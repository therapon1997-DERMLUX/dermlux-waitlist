import admin from 'firebase-admin'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const env = Object.fromEntries(readFileSync('C:/Users/User/dermlux-waitlist/.env', 'utf8')
  .split('\n').filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const customToken = await admin.auth().createCustomToken('script-reader', { admin: true })
const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${env.VITE_FIREBASE_API_KEY}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: customToken, returnSecureToken: true }),
})
const auth = await r.json()
if (!auth.idToken) { console.error('AUTH FAILED'); process.exit(1) }

const ids = ['q2_p049', 'q2_p050', 'q2_p063', 'q2_p070', 'q2_p091', 'q2_p147', 'q2_p148', 'q2_p170', 'q2_p188', 'q2_p205', 'q2_p224', 'q2_p239', 'q2_p240', 'q2_p243']
const outDir = 'C:/Users/User/mj_fiber'
mkdirSync(outDir, { recursive: true })
for (const id of ids) {
  const doc = await db.collection('expenses').doc(id).get()
  const e = doc.data()
  if (!e?.fileUrl) { console.log(id, 'NO URL'); continue }
  const res = await fetch(e.fileUrl, { headers: { Authorization: `Bearer ${auth.idToken}`, 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) { console.log(id, 'HTTP', res.status); continue }
  const f = `${outDir}/${id}_${e.date}.png`
  writeFileSync(f, Buffer.from(await res.arrayBuffer()))
  console.log('OK', id, e.date, '€' + e.total, '->', f)
}
process.exit(0)
