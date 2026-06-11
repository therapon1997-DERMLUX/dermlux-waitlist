/**
 * cleanupFakeEmails.mjs
 *
 * Finds and deletes:
 *   1. Emails containing "dermlux" anywhere
 *   2. Clearly fake/generic emails (username is a known placeholder word)
 *   3. Duplicate emails (same address in multiple docs — keeps canonical doc)
 *
 * DRY RUN by default. Pass --delete to actually remove.
 *
 * Run:  node scripts/cleanupFakeEmails.mjs
 *       node scripts/cleanupFakeEmails.mjs --delete
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA        = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT   = SA.project_id
const BASE_URL  = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`
const DRY_RUN   = !process.argv.includes('--delete')

// ── Known fake/generic usernames ─────────────────────────────────────────────
// These are usernames that are clearly placeholder names, not real people.
const FAKE_USERNAMES = new Set([
  // Literal placeholders
  'name', 'firstname', 'lastname', 'username', 'surname', 'fullname', 'yourname',
  'test', 'testing', 'tester', 'test1', 'test2', 'testtest',
  'fake', 'dummy', 'sample', 'example', 'demo', 'placeholder', 'temp', 'temporary',
  'user', 'user1', 'user2',
  // Generic mailboxes
  'info', 'admin', 'administrator', 'contact', 'contacts', 'support', 'helpdesk',
  'hello', 'hi', 'hey',
  'noreply', 'no-reply', 'no_reply', 'donotreply', 'do-not-reply',
  'mail', 'email', 'e-mail',
  'webmaster', 'postmaster', 'hostmaster',
  'office', 'reception', 'receptionist',
  'enquiry', 'enquiries', 'inquiry', 'inquiries',
  'help', 'helpme',
  'sales', 'marketing', 'billing', 'accounts', 'accounting', 'finance',
  'hr', 'humanresources', 'recruitment',
  'newsletter', 'news', 'updates', 'notifications',
  'client', 'customer', 'customers', 'member',
  // Single letter / single digit
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Common mistakes
  'aaa', 'bbb', 'ccc', 'xxx', 'yyy', 'zzz', 'abc', 'xyz',
  'qwerty', 'asdf', 'password',
])

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
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${msg}.${sig}` }),
  })
  const d = await res.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

function getStr(fields, key) { return (fields?.[key]?.stringValue || '').trim() }

function docIdFromEmail(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── Fetch all docs ────────────────────────────────────────────────────────────
async function fetchAllDocs(token) {
  const docs = []
  let pageToken = null, page = 0
  do {
    const url = new URL(`${BASE_URL}/email_contacts`)
    url.searchParams.set('pageSize', '300')
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    let res, attempt = 0
    while (true) {
      res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
      if (res.status === 429) {
        attempt++
        const wait = attempt * 10000
        process.stdout.write(`\r  Rate limited, waiting ${wait / 1000}s… (page ${page + 1})`)
        await sleep(wait)
        continue
      }
      if (!res.ok) throw new Error(`List ${res.status}: ${await res.text()}`)
      break
    }

    const data = await res.json()
    for (const d of (data.documents || [])) {
      docs.push({ id: d.name.split('/').pop(), fields: d.fields || {} })
    }
    pageToken = data.nextPageToken || null
    page++
    process.stdout.write(`\r  Fetched ${docs.length} docs (page ${page})…`)
    await sleep(300)  // 300ms between pages to avoid rate limit
  } while (pageToken)
  console.log(`\r  Fetched ${docs.length} docs total.              `)
  return docs
}

// ── Delete ────────────────────────────────────────────────────────────────────
async function deleteDoc(token, docId) {
  const res = await fetch(`${BASE_URL}/email_contacts/${encodeURIComponent(docId)}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok && res.status !== 404) throw new Error(`Delete ${docId}: ${await res.text()}`)
}

// ── Classify one email ────────────────────────────────────────────────────────
const PROTECTED = new Set(['bounced', 'complained', 'suppressed', 'unsubscribed'])

function classify(id, fields) {
  const email  = getStr(fields, 'email').toLowerCase()
  const status = getStr(fields, 'status')

  if (!email) return { reason: 'no_email' }
  if (PROTECTED.has(status)) return null  // never touch protected

  // 1. Contains "dermlux"
  if (email.includes('dermlux')) return { reason: 'dermlux', email }

  // 2. Fake/generic username
  const username = email.split('@')[0].replace(/[^a-z0-9]/g, '')  // strip dots/underscores
  if (FAKE_USERNAMES.has(username)) return { reason: 'fake_username', email, username }

  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────
console.log(DRY_RUN
  ? '🔍  DRY RUN — pass --delete to actually remove contacts\n'
  : '⚠️   LIVE DELETE MODE\n'
)

console.log('Authenticating…')
let token = await getToken()

console.log('Fetching all email_contacts…')
const docs = await fetchAllDocs(token)

// ── Classify ──────────────────────────────────────────────────────────────────
const toDermlux  = []
const toFake     = []
const emailIndex = {}   // email → [docIds] for duplicate detection

for (const { id, fields } of docs) {
  const email  = getStr(fields, 'email').toLowerCase()
  const status = getStr(fields, 'status')
  const name   = getStr(fields, 'name')

  if (!email || PROTECTED.has(status)) continue

  // Duplicate index (all valid emails)
  if (!emailIndex[email]) emailIndex[email] = []
  emailIndex[email].push(id)

  const hit = classify(id, fields)
  if (!hit) continue
  const entry = { id, email, name, reason: hit.reason, username: hit.username }
  if (hit.reason === 'dermlux')       toDermlux.push(entry)
  else if (hit.reason === 'fake_username') toFake.push(entry)
}

// Duplicates: same email in 2+ docs
const duplicates = Object.entries(emailIndex).filter(([, ids]) => ids.length > 1)

// ── Report ────────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════════════════')
console.log(`  Total contacts fetched:  ${docs.length}`)
console.log(`  Contains "dermlux":      ${toDermlux.length}`)
console.log(`  Fake/generic username:   ${toFake.length}`)
console.log(`  Duplicate email groups:  ${duplicates.length}`)
const dupCount = duplicates.reduce((sum, [, ids]) => sum + ids.length - 1, 0)
console.log(`  Duplicate docs to drop:  ${dupCount}`)
console.log('══════════════════════════════════════════════════════\n')

if (toDermlux.length) {
  console.log('── Contains "dermlux" ──────────────────────────────')
  toDermlux.forEach(c => console.log(`  ${c.email.padEnd(50)}  "${c.name}"`))
  console.log()
}

if (toFake.length) {
  console.log('── Fake/generic username ───────────────────────────')
  toFake.forEach(c => console.log(`  ${c.email.padEnd(50)}  username="${c.username}"  name="${c.name}"`))
  console.log()
}

if (duplicates.length) {
  console.log('── Duplicate emails ────────────────────────────────')
  duplicates.slice(0, 20).forEach(([email, ids]) =>
    console.log(`  ${email.padEnd(50)}  docs: ${ids.join(', ')}`)
  )
  if (duplicates.length > 20) console.log(`  … and ${duplicates.length - 20} more`)
  console.log()
}

const totalToDelete = toDermlux.length + toFake.length + dupCount
if (totalToDelete === 0) {
  console.log('✅  Database is clean — nothing to remove!')
  process.exit(0)
}

if (DRY_RUN) {
  console.log(`📋  Would delete ${totalToDelete} contacts total.`)
  console.log('    Run with --delete to apply.')
  process.exit(0)
}

// ── Delete ────────────────────────────────────────────────────────────────────
console.log(`\nDeleting ${totalToDelete} contacts…`)
token = await getToken()
let deleted = 0, errors = 0

const deleteOne = async (id, label) => {
  try {
    await deleteDoc(token, id)
    console.log(`  [deleted ${label}]  ${id}`)
    deleted++
  } catch (e) {
    console.error(`  [error]  ${id}: ${e.message}`)
    errors++
  }
}

for (const c of toDermlux) await deleteOne(c.id, 'dermlux ')
for (const c of toFake)     await deleteOne(c.id, 'fake    ')

for (const [email, ids] of duplicates) {
  const canonical = docIdFromEmail(email)
  const keep   = ids.includes(canonical) ? canonical : ids[0]
  const remove = ids.filter(id => id !== keep)
  for (const id of remove) await deleteOne(id, 'dup     ')
}

console.log(`\n✅  Done: ${deleted} deleted, ${errors} errors.`)
