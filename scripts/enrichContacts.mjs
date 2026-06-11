/**
 * Enrich Firestore email_contacts from a full OmniLux CSV export.
 *
 * Strategy (two-pass via REST batchWrite — no reads needed):
 *
 *  Pass 1 — CREATE new contacts only (condition: doc must not exist).
 *            New contacts get full data + status:'active' (or 'unsubscribed').
 *
 *  Pass 2 — ENRICH all contacts (updateMask, status never touched).
 *            Safe to run repeatedly — will not overwrite status/sendCount/etc.
 *
 * Usage:
 *   node scripts/enrichContacts.mjs               ← auto-finds latest OmniLux CSV in Downloads
 *   node scripts/enrichContacts.mjs --csv <path>  ← use specific CSV
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const DOWNLOADS = 'C:/Users/User/Downloads'

// ── CSV path: --csv arg or auto-find latest OmniLux file ──────────────────────
function findLatestOmniLuxCSV() {
  const files = readdirSync(DOWNLOADS)
    .filter(f => /^OmniLux.*\.csv$/i.test(f))
    .map(f => ({ name: f, mtime: statSync(`${DOWNLOADS}/${f}`).mtime }))
    .sort((a, b) => b.mtime - a.mtime)
  if (!files.length) throw new Error('No OmniLux CSV found in Downloads folder.')
  return `${DOWNLOADS}/${files[0].name}`
}

const argCsv = (() => {
  const idx = process.argv.indexOf('--csv')
  return idx !== -1 ? process.argv[idx + 1] : null
})()

const CSV_PATH = argCsv || findLatestOmniLuxCSV()
console.log(`Using CSV: ${CSV_PATH}`)

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

// ── Field helpers ──────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))
function sv(v)  { return { stringValue: String(v ?? '').trim() } }
function nv(v)  {
  const n = parseFloat(String(v).replace(/[^\d.]/g, ''))
  return isNaN(n) ? { nullValue: null } : { doubleValue: n }
}
function iv(v)  { return { integerValue: String(parseInt(v) || 0) } }
function bv(v)  { return { booleanValue: Boolean(v) } }
function nullv(){ return { nullValue: null } }
function tv(dateStr) {
  if (!dateStr || !String(dateStr).trim()) return { nullValue: null }
  // Formats: DD/MM/YYYY or DD/MM/YYYY HH:MM
  const parts = String(dateStr).trim().split(/[\s/]/)
  if (parts.length < 3) return { nullValue: null }
  const [d, m, y] = parts
  const dt = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
  if (isNaN(dt)) return { nullValue: null }
  return { timestampValue: dt.toISOString() }
}

// Tags: split Categories column by comma, lowercase
function tagsField(r) {
  const raw = (r['Categories'] || '').trim()
  if (!raw) return { arrayValue: { values: [] } }
  const tags = raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return { arrayValue: { values: tags.map(t => ({ stringValue: t })) } }
}

// Detailed treatment category inference (from both Treatments + Categories text)
function treatmentCategoriesField(r) {
  const text = `${r['Treatments'] || ''} ${r['Categories'] || ''}`.toLowerCase()
  const cats = []
  if (/inject|botox|filler|lip\s*fill|toxin|dysport|xeomin|juvederm|restylane|sculptra|prp|prf|hyaluron|profhilo|radiesse/.test(text)) cats.push('injectables')
  if (/laser/.test(text)) cats.push('laser')
  if (/facial|hydrat|peel|microneedl|dermapen|mesother|mesopeel|clean(sing)?|brightening|glow|skinbooster|hydroface|oxygen|carboxy|hifu|ulthera|rf\b|radiofrequen/.test(text)) cats.push('facial')
  if (/body|σώμα/.test(text)) cats.push('body')
  if (/consult/.test(text)) cats.push('consultation')
  const hasText = (r['Treatments'] || '').trim() || (r['Categories'] || '').trim()
  if (hasText && cats.length === 0) cats.push('other')
  return { arrayValue: { values: cats.map(c => ({ stringValue: c })) } }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function docId(email) { return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_') }
function normalise(e) { return (e || '').toLowerCase().trim() }
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

// ── Parse & deduplicate CSV ────────────────────────────────────────────────────
console.log('Parsing CSV…')
const raw  = readFileSync(CSV_PATH, 'utf-8')
const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true })

// Deduplicate by email — keep the record with the most filled fields
const byEmail = new Map()
for (const r of rows) {
  const email = normalise(r['Email'])
  if (!email || !isValidEmail(email)) continue
  if (!byEmail.has(email)) {
    byEmail.set(email, r)
  } else {
    const score = o => Object.values(o).filter(v => v && String(v).trim()).length
    if (score(r) > score(byEmail.get(email))) byEmail.set(email, r)
  }
}

const contacts = [...byEmail.values()]
console.log(`Total CSV rows: ${rows.length}`)
console.log(`Unique valid emails: ${contacts.length}`)

const csvUnsub  = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() === 'unsubscribed')
const csvNormal = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() !== 'unsubscribed')
console.log(`Unsubscribed: ${csvUnsub.length}  |  Normal: ${csvNormal.length}`)

// ── Firestore field builders ───────────────────────────────────────────────────
function buildNewContactFields(r, status) {
  return {
    // Identity
    email:               sv(normalise(r['Email'])),
    name:                sv(r['Full Name']),
    phone:               sv(r['Phone']),

    // Location
    city:                sv(r['Primary City']),
    citiesVisited:       sv(r['Cities Visited']),

    // Email system fields
    tags:                tagsField(r),
    source:              sv('csv_import'),
    status:              sv(status),
    sendCount:           iv(0),
    lastSentAt:          nullv(),
    unsubscribedAt:      status === 'unsubscribed' ? { timestampValue: new Date().toISOString() } : nullv(),
    bouncedAt:           nullv(),
    complainedAt:        nullv(),
    optOutPermanent:     bv(status === 'unsubscribed'),

    // OmniLux data
    omniluxStatus:       sv(r['Status']),
    omniluxSource:       sv(r['Data Source']),
    appointmentCount:    iv(r['Appointments']),
    totalSpend:          nv(r['Total Spend']),
    categories:          sv(r['Categories']),
    treatments:          sv(r['Treatments']),
    treatmentCategories: treatmentCategoriesField(r),
    language:            sv(r['Language']),
    adName:              sv(r['Ad Name']),

    // Dates
    lastAppointmentAt:   tv(r['Last Appointment']),
    lastActivityAt:      tv(r['Last Activity']),
    addedOnAt:           tv(r['Added On']),

    // Metadata
    importedAt:          { timestampValue: new Date().toISOString() },
    updatedAt:           { timestampValue: new Date().toISOString() },
    enrichedAt:          { timestampValue: new Date().toISOString() },
  }
}

// Enrich mask — fields safe to overwrite on existing contacts (status is NOT here)
const ENRICH_MASK = [
  'phone',
  'city', 'citiesVisited',
  'tags',
  'omniluxStatus', 'omniluxSource',
  'appointmentCount', 'totalSpend',
  'categories', 'treatments', 'treatmentCategories',
  'language', 'adName',
  'lastAppointmentAt', 'lastActivityAt', 'addedOnAt',
  'enrichedAt',
]

function buildEnrichFields(r) {
  return {
    phone:               sv(r['Phone']),
    city:                sv(r['Primary City']),
    citiesVisited:       sv(r['Cities Visited']),
    tags:                tagsField(r),
    omniluxStatus:       sv(r['Status']),
    omniluxSource:       sv(r['Data Source']),
    appointmentCount:    iv(r['Appointments']),
    totalSpend:          nv(r['Total Spend']),
    categories:          sv(r['Categories']),
    treatments:          sv(r['Treatments']),
    treatmentCategories: treatmentCategoriesField(r),
    language:            sv(r['Language']),
    adName:              sv(r['Ad Name']),
    lastAppointmentAt:   tv(r['Last Appointment']),
    lastActivityAt:      tv(r['Last Activity']),
    addedOnAt:           tv(r['Added On']),
    enrichedAt:          { timestampValue: new Date().toISOString() },
  }
}

// ── batchWrite with auto-retry on rate limits ──────────────────────────────────
const BASE       = `projects/${PROJECT}/databases/(default)/documents/email_contacts`
const BATCH_URL  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:batchWrite`
const BATCH_SIZE = 200   // smaller batches to stay within rate limits

async function batchWrite(token, writes, attempt = 0) {
  const res = await fetch(BATCH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  })
  if (res.status === 429 || res.status === 503) {
    if (attempt >= 8) throw new Error(`batchWrite ${res.status} after ${attempt} retries — daily quota likely exhausted`)
    const wait = Math.min(3000 * 2 ** attempt, 120000)
    console.log(`  Rate limited (${res.status}) — retry ${attempt + 1} in ${(wait / 1000).toFixed(0)}s…`)
    await sleep(wait)
    return batchWrite(token, writes, attempt + 1)
  }
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`batchWrite ${res.status}: ${t.slice(0, 400)}`)
  }
  return res.json()
}

// ── PASS 1: Create new contacts (only if doc doesn't exist) ───────────────────
console.log('\n── Pass 1: Creating new contacts…')
let token = await getToken()
let created = 0, skipped = 0

const allForCreate = [
  ...csvNormal.map(r => ({ r, status: 'active' })),
  ...csvUnsub.map(r  => ({ r, status: 'unsubscribed' })),
]

for (let i = 0; i < allForCreate.length; i += BATCH_SIZE) {
  const chunk = allForCreate.slice(i, i + BATCH_SIZE)
  const writes = chunk.map(({ r, status }) => ({
    update: {
      name:   `${BASE}/${docId(normalise(r['Email']))}`,
      fields: buildNewContactFields(r, status),
    },
    currentDocument: { exists: false },
  }))

  if (i > 0 && i % 10000 === 0) token = await getToken()
  const result = await batchWrite(token, writes)
  await sleep(800)

  for (const s of (result.writeResults || [])) {
    if (s.updateTime) created++
    else skipped++
  }

  const done = Math.min(i + BATCH_SIZE, allForCreate.length)
  console.log(`  ${done}/${allForCreate.length} — new: ${created}, existing: ${skipped}`)
}
console.log(`Pass 1 done. Created: ${created}, Already existed: ${skipped}`)

// ── PASS 2: Enrich all contacts (safe — status never touched) ─────────────────
console.log('\n── Pass 2: Enriching all contacts…')
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
  await sleep(800)

  const done = Math.min(i + BATCH_SIZE, contacts.length)
  console.log(`  ${done}/${contacts.length} enriched`)
}

console.log(`Pass 2 done. Enriched: ${enriched}`)
console.log('\n✓ Enrichment complete!')
