// Import Eurobank July-2026 + Revolut Jun–Aug 2026.
// Eurobank: ids continue the existing tx_Eur_<date>_<seq> convention.
// Revolut : ids derive from the Revolut transaction UUID (stable → re-running can never duplicate);
//           rows already stored under the old boc_rev26_NNN ids are detected BY CONTENT and skipped.
// Never overwrites: uses batch.create. Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'

const eb = JSON.parse(readFileSync(S + 'eb_589-01-H59895-01_07_2026.json', 'utf8'))
const rev = JSON.parse(readFileSync(S + 'revolut_parsed.json', 'utf8'))

const snap = await db.collection('bank_transactions').get()
const all = snap.docs.map(d => ({ _id: d.id, ...d.data() }))
const existingIds = new Set(all.map(t => t._id))

// ---------- Eurobank ----------
const ebStored = all.filter(t => t.account === '589-01-H59895-01')
let maxSeq = 0
for (const t of ebStored) { const m = /^tx_Eur_\d{4}-\d{2}-\d{2}_(\d+)$/.exec(t._id); if (m) maxSeq = Math.max(maxSeq, +m[1]) }
const ebLast = ebStored.sort((a, b) => String(a.date).localeCompare(String(b.date))).at(-1)
console.log(`Eurobank stored: ${ebStored.length} rows, last ${ebLast.date} balance €${ebLast.balance}, max seq ${maxSeq}`)
console.log(`Eurobank July parse: opening €${eb.opening}  ${eb.txs.length} rows  →  chain start matches stored close: ${Math.abs(eb.opening - ebLast.balance) < 0.005 ? 'YES ✓' : 'NO ✗'}`)
const ebKey = (t) => `${t.date}|${(t.debit ?? 0).toFixed(2)}|${(t.credit ?? 0).toFixed(2)}|${(t.description || '').slice(0, 24).toLowerCase()}`
const ebStoredKeys = new Set(ebStored.map(ebKey))
let seq = maxSeq
const ebWrites = []
for (const t of eb.txs) {
  if (ebStoredKeys.has(ebKey(t))) { console.log('   skip (already stored):', t.date, t.description.slice(0, 40)); continue }
  seq++
  ebWrites.push({ id: `tx_Eur_${t.date}_${seq}`, doc: {
    bank: 'Eurobank', account: '589-01-H59895-01', date: t.date, description: t.description,
    type: '', debit: t.debit ?? null, credit: t.credit ?? null, balance: t.balance ?? null, ref: '', tag: null } })
}

// ---------- Revolut ----------
const revStored = all.filter(t => t.account === 'Main EUR')
const core = (d) => String(d || '').replace(/^(MOR|FEE|CAR|TRANSFER|CARD_PAYMENT|TOPUP)\s+/i, '').trim().toLowerCase()
const revKey = (date, debit, credit, desc) => `${date}|${(debit ?? 0).toFixed(2)}|${(credit ?? 0).toFixed(2)}|${core(desc)}`
const revStoredKeys = new Set(revStored.map(t => revKey(t.date, t.debit, t.credit, t.description)))
console.log(`\nRevolut stored: ${revStored.length} rows ${revStored.map(r => r.date).sort()[0]} → ${revStored.map(r => r.date).sort().at(-1)}`)
const revWrites = []
let revSkipped = 0
for (const t of rev) {
  if (revStoredKeys.has(revKey(t.date, t.debit, t.credit, t.desc_core))) { revSkipped++; continue }
  const id = 'rev_' + String(t.uuid).replace(/-/g, '')
  if (existingIds.has(id)) { revSkipped++; continue }
  revWrites.push({ id, doc: {
    bank: 'Revolut', account: 'Main EUR', date: t.date, description: t.description,
    type: t.type, doc_no: '', debit: t.debit ?? null, credit: t.credit ?? null,
    balance: t.balance ?? null, ref: String(t.uuid),
    flow: t.credit ? 'other_in' : null, tag: null } })
}
console.log(`Revolut: ${revWrites.length} new, ${revSkipped} already present`)

const writes = [...ebWrites, ...revWrites]
console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'} — total new rows: ${writes.length}  (Eurobank ${ebWrites.length}, Revolut ${revWrites.length})`)
const bad = writes.filter(w => !w.doc.date || !w.doc.account || (w.doc.debit == null && w.doc.credit == null))
console.log('rows refused (missing date/account/amount):', bad.length)
for (const w of writes.slice(0, 6)) console.log('   ', w.id, JSON.stringify(w.doc).slice(0, 150))
writeFileSync('C:/Users/User/backups/eb_rev_import_preview_2026-09-01.json', JSON.stringify(writes, null, 1), 'utf8')
console.log('preview → C:/Users/User/backups/eb_rev_import_preview_2026-09-01.json')

if (EXECUTE) {
  if (bad.length) { console.log('ABORT'); process.exit(1) }
  for (let i = 0; i < writes.length; i += 400) {
    const b = db.batch()
    for (const w of writes.slice(i, i + 400)) b.create(db.collection('bank_transactions').doc(w.id), w.doc)
    await b.commit()
  }
  console.log('DONE — wrote', writes.length)
}
process.exit(0)
