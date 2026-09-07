// Read-only: which Meta ad-account ids already appear in the books, and for which months/amounts?
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const rows = exps.filter(e => /META-\d{6,}/i.test(String(e.invoiceNumber || '')))
console.log(`expenses with a META-<acct>-<month> invoice number: ${rows.length}\n`)
const byAcct = {}
for (const r of rows.sort((a, b) => String(a.date).localeCompare(String(b.date)))) {
  const acct = (String(r.invoiceNumber).match(/META-(\d+)/) || [])[1]
  console.log(`  ${r.date}  ${String(r.invoiceNumber).padEnd(34)} €${Number(r.total || 0).toFixed(2).padStart(10)}  ${r.vendor}  [${r.id}]`)
  byAcct[acct] = byAcct[acct] || { n: 0, sum: 0, months: [] }
  byAcct[acct].n++
  byAcct[acct].sum = +(byAcct[acct].sum + Number(r.total || 0)).toFixed(2)
  byAcct[acct].months.push(String(r.invoiceNumber).slice(-7))
}
console.log('\nper ad account:')
for (const [a, v] of Object.entries(byAcct)) console.log(`  ${a}  ${v.n} docs  €${v.sum.toFixed(2)}  months ${v.months.join(', ')}`)
process.exit(0)
