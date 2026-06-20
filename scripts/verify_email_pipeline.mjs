// Verify: (A) live Firestore rules match intent, (B) webhook→Firestore pipeline
// has been writing Resend events, (C) recent campaign sends exist.
import { readFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/dermlux-waitlist/serviceAccountKey.json', 'utf8'))
const project = sa.project_id
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
const now = Math.floor(Date.now()/1000)
const header = b64url(JSON.stringify({ alg:'RS256', typ:'JWT' }))
const claims = b64url(JSON.stringify({ iss: sa.client_email, scope:'https://www.googleapis.com/auth/cloud-platform', aud:'https://oauth2.googleapis.com/token', iat:now, exp:now+3600 }))
const sig = b64url(crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key))
const tok = await (await fetch('https://oauth2.googleapis.com/token', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claims}.${sig}` })).json()
const H = { Authorization:`Bearer ${tok.access_token}`, 'Content-Type':'application/json' }
const fs = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`

// (A) live rules
const rel = await (await fetch(`https://firebaserules.googleapis.com/v1/projects/${project}/releases/cloud.firestore`, { headers:H })).json()
const rsId = rel.rulesetName.split('/').pop()
const rs = await (await fetch(`https://firebaserules.googleapis.com/v1/projects/${project}/rulesets/${rsId}`, { headers:H })).json()
const src = rs.source.files[0].content
console.log('=== (A) LIVE RULES ===')
console.log('  ruleset:', rsId, '| createTime:', rs.createTime)
console.log('  has isMarketer():', src.includes('function isMarketer()'))
console.log('  email_* allows marketer:', /email_contacts\/\{d\}\s+\{ allow read, write: if isAdmin\(\) \|\| isMarketer\(\)/.test(src))
console.log('  catch-all denies marketer:', src.includes('if authed() && !isMarketer()'))

// (B) webhook pipeline: count email_sends with webhook-set event fields
console.log('\n=== (B) WEBHOOK→FIRESTORE PIPELINE (proves Resend events land) ===')
const q = {
  structuredQuery: {
    from: [{ collectionId: 'email_sends' }],
    orderBy: [{ field: { fieldPath: 'sentAt' }, direction: 'DESCENDING' }],
    limit: 200,
  }
}
const sends = await (await fetch(`${fs}:runQuery`, { method:'POST', headers:H, body:JSON.stringify(q) })).json()
let total=0, opened=0, clicked=0, bounced=0, delivered=0, lastOpen=null, lastSent=null
for (const row of sends) {
  const f = row.document?.fields; if (!f) continue
  total++
  if (f.openedAt?.timestampValue)   { opened++;  if(!lastOpen) lastOpen=f.openedAt.timestampValue }
  if (f.clickedAt?.timestampValue)  clicked++
  if (f.bouncedAt?.timestampValue)  bounced++
  if (f.status?.stringValue==='delivered' || f.deliveredAt) delivered++
  if (f.sentAt?.timestampValue && !lastSent) lastSent=f.sentAt.timestampValue
}
console.log('  recent email_sends sampled:', total)
console.log('  with openedAt (webhook wrote):', opened, '| clickedAt:', clicked, '| bouncedAt:', bounced)
console.log('  most recent send:', lastSent || 'n/a')
console.log('  most recent open event:', lastOpen || 'n/a')
console.log(opened>0||clicked>0||bounced>0 ? '  ✓ Webhook HAS been writing Resend events to Firestore' : '  ⚠ no event fields in sample (may just be no recent opens)')

// (C) campaigns sanity
console.log('\n=== (C) CAMPAIGNS ===')
const camps = await (await fetch(`${fs}/email_campaigns`, { headers:H })).json()
const list = (camps.documents||[]).map(d=>({ n:d.fields?.name?.stringValue, s:d.fields?.status?.stringValue, sent:d.fields?.stats?.mapValue?.fields?.sent?.integerValue }))
console.log('  total campaigns:', list.length)
list.slice(0,5).forEach(c=>console.log(`   - "${c.n}" status=${c.s} sent=${c.sent||0}`))
