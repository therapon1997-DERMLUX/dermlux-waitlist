// READ-ONLY: what bank data is already in Firestore, per account, so the import only adds the gap.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const snap = await db.collection('bank_transactions').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
console.log('bank_transactions total:', all.length)

const byAcc = {}
for (const t of all) {
  const acc = t.account || t.accountNumber || t.bank || '(unknown)'
  const d = (t.date || t.transactionDate || '').toString().slice(0, 10)
  if (!byAcc[acc]) byAcc[acc] = { n: 0, min: '9999', max: '0000', prefixes: new Set() }
  const a = byAcc[acc]
  a.n++
  if (d && d < a.min) a.min = d
  if (d && d > a.max) a.max = d
  a.prefixes.add(String(t.id).replace(/[0-9].*$/, '').slice(0, 12))
}
console.log('\naccount                     rows    from         to           id prefixes')
for (const [acc, a] of Object.entries(byAcc).sort((x, y) => y[1].n - x[1].n)) {
  console.log(`${String(acc).slice(0, 26).padEnd(26)} ${String(a.n).padStart(6)}  ${a.min}   ${a.max}   ${[...a.prefixes].slice(0, 4).join(',')}`)
}

// a sample doc so I can match the exact schema when importing
const sample = all.sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]
console.log('\nnewest doc:\n', JSON.stringify(sample, null, 1).slice(0, 1200))
process.exit(0)
