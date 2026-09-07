// The old matcher wrote match fields onto bank_transaction ids that never existed, creating
// documents with ONLY matchedExpenseId — no date, no account, no amount. Result: the expenses
// pointing at them look settled while no real bank movement backs them.
// This backs them up, deletes the phantom bank docs and releases the affected expenses back into
// the unmatched pool so the proper matcher can re-link them. Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

const bank = (await db.collection('bank_transactions').get()).docs.map(d => ({ _id: d.id, ...d.data() }))
const phantoms = bank.filter(t => !t.date || !t.account || (t.debit == null && t.credit == null))
console.log('phantom bank docs:', phantoms.length)
for (const p of phantoms) console.log('   ', JSON.stringify(p))

// which expenses claim to be matched to them?
const ids = new Set()
for (const p of phantoms) {
  if (p.matchedExpenseId) ids.add(p.matchedExpenseId)
  if (p.matchedExpenseIds) { try { JSON.parse(p.matchedExpenseIds).forEach(x => ids.add(x)) } catch {} }
}
console.log('\nexpense ids referenced by phantoms:', [...ids].join(', ') || '(none)')

const affected = []
for (const id of ids) {
  const s = await db.collection('expenses').doc(id).get()
  if (!s.exists) { console.log('   !! expense not found:', id); continue }
  const e = { id, ...s.data() }
  affected.push(e)
  console.log(`   ${id}  ${String(e.vendor).slice(0, 28).padEnd(28)} €${e.total}  ${e.date}  bankTagBank=${e.bankTagBank ?? '—'} bankTagRef=${e.bankTagRef ?? '—'}`)
}

writeFileSync('C:/Users/User/backups/phantom_bank_docs_2026-09-01.json',
  JSON.stringify({ phantoms, affected }, null, 1), 'utf8')
console.log('\nbackup → C:/Users/User/backups/phantom_bank_docs_2026-09-01.json')

const TAGS = ['bankTagBank', 'bankTagDate', 'bankTagDesc', 'bankTagAmount', 'bankTagRef']
console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'}: delete ${phantoms.length} phantom bank docs; clear bank tags on ${affected.length} expenses`)
if (EXECUTE) {
  const b = db.batch()
  for (const p of phantoms) b.delete(db.collection('bank_transactions').doc(p._id))
  for (const e of affected) {
    const patch = {}
    for (const t of TAGS) if (e[t] !== undefined) patch[t] = admin.firestore.FieldValue.delete()
    patch.notes = ((e.notes || '') + ' ⚠️ Το προηγούμενο τραπεζικό match ήταν άκυρο (η κίνηση δεν υπήρχε) — αφαιρέθηκε 01/09/2026 για επανα-ταίριασμα.').trim()
    b.update(db.collection('expenses').doc(e.id), patch)
  }
  await b.commit()
  console.log('DONE')
  const after = (await db.collection('bank_transactions').get()).docs.map(d => ({ _id: d.id, ...d.data() }))
  console.log('phantoms remaining:', after.filter(t => !t.date || !t.account || (t.debit == null && t.credit == null)).length)
}
process.exit(0)
