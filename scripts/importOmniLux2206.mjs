/**
 * Import OmniLux-22-06-2026 (from scripts/omnilux2206.json, pre-cleaned).
 *
 * SAFE rules:
 *  - Canonical base64url contactDocId (NOT the legacy underscore scheme → no dupes)
 *  - NEW emails → conditional create (exists:false), status 'active'
 *  - EXISTING active → enrich segmentation only (updateMask, never status/opt-out)
 *  - EXISTING bounced/unsubscribed/complained/failed/invalid → SKIPPED entirely
 *  - Junk names ("Πληκτρολογεί…", ellipsis, no letters) → stored blank
 *  - Adds appointmentCount (old import omitted it)
 *
 * Run: node scripts/importOmniLux2206.mjs           (dry run, no writes)
 *      node scripts/importOmniLux2206.mjs --execute  (writes)
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const DOCBASE = `projects/${PROJECT}/databases/(default)/documents/email_contacts`
const BATCHGET   = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchGet`
const BATCHWRITE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchWrite`
const EXECUTE = process.argv.includes('--execute')

const normalise = e => (e || '').toLowerCase().trim()
const FAKE = /^(test|noreply|no-reply|donotreply|admin|info)@/i
const PROTECTED = new Set(['unsubscribed','bounced','complained','failed','invalid'])
const sleep = ms => new Promise(r => setTimeout(r, ms))
function contactDocId(email) {
  return Buffer.from(normalise(email),'latin1').toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
}
function cleanName(n) {
  const s = (n||'').trim()
  if (!s) return ''
  if (/πληκτρολογ|typing|^[.…\s]+$/i.test(s)) return ''
  if (!/[A-Za-zΑ-Ωα-ωΆ-Ώά-ώ]/.test(s)) return ''   // no letters → junk
  return s
}
// value helpers
const sv = v => ({ stringValue: String(v ?? '').trim() })
const iv = v => ({ integerValue: String(parseInt(v) || 0) })
const bv = v => ({ booleanValue: Boolean(v) })
const nullv = () => ({ nullValue: null })
const tsNow = () => ({ timestampValue: new Date().toISOString() })
function nv(v){ const n=parseFloat(String(v).replace(/[^\d.]/g,'')); return isNaN(n)?{nullValue:null}:{doubleValue:n} }
function tv(s){ if(!s||!s.trim())return{nullValue:null}; const p=s.trim().split(/[\s/]/); if(p.length<3)return{nullValue:null}
  const [d,m,y]=p; const dt=new Date(`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`); return isNaN(dt)?{nullValue:null}:{timestampValue:dt.toISOString()} }

function mapCats(treat='', cat='') {
  const out=new Set(); const raw=(cat||'').trim()
  if(raw){ for(const part of raw.split(';')){ const p=part.trim().toLowerCase()
    if(p==='injectables'||p==='injectable')out.add('injectables'); else if(p==='laser')out.add('laser')
    else if(p==='facial')out.add('facial'); else if(p==='consultation')out.add('consultation'); else if(p==='other')out.add('other') }
    if(out.size)return[...out] }
  const t=treat.toLowerCase(); const c=[]
  if(/inject|botox|filler|lip\s*fill|toxin|dysport|xeomin|juvederm|restylane|sculptra|prp|prf|hyaluron|profhilo|radiesse/.test(t))c.push('injectables')
  if(/laser/.test(t))c.push('laser')
  if(/facial|hydrat|peel|microneedl|dermapen|mesother|mesopeel|clean|brightening|glow|skinbooster|hydroface|oxygen|carboxy|hifu|ulthera|rf\b|radiofrequen|υψίσυχ/.test(t))c.push('facial')
  if(/consult/.test(t))c.push('consultation')
  if(t.trim()&&c.length===0)c.push('other')
  return c
}
const catsField = r => ({ arrayValue:{ values: mapCats(r['Treatments']||'', r['Categories']||'').map(c=>({stringValue:c})) } })

function newContact(r){ const email=normalise(r['Email']); return {
  email:sv(email), name:sv(cleanName(r['Full Name'])), phone:sv(r['Phone']), city:sv(r['Primary City']),
  citiesVisited:sv(r['Cities Visited']), adName:sv(r['Ad Name']), tags:{arrayValue:{values:[]}},
  source:sv('csv_import_omnilux_2206'), status:sv('active'), sendCount:iv(0),
  totalSpend:nv(r['Total Spend']), appointmentCount:iv(r['Appointments']),
  categories:sv(r['Categories']), treatments:sv(r['Treatments']), treatmentCategories:catsField(r),
  lastAppointmentAt:tv(r['Last Appointment']), omniluxStatus:sv(r['Status']), omniluxSource:sv(r['Data Source']),
  language:sv(r['Language']), lastSentAt:nullv(), unsubscribedAt:nullv(), bouncedAt:nullv(), complainedAt:nullv(),
  optOutPermanent:bv(false), importedAt:tsNow(), updatedAt:tsNow(), enrichedAt:tsNow() } }

const ENRICH_MASK = ['city','citiesVisited','adName','totalSpend','appointmentCount','categories','treatments','treatmentCategories','lastAppointmentAt','omniluxStatus','omniluxSource','language','phone','enrichedAt']
function enrichFields(r){ return {
  city:sv(r['Primary City']), citiesVisited:sv(r['Cities Visited']), adName:sv(r['Ad Name']),
  totalSpend:nv(r['Total Spend']), appointmentCount:iv(r['Appointments']), categories:sv(r['Categories']),
  treatments:sv(r['Treatments']), treatmentCategories:catsField(r), lastAppointmentAt:tv(r['Last Appointment']),
  omniluxStatus:sv(r['Status']), omniluxSource:sv(r['Data Source']), language:sv(r['Language']),
  phone:sv(r['Phone']), enrichedAt:tsNow() } }

async function getToken(){ const now=Math.floor(Date.now()/1000)
  const h=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url')
  const p=Buffer.from(JSON.stringify({iss:SA.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})).toString('base64url')
  const m=`${h}.${p}`; const s=createSign('RSA-SHA256');s.update(m); const sig=s.sign(SA.private_key,'base64url')
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${m}.${sig}`})})
  const d=await r.json(); if(!d.access_token)throw new Error('token '+JSON.stringify(d)); return d.access_token }

async function batchWrite(tok, writes){ for(let a=0;a<5;a++){
  const res=await fetch(BATCHWRITE,{method:'POST',headers:{Authorization:`Bearer ${tok.value}`,'Content-Type':'application/json'},body:JSON.stringify({writes})})
  if(res.ok)return res.json(); const b=await res.text()
  if(res.status===429||res.status===503){ const w=(a+1)*8000; process.stdout.write(`\n  [quota] wait ${w/1000}s…`); await sleep(w); tok.value=await getToken(); continue }
  throw new Error(`batchWrite ${res.status}: ${b.slice(0,200)}`) } throw new Error('retries exceeded') }

async function runBatch(tok, writes, label){ const CH=200; let done=0
  for(let i=0;i<writes.length;i+=CH){ await batchWrite(tok, writes.slice(i,i+CH)); done+=Math.min(CH,writes.length-i)
    process.stdout.write(`\r  ${label}: ${done}/${writes.length}…`); await sleep(1200) }
  console.log(`\r  ${label}: ${done} done.                 `) }

// ── load + classify ───────────────────────────────────────────────────────────
const cleaned = JSON.parse(readFileSync(resolve(__dirname,'omnilux2206.json'),'utf-8')).filter(r=>!FAKE.test(normalise(r['Email'])))
const byId = new Map(cleaned.map(r=>[contactDocId(r['Email']), r]))
const tok = { value: await getToken() }

console.log(`Checking ${byId.size} emails against DB…`)
const status = new Map()
const ids=[...byId.keys()]
for(let i=0;i<ids.length;i+=250){ const docs=ids.slice(i,i+250).map(id=>`${DOCBASE}/${id}`)
  const res=await fetch(BATCHGET,{method:'POST',headers:{Authorization:`Bearer ${tok.value}`,'Content-Type':'application/json'},body:JSON.stringify({documents:docs})})
  if(!res.ok)throw new Error('batchGet '+res.status);
  for(const e of await res.json()){ if(e.found){ const id=e.found.name.split('/').pop(); status.set(id, e.found.fields?.status?.stringValue||'active') } }
  process.stdout.write(`\r  ${Math.min(i+250,ids.length)}/${ids.length}`) }
console.log('')

const newWrites=[], enrichWrites=[]; let skippedProtected=0
for(const [id,r] of byId){
  const st=status.get(id)
  if(st===undefined){ newWrites.push({ update:{ name:`${DOCBASE}/${id}`, fields:newContact(r) }, currentDocument:{exists:false} }) }
  else if(PROTECTED.has(st)){ skippedProtected++ }
  else { enrichWrites.push({ update:{ name:`${DOCBASE}/${id}`, fields:enrichFields(r) }, updateMask:{fieldPaths:ENRICH_MASK} }) }
}
console.log(`\nNEW to create:   ${newWrites.length}`)
console.log(`ENRICH existing: ${enrichWrites.length}`)
console.log(`SKIPPED (opt-out/bounced): ${skippedProtected}`)

if(!EXECUTE){ console.log('\n** DRY RUN — no writes. Re-run with --execute to apply. **'); process.exit(0) }

console.log('\nWriting…')
await runBatch(tok, newWrites, 'Creating new')
await runBatch(tok, enrichWrites, 'Enriching')
console.log('\n✓ Done.')
