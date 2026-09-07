// For each phantom, find the REAL bank transaction it was meant to point at.
// READ-ONLY.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ _id: d.id, ...d.data() }))
const real = bank.filter(t => t.date && t.account)
const phantoms = bank.filter(t => !t.date || !t.account || (t.debit == null && t.credit == null))

const CASES = [
  { pid: 'boc_2024121201 249376', exp: 'hist_card24q4_r161', vendor: 'JUMBO TRADING LTD', amount: 34.81, date: '2024-12-11' },
  { pid: 'boc_2025012001 248863', exp: 'hist_card25q1_r040', vendor: 'MARINOPOULOS', amount: 42.9, date: '2025-01-17' },
  { pid: 'boc_2025022401 284457', exp: 'hist_card25q1_r129', vendor: 'JUMBO TRADING LTD', amount: 13.16, date: '2025-02-21' },
  { pid: 'boc_2025091801 209798', exp: 'q3_25_r136', vendor: 'Mailchimp', amount: 17.16, date: '2025-09-16' },
  { pid: 'boc_2025102001 245711', exp: '93bb0abd-a454-475a-a530-a7d52ddd7b39', vendor: 'Mailchimp', amount: 17.33, date: '2025-10-16' },
  { pid: 'boc_2026020301 283783', exp: 'hist_card24sep_r023', vendor: 'Limassol District', amount: 33.61, date: '2024-10-09' },
]

for (const c of CASES) {
  const rawRef = c.pid.replace(/^boc_/, '')
  const under = rawRef.replace(/\s+/g, '_')
  const nospace = rawRef.replace(/\s+/g, '')
  console.log(`\n=== ${c.pid}`)
  console.log(`    expense ${c.exp}  ${c.vendor}  €${c.amount}  ${c.date}`)
  // (1) does a real doc exist under the underscore / no-space variant?
  for (const v of [under, nospace]) {
    const hit = real.find(t => t._id === 'boc_' + v || t.ref === v || t.ref === rawRef)
    if (hit) console.log(`    → id/ref variant "${v}" EXISTS:`, JSON.stringify(hit).slice(0, 170))
  }
  // (2) any real row whose ref contains both numeric groups?
  const parts = rawRef.split(/\s+/)
  const byRef = real.filter(t => parts.every(p => String(t.ref || '').includes(p)))
  console.log(`    rows whose ref contains all of [${parts.join(', ')}]: ${byRef.length}`)
  for (const t of byRef.slice(0, 3)) console.log('       ', JSON.stringify(t).slice(0, 170))
  // (3) fall back to amount match near the date
  const amt = real.filter(t => Math.abs((t.debit || 0) - c.amount) < 0.005)
  const near = amt.filter(t => Math.abs(new Date(t.date) - new Date(c.date)) < 12 * 864e5)
  console.log(`    rows with debit €${c.amount}: ${amt.length}   of which within 12 days of ${c.date}: ${near.length}`)
  for (const t of near.slice(0, 4)) console.log('       ', t._id, t.date, '€' + t.debit, String(t.description).slice(0, 70))
}
process.exit(0)
