/**
 * Finds and deletes all email_contacts where:
 *   - status === 'active'  AND
 *   - email is empty or does not match a valid email pattern
 *
 * Run: node scripts/removeInvalidEmails.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const BASE    = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Auth ──────────────────────────────────────────────────────────────────────
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

// ── Scan ──────────────────────────────────────────────────────────────────────
const token    = await getToken()
const toDelete = []
let pageToken  = null
let total      = 0

console.log('Scanning email_contacts for invalid emails…')
do {
  const url = `${BASE}/email_contacts?pageSize=300${pageToken ? '&pageToken=' + pageToken : ''}`
    + `&mask.fieldPaths=email&mask.fieldPaths=status`
  const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const data = await res.json()
  if (data.error) throw new Error(`Firestore error: ${JSON.stringify(data.error)}`)

  for (const doc of data.documents || []) {
    const email  = (doc.fields?.email?.stringValue || '').trim()
    const status = doc.fields?.status?.stringValue || ''
    total++
    if (status === 'active' && !emailRe.test(email)) {
      toDelete.push({ name: doc.name, email: email || '(empty)' })
    }
  }
  pageToken = data.nextPageToken
  process.stdout.write(`\r  ${total} scanned — ${toDelete.length} to delete…`)
} while (pageToken)

console.log(`\n\nFound ${toDelete.length} active contacts with invalid/empty email.`)

if (toDelete.length === 0) {
  console.log('Nothing to delete.')
  process.exit(0)
}

// ── Preview ───────────────────────────────────────────────────────────────────
console.log('\nContacts to be deleted:')
toDelete.forEach(d => console.log(`  - "${d.email}"`))

// ── Delete in batches of 20 (batchWrite max per call) ─────────────────────────
console.log('\nDeleting…')
const BATCH_DELETE = 20
let deleted = 0

for (let i = 0; i < toDelete.length; i += BATCH_DELETE) {
  const chunk = toDelete.slice(i, i + BATCH_DELETE)
  const res = await fetch(`${BASE.replace('/documents', '')}:batchWrite`
    .replace('/v1/', '/v1/')
    .replace('documents', 'documents')
    // correct URL:
    , {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: chunk.map(d => ({ delete: d.name })),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`  Batch delete failed: ${err.slice(0, 200)}`)
  } else {
    deleted += chunk.length
    console.log(`  ${deleted}/${toDelete.length} deleted`)
  }
}

console.log(`\n✓ Done. Removed ${deleted} contact(s) with invalid emails.`)
