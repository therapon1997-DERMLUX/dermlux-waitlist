/**
 * Downloads the invoice images of every expense that has no line items yet,
 * so Claude can read them locally (no Anthropic API credits needed).
 * Auth: service account -> custom token -> Firebase ID token -> Worker /invoices/*
 */
import admin from 'firebase-admin'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })

const env = Object.fromEntries(readFileSync('C:/Users/User/dermlux-waitlist/.env', 'utf8')
  .split('\n').filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const API_KEY = env.VITE_FIREBASE_API_KEY

const uid = 'script-reader'
const customToken = await admin.auth().createCustomToken(uid, { admin: true })
const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${API_KEY}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: customToken, returnSecureToken: true }),
})
const auth = await r.json()
if (!auth.idToken) { console.error('AUTH FAILED', JSON.stringify(auth).slice(0, 400)); process.exit(1) }
console.log('got ID token ✓')

const list = JSON.parse(readFileSync('C:/Users/User/tmp_unread.json', 'utf8'))
const outDir = 'C:/Users/User/unread_invoices'
mkdirSync(outDir, { recursive: true })

const slug = s => (s || 'x').replace(/[^\w.-]+/g, '_').slice(0, 40)
const manifest = []
let ok = 0, fail = 0, skip = 0
for (const [i, e] of list.entries()) {
  if (!e.fileUrl) { skip++; continue }
  const ext = (e.fileName || e.fileUrl).split('.').pop().split('?')[0].toLowerCase()
  const name = `${String(i).padStart(3, '0')}_${slug(e.vendor)}_${e.date || 'nodate'}_${slug(e.inv)}.${['jpg', 'jpeg', 'png', 'pdf', 'webp'].includes(ext) ? ext : 'jpg'}`
  const dest = `${outDir}/${name}`
  if (existsSync(dest)) { manifest.push({ ...e, file: name }); ok++; continue }
  try {
    const res = await fetch(e.fileUrl, { headers: { Authorization: `Bearer ${auth.idToken}`, 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) throw new Error('HTTP ' + res.status)
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
    manifest.push({ ...e, file: name }); ok++
  } catch (err) {
    console.log(`FAIL ${e.vendor} ${e.date} ${e.inv}: ${err.message}`)
    fail++
  }
}
writeFileSync(`${outDir}/manifest.json`, JSON.stringify(manifest, null, 1))
console.log(`\ndownloaded ${ok}, failed ${fail}, no-url ${skip}  →  ${outDir}`)
process.exit(0)
