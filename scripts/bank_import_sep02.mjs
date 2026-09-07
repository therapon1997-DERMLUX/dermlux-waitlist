// Import (02/09/2026): Eurobank August 2026 + IEPE (357046275557) 07/07–02/09/2026.
// Safety gates: overlap rows must already exist & match; Eurobank opening must equal stored closing.
// Never overwrites: batch.create. Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const P = 'scripts/bank_parsers/'
const eb = JSON.parse(readFileSync(P + 'eb_589-01-H59895-01_08_2026.json', 'utf8'))
const iepe = JSON.parse(readFileSync(P + 'iepe_2026-07-06_to_09-02.json', 'utf8'))

const snap = await db.collection('bank_transactions').get()
const all = snap.docs.map(d => ({ _id: d.id, ...d.data() }))
const ids = new Set(all.map(t => t._id))
const problems = []

// ── Eurobank ──
const ebOld = all.filter(t => t.account === '589-01-H59895-01').sort((a, b) => (a.date + a._id).localeCompare(b.date + b._id))
const lastEb = ebOld[ebOld.length - 1]
if (Math.abs((lastEb.balance ?? 0) - eb.opening) > 0.005) problems.push(`Eurobank opening ${eb.opening} ≠ stored closing ${lastEb.balance} (${lastEb._id})`)
let seq = Math.max(...ebOld.map(t => +(t._id.match(/_(\d+)$/)?.[1] || 0)))
const ebFlow = d => /ATM ERB|ATM HLB/.test(d) ? 'cash_deposit' : /DERMLUX LASER/.test(d) ? 'internal' : null
const ebNew = eb.txs.filter(t => t.date > lastEb.date).map(t => {
  seq += 1
  return { _id: `tx_Eur_${t.date}_${seq}`, bank: 'Eurobank', account: '589-01-H59895-01', date: t.date, description: t.description, type: 'statement',
    debit: t.debit, credit: t.credit, balance: t.balance, ref: '', tag: null, flow: ebFlow(t.description), value_date: t.value_date || null }
})

// ── IEPE ──
const iepeOld = all.filter(t => t.account === '357046275557')
const lastDate = iepeOld.map(t => t.date).sort().pop()
const overlap = iepe.filter(r => r.date <= lastDate)
for (const r of overlap) {
  const ex = all.find(t => t._id === 'iepe_' + r.ref)
  if (!ex) problems.push(`IEPE overlap row missing in DB: ${r.date} ${r.ref} ${r.description.slice(0, 40)}`)
  else if ((ex.debit ?? null) !== r.debit || (ex.credit ?? null) !== r.credit || Math.abs((ex.balance ?? 0) - r.balance) > 0.005) problems.push(`IEPE overlap mismatch ${r.ref}: db ${ex.debit}/${ex.credit}/${ex.balance} vs xlsx ${r.debit}/${r.credit}/${r.balance}`)
}
const iepeFlow = r => /ATM Cash Deposit/.test(r.description) ? 'cash_deposit'
  : /Paybypago/.test(r.description) ? 'cards'
  : /TIPS INWARD .* by Therapon/i.test(r.description) ? 'other_in' : null
const iepeTag = r => r.type === 'BOC Transfer' && /(Therapon|Christos|Andriana|Karapatakis|Georgiou|Constantinou)/i.test(r.description) && r.debit ? 'Μισθοί' : null
const iepeNew = iepe.filter(r => r.date > lastDate && !ids.has('iepe_' + r.ref)).map(r => ({ _id: 'iepe_' + r.ref, ...r, flow: iepeFlow(r), tag: iepeTag(r) }))
const dupInNew = iepe.filter(r => r.date > lastDate && ids.has('iepe_' + r.ref))
if (dupInNew.length) problems.push(`IEPE rows after ${lastDate} already in DB: ${dupInNew.length}`)

console.log(`Eurobank: stored to ${lastEb.date} (close €${lastEb.balance}); statement opening €${eb.opening}; NEW ${ebNew.length} rows → close €${eb.txs.at(-1).balance}`)
console.log(`IEPE: stored to ${lastDate}; overlap checked ${overlap.length} rows; NEW ${iepeNew.length} rows (${iepeNew.at(-1)?.date} → ${iepeNew[0]?.date})`)
console.log('problems:', problems.length ? problems : 'none')
for (const t of [...ebNew, ...iepeNew]) console.log(' +', t._id.padEnd(30), t.date, String(t.debit ?? '').padStart(8), String(t.credit ?? '').padStart(8), (t.flow || '').padEnd(12), (t.tag || '').padEnd(6), t.description.slice(0, 50))
writeFileSync('backups/bank_import_preview_2026-09-02.json', JSON.stringify({ ebNew, iepeNew, problems }, null, 1))
if (problems.length) { console.log('ABORT: fix problems first'); process.exit(1) }
if (!EXECUTE) { console.log('\nDRY RUN — rerun with --execute'); process.exit(0) }
const batch = db.batch()
for (const t of [...ebNew, ...iepeNew]) { const { _id, ...data } = t; batch.create(db.collection('bank_transactions').doc(_id), data) }
await batch.commit()
console.log(`WROTE ${ebNew.length + iepeNew.length} rows`)
process.exit(0)
