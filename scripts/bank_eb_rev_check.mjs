// READ-ONLY: existing Eurobank + Revolut doc schema and the last stored balance,
// so the new rows follow exactly the same shape and the chain can be cross-checked.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const snap = await db.collection('bank_transactions').get()
const all = snap.docs.map(d => ({ _id: d.id, ...d.data() }))

for (const acc of ['589-01-H59895-01', 'Main EUR']) {
  const rows = all.filter(t => t.account === acc).sort((a, b) => String(a.date).localeCompare(String(b.date)))
  console.log(`\n===== ${acc}: ${rows.length} rows   ${rows[0]?.date} → ${rows[rows.length - 1]?.date}`)
  console.log('id prefixes:', [...new Set(rows.map(r => r._id.replace(/[0-9].*$/, '')))].slice(0, 6).join(', '))
  console.log('LAST 3 stored:')
  for (const r of rows.slice(-3)) console.log('  ', JSON.stringify(r))
  console.log('FIRST stored:', JSON.stringify(rows[0]))
}
process.exit(0)
