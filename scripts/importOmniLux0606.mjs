/**
 * Import OmniLux-06-06-2026.csv
 *
 * Steps:
 *  0. Identify bad contacts (no email, invalid format, number-heavy) → delete from DB
 *  1. Pass 1 — Create new contacts (conditional, skip existing)
 *  2. Pass 2 — Enrich all valid contacts (updateMask, never touches status)
 *
 * New fields added: adName, citiesVisited
 * treatmentCategories mapped from Categories column directly (semicolon-separated)
 * and falls back to text-matching on Treatments when Categories is empty.
 *
 * Run: node scripts/importOmniLux0606.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA       = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT  = SA.project_id
const CSV_PATH = 'C:/Users/User/Downloads/OmniLux-06-06-2026.csv'
const BASE_URL  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function docId(email)       { return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_') }
function normalise(e)       { return (e || '').toLowerCase().trim() }
function isValidEmail(e)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
const sleep = ms => new Promise(r => setTimeout(r, ms))

function numberHeavy(email) {
  const username = email.split('@')[0]
  let digits = 0, letters = 0
  for (const ch of username) {
    if (ch >= '0' && ch <= '9') digits++
    else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) letters++
  }
  return digits > letters
}

function sv(v)  { return { stringValue:  String(v ?? '').trim() } }
function nv(v)  {
  const n = parseFloat(String(v).replace(/[^\d.]/g, ''))
  return isNaN(n) ? { nullValue: null } : { doubleValue: n }
}
function bv(v)  { return { booleanValue: Boolean(v) } }
function iv(v)  { return { integerValue: String(parseInt(v) || 0) } }
function tv(dateStr) {
  if (!dateStr || !dateStr.trim()) return { nullValue: null }
  const parts = dateStr.trim().split(/[\s\/]/)
  if (parts.length < 3) return { nullValue: null }
  const [d, m, y] = parts
  const dt = new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`)
  if (isNaN(dt)) return { nullValue: null }
  return { timestampValue: dt.toISOString() }
}
function nullv() { return { nullValue: null } }

// ── Treatment category mapping ─────────────────────────────────────────────────
// Prefer the Categories column (properly filled); fall back to text-matching.
function mapTreatmentCategories(treatmentsStr = '', categoriesStr = '') {
  const catRaw = (categoriesStr || '').trim()
  if (catRaw) {
    const cats = new Set()
    for (const part of catRaw.split(';')) {
      const p = part.trim().toLowerCase()
      if (p === 'injectables' || p === 'injectable') cats.add('injectables')
      else if (p === 'laser')        cats.add('laser')
      else if (p === 'facial')       cats.add('facial')
      else if (p === 'consultation') cats.add('consultation')
      else if (p === 'other')        cats.add('other')
    }
    if (cats.size > 0) return [...cats]
  }
  // Fallback: text match on treatments
  const text = treatmentsStr.toLowerCase()
  const cats = []
  if (/inject|botox|filler|lip\s*fill|toxin|dysport|xeomin|juvederm|restylane|sculptra|prp|prf|hyaluron|profhilo|radiesse/.test(text)) cats.push('injectables')
  if (/laser/.test(text)) cats.push('laser')
  if (/facial|hydrat|peel|microneedl|dermapen|mesother|mesopeel|clean|brightening|glow|skinbooster|hydroface|oxygen|carboxy|hifu|ulthera|rf\b|radiofrequen|υψίσυχ|υψισιχν/.test(text)) cats.push('facial')
  if (/consult/.test(text)) cats.push('consultation')
  if (text.trim() && cats.length === 0) cats.push('other')
  return cats
}

function treatmentCategoriesField(r) {
  const cats = mapTreatmentCategories(r['Treatments'] || '', r['Categories'] || '')
  return { arrayValue: { values: cats.map(c => ({ stringValue: c })) } }
}

// ── Parse & deduplicate CSV ────────────────────────────────────────────────────
console.log('Parsing CSV…')
const raw  = readFileSync(CSV_PATH, 'utf-8')
const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true })
console.log(`Total rows: ${rows.length}`)

// Separate bad vs valid
const badEmails   = new Set()   // to delete from DB
const byEmail     = new Map()   // valid: email → best row

for (const r of rows) {
  const email = normalise(r['Email'])
  if (!email) continue
  if (!isValidEmail(email)) { badEmails.add(email); continue }
  if (numberHeavy(email))   { badEmails.add(email); continue }

  // Keep record with most non-empty fields
  if (!byEmail.has(email)) {
    byEmail.set(email, r)
  } else {
    const prev  = byEmail.get(email)
    const score = o => Object.values(o).filter(v => v && String(v).trim()).length
    if (score(r) > score(prev)) byEmail.set(email, r)
  }
}

const contacts = [...byEmail.values()]
console.log(`Valid unique emails:  ${contacts.length}`)
console.log(`Bad emails (delete):  ${badEmails.size}`)

const csvUnsub  = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() === 'unsubscribed')
const csvNormal = contacts.filter(r => (r['Subscription'] || '').toLowerCase().trim() !== 'unsubscribed')
console.log(`CSV unsubscribed:     ${csvUnsub.length}`)
console.log(`Normal contacts:      ${csvNormal.length}`)

// ── Field builders ─────────────────────────────────────────────────────────────
function buildNewContact(r, status) {
  const email = normalise(r['Email'])
  return {
    email:                sv(email),
    name:                 sv(r['Full Name']),
    phone:                sv(r['Phone']),
    city:                 sv(r['Primary City']),
    citiesVisited:        sv(r['Cities Visited']),
    adName:               sv(r['Ad Name']),
    tags:                 { arrayValue: { values: [] } },
    source:               sv('csv_import'),
    status:               sv(status),
    sendCount:            iv(0),
    totalSpend:           nv(r['Total Spend']),
    categories:           sv(r['Categories']),
    treatments:           sv(r['Treatments']),
    treatmentCategories:  treatmentCategoriesField(r),
    lastAppointmentAt:    tv(r['Last Appointment']),
    omniluxStatus:        sv(r['Status']),
    omniluxSource:        sv(r['Data Source']),
    language:             sv(r['Language']),
    lastSentAt:           nullv(),
    unsubscribedAt:       status === 'unsubscribed' ? { timestampValue: new Date().toISOString() } : nullv(),
    bouncedAt:            nullv(),
    complainedAt:         nullv(),
    optOutPermanent:      status === 'unsubscribed' ? bv(true) : bv(false),
    importedAt:           { timestampValue: new Date().toISOString() },
    updatedAt:            { timestampValue: new Date().toISOString() },
    enrichedAt:           { timestampValue: new Date().toISOString() },
  }
}

const ENRICH_MASK = [
  'city', 'citiesVisited', 'adName', 'totalSpend',
  'categories', 'treatments', 'treatmentCategories',
  'lastAppointmentAt', 'omniluxStatus', 'omniluxSource',
  'language', 'phone', 'enrichedAt',
]

function buildEnrichFields(r) {
  return {
    city:                 sv(r['Primary City']),
    citiesVisited:        sv(r['Cities Visited']),
    adName:               sv(r['Ad Name']),
    totalSpend:           nv(r['Total Spend']),
    categories:           sv(r['Categories']),
    treatments:           sv(r['Treatments']),
    treatmentCategories:  treatmentCategoriesField(r),
    lastAppointmentAt:    tv(r['Last Appointment']),
    omniluxStatus:        sv(r['Status']),
    omniluxSource:        sv(r['Data Source']),
    language:             sv(r['Language']),
    phone:                sv(r['Phone']),
    enrichedAt:           { timestampValue: new Date().toISOString() },
  }
}

// ── batchWrite helper ──────────────────────────────────────────────────────────
const CHUNK = 200

async function batchWrite(tokenRef, writes) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(BATCH_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenRef.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ writes }),
    })
    if (res.ok) return res.json()
    const body = await res.text()
    if (res.status === 429 || res.status === 503) {
      const wait = (attempt + 1) * 10000  // 10s, 20s, 30s...
      process.stdout.write(`\n  [quota] waiting ${wait/1000}s…`)
      await sleep(wait)
      tokenRef.value = await getToken()   // refresh token
      continue
    }
    throw new Error(`batchWrite ${res.status}: ${body.slice(0, 300)}`)
  }
  throw new Error('Max retries exceeded')
}

async function runBatch(tokenRef, writes, label, resumeAt = 0) {
  let done = resumeAt
  for (let i = resumeAt; i < writes.length; i += CHUNK) {
    const chunk = writes.slice(i, i + CHUNK)
    await batchWrite(tokenRef, chunk)
    done += chunk.length
    process.stdout.write(`\r  ${label}: ${done} / ${writes.length}…`)
    await sleep(1500)   // 1.5s between batches to stay under rate limits
  }
  console.log(`\r  ${label}: ${done} done.                    `)
}

// Parse resume offsets from args: node script.mjs --s0 0 --s1 5200 --s2 0
const args = process.argv.slice(2)
function getArg(name) {
  const idx = args.indexOf(name)
  return idx !== -1 ? parseInt(args[idx + 1]) || 0 : 0
}
const resumeS0 = getArg('--s0')
const resumeS1 = getArg('--s1')
const resumeS2 = getArg('--s2')

const tokenRef = { value: await getToken() }

// ── STEP 0: Delete bad contacts from DB ───────────────────────────────────────
console.log('\n── Step 0: Deleting bad contacts from DB…')

// Skip doc IDs that are entirely underscores (reserved by Firestore)
const deleteWrites = [...badEmails]
  .map(email => ({ email, id: docId(email) }))
  .filter(({ id }) => /[a-z0-9]/.test(id))   // must have at least one alphanumeric char
  .map(({ id }) => ({
    delete: `${BASE_DOC}/${encodeURIComponent(id)}`,
  }))

if (deleteWrites.length > 0) {
  await runBatch(tokenRef, deleteWrites, 'Deleting bad contacts', resumeS0)
} else {
  console.log('  Nothing to delete.')
}

// ── STEP 1: Create new contacts (conditional) ──────────────────────────────────
console.log('\n── Step 1: Creating new contacts (skip existing)…')
if (resumeS1 > 0) console.log(`  Resuming from offset ${resumeS1}…`)

const allForCreate = [
  ...csvNormal.map(r => ({ r, status: 'active' })),
  ...csvUnsub.map(r  => ({ r, status: 'unsubscribed' })),
]

const createWrites = allForCreate.map(({ r, status }) => ({
  update: {
    name:   `${BASE_DOC}/${docId(normalise(r['Email']))}`,
    fields: buildNewContact(r, status),
  },
  currentDocument: { exists: false },
}))

await runBatch(tokenRef, createWrites, 'Creating', resumeS1)

// ── STEP 2: Enrich all valid contacts ──────────────────────────────────────────
console.log('\n── Step 2: Enriching all valid contacts (never touches status)…')
if (resumeS2 > 0) console.log(`  Resuming from offset ${resumeS2}…`)

const enrichWrites = contacts.map(r => ({
  update: {
    name:   `${BASE_DOC}/${docId(normalise(r['Email']))}`,
    fields: buildEnrichFields(r),
  },
  updateMask: { fieldPaths: ENRICH_MASK },
}))

await runBatch(tokenRef, enrichWrites, 'Enriching', resumeS2)

// ── Summary ────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════')
console.log(`  Bad deleted:   ${badEmails.size}`)
console.log(`  Attempted new: ${contacts.length}`)
console.log(`  Enriched:      ${contacts.length}`)
console.log('══════════════════════════════════════')

// Treatment category breakdown
const cats = { injectables: 0, laser: 0, facial: 0, consultation: 0, other: 0, none: 0 }
for (const r of contacts) {
  const mapped = mapTreatmentCategories(r['Treatments'] || '', r['Categories'] || '')
  if (mapped.length === 0) cats.none++
  else mapped.forEach(c => cats[c]++)
}
console.log('\nTreatment categories in this CSV:')
Object.entries(cats).forEach(([k, v]) => { if (v) console.log(`  ${k.padEnd(14)} ${v}`) })
console.log('\nDone!')
