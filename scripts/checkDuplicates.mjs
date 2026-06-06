/**
 * Check Firestore email_contacts for:
 *   1. Duplicate email addresses (same email stored in multiple docs)
 *   2. Records with missing or invalid email
 *   3. Email field that doesn't match the document ID
 *
 * Reports issues and removes/fixes them.
 * Uses REST API (avoids gRPC quota issues).
 *
 * Run: node scripts/checkDuplicates.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

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
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${msg}.${sig}` }),
  })
  const d = await res.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || '').trim())
}

function docIdFromEmail(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}

function getStr(fields, key) {
  return fields?.[key]?.stringValue || ''
}

// ── Fetch all documents (paginated) ───────────────────────────────────────────
async function fetchAllDocs(token) {
  const docs = []
  let pageToken = null
  let page = 0

  do {
    const url = new URL(`${BASE_URL}/email_contacts`)
    url.searchParams.set('pageSize', '300')
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`List failed ${res.status}: ${await res.text()}`)
    const data = await res.json()

    for (const doc of (data.documents || [])) {
      const id     = doc.name.split('/').pop()
      const fields = doc.fields || {}
      docs.push({ id, fields })
    }

    pageToken = data.nextPageToken || null
    page++
    process.stdout.write(`\r  Fetched ${docs.length} documents (page ${page})…`)
  } while (pageToken)

  console.log(`\r  Fetched ${docs.length} documents total.             `)
  return docs
}

// ── Delete a doc ──────────────────────────────────────────────────────────────
async function deleteDoc(token, docId) {
  const res = await fetch(`${BASE_URL}/email_contacts/${encodeURIComponent(docId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Delete ${docId} failed: ${await res.text()}`)
}

// ── Patch email field ──────────────────────────────────────────────────────────
async function patchEmail(token, docId, correctEmail) {
  const res = await fetch(
    `${BASE_URL}/email_contacts/${encodeURIComponent(docId)}?updateMask.fieldPaths=email`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { email: { stringValue: correctEmail } } }),
    }
  )
  if (!res.ok) throw new Error(`Patch ${docId} failed: ${await res.text()}`)
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log('Authenticating…')
let token = await getToken()

console.log('Fetching all email_contacts…')
const docs = await fetchAllDocs(token)

// ── Analysis ──────────────────────────────────────────────────────────────────
const noEmail       = []  // docs with empty email field
const invalidEmail  = []  // docs with malformed email
const mismatchId    = []  // email field doesn't match doc ID
const emailIndex    = {}  // email → [docIds]   (for duplicate detection)

for (const { id, fields } of docs) {
  const emailRaw = getStr(fields, 'email')
  const email    = emailRaw.trim().toLowerCase()

  if (!emailRaw.trim()) {
    noEmail.push(id)
    continue
  }

  if (!isValidEmail(email)) {
    invalidEmail.push({ id, email: emailRaw })
    continue
  }

  // Check if email field matches doc ID
  const expectedId = docIdFromEmail(email)
  if (expectedId !== id) {
    mismatchId.push({ id, email, expectedId })
  }

  // Index for duplicate check
  if (!emailIndex[email]) emailIndex[email] = []
  emailIndex[email].push(id)
}

// True duplicates: same email stored in 2+ different docs
const duplicates = Object.entries(emailIndex)
  .filter(([, ids]) => ids.length > 1)

// ── Report ────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════')
console.log(`  TOTAL DOCUMENTS:       ${docs.length}`)
console.log(`  Missing email field:   ${noEmail.length}`)
console.log(`  Invalid email format:  ${invalidEmail.length}`)
console.log(`  Doc ID mismatch:       ${mismatchId.length}`)
console.log(`  Duplicate emails:      ${duplicates.length}`)
console.log('══════════════════════════════════════════════\n')

if (noEmail.length)      console.log('No email:', noEmail.slice(0, 5))
if (invalidEmail.length) console.log('Invalid:', invalidEmail.slice(0, 5))
if (mismatchId.length)   console.log('Mismatch:', mismatchId.slice(0, 5))
if (duplicates.length)   console.log('Duplicates:', duplicates.slice(0, 5))

const total = noEmail.length + invalidEmail.length + mismatchId.length + duplicates.length
if (total === 0) {
  console.log('✅  Database is clean — no issues found!')
  process.exit(0)
}

// ── Fix ────────────────────────────────────────────────────────────────────────
console.log(`\nFixing ${total} issues…\n`)
token = await getToken() // refresh before write phase

let deleted = 0, fixed = 0

// 1. Delete docs with no email (can't be targeted, useless)
for (const id of noEmail) {
  try {
    await deleteDoc(token, id)
    console.log(`[deleted — no email]  ${id}`)
    deleted++
  } catch (e) { console.error(`  ERR: ${e.message}`) }
}

// 2. Delete docs with invalid email
for (const { id, email } of invalidEmail) {
  try {
    await deleteDoc(token, id)
    console.log(`[deleted — invalid]   ${id}  (${email})`)
    deleted++
  } catch (e) { console.error(`  ERR: ${e.message}`) }
}

// 3. Fix email field mismatch (doc ID is authoritative — the email field was wrong)
for (const { id, email, expectedId } of mismatchId) {
  // The correct email is reconstructible from the doc ID
  // BUT doc ID encoding is lossy (special chars → '_'), so we trust the email field value
  // and just ensure the email field is lowercased and trimmed
  const corrected = email.toLowerCase().trim()
  try {
    await patchEmail(token, id, corrected)
    console.log(`[fixed — mismatch]    ${id}  email set to "${corrected}"`)
    fixed++
  } catch (e) { console.error(`  ERR: ${e.message}`) }
}

// 4. Deduplicate: keep the doc whose ID matches the email (canonical), delete others
for (const [email, ids] of duplicates) {
  const canonical = docIdFromEmail(email)
  // Keep canonical if it exists, otherwise keep first; delete the rest
  const keep   = ids.includes(canonical) ? canonical : ids[0]
  const remove = ids.filter(id => id !== keep)

  for (const id of remove) {
    try {
      await deleteDoc(token, id)
      console.log(`[deleted — duplicate] ${id}  (kept: ${keep})  email: ${email}`)
      deleted++
    } catch (e) { console.error(`  ERR: ${e.message}`) }
  }
}

console.log(`\n✅  Done: ${deleted} deleted, ${fixed} fixed.`)
