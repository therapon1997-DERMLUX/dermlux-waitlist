// Find & merge duplicate email_contacts (same normalized email, different doc IDs).
// Usage:
//   node scripts/merge_duplicates.mjs           → dry run (report only)
//   node scripts/merge_duplicates.mjs --execute → merge + delete (writes backup JSON first)
import { readFileSync, writeFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const EXECUTE = process.argv.includes('--execute')

// ── Auth ──
const now = Math.floor(Date.now() / 1000)
const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
const claims = b64url(JSON.stringify({
  iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
}))
const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key)
const tok = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claims}.${b64url(sig)}`,
})).json()
const H = { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' }
const base = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`

// ── Firestore value helpers ──
const fromFs = f => {
  if (f == null) return null
  if (f.stringValue   !== undefined) return f.stringValue
  if (f.integerValue  !== undefined) return Number(f.integerValue)
  if (f.doubleValue   !== undefined) return f.doubleValue
  if (f.booleanValue  !== undefined) return f.booleanValue
  if (f.timestampValue!== undefined) return f.timestampValue
  if (f.nullValue     !== undefined) return null
  if (f.arrayValue    !== undefined) return (f.arrayValue.values || []).map(fromFs)
  if (f.mapValue      !== undefined) return Object.fromEntries(Object.entries(f.mapValue.fields || {}).map(([k, v]) => [k, fromFs(v)]))
  return null
}
const toFs = v => {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (typeof v === 'number')  return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (Array.isArray(v))       return { arrayValue: { values: v.map(toFs) } }
  if (typeof v === 'string')  return /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(v) ? { timestampValue: v } : { stringValue: v }
  if (typeof v === 'object')  return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toFs(x)])) } }
  return { stringValue: String(v) }
}

const normalizeEmail = e => (e || '').toLowerCase().trim()
const contactDocId = email => Buffer.from(normalizeEmail(email)).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

// ── 1. Fetch all contacts (paginated) ──
console.log('Φόρτωση όλων των επαφών…')
const all = []
let pageToken = ''
do {
  const url = `${base}/email_contacts?pageSize=1000${pageToken ? `&pageToken=${pageToken}` : ''}`
  const r = await (await fetch(url, { headers: H })).json()
  if (r.error) { console.error('READ ERROR:', JSON.stringify(r.error)); process.exit(1) }
  for (const d of r.documents || []) {
    const fields = Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, fromFs(v)]))
    all.push({ docId: d.name.split('/').pop(), ...fields })
  }
  pageToken = r.nextPageToken || ''
  process.stdout.write(`\r  ${all.length} επαφές…`)
} while (pageToken)
console.log(`\nΣύνολο: ${all.length}`)

// ── 2. Group by normalized email ──
const groups = new Map()
for (const c of all) {
  const key = normalizeEmail(c.email)
  if (!key) continue
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(c)
}
const dups = [...groups.entries()].filter(([, v]) => v.length > 1)
console.log(`Διπλότυπα emails: ${dups.length} (σύνολο ${dups.reduce((s, [, v]) => s + v.length, 0)} εγγραφές)`)

if (dups.length === 0) process.exit(0)

// ── 3. Merge logic ──
const STATUS_RANK = { complained: 6, bounced: 5, unsubscribed: 4, failed: 3, invalid: 2, active: 1 }
const maxTs  = (...ts) => ts.filter(Boolean).sort().pop() || null
const minTs  = (...ts) => ts.filter(Boolean).sort().shift() || null

