// Read-only diagnosis: how do Meta ad charges actually appear on the bank statements,
// and can the booked per-transaction expenses be reconciled to them by month?
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))

const desc = (t) => [t.description, t.details, t.narrative, t.text, t.merchant]
  .filter(Boolean).join(' ')
const RX = /facebk|facebook|meta\s*plat|meta\s*ads|\bmeta\b|fb\.me|fbads/i

const hits = bank.filter(t => RX.test(desc(t)))
console.log(`bank rows whose description looks like Meta/Facebook: ${hits.length}`)
const forms = {}
for (const t of hits) {
  const d = desc(t).replace(/\d{4,}/g, '#').replace(/\s+/g, ' ').trim().slice(0, 70)
  forms[d] = (forms[d] || 0) + 1
}
console.log('\ndescription shapes seen:')
for (const [k, v] of Object.entries(forms).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`   ${String(v).padStart(4)}  ${k}`)
}

// per month: booked Meta expense total vs Meta-looking bank debits total
const bookedByMonth = {}, bankByMonth = {}
for (const e of exps) {
  if (e.source !== 'meta_billing_import_2026_09') continue
  const m = String(e.date).slice(0, 7)
  bookedByMonth[m] = +((bookedByMonth[m] || 0) + Number(e.total || 0)).toFixed(2)
}
for (const t of hits) {
  if (!(Number(t.debit) > 0)) continue
  const m = String(t.date || '').slice(0, 7)
  bankByMonth[m] = +((bankByMonth[m] || 0) + Number(t.debit)).toFixed(2)
}
const months = [...new Set([...Object.keys(bookedByMonth), ...Object.keys(bankByMonth)])].sort()
console.log('\nmonth      booked(Meta expenses)   bank(Meta-looking debits)      diff')
for (const m of months) {
  const b = bookedByMonth[m] || 0, k = bankByMonth[m] || 0
  console.log(`${m}   ${b.toFixed(2).padStart(14)}   ${k.toFixed(2).padStart(22)}   ${(k - b).toFixed(2).padStart(11)}`)
}

// how many of the Meta-looking debits are already tagged to something?
const tagged = hits.filter(t => t.matchedExpenseId)
console.log(`\nMeta-looking bank debits already matched to an expense: ${tagged.length} / ${hits.filter(t => Number(t.debit) > 0).length}`)

// distinct amounts, to show why one-to-one matching cannot disambiguate
const amounts = {}
for (const t of hits) if (Number(t.debit) > 0) amounts[t.debit] = (amounts[t.debit] || 0) + 1
const repeated = Object.entries(amounts).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1])
console.log(`\namounts that appear more than once on the bank side: ${repeated.length}`)
for (const [a, n] of repeated.slice(0, 10)) console.log(`   €${a} × ${n}`)
process.exit(0)
