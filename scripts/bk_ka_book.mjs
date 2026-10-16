// Κοινωνικές Ασφαλίσεις → Λογιστικά (εντολή Θεράπωνα 16/10/2026: «τα pdf με όλες τις κοινωνικές να μπουν στο λογιστικό
// μας αρχείο και να συνδεθούν με το bank transfer»). Πλάνο από scripts/bk_ka_build.py (book_plan.json).
// Χρήση: node scripts/bk_ka_book.mjs --plan=C:/Users/User/bookkeeping-ka/book_plan.json [--execute]
//  · book: ένα expenses ανά πληρωμή Κ.Α. (docType payment_receipt, PDF = Βεβαίωση + Κατάσταση), δεμένο με την κίνηση
//  · tx_only: κίνηση λογαριασμού ΙΕΠΕ (άλλη εταιρεία) → μόνο supportingDoc
//  · link_existing: κίνηση ↔ υπάρχον παραστατικό Κ.Α. (ka_* από προηγούμενο τρέξιμο, πριν έρθει η κίνηση)
// Ελέγχει απευθείας στη βάση (όχι στο αντίγραφο) ότι τίποτα δεν υπάρχει/δεν έχει δεθεί στο μεταξύ. Dry run εκτός --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'
const run = promisify(execFile)
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))) })
const db = admin.firestore(); const EXECUTE = process.argv.includes('--execute')
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=').slice(1).join('=')
const PLAN = JSON.parse(readFileSync(arg('plan', 'C:/Users/User/bookkeeping-ka/book_plan.json'), 'utf8'))
const WORKER = 'C:/Users/User/dermlux-waitlist/worker', BASE = 'https://empty-hall-968f.therapon1997.workers.dev/invoices/'
const now = new Date().toISOString(), SRC = 'claude_ka_archive_' + now.slice(0, 10)

const B = PLAN.book
const txIds = [...B.filter(b => b.tx).map(b => b.tx), ...PLAN.tx_only.map(t => t.tx), ...PLAN.link_existing.map(l => l.tx)]
const getAll = async (col, ids) => { const out = []; for (let i = 0; i < ids.length; i += 100) out.push(...await db.getAll(...ids.slice(i, i + 100).map(id => db.collection(col).doc(id)))); return out }
const exSnaps = await getAll('expenses', [...B.map(b => b.id), ...PLAN.link_existing.map(l => l.expense)])
const txSnaps = await getAll('bank_transactions', txIds)
const exists = exSnaps.slice(0, B.length).filter(s => s.exists).map(s => s.id)
const missingTx = txSnaps.filter(s => !s.exists).map(s => s.id)
const txNow = Object.fromEntries(txSnaps.filter(s => s.exists).map(s => [s.id, s.data()]))
const alreadyLinked = txIds.filter(id => PLAN.tx_only.every(t => t.tx !== id) && (txNow[id]?.matchedExpenseId || txNow[id]?.matchedExpenseIds))
const linkEx = exSnaps.slice(B.length)
console.log('καταχωρήσεις', B.length, '· με κίνηση', B.filter(b => b.tx).length, '· tx_only', PLAN.tx_only.length, '· link_existing', PLAN.link_existing.length)
console.log('σύνολο €', Math.round(B.reduce((s, b) => s + b.amount, 0) * 100) / 100)
console.log('ήδη υπάρχουν:', exists, '· κινήσεις που λείπουν:', missingTx, '· κινήσεις ήδη δεμένες:', alreadyLinked, '· υπάρχον Expensify:', linkEx.map(s => s.exists))
for (const b of B) readFileSync(b.file)
if (exists.length || missingTx.length || alreadyLinked.length || linkEx.some(s => !s.exists)) { console.log('⛔ σταματώ — κάτι άλλαξε στη βάση'); process.exit(1) }
console.table(PLAN.link_existing.map(l => ({ tx: l.tx, expense: l.expense, date: l.date, amount: l.amount })))
if (!B.length && !PLAN.link_existing.length && !PLAN.tx_only.length) { console.log('τίποτα να γίνει'); process.exit(0) }
if (!EXECUTE) { console.log('DRY RUN — τίποτα δεν γράφτηκε'); process.exit(0) }

