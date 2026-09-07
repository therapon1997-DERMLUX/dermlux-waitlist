// READ-ONLY: how many expenses still have no bank tag, and how much bank movement is unclaimed.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const real = exps.filter(e => e.docType !== 'deposit_slip' && e.docType !== 'statement')
const unmatched = real.filter(e => !e.bankTagBank && Number(e.total) > 0)
const matched = real.filter(e => e.bankTagBank)

console.log(`expenses (excl. deposit slips & statements): ${real.length}`)
console.log(`   with a bank tag : ${matched.length}`)
console.log(`   WITHOUT         : ${unmatched.length}   €${unmatched.reduce((s, e) => s + Number(e.total || 0), 0).toFixed(2)}`)

const bySrc = {}
for (const e of unmatched) {
  const k = e.source || '(no source)'
  bySrc[k] ||= { n: 0, eur: 0 }
  bySrc[k].n++; bySrc[k].eur += Number(e.total || 0)
}
console.log('\nunmatched by source:')
for (const [k, v] of Object.entries(bySrc).sort((a, b) => b[1].n - a[1].n))
  console.log(`   ${k.padEnd(26)} ${String(v.n).padStart(4)}   €${v.eur.toFixed(2)}`)

const byMethod = {}
for (const e of unmatched) { const k = e.paymentMethod || '(none)'; byMethod[k] = (byMethod[k] || 0) + 1 }
console.log('\nunmatched by payment method:', JSON.stringify(byMethod))

// recent unmatched (the ones that matter now)
const recent = unmatched.filter(e => (e.date || '') >= '2026-07-01').sort((a, b) => String(a.date).localeCompare(String(b.date)))
console.log(`\nunmatched dated 2026-07-01 or later: ${recent.length}   €${recent.reduce((s, e) => s + Number(e.total || 0), 0).toFixed(2)}`)
for (const e of recent.slice(0, 25))
  console.log(`   ${e.date}  ${String(e.vendor).slice(0, 30).padEnd(30)} €${String(e.total).padStart(9)}  inv=${String(e.invoiceNumber || '—').slice(0, 18).padEnd(18)} pay=${e.paymentMethod || '—'}  src=${e.source || '—'}`)

// unclaimed bank debits in the same window
const debits = bank.filter(t => t.debit > 0 && (t.date || '') >= '2026-07-01' && !t.matchedExpenseId)
console.log(`\nbank DEBITS from 2026-07-01 with no expense attached: ${debits.length}   €${debits.reduce((s, t) => s + t.debit, 0).toFixed(2)}`)
process.exit(0)
