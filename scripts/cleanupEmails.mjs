/**
 * Delete all flagged contacts from Firestore.
 * Run: node scripts/cleanupEmails.mjs
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

function docId(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}

const TO_DELETE = [
  // ── Internal / clinic placeholder emails ─────────────────────────────────
  '95666899@noemail.dermlux.local',
  '97762758@noemail.dermlux.local',
  '99108037@noemail.dermlux.local',
  'δdermluxlimassol@gmail.com',
  'info@dermluxclinic.com',

  // ── Typo TLD: .con instead of .com ───────────────────────────────────────
  'mozhdemoshfegh0@gmail.con',
  'sajid336606@gmail.con',
  'pavlina_-k@hotmail.con',
  'victorianicolaou@gmail.con',
  'lea_skondric@hotmail.con',
  'noman_7@hotmail.con',
  'olgakonomou2000@gmail.con',
  'srizasubba11@gmail.con',

  // ── Typo domain: misspelled gmail ────────────────────────────────────────
  'gedeon@gmaill.com',
  'karit@gmail.co',
  'kitenge@gmai.com',
  'mirasol@gmai.com',

  // ── Fake / garbage ────────────────────────────────────────────────────────
  '2718645@gmail.com',
  '99@300305.net',

  // ── Business shared inboxes ───────────────────────────────────────────────
  'info@assetpro.cy',
  'info@aatbsi.com',
  'info@gallopsky.com',
  'info@happyvalley.com.cy',
  'info@karatzias.com',
  'info@kastaliawater.com',
  'info@metimetherapy.cy',
  'info@paphosweddingsmadeeasy.com',
  'info@rotosgroup.com',
  'info@russellflick.com',
  'info@smlawcy.com',
  'info@studiog.com.cy',
  'info@umbertobros.com',
  'info@vitaltrendsgmbh.com',
  'office@cypruspropertyland.com',
]

const token = await getToken()
let deleted = 0, notFound = 0, errors = 0

for (const email of TO_DELETE) {
  const id  = docId(email)
  const url = `${BASE_URL}/email_contacts/${encodeURIComponent(id)}`
  try {
    const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.status === 404) {
      console.log(`  [not found] ${email}`)
      notFound++
    } else if (!res.ok) {
      throw new Error(await res.text())
    } else {
      console.log(`  [deleted]   ${email}`)
      deleted++
    }
  } catch (e) {
    console.error(`  [error]     ${email}: ${e.message}`)
    errors++
  }
}

console.log(`\nDone: ${deleted} deleted, ${notFound} not found, ${errors} errors.`)