function mergeGroup(email, docs) {
  const canonicalId = contactDocId(email)
  // Prefer the doc that already has the canonical ID; otherwise the one with most fields
  let keeper = docs.find(d => d.docId === canonicalId)
    || [...docs].sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0]
  const others = docs.filter(d => d !== keeper)

  const merged = { ...keeper }
  for (const o of others) {
    for (const [k, v] of Object.entries(o)) {
      if (k === 'docId' || v === null || v === undefined || v === '') continue
      const cur = merged[k]
      if (cur === null || cur === undefined || cur === '') { merged[k] = v; continue }
      // Field-specific resolution
      if (k === 'status') {
        if ((STATUS_RANK[v] || 0) > (STATUS_RANK[cur] || 0)) merged[k] = v
      } else if (k === 'name') {
        if (String(v).length > String(cur).length) merged[k] = v
      } else if (k === 'phone') {
        if (String(v).startsWith('+') && !String(cur).startsWith('+')) merged[k] = v
      } else if (['lastOpenedAt','lastClickedAt','lastEngagedAt','lastDeliveredAt','lastEventAt','lastSentAt','updatedAt','unsubscribedAt','bouncedAt','complainedAt','failedAt'].includes(k)) {
        merged[k] = maxTs(cur, v)
      } else if (['createdAt','importedAt'].includes(k)) {
        merged[k] = minTs(cur, v)
      } else if (['sendCount','totalSpend','appointmentCount','recordId'].includes(k)) {
        merged[k] = Math.max(Number(cur) || 0, Number(v) || 0)
      } else if (Array.isArray(cur) && Array.isArray(v)) {
        merged[k] = [...new Set([...cur, ...v])]
      }
      // otherwise: keep keeper's value
    }
  }
  merged.email = email // normalized
  delete merged.docId
  return { canonicalId, keeperId: keeper.docId, merged, deleteIds: docs.map(d => d.docId).filter(id => id !== canonicalId) }
}

const plans = dups.map(([email, docs]) => mergeGroup(email, docs))

// ── 4. Report ──
console.log('\n— Δείγμα (πρώτα 15):')
for (const p of plans.slice(0, 15)) {
  console.log(`  ${p.merged.email}  [${p.merged.status}]  κρατάμε→${p.canonicalId.slice(0, 12)}…  σβήνουμε ${p.deleteIds.length}`)
}
const statusChanges = plans.filter(p => p.merged.status !== 'active').length
console.log(`\nΣυγχωνεύσεις: ${plans.length} · Διαγραφές: ${plans.reduce((s, p) => s + p.deleteIds.length, 0)} · Με μη-active status: ${statusChanges}`)

if (!EXECUTE) { console.log('\nDRY RUN — τίποτα δεν άλλαξε. Τρέξε με --execute για εφαρμογή.'); process.exit(0) }

// ── 5. Backup before touching anything ──
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const backupFile = `C:/Users/User/dermlux-waitlist/backups/duplicates_backup_${stamp}.json`
import('fs').then(fs => fs.mkdirSync('C:/Users/User/dermlux-waitlist/backups', { recursive: true }))
writeFileSync(backupFile, JSON.stringify({ when: stamp, groups: dups.map(([email, docs]) => ({ email, docs })) }, null, 1))
console.log(`Backup: ${backupFile}`)

// ── 6. Execute: write merged canonical doc, delete the rest ──
let done = 0, errors = 0
for (const p of plans) {
  try {
    const fields = Object.fromEntries(Object.entries(p.merged).map(([k, v]) => [k, toFs(v)]))
    const setRes = await fetch(`${base}/email_contacts/${p.canonicalId}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ fields }),
    })
    if (!setRes.ok) throw new Error(`set ${setRes.status}: ${await setRes.text()}`)
    for (const id of p.deleteIds) {
      const delRes = await fetch(`${base}/email_contacts/${id}`, { method: 'DELETE', headers: H })
      if (!delRes.ok && delRes.status !== 404) throw new Error(`del ${id} ${delRes.status}`)
    }
    done++
    if (done % 25 === 0) process.stdout.write(`\r  ${done}/${plans.length}…`)
  } catch (err) {
    errors++
    console.error(`\nERROR ${p.merged.email}: ${err.message}`)
  }
}
console.log(`\nΟΛΟΚΛΗΡΩΘΗΚΕ: ${done} συγχωνεύσεις, ${errors} σφάλματα.`)
