/**
 * Delete contacts where the email username (before @) has more digits than letters.
 * e.g. 20234585@std.neu.edu.tr → 8 digits, 0 letters → DELETE
 *      maria123@gmail.com      → 5 letters, 3 digits → KEEP
 *      abc123@gmail.com        → 3 letters, 3 digits → KEEP (equal = keep)
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

async function getToken() {
  const now = Math.floor(Date.now() / 1000)
  const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const pld = Buffer.from(JSON.stringify({
    iss: SA.client_email, scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })).toString('base64url')
  const msg = `${hdr}.${pld}`
  const sig = (() => { const s = createSign('RSA-SHA256'); s.update(msg); return s.sign(SA.private_key, 'base64url') })()
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${msg}.${sig}` }),
  })
  const d = await res.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

function getStr(fields, key) { return (fields?.[key]?.stringValue || '').trim() }

function numberHeavy(email) {
  const username = email.split('@')[0]
  let digits = 0, letters = 0
  for (const ch of username) {
    if (ch >= '0' && ch <= '9') digits++
    else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) letters++
  }
  return { digits, letters, heavy: digits > letters }
}

// Fetch all docs
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
    for (const d of (data.documents || [])) {
      docs.push({ id: d.name.split('/').pop(), fields: d.fields || {} })
    }
    pageToken = data.nextPageToken || null
    page++
    process.stdout.write(`\r  Fetched ${docs.length} (page ${page})…`)
  } while (pageToken)
  console.log(`\r  Fetched ${docs.length} total.              `)
  return docs
}

const PROTECTED = new Set(['bounced', 'complained', 'suppressed', 'unsubscribed'])

let token = await getToken()
console.log('Fetching contacts…')
const docs = await fetchAllDocs(token)

// Find candidates
const toDelete = []
for (const { id, fields } of docs) {
  const email  = getStr(fields, 'email')
  const name   = getStr(fields, 'name')
  const status = getStr(fields, 'status')
  if (!email || PROTECTED.has(status)) continue
  const { digits, letters, heavy } = numberHeavy(email)
  if (heavy) toDelete.push({ id, email, name, digits, letters })
}

console.log(`\nFound ${toDelete.length} contacts with more digits than letters in username:\n`)
toDelete.forEach(c =>
  console.log(`  ${c.digits}d ${c.letters}l  ${c.email.padEnd(45)}  "${c.name}"`)
)

if (toDelete.length === 0) {
  console.log('Nothing to delete.')
  process.exit(0)
}

// Delete
console.log(`\nDeleting ${toDelete.length} contacts…`)
token = await getToken()
let deleted = 0, errors = 0

for (const { id, email } of toDelete) {
  const res = await fetch(`${BASE_URL}/email_contacts/${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  })
  if (res.ok || res.status === 404) {
    console.log(`  [deleted] ${email}`)
    deleted++
  } else {
    console.error(`  [error]   ${email}: ${await res.text()}`)
    errors++
  }
}

console.log(`\nDone: ${deleted} deleted, ${errors} errors.`)
