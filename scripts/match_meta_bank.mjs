// Match booked Meta ad expenses to the card charges on the bank statements.
//
// Why the generic matcher found nothing: the bank description is
//   "IE FACEBK <ref> PURCHASE Card 4***<n> <date> <amount> EUR Auth<n> Trace<n>"
// It says FACEBK, never "Meta"/"Platforms"/"Ireland", so the vendor-keyword strategy
// never fired. 833 Facebook debits existed with 0 matched.
//
// Why exact-one-candidate also fails: Meta charges the card on a spend threshold, so the
// same amount repeats many times in a month (52 amounts repeat; e.g. €442 x 14 in August).
// So this matcher pairs on amount AND a tight date window, consuming each bank row once,
// oldest first — the card settles the same day or 1-4 days later, never before.
//
// Precision over recall: a pair is only made when exactly ONE unclaimed bank row of that
// exact amount sits in the window. Ambiguous ones are reported, never guessed.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const WINDOW_DAYS = 4

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ id: d.id, ...d.data() }))

const desc = (t) => [t.description, t.details, t.narrative, t.text, t.merchant].filter(Boolean).join(' ')
const FACEBK = /facebk|facebook|meta\s*plat/i

const metaExp = exps
  .filter(e => e.source === 'meta_billing_import_2026_09' && !e.bankTagBank && Number(e.total) > 0)
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))
const fbBank = bank
  .filter(t => Number(t.debit) > 0 && FACEBK.test(desc(t)) && !t.matchedExpenseId)
  .sort((a, b) => String(a.date).localeCompare(String(b.date)))

console.log(`Meta expenses to match : ${metaExp.length}  €${metaExp.reduce((s, e) => s + Number(e.total), 0).toFixed(2)}`)
console.log(`unclaimed FACEBK debits: ${fbBank.length}  €${fbBank.reduce((s, t) => s + t.debit, 0).toFixed(2)}`)

const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const cents = (v) => Math.round(Number(v) * 100)

const used = new Set()
const pairs = [], ambiguous = [], nohit = []

// The bank description carries the REAL purchase date, not just the posting date:
//   "IE 7311 FACEBK <ref> PURCHASE Card 4***3068 2026-04-18"
// That date equals Meta's transaction date exactly, so it is a far tighter key than a
// posting-date window — it collapses most of the same-amount ambiguity by itself.
const purchaseDate = (t) => {
  const m = desc(t).match(/PURCHASE\s+Card\s+\S+\s+(\d{4}-\d{2}-\d{2})/i)
    || desc(t).match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

for (const e of metaExp) {
  const from = String(e.date).slice(0, 10)
  const to = addDays(from, WINDOW_DAYS)
  // Pass 1 — exact amount AND the purchase date printed in the description.
  let cand = fbBank.filter(t => !used.has(t.id)
    && cents(t.debit) === cents(e.total)
    && purchaseDate(t) === from)
  // Pass 2 — fall back to the posting-date window only if pass 1 found nothing at all.
  if (cand.length === 0) {
    cand = fbBank.filter(t => !used.has(t.id)
      && cents(t.debit) === cents(e.total)
      && String(t.date) >= from && String(t.date) <= to)
  }
  if (cand.length === 1) {
    used.add(cand[0].id)
    pairs.push({ expId: e.id, inv: e.invoiceNumber, expDate: from, amount: Number(e.total),
                 txId: cand[0].id, txDate: cand[0].date, txDesc: desc(cand[0]).slice(0, 60) })
  } else if (cand.length > 1) {
    ambiguous.push({ inv: e.invoiceNumber, expDate: from, amount: Number(e.total), candidates: cand.length })
  } else {
    nohit.push({ inv: e.invoiceNumber, expDate: from, amount: Number(e.total) })
  }
}

console.log(`\nmatched      : ${pairs.length}  €${pairs.reduce((s, p) => s + p.amount, 0).toFixed(2)}`)
console.log(`ambiguous    : ${ambiguous.length}  (more than one bank row of that amount in the window)`)
console.log(`no bank row  : ${nohit.length}`)

const byMonth = {}
for (const p of pairs) {
  const m = p.expDate.slice(0, 7)
  byMonth[m] = byMonth[m] || { n: 0, sum: 0 }
  byMonth[m].n++; byMonth[m].sum = +(byMonth[m].sum + p.amount).toFixed(2)
}
console.log('\nmatched per month:')
for (const m of Object.keys(byMonth).sort()) console.log(`   ${m}  ${String(byMonth[m].n).padStart(3)} tx  €${byMonth[m].sum.toFixed(2)}`)

console.log('\nfirst 8 pairs:')
for (const p of pairs.slice(0, 8)) {
  console.log(`   ${p.expDate} €${p.amount.toFixed(2).padStart(8)}  ${p.inv}  ->  ${p.txDate}  ${p.txDesc}`)
}
if (ambiguous.length) {
  console.log('\nambiguous (left alone):')
  for (const a of ambiguous.slice(0, 10)) console.log(`   ${a.expDate} €${a.amount.toFixed(2)}  ${a.inv}  (${a.candidates} candidates)`)
}
if (nohit.length) {
  console.log('\nno bank row found (left alone):')
  for (const a of nohit.slice(0, 10)) console.log(`   ${a.expDate} €${a.amount.toFixed(2)}  ${a.inv}`)
}

writeFileSync('C:/Users/User/backups/meta_bank_match_2026-09-01.json',
  JSON.stringify({ pairs, ambiguous, nohit }, null, 1), 'utf8')
console.log('\nplan -> C:/Users/User/backups/meta_bank_match_2026-09-01.json')

if (EXECUTE) {
  let n = 0
  for (let i = 0; i < pairs.length; i += 200) {
    const b = db.batch()
    for (const p of pairs.slice(i, i + 200)) {
      b.update(db.collection('bank_transactions').doc(p.txId),
        { matchedExpenseId: p.expId, matchMethod: 'meta_facebk_amount_date' })
      b.update(db.collection('expenses').doc(p.expId),
        { bankTagBank: 'card', bankTagTxId: p.txId, bankTagMethod: 'meta_facebk_amount_date' })
      n++
    }
    await b.commit()
  }
  console.log(`DONE — tagged ${n} pairs`)
}
process.exit(0)
