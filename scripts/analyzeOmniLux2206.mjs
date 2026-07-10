/**
 * READ-ONLY analysis of OmniLux-22-06-2026.csv vs our email_contacts.
 * Writes NOTHING. Uses the CANONICAL base64url contactDocId (not the legacy
 * underscore scheme that previously caused duplicates).
 *
 * Run: node scripts/analyzeOmniLux2206.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const CSV_PATH = 'C:/Users/User/Downloads/OmniLux-22-06-2026.csv'
const DOCBASE = `projects/${PROJECT}/databases/(default)/documents/email_contacts`
const BATCHGET = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchGet`

// ── canonical id + helpers (mirror src/utils/emailValidation.js) ──────────────
const normalise = e => (e || '').toLowerCase().trim()
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const isValidEmail = e => { const t = (e||'').trim(); return !t.toLowerCase().endsWith('.local') && EMAIL_REGEX.test(t) }
const FAKE = /^(test|noreply|no-reply|donotreply|admin|info)@/i
function contactDocId(email) {
  return Buffer.from(normalise(email), 'latin1').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
function numberHeavy(email) {
  const u = email.split('@')[0]; let d=0,l=0
  for (const c of u) { if (c>='0'&&c<='9') d++; else if ((c>='a'&&c<='z')||(c>='A'&&c<='Z')) l++ }
  return d > l
}
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getToken() {
  const now = Math.floor(Date.now()/1000)
  const hdr = Buffer.from(JSON.stringify({ alg:'RS256', typ:'JWT' })).toString('base64url')
  const pld = Buffer.from(JSON.stringify({ iss:SA.client_email, scope:'https://www.googleapis.com/auth/datastore',
    aud:'https://oauth2.googleapis.com/token', iat:now, exp:now+3600 })).toString('base64url')
  const msg = `${hdr}.${pld}`
  const s = createSign('RSA-SHA256'); s.update(msg); const sig = s.sign(SA.private_key,'base64url')
  const r = await fetch('https://oauth2.googleapis.com/token', { method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({ grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion:`${msg}.${sig}` }) })
  const d = await r.json(); if (!d.access_token) throw new Error('token: '+JSON.stringify(d)); return d.access_token
}

// ── load pre-cleaned, deduped rows (Python prep handles the messy quoting) ─────
const cleaned = JSON.parse(readFileSync(resolve(__dirname, 'omnilux2206.json'), 'utf-8'))
const byEmail = new Map(); let fake=0, numHeavy=0
for (const r of cleaned) {
  const e = normalise(r['Email'])
  if (FAKE.test(e)) { fake++; continue }
  if (numberHeavy(e)) numHeavy++
  byEmail.set(e, r)
}
const emails = [...byEmail.keys()]
console.log(`Cleaned valid unique emails: ${cleaned.length} | fake skipped: ${fake}`)
console.log(`Emails to check vs DB: ${emails.length} (number-heavy flagged: ${numHeavy})`)

// ── batchGet existing docs ────────────────────────────────────────────────────
const token = await getToken()
const idToEmail = new Map(emails.map(e => [contactDocId(e), e]))
const allIds = [...idToEmail.keys()]
const found = new Map()   // email → { status, has:{city,language,appt,cats} }
const CH = 250
for (let i=0;i<allIds.length;i+=CH) {
  const docs = allIds.slice(i,i+CH).map(id => `${DOCBASE}/${id}`)
  const res = await fetch(BATCHGET, { method:'POST',
    headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ documents: docs }) })
  if (!res.ok) throw new Error(`batchGet ${res.status}: ${(await res.text()).slice(0,200)}`)
  for (const ent of await res.json()) {
    if (!ent.found) continue
    const f = ent.found.fields || {}
    const id = ent.found.name.split('/').pop()
    const email = idToEmail.get(id)
    found.set(email, {
      status: f.status?.stringValue || 'active',
      hasCity: !!(f.city?.stringValue||'').trim(),
      hasLang: !!(f.language?.stringValue||'').trim(),
      hasAppt: f.appointmentCount != null && f.appointmentCount.integerValue != null,
      hasCats: (f.treatmentCategories?.arrayValue?.values||[]).length > 0,
    })
  }
  process.stdout.write(`\r  checked ${Math.min(i+CH,allIds.length)}/${allIds.length}…`)
  await sleep(200)
}
console.log('')

// ── classify ──────────────────────────────────────────────────────────────────
const PROTECTED = new Set(['unsubscribed','bounced','complained','failed','invalid'])
const newEmails = emails.filter(e => !found.has(e))
const existing  = emails.filter(e => found.has(e))
const protectedExisting = existing.filter(e => PROTECTED.has(found.get(e).status))
const activeExisting    = existing.filter(e => !PROTECTED.has(found.get(e).status))

const statusBreak = {}
for (const e of existing) { const s = found.get(e).status; statusBreak[s]=(statusBreak[s]||0)+1 }

// enrichment gaps among existing (active only — protected we won't touch status, but report)
function gaps(list, key) { return list.filter(e => !found.get(e)[key]).length }

console.log('\n══════════ RESULT ══════════')
console.log(`NEW emails we DON'T have:        ${newEmails.length}`)
console.log(`Already in our DB:               ${existing.length}`)
console.log(`  ├─ active (enrich OK):         ${activeExisting.length}`)
console.log(`  └─ opt-out/bounced (PROTECT):  ${protectedExisting.length}`)
console.log(`     status breakdown:           ${JSON.stringify(statusBreak)}`)
console.log('\nEnrichment gaps among EXISTING (missing field → CSV can fill):')
console.log(`  missing city:           ${gaps(existing,'hasCity')}`)
console.log(`  missing language:       ${gaps(existing,'hasLang')}`)
console.log(`  missing appointmentCount: ${gaps(existing,'hasAppt')}`)
console.log(`  missing treatmentCategories: ${gaps(existing,'hasCats')}`)
console.log('\nSample of 10 NEW emails:')
newEmails.slice(0,10).forEach(e => { const r=byEmail.get(e); console.log(`  ${e}  | ${r['Full Name']} | ${r['Primary City']} | ${r['Status']}`) })
console.log('\n(no writes performed — analysis only)')
