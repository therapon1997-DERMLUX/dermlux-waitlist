// Import ONLY bank rows that do not already exist. Never overwrites an existing doc
// (they may already carry tag / matchedExpenseId from earlier matching runs).
// Dry run by default; pass --execute to write.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

const SRC = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/boc_parsed.json'
const parsed = JSON.parse(readFileSync(SRC, 'utf8'))
const CASH = '357542264638'
const docId = (t) => (t.account === CASH ? 'boc_tam_' : 'boc_') + String(t.ref).replace(/\s+/g, '_')

const byId = new Map()
for (const f of Object.keys(parsed)) for (const t of parsed[f].txs) byId.set(docId(t), t)

const flowOf = (t) => {
  if (t.account !== CASH) return undefined
  const d = (t.description || '').toUpperCase()
  if (d.startsWith('CASH DEPOSIT')) return 'cash_deposit'
  if (d.includes('MANUAL CASH ADVANCE')) return 'internal'
  return undefined
}

const snap = await db.collection('bank_transactions').get()
const existing = new Set(snap.docs.map(d => d.id))

const toWrite = []
for (const [id, t] of byId) {
  if (existing.has(id)) continue
  const doc = {
    bank: 'Bank of Cyprus',
    account: t.account,
    date: t.date,
    description: t.description,
    type: t.type ?? null,
    doc_no: t.doc_no ?? null,
    debit: t.debit ?? null,
    credit: t.credit ?? null,
    // the cash statement carries no balance column — store null, not 0 (matches the existing rows)
    balance: t.account === CASH ? null : (t.balance ?? null),
    ref: String(t.ref).replace(/\s+/g, '_'),
    tag: null,
  }
  const fl = flowOf(t)
  if (fl) doc.flow = fl
  toWrite.push({ id, doc })
}

const byAcc = {}
for (const w of toWrite) (byAcc[w.doc.account] ||= []).push(w)
console.log(EXECUTE ? 'EXECUTE' : 'DRY RUN', '— new rows:', toWrite.length)
for (const [acc, list] of Object.entries(byAcc)) {
  const ds = list.map(x => x.doc.date).sort()
  const dr = list.reduce((s, x) => s + (x.doc.debit || 0), 0)
  const cr = list.reduce((s, x) => s + (x.doc.credit || 0), 0)
  console.log(`   ${acc}: ${list.length} rows  ${ds[0]} → ${ds[ds.length - 1]}  debits €${dr.toFixed(2)}  credits €${cr.toFixed(2)}`)
}
console.log('   sample:', JSON.stringify(toWrite[0]?.doc).slice(0, 240))
// guard: nothing without a date or ref may be written (that is how the 7 phantom docs were born)
const bad = toWrite.filter(w => !w.doc.date || !w.doc.ref || !w.doc.account)
console.log('   rows missing date/ref/account (refused):', bad.length)

writeFileSync('C:/Users/User/backups/boc_import_preview_2026-09-01.json', JSON.stringify(toWrite, null, 1), 'utf8')
console.log('   preview saved → C:/Users/User/backups/boc_import_preview_2026-09-01.json')

if (EXECUTE) {
  if (bad.length) { console.log('ABORT: rows missing key fields'); process.exit(1) }
  let n = 0
  for (let i = 0; i < toWrite.length; i += 400) {
    const batch = db.batch()
    for (const w of toWrite.slice(i, i + 400)) batch.create(db.collection('bank_transactions').doc(w.id), w.doc)
    await batch.commit(); n += Math.min(400, toWrite.length - i)
    console.log('   written', n)
  }
  console.log('DONE — wrote', n)
}
process.exit(0)
