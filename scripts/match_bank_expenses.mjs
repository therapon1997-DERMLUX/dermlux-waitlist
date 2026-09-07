// Match unmatched expenses to bank movements, same three strategies as bank_match.py:
//   A  invoice-number digit tokens found inside a transfer description   (highest confidence)
//   C  card purchase: exact amount + vendor keyword in the description
//   B  vendor keyword + exact single-amount hit on a transfer            (conservative variant)
// Precision over recall: cash / "Επί πιστώσει" expenses are never matched, a bank row is used once,
// and an expense is only tagged when exactly ONE candidate survives.
// Dry run unless --execute.  Optional --from=YYYY-MM-DD (default 2026-06-01).
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const FROM = (process.argv.find(a => a.startsWith('--from=')) || '--from=2026-06-01').split('=')[1]

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ id: d.id, ...d.data() }))

const NO_BANK = new Set(['Μετρητά', 'Επί πιστώσει'])
const pool = exps.filter(e => e.docType !== 'deposit_slip' && e.docType !== 'statement'
  && !e.bankTagBank && Number(e.total) > 0 && (e.date || '') >= FROM
  && !NO_BANK.has(e.paymentMethod))
const debits = bank.filter(t => t.debit > 0 && (t.date || '') >= FROM && !t.matchedExpenseId)
console.log(`window from ${FROM}`)
console.log(`candidate expenses (bank/card only, untagged): ${pool.length}  €${pool.reduce((s, e) => s + Number(e.total), 0).toFixed(2)}`)
console.log(`unclaimed bank debits: ${debits.length}  €${debits.reduce((s, t) => s + t.debit, 0).toFixed(2)}`)

const YEAR = /^(19|20)\d{2}$/
const toks = (s, min = 4) => {
  const out = new Set()
  for (const g of String(s || '').match(/\d{3,}/g) || []) {
    const g2 = g.replace(/^0+/, '') || g
    if (YEAR.test(g2) || g2.length < min) continue
    out.add(g2)
  }
  return out
}
const XFER = /Transfer-Internet-Debit|TIPS OUTWARD|OUTWARD CY|1Bank/i
const norm = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ ]/g, ' ').replace(/\s+/g, ' ').trim()
const vendorKeys = (v) => norm(v).split(' ').filter(w => w.length >= 4 &&
  !['LIMITED', 'LTD', 'CYPRUS', 'TRADING', 'SERVICES', 'COMPANY', 'PUBLIC'].includes(w))

const usedTx = new Set(), taggedExp = new Set()
const props = []

// ---------- A: invoice tokens inside transfer descriptions ----------
for (const t of debits) {
  if (!XFER.test(t.description || '')) continue
  const dt = toks(t.description, 4)
  if (!dt.size) continue
  const hits = pool.filter(e => !taggedExp.has(e.id) && [...toks(e.invoiceNumber, 4)].some(x => dt.has(x)))
  if (hits.length === 0) continue
  const sum = hits.reduce((s, e) => s + Number(e.total), 0)
  if (Math.abs(sum - t.debit) < 0.02) {
    props.push({ strat: 'A', tx: t, exps: hits, why: `inv tokens in transfer, sum €${sum.toFixed(2)} = debit` })
    usedTx.add(t.id); hits.forEach(e => taggedExp.add(e.id))
  } else if (hits.length === 1 && Math.abs(Number(hits[0].total) - t.debit) < 0.02) {
    props.push({ strat: 'A', tx: t, exps: hits, why: 'inv token + exact amount' })
    usedTx.add(t.id); taggedExp.add(hits[0].id)
  }
}
// ---------- C: card purchases, exact amount + vendor keyword ----------
for (const t of debits) {
  if (usedTx.has(t.id)) continue
  const d = norm(t.description)
  const cands = pool.filter(e => !taggedExp.has(e.id) && Math.abs(Number(e.total) - t.debit) < 0.005
    && vendorKeys(e.vendor).some(k => d.includes(k)))
  if (cands.length === 1) {
    props.push({ strat: 'C', tx: t, exps: cands, why: 'exact amount + vendor keyword' })
    usedTx.add(t.id); taggedExp.add(cands[0].id)
  }
}
// ---------- B: transfer, exact amount + vendor keyword ----------
for (const t of debits) {
  if (usedTx.has(t.id)) continue
  const d = norm(t.description)
  const cands = pool.filter(e => !taggedExp.has(e.id) && Math.abs(Number(e.total) - t.debit) < 0.005
    && vendorKeys(e.vendor).some(k => d.includes(k)))
  if (cands.length === 1) {
    props.push({ strat: 'B', tx: t, exps: cands, why: 'exact amount + vendor keyword (transfer)' })
    usedTx.add(t.id); taggedExp.add(cands[0].id)
  }
}

const n = props.reduce((s, p) => s + p.exps.length, 0)
console.log(`\nproposals: ${props.length} bank rows → ${n} expenses`)
for (const s of ['A', 'C', 'B']) {
  const g = props.filter(p => p.strat === s)
  console.log(`   ${s}: ${g.length} rows, ${g.reduce((x, p) => x + p.exps.length, 0)} expenses, €${g.reduce((x, p) => x + p.tx.debit, 0).toFixed(2)}`)
}
console.log('')
for (const p of props) {
  console.log(`[${p.strat}] ${p.tx.date} €${String(p.tx.debit).padStart(9)}  ${String(p.tx.description).slice(0, 52).padEnd(52)} | ${p.why}`)
  for (const e of p.exps) console.log(`        → ${e.date} ${String(e.vendor).slice(0, 30).padEnd(30)} €${String(e.total).padStart(9)}  inv=${e.invoiceNumber || '—'}`)
}
writeFileSync('C:/Users/User/backups/match_proposals_2026-09-01.json',
  JSON.stringify(props.map(p => ({ strat: p.strat, tx: p.tx.id, txDate: p.tx.date, txDebit: p.tx.debit, txDesc: p.tx.description, why: p.why, expenses: p.exps.map(e => ({ id: e.id, vendor: e.vendor, total: e.total, date: e.date, inv: e.invoiceNumber })) })), null, 1), 'utf8')
console.log('\nproposals → C:/Users/User/backups/match_proposals_2026-09-01.json')

if (EXECUTE) {
  let done = 0
  for (let i = 0; i < props.length; i += 150) {
    const b = db.batch()
    for (const p of props.slice(i, i + 150)) {
      const ids = p.exps.map(e => e.id)
      b.update(db.collection('bank_transactions').doc(p.tx.id), {
        matchedExpenseIds: JSON.stringify(ids), matchedExpenseId: ids[0] })
      for (const e of p.exps) b.update(db.collection('expenses').doc(e.id), {
        bankTagBank: p.tx.bank, bankTagDate: p.tx.date, bankTagDesc: p.tx.description ?? '',
        bankTagAmount: p.tx.debit, bankTagRef: p.tx.ref ?? p.tx.id })
      done += ids.length
    }
    await b.commit()
  }
  console.log('DONE — expenses tagged:', done)
}
process.exit(0)
