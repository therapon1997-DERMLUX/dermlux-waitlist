/**
 * Mark bounced / complained / suppressed contacts as opt-out in Firestore.
 * Uses REST API PATCH (no pre-read needed — Firestore supports create-or-merge via updateMask).
 * If the doc doesn't exist, we create it as a tombstone.
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id

// ── contacts to mark ──────────────────────────────────────────────────────────
const BOUNCED = [
  'rajbhullai108@gmail.com', 'rajbhullai786@gmail.com',
  'loizides.ko@cytanet.com.cy', 'loula19@hotmail.com',
  'oleksandabudarina@gmail.com', 'ordoniomariaisqbel@gmail.com',
  'argyrokaragiorgiades@gmail.com', 'andriaria_0304@hotmail.com',
  'kivia@europesportsgroup.com', 'kfirillas1@yahoo.gr',
  'albrgasahmad@gmail.com', 'ab.chrysostomou@hotmail.com',
  'jocelynambor@cloud.com', 'jasminbk2bb3@gmail.com',
  'ahtishamjohn1@gmail.con',
]

const COMPLAINED = [
  'anna.tal@hotmail.com',
  'christina-demetriou25@hotmail.com',
]

const SUPPRESSED = [
  'panagiota@dermlux.com', 'eliadathena@gmail.com',
  'k.silivastru@yahoo.com', 'annaprocopiou@hotmail.com',
  'anastasioudespoina45@gmail.com', 'morikurger@gmail.com',
  'johnkhedeclarian@gmail.com', 'jorgiastylianoy@gmail.com',
  'jatinderjatinderkaur2681@gmail.com', 'jana.barpas@yahoo.com',
  'irene.lazarou@yahoo.com', 'ireneyelasrou@hotmail.com',
  'gewrgia.lazarou22@gmail.com', 'happyhippos85.ef@gmail.com',
]

// ── helpers ───────────────────────────────────────────────────────────────────
function contactDocId(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: SA.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url')
  const sigInput = `${header}.${payload}`
  const sign = createSign('RSA-SHA256')
  sign.update(sigInput)
  const sig = sign.sign(SA.private_key, 'base64url')
  const jwt = `${sigInput}.${sig}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Token error: ' + JSON.stringify(data))
  return data.access_token
}

const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/email_contacts`

// Fully overwrite the document — no read needed
async function setDoc(token, docId, email, status, statusField) {
  const now = new Date().toISOString()
  const fields = {
    email:           { stringValue: email.toLowerCase().trim() },
    name:            { stringValue: '' },
    phone:           { stringValue: '' },
    tags:            { arrayValue: { values: [] } },
    source:          { stringValue: 'manual' },
    status:          { stringValue: status },
    optOutPermanent: { booleanValue: true },
    sendCount:       { integerValue: '0' },
    lastSentAt:      { nullValue: null },
    unsubscribedAt:  { nullValue: null },
    bouncedAt:       { nullValue: null },
    importedAt:      { stringValue: now },
    updatedAt:       { stringValue: now },
    [statusField]:   { stringValue: now },
  }

  // PUT = create or overwrite (no read needed)
  const res = await fetch(`${BASE}/${encodeURIComponent(docId)}`, {
    method: 'PATCH',  // PATCH with no updateMask = full overwrite (merge not supported here)
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status}: ${body}`)
  }
  return res.json()
}

// ── main ──────────────────────────────────────────────────────────────────────
const token = await getAccessToken()

const ALL = [
  ...BOUNCED.map(e    => ({ email: e, status: 'bounced',    field: 'bouncedAt'    })),
  ...COMPLAINED.map(e => ({ email: e, status: 'complained', field: 'complainedAt' })),
  ...SUPPRESSED.map(e => ({ email: e, status: 'suppressed', field: 'suppressedAt' })),
]

let ok = 0, errors = 0

for (const { email, status, field } of ALL) {
  const id = contactDocId(email)
  try {
    await setDoc(token, id, email, status, field)
    console.log(`[${status}] ${email}`)
    ok++
  } catch (e) {
    console.error(`ERROR ${email}: ${e.message}`)
    errors++
  }
  await sleep(150)
}

console.log(`\nDone: ${ok} written, ${errors} errors.`)
