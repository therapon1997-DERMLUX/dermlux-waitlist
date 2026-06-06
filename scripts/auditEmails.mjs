/**
 * Full email audit — read-only analysis, no deletions.
 * Identifies suspicious / invalid / internal contacts.
 * Run: node scripts/auditEmails.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
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
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || '').trim()) }

// Clinic / internal domain keywords
const INTERNAL_KEYWORDS = ['dermlux', 'dermilux', 'dermlax', 'dermlox', 'dermlucks']

// Obviously fake/role/test email patterns (username part)
const ROLE_PREFIXES = [
  'info', 'admin', 'contact', 'hello', 'support', 'noreply', 'no-reply',
  'test', 'example', 'demo', 'sample', 'dummy', 'fake', 'marketing',
  'newsletter', 'mail', 'email', 'office', 'reception', 'booking',
]

// Known bad TLDs or clearly wrong domains
const BAD_PATTERNS = [
  /@.*\.con$/i,   // .con instead of .com
  /@.*\.cpm$/i,   // .cpm
  /@.*\.vom$/i,   // .vom
  /@.*\.ocm$/i,   // .ocm
  /^\d+@/,        // starts with numbers only
]

function firstNameFromFull(fullName) {
  if (!fullName) return ''
  return fullName.trim().split(/\s+/)[0].toLowerCase()
}

function emailUsername(email) {
  return (email || '').split('@')[0].toLowerCase()
}

async function fetchAllDocs(token) {
  const docs = []
  let pageToken = null, page = 0
  do {
    const url = new URL(`${BASE_URL}/email_contacts`)
    url.searchParams.set('pageSize', '300')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`List failed ${res.status}: ${await res.text()}`)
    const data = await res.json()
    for (const d of (data.documents || [])) {
      docs.push({ id: d.name.split('/').pop(), fields: d.fields || {} })
    }
    pageToken = data.nextPageToken || null
    page++
    process.stdout.write(`\r  Fetched ${docs.length} docs (page ${page})…`)
  } while (pageToken)
  console.log(`\r  Fetched ${docs.length} total.              `)
  return docs
}

// ── Main ───────────────────────────────────────────────────────────────────────
const token = await getToken()
console.log('Fetching all contacts…')
const docs = await fetchAllDocs(token)

const results = {
  internal:       [],   // contains dermlux etc.
  invalidFormat:  [],   // fails email regex or has typo TLD
  noEmail:        [],   // empty email field
  roleAddress:    [],   // info@, admin@, etc.
  firstNameOnly:  [],   // email username = just the first name (e.g. maria@gmail.com for "Maria X")
  idMismatch:     [],   // email field ≠ doc id derivation (encoding issue)
  clean:          0,
}

const PROTECTED = new Set(['bounced','complained','suppressed','unsubscribed'])

for (const { id, fields } of docs) {
  const email  = getStr(fields, 'email')
  const name   = getStr(fields, 'name')
  const status = getStr(fields, 'status')

  // Skip already-protected contacts (we don't touch their records)
  if (PROTECTED.has(status)) { results.clean++; continue }

  if (!email) {
    results.noEmail.push({ id, name, status })
    continue
  }

  // 1. Internal / clinic emails
  const emailLower = email.toLowerCase()
  if (INTERNAL_KEYWORDS.some(kw => emailLower.includes(kw))) {
    results.internal.push({ id, email, name, status })
    continue
  }

  // 2. Bad TLD / obvious typos
  const hasBadPattern = BAD_PATTERNS.some(p => p.test(email))
  if (hasBadPattern || !isValidEmail(email)) {
    results.invalidFormat.push({ id, email, name, status, reason: hasBadPattern ? 'typo TLD/pattern' : 'invalid format' })
    continue
  }

  // 3. Role addresses (info@, admin@, etc.)
  const username = emailUsername(email)
  if (ROLE_PREFIXES.some(p => username === p || username.startsWith(p + '.'))) {
    results.roleAddress.push({ id, email, name, status })
    continue
  }

  // 4. First-name-only email (username = just the person's first name, no numbers/dots)
  const firstName = firstNameFromFull(name)
  if (
    firstName.length >= 3 &&                      // name must be meaningful
    username === firstName &&                      // exact match
    !/[\d._+\-]/.test(username) &&                // no numbers or separators
    name.trim().split(/\s+/).length >= 2           // must have last name too (otherwise could be legit single-name account)
  ) {
    results.firstNameOnly.push({ id, email, name, status, reason: `"${username}" matches first name of "${name}"` })
    continue
  }

  results.clean++
}

// ── Report ─────────────────────────────────────────────────────────────────────
const total = docs.length
const issues = results.internal.length + results.invalidFormat.length +
               results.noEmail.length + results.roleAddress.length +
               results.firstNameOnly.length

console.log('\n══════════════════════════════════════════════════════')
console.log(`  Total contacts:          ${total}`)
console.log(`  ✅ Clean / protected:    ${results.clean}`)
console.log(`  ─────────────────────────────────────────────────`)
console.log(`  🏥 Internal (dermlux…):  ${results.internal.length}`)
console.log(`  ❌ Invalid format/typo:  ${results.invalidFormat.length}`)
console.log(`  📭 Missing email:        ${results.noEmail.length}`)
console.log(`  🤖 Role address:         ${results.roleAddress.length}`)
console.log(`  👤 First-name-only:      ${results.firstNameOnly.length}`)
console.log(`  ─────────────────────────────────────────────────`)
console.log(`  Total to remove:         ${issues}`)
console.log('══════════════════════════════════════════════════════\n')

// Print samples
function printSample(label, arr, n = 8) {
  if (!arr.length) return
  console.log(`\n── ${label} (showing ${Math.min(n, arr.length)} of ${arr.length}) ─────────────`)
  arr.slice(0, n).forEach(r => console.log(`  [${r.status || '?'}] ${r.email || '(empty)'}  — "${r.name || ''}"  ${r.reason || ''}`))
}

printSample('Internal / clinic', results.internal)
printSample('Invalid format / typo', results.invalidFormat)
printSample('Missing email', results.noEmail)
printSample('Role address', results.roleAddress)
printSample('First-name-only', results.firstNameOnly, 12)

// Save full report to file for review
const report = { generated: new Date().toISOString(), total, issues, ...results }
writeFileSync(resolve(__dirname, '../scripts/audit-report.json'), JSON.stringify(report, null, 2))
console.log('\nFull report saved to scripts/audit-report.json')