// 1) PDF στο R2 (4 παράλληλα)
let done = 0
const queue = [...B]
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const b = queue.shift()
    await run('npx', ['wrangler', 'r2', 'object', 'put', `dermlux-invoices/${b.key}`, '--file', `"${b.file}"`, '--content-type', 'application/pdf', '--remote'], { cwd: WORKER, shell: true })
    if (++done % 20 === 0) console.log('R2', done, '/', B.length)
  }
}))
console.log('R2 ✅', done)

// 2) backup κινήσεων πριν την αλλαγή
writeFileSync('C:/Users/User/backups/bk_ka_book_' + Date.now() + '.json', JSON.stringify({
  tx_before: Object.fromEntries(txIds.map(id => [id, { matchedExpenseId: txNow[id]?.matchedExpenseId ?? null, matchedExpenseIds: txNow[id]?.matchedExpenseIds ?? null, matchMethod: txNow[id]?.matchMethod ?? null, supportingDoc: txNow[id]?.supportingDoc ?? null, supportingDocFile: txNow[id]?.supportingDocFile ?? null, intercompany: txNow[id]?.intercompany ?? null }])),
  link_existing_before: Object.fromEntries(linkEx.map(s => [s.id, Object.fromEntries(['bankTagBank', 'bankTagDate', 'bankTagDesc', 'bankTagAmount', 'bankTagRef'].map(k => [k, s.data()[k] ?? null]))])),
  created: B.map(b => b.id),
}, null, 1))

// 3) εγγραφές
const b1 = db.batch()
if (B.length) for (const b of B) b1.create(db.collection('expenses').doc(b.id), { ...b.data, status: 'confirmed', source: SRC, createdAt: now, createdBy: 'claude-bookkeeping', fileName: b.fileName, fileUrl: BASE + encodeURIComponent(b.key) })
if (B.length) await b1.commit()
const b2 = db.batch()
for (const b of B.filter(b => b.tx)) {
  const t = txNow[b.tx]
  b2.update(db.collection('bank_transactions').doc(b.tx), {
    matchedExpenseIds: JSON.stringify([b.id]), matchedExpenseId: b.id,
    matchMethod: `bk_KA · ${b.data.kaCompany} ${b.data.kaAme} · μήνας ${b.data.kaMonth} · αρ. ${b.data.kaPaymentNumber}`,
    // δικαιολογητικό: κρατάμε το υπάρχον, εκτός αν έγραφε λάθος «ΑΛΛΗΣ ΕΤΑΙΡΕΙΑΣ» για πληρωμή από τον λογαριασμό της ίδιας της εταιρείας
    ...(!t.supportingDoc || (b.own && /ΑΛΛΗΣ ΕΤΑΙΡΕΙΑΣ/.test(t.supportingDoc)) ? { supportingDoc: b.txSupportingDoc, supportingDocFile: b.txSupportingDocFile } : {}),
    ...(b.data.intercompany ? { intercompany: b.data.intercompany } : t.intercompany ? { intercompany: admin.firestore.FieldValue.delete() } : {}),
  })
}
for (const t of PLAN.tx_only) b2.update(db.collection('bank_transactions').doc(t.tx), { supportingDoc: t.supportingDoc, supportingDocFile: t.supportingDocFile, matchMethod: 'bk_KA · λογαριασμός χωρίς βιβλία — μόνο δικαιολογητικό' })
for (const l of PLAN.link_existing) {
  b2.update(db.collection('bank_transactions').doc(l.tx), { matchedExpenseIds: JSON.stringify([l.expense]), matchedExpenseId: l.expense, matchMethod: l.matchMethod || 'bk_KA', ...(l.supportingDoc ? { supportingDoc: l.supportingDoc, supportingDocFile: l.supportingDocFile } : {}) })
  b2.update(db.collection('expenses').doc(l.expense), { bankTagBank: l.bank, bankTagDate: l.date, bankTagDesc: l.desc, bankTagAmount: l.amount, bankTagRef: l.ref })
}
await b2.commit()
console.log('✅ καταχωρήθηκαν', B.length, '· δέθηκαν', B.filter(b => b.tx).length + PLAN.link_existing.length, '· μόνο δικαιολογητικό', PLAN.tx_only.length)
process.exit(0)
