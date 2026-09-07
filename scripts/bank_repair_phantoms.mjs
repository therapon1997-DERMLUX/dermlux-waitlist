// Definitive repair of the 7 phantom bank docs.
// 5 pointed at a REAL cash-account transaction but under a malformed id (space instead of the
// boc_tam_ + underscore convention) -> the match is re-attached to the real doc.
// 1 was genuinely mis-matched (Limassol District €33.61 tied to a JUMBO €33.64 row) -> re-pointed
// at the correct SEPA direct debit.
// 1 was an empty shell with no reference at all -> deleted.
// Nothing is lost: every phantom is backed up first, no expense loses its link.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

// phantom id -> real bank doc id (null = pure garbage, just delete)
const MAP = {
  'boc_2024121201 249376': 'boc_tam_2024121201_249376',
  'boc_2025012001 248863': 'boc_tam_2025012001_248863',
  'boc_2025022401 284457': 'boc_tam_2025022401_284457',
  'boc_2025091801 209798': 'boc_tam_2025091801_209798',
  'boc_2025102001 245711': 'boc_tam_2025102001_245711',
  'boc_2026020301 283783': 'boc_12410040105EQNO43045', // corrected: the real Limassol Wb Bill DD
  'boc_': null,
}

const bankSnap = await db.collection('bank_transactions').get()
const bank = new Map(bankSnap.docs.map(d => [d.id, d.data()]))
const phantoms = []
for (const pid of Object.keys(MAP)) {
  const d = bank.get(pid)
  if (d) phantoms.push({ _id: pid, ...d })
}
writeFileSync('C:/Users/User/backups/phantom_repair_backup_2026-09-01.json',
  JSON.stringify({ phantoms, map: MAP }, null, 1), 'utf8')
console.log('backup →  C:/Users/User/backups/phantom_repair_backup_2026-09-01.json')

// a known-good expense, to copy the exact bankTag field convention
const goodSnap = await db.collection('expenses').where('bankTagBank', '==', 'Bank of Cyprus').limit(1).get()
if (!goodSnap.empty) {
  const g = goodSnap.docs[0].data()
  console.log('reference convention:', JSON.stringify({
    bankTagBank: g.bankTagBank, bankTagDate: g.bankTagDate, bankTagDesc: String(g.bankTagDesc).slice(0, 40),
    bankTagAmount: g.bankTagAmount, bankTagRef: g.bankTagRef }))
}

const plan = []
for (const p of phantoms) {
  const target = MAP[p._id]
  const expIds = p.matchedExpenseIds ? JSON.parse(p.matchedExpenseIds) : (p.matchedExpenseId ? [p.matchedExpenseId] : [])
  if (!target) { plan.push({ deletePhantom: p._id, note: 'empty shell, no reference — nothing to relink' }); continue }
  const real = bank.get(target)
  if (!real) { console.log('!! target missing:', target); continue }
  plan.push({ deletePhantom: p._id, relinkTo: target, expenses: expIds,
    realDate: real.date, realDesc: String(real.description).slice(0, 60), realDebit: real.debit, realRef: real.ref,
    alreadyMatched: real.matchedExpenseId ?? null })
}
console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'} — plan:`)
for (const s of plan) console.log('  ', JSON.stringify(s))

if (EXECUTE) {
  const batch = db.batch()
  for (const s of plan) {
    batch.delete(db.collection('bank_transactions').doc(s.deletePhantom))
    if (!s.relinkTo) continue
    const real = bank.get(s.relinkTo)
    // attach the match to the REAL bank row (never clobber an existing match)
    const prev = real.matchedExpenseIds ? JSON.parse(real.matchedExpenseIds) : (real.matchedExpenseId ? [real.matchedExpenseId] : [])
    const merged = [...new Set([...prev, ...s.expenses])]
    batch.update(db.collection('bank_transactions').doc(s.relinkTo), {
      matchedExpenseIds: JSON.stringify(merged), matchedExpenseId: merged[0] })
    // correct the expense's bank tag to the real movement
    for (const eid of s.expenses) {
      batch.update(db.collection('expenses').doc(eid), {
        bankTagBank: 'Bank of Cyprus',
        bankTagDate: real.date,
        bankTagDesc: real.description ?? '',
        bankTagAmount: real.debit ?? null,
        bankTagRef: real.ref ?? s.relinkTo.replace(/^boc(_tam)?_/, ''),
      })
    }
  }
  await batch.commit()
  console.log('\nDONE')
  const after = (await db.collection('bank_transactions').get()).docs.map(d => ({ _id: d.id, ...d.data() }))
  console.log('phantoms remaining:', after.filter(t => !t.date || !t.account || (t.debit == null && t.credit == null)).length)
  console.log('total bank_transactions:', after.length)
}
process.exit(0)
