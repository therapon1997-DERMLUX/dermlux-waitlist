/**
 * Enrich Firestore email_contacts from a full OmniLux CSV export.
 *
 * Strategy (two-pass via REST batchWrite — no reads needed):
 *
 *  Pass 1 — CREATE new contacts only (condition: doc must not exist).
 *            Existing docs fail silently in batchWrite (non-atomic).
 *            New contacts get full data + status:'active' (or 'unsubscribed').
 *
 *  Pass 2 — ENRICH all contacts (updateMask, no status field touched).
 *            Adds city, totalSpend, treatments, etc. to every doc.
 *            Protected statuses (bounced/complained/suppressed/unsubscribed)
 *            are never overwritten because status is NOT in the updateMask.
 *
 * Run: node scripts/enrichContacts.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const CSV_PATH = 'C:/Users/User/Downloads/OmniLux-05-06-2026 (1).csv'

// ── Auth ───────────────────────────────────────────────────────────────────────
async function getToken() {
  const now = Math.floor(Date.now() / 1000)
  const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const pld = Buffer.from(JSON.stringify({
    iss: SA.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url')
  const msg = `${hdr}.${pld}`
  const sig = (() => { const s = createSign('RSA-SHA256'); s.update(msg); return s.sign(SA.private_key, 'base64url') })()
  const jwt = `${msg}.${sig}`
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  const d = await r.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

// ── Treatment category mapping ─────────────────────────────────────────────────
function mapTreatmentCategories(treatmentsStr = '', categoriesStr = '') {
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
  const hasText = treatmentsStr.trim() || categoriesStr.trim()
  if (hasText && cats.length === 0) cats.push('other')
  return cats
}

function treatmentCategoriesField(r) {
  const cats = mapTreatmentCategories(r['Treatments'] || '', r['Categories'] || '')
  return { arrayValue: { values: cats.map(c => ({ stringValue: c })) } }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function docId(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}
function normalise(e) { return (e || '').toLowerCase().trim() }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
const sleep = ms => new Promise(r => setTimeout(r, ms))

function sv(v)  { return { stringValue:  String(v ?? '').trim() } }
function nv(v)  {
  const n = parseFloat(String(v).replace(/[^\d.]/g, ''))
  return isNaN(n) ? { nullValue: null } : { doubleValue: n }
}
function bv(v)  { return { booleanValue: Boolean(v) } }
function iv(v)  { return { integerValue: String(parseInt(v) || 0) } }
function tv(dateStr) {
  if (!dateStr || !dateStr.trim()) return { nullValue: null }
  // formats: DD/MM/YYYY or DD/MM/YYYY HH:MM
  const parts = dateStr.trim().split(/[\s\/]/)
  if (parts.length < 3) return { nullValue: null }
  const [d, m, y] = parts
  const dt = new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`)
  if (isNaN(dt)) return { nullValue: null }
  return { timestampValue: dt.toISOString() }
}
function nullv() { return { nullValue: null } }

// ── Parse & deduplicate CSV ────────────────────────────────────────────────────
console.log('Parsing CSV…')
const raw  = readFileSync(CSV_PATH, 'utf-8')
const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true })

// Deduplicate: for the same email keep the record with most non-empty fields
const byEmail = new Map()
for (const r of rows) {
  const email = normalise(r['Email'])
  if (!email || !isValidEmail(email)) continue
  if (!byEmail.has(email)) {
    byEmail.set(email, r)
  } else {
    const prev  = byEmail.get(email)
    const score = o => Object.values(o).filter(v => v && String(v).trim()).length
    if (score(r) > score(prev)) byEmail.set(email, r)
  }
}

const contacts = [...byEmail.values()]
console.log(`Unique valid emails: ${contacts.length}`)

// Separate out the 11 CSV-unsubscribed
const csvUnsub = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() === 'unsubscribed')
const csvNormal = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() !== 'unsubscribed')
console.log(`CSV unsubscribed (will be created/kept as opt-out): ${csvUnsub.length}`)
console.log(`Normal contacts: ${csvNormal.length}`)

// ── Firestore value builders ───────────────────────────────────────────────────
function buildNewContactFields(r, status) {
  const email = normalise(r['Email'])
  return {
    email:              sv(email),
    name:               sv(r['Full Name']),
    phone:              sv(r['Phone']),
    city:               sv(r['Primary City']),
    tags:               { arrayValue: { values: [] } },
    source:             sv('csv_import'),
    status:             sv(status),
    sendCount:          iv(0),
    totalSpend:         nv(r['Total Spend']),
    categories:           sv(r['Categories']),
    treatments:           sv(r['Treatments']),
    treatmentCategories:  treatmentCategoriesField(r),
    lastAppointmentAt:    tv(r['Last Appointment']),
    omniluxStatus:        sv(r['Status']),
    omniluxSource:        sv(r['Data Source']),
    language:             sv(r['Language']),
    lastSentAt:           nullv(),
    unsubscribedAt:     status === 'unsubscribed' ? { timestampValue: new Date().toISOString() } : nullv(),
    bouncedAt:          nullv(),
    complainedAt:       nullv(),
    optOutPermanent:    status === 'unsubscribed' ? bv(true) : bv(false),
    importedAt:         { timestampValue: new Date().toISOString() },
    updatedAt:          { timestampValue: new Date().toISOString() },
    enrichedAt:         { timestampValue: new Date().toISOString() },
  }
}

// Enrichment-only fields (never includes status — safe for all existing contacts)
const ENRICH_MASK = [
  'city', 'totalSpend', 'categories', 'treatments', 'treatmentCategories',
  'lastAppointmentAt', 'omniluxStatus', 'omniluxSource',
  'language', 'enrichedAt',
]

function buildEnrichFields(r) {
  return {
    city:                 sv(r['Primary City']),
    totalSpend:           nv(r['Total Spend']),
    categories:           sv(r['Categories']),
    treatments:           sv(r['Treatments']),
    treatmentCategories:  treatmentCategoriesField(r),
    lastAppointmentAt:    tv(r['Last Appointment']),
    omniluxStatus:        sv(r['Status']),
    omniluxSource:        sv(r['Data Source']),
    language:             sv(r['Language']),
    enrichedAt:           { timestampValue: new Date().toISOString() },
  }
}

// ── batchWrite helper ──────────────────────────────────────────────────────────
const BASE = `projects/${PROJECT}/databases/(default)/documents/email_contacts`
const BATCH_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchWrite`
const BATCH_SIZE = 400

async function batchWrite(token, writes) {
  const res = await fetch(BATCH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`batchWrite ${res.status}: ${t.slice(0, 300)}`)
  }
  return res.json()
}

// ── PASS 1: Create new contacts (condition: must not exist) ────────────────────
console.log('\n── Pass 1: Creating new contacts (skip if already exists)…')
let token = await getToken()
let created = 0, skipped = 0

const allContactsForCreate = [
  ...csvNormal.map(r => ({ r, status: 'active' })),
  ...csvUnsub.map(r  => ({ r, status: 'unsubscribed' })),
]

for (let i = 0; i < allContactsForCreate.length; i += BATCH_SIZE) {
  const chunk = allContactsForCreate.slice(i, i + BATCH_SIZE)

  const writes = chunk.map(({ r, status }) => ({
    update: {
      name:   `${BASE}/${docId(normalise(r['Email']))}`,
      fields: buildNewContactFields(r, status),
    },
    currentDocument: { exists: false }, // only write if doc doesn't exist
  }))

  // Refresh token every ~45 min
  if (i > 0 && i % 10000 === 0) token = await getToken()

  const result = await batchWrite(token, writes)
  await sleep(300)

  // Count results
  for (const s of (result.writeResults || [])) {
    // writeResults entries without updateTime = precondition failed (doc existed)
    if (s.updateTime) created++
    else skipped++
  }

  const done = Math.min(i + BATCH_SIZE, allContactsForCreate.length)
  console.log(`  ${done}/${allContactsForCreate.length} processed — new: ${created}, existing: ${skipped}`)
}

console.log(`Pass 1 done. Created: ${created}, Already existed: ${skipped}`)

// ── PASS 2: Enrich all contacts (updateMask — status never touched) ────────────
console.log('\n── Pass 2: Enriching all contacts with city / spend / treatments…')
let enriched = 0

for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
  const chunk = contacts.slice(i, i + BATCH_SIZE)

  const writes = chunk.map(r => ({
    update: {
      name:   `${BASE}/${docId(normalise(r['Email']))}`,
      fields: buildEnrichFields(r),
    },
    updateMask: { fieldPaths: ENRICH_MASK },
  }))

  if (i > 0 && i % 10000 === 0) token = await getToken()

  await batchWrite(token, writes)
  enriched += chunk.length
  await sleep(300)

  const done = Math.min(i + BATCH_SIZE, contacts.length)
  console.log(`  ${done}/${contacts.length} enriched`)
}

console.log(`Pass 2 done. Enriched: ${enriched}`)
console.log('\n✓ All done!')
