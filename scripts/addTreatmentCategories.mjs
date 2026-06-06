/**
 * Backfill treatmentCategories on all existing contacts.
 *
 * Maps the raw `treatments` + `categories` string fields to a
 * standardised array: ['injectables','laser','facial','consultation','other']
 *
 * Run: node scripts/addTreatmentCategories.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`
const BATCH_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchWrite`
const BASE_DOC  = `projects/${PROJECT}/databases/(default)/documents/email_contacts`

// ── Auth ───────────────────────────────────────────────────────────────────────
async function getToken() {
  const now = Math.floor(Date.now() / 1000)
  const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const pld = Buffer.from(JSON.stringify({
    iss: SA.client_email, scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })).toString('base64url')
  const msg = `${hdr}.${pld}`
  const sig = (() => { const s = createSign('RSA-SHA256'); s.update(msg); return s.sign(SA.private_key, 'base64url') })()
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${msg}.${sig}` }),
  })
  const d = await r.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

// ── Category mapping ──────────────────────────────────────────────────────────
export function mapTreatmentCategories(treatmentsStr = '', categoriesStr = '') {
  const text = `${treatmentsStr} ${categoriesStr}`.toLowerCase()
  const cats = []

  if (/inject|botox|filler|lip\s*fill|toxin|dysport|xeomin|juvederm|restylane|sculptra|prp|prf|hyaluron|profhilo|radiesse/.test(text))
    cats.push('injectables')

  if (/laser/.test(text))
    cats.push('laser')

  if (/facial|hydrat|peel|microneedl|dermapen|mesother|mesopeel|clean(sing)?|brightening|glow|skinbooster|hydroface|oxygen|carboxy|hifu|ulthera|rf\b|radiofrequen/.test(text))
    cats.push('facial')

  if (/consult/.test(text))
    cats.push('consultation')

  // has treatment text but matched none of the above → other
  const hasText = treatmentsStr.trim() || categoriesStr.trim()
  if (hasText && cats.length === 0)
    cats.push('other')

  return cats
}

function getStr(fields, key) { return (fields?.[key]?.stringValue || '').trim() }
const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── Fetch all docs ─────────────────────────────────────────────────────────────
async function fetchAllDocs(token) {
  const docs = []
  let pageToken = null, page = 0
  do {
    const url = new URL(`${BASE_URL}/email_contacts`)
    url.searchParams.set('pageSize', '300')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`List ${res.status}: ${await res.text()}`)
    const data = await res.json()
    for (const d of (data.documents || []))
      docs.push({ id: d.name.split('/').pop(), fields: d.fields || {} })
    pageToken = data.nextPageToken || null
    page++
    process.stdout.write(`\r  Fetched ${docs.length} (page ${page})…`)
  } while (pageToken)
  console.log(`\r  Fetched ${docs.length} total.              `)
  return docs
}

// ── batchWrite helper ──────────────────────────────────────────────────────────
async function batchWrite(token, writes) {
  const res = await fetch(BATCH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  })
  if (!res.ok) throw new Error(`batchWrite ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log('Authenticating…')
let token = await getToken()

console.log('Fetching all contacts…')
const docs = await fetchAllDocs(token)

// Build writes — only docs that have treatments or categories data
const writes = []
for (const { id, fields } of docs) {
  const treatments  = getStr(fields, 'treatments')
  const categories  = getStr(fields, 'categories')
  const cats = mapTreatmentCategories(treatments, categories)
  // Always write the field (even empty array) so the field exists on all docs
  writes.push({
    update: {
      name:   `${BASE_DOC}/${id}`,
      fields: {
        treatmentCategories: {
          arrayValue: { values: cats.map(c => ({ stringValue: c })) },
        },
      },
    },
    updateMask: { fieldPaths: ['treatmentCategories'] },
  })
}

console.log(`\nWriting treatmentCategories to ${writes.length} contacts…`)
token = await getToken()

const CHUNK = 400
let done = 0
for (let i = 0; i < writes.length; i += CHUNK) {
  const chunk = writes.slice(i, i + CHUNK)
  await batchWrite(token, chunk)
  done += chunk.length
  process.stdout.write(`\r  ${done} / ${writes.length}…`)
  if (i + CHUNK < writes.length) await sleep(300)
}

console.log(`\r\nDone — treatmentCategories written to ${done} contacts.`)

// Quick summary
const summary = { injectables: 0, laser: 0, facial: 0, consultation: 0, other: 0, none: 0 }
for (const { fields } of docs) {
  const cats = mapTreatmentCategories(getStr(fields, 'treatments'), getStr(fields, 'categories'))
  if (cats.length === 0) summary.none++
  else cats.forEach(c => summary[c]++)
}
console.log('\nBreakdown:')
Object.entries(summary).forEach(([k, v]) => console.log(`  ${k.padEnd(14)} ${v}`))
