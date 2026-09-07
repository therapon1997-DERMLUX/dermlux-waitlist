// READ-ONLY: exact schema of existing BoC docs + the 7 broken ones.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const snap = await db.collection('bank_transactions').where('account', '==', '357041157122').get()
const rows = snap.docs.map(d => ({ _id: d.id, ...d.data() }))
  .filter(t => (t.date || '') >= '2026-07-01').sort((a, b) => String(a.date).localeCompare(String(b.date)))
console.log('main-account docs in July 2026:', rows.length)
for (const r of rows.slice(-3)) console.log(JSON.stringify(r, null, 1))

const tam = await db.collection('bank_transactions').where('account', '==', '357542264638').get()
const t2 = tam.docs.map(d => ({ _id: d.id, ...d.data() })).sort((a, b) => String(a.date).localeCompare(String(b.date)))
console.log('\n--- newest cash-account doc ---\n', JSON.stringify(t2[t2.length - 1], null, 1))

const all = await db.collection('bank_transactions').get()
const broken = all.docs.map(d => ({ _id: d.id, ...d.data() })).filter(t => !t.date || !t.account)
console.log(`\n--- ${broken.length} docs with no date/account ---`)
for (const b of broken.slice(0, 8)) console.log(JSON.stringify(b).slice(0, 220))
process.exit(0)
