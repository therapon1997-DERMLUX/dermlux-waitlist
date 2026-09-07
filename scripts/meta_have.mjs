// Read-only: what Meta/Facebook spend is already in `expenses`?
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const meta = exps.filter(e => /meta|facebook|instagram|fb/i.test(
  [e.vendor, e.invoiceNumber, e.notes, e.source, e.id].join(' ')))

console.log(`expenses total: ${exps.length}   meta-ish: ${meta.length}\n`)
const byMonth = {}
for (const m of meta.sort((a, b) => String(a.date).localeCompare(String(b.date)))) {
  console.log(`  ${m.date}  ${String(m.invoiceNumber || '—').padEnd(26)} €${Number(m.total || 0).toFixed(2).padStart(10)}  ${m.vendor}  [${m.id}]`)
  const k = String(m.date || '').slice(0, 7)
  byMonth[k] = +((byMonth[k] || 0) + Number(m.total || 0)).toFixed(2)
}
console.log('\nper month:', JSON.stringify(byMonth, null, 1))
console.log('meta sum: €' + meta.reduce((a, b) => a + Number(b.total || 0), 0).toFixed(2))

// vendors present, so I can see the naming convention already in use
const vendors = {}
for (const e of exps) vendors[e.vendor || '—'] = (vendors[e.vendor || '—'] || 0) + 1
const top = Object.entries(vendors).sort((a, b) => b[1] - a[1]).slice(0, 25)
console.log('\ntop vendors:'); for (const [v, n] of top) console.log(`   ${String(n).padStart(4)}  ${v}`)
process.exit(0)
