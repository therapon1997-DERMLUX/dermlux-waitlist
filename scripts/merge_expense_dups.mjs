// One-off: merge EXACT duplicate expenses (same vendor + invoice number + total)
// per Therapon's 10/07/2026 rule — keep one record, best file primary, others as
// extraFiles, payment info from whichever upload has a real method.
// Ambiguous cases (same inv no but different totals) are only REPORTED, never touched.
// Run: node scripts/merge_expense_dups.mjs [--execute]
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const EXECUTE = process.argv.includes('--execute')
const sa = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
initializeApp({ credential: cert(sa) })
const db = getFirestore()

const normVendor = v => (v || '').toLowerCase().trim()
  .replace(/[.,]/g, '')
  .replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g, '')
  .replace(/\s+/g, ' ').trim()
const normInv = v => (v || '').trim().toUpperCase()
const isPdf = f => /\.pdf$/i.test(f?.fileName || '') || /\.pdf(\?|$)/i.test(f?.fileUrl || '')
const REAL_PAY = ['Μετρητά', 'Κάρτα', 'Τραπεζική', 'Κατάθεση']

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
console.log(`Σύνολο expenses: ${all.length}`)

const byInv = {}
for (const e of all) {
  const v = normVendor(e.vendor), inv = normInv(e.invoiceNumber)
  if (!v || !inv) continue
  const k = v + '|' + inv
  ;(byInv[k] ||= []).push(e)
}

const exact = [], ambiguous = []
for (const arr of Object.values(byInv)) {
  if (arr.length < 2) continue
  const totals = new Set(arr.map(e => e.total == null ? '∅' : Number(e.total).toFixed(2)))
  if (totals.size === 1 && !totals.has('∅')) exact.push(arr)
  else ambiguous.push(arr)
}
console.log(`Σίγουρα διπλά (ίδιο ποσό): ${exact.length} ομάδες · Αμφίβολα (άλλο ποσό): ${ambiguous.length} ομάδες`)

for (const g of ambiguous) {
  console.log(`  ⚠ ΑΜΦΙΒΟΛΟ: ${g[0].vendor} · inv ${g[0].invoiceNumber} → ποσά: ${g.map(e => e.total + ' (' + (e.source || '') + ' ' + (e.date || '') + ')').join(' vs ')}`)
}

if (exact.length && EXECUTE) {
  mkdirSync('backups', { recursive: true })
  writeFileSync(`backups/expense_dups_backup_${Date.now()}.json`, JSON.stringify(exact, null, 2))
}

for (const g of exact) {
  const sorted = [...g].sort((a, b) => (a.createdAt?.seconds ?? Infinity) - (b.createdAt?.seconds ?? Infinity))
  const keep = sorted.find(e => e.status === 'confirmed') || sorted[0]
  const rest = sorted.filter(e => e.id !== keep.id)
  console.log(`MERGE: ${keep.vendor} · inv ${keep.invoiceNumber} · €${keep.total} → κρατάω ${keep.id} (${keep.source || ''}), σβήνω ${rest.map(r => r.id + ' (' + (r.source || '') + ')').join(', ')}`)
  if (!EXECUTE) continue

  const upd = {}
  let primary = { fileUrl: keep.fileUrl || '', fileName: keep.fileName || '' }
  const extras = [...(keep.extraFiles || [])]
  for (const d of rest) {
    if (!d.fileUrl || d.fileUrl === primary.fileUrl) continue
    if (!primary.fileUrl || (isPdf(d) && !isPdf(primary))) {
      if (primary.fileUrl) extras.push(primary)
      primary = { fileUrl: d.fileUrl, fileName: d.fileName || '' }
    } else extras.push({ fileUrl: d.fileUrl, fileName: d.fileName || '' })
  }
  if (primary.fileUrl !== (keep.fileUrl || '')) { upd.fileUrl = primary.fileUrl; upd.fileName = primary.fileName }
  if (extras.length) upd.extraFiles = extras
  for (const f of ['vatNumber', 'date', 'net', 'vat', 'vatRate', 'category', 'location',
                   'bankTagBank', 'bankTagDate', 'bankTagDesc', 'bankTagAmount', 'bankTagRef',
                   'lineItems', 'pdfPage', 'bankPaymentNote']) {
    if (keep[f] == null || keep[f] === '') {
      const src = rest.find(d => d[f] != null && d[f] !== '')
      if (src) upd[f] = src[f]
    }
  }
  const keepItems = Array.isArray(keep.items) ? keep.items.length : 0
  const richer = rest.find(d => Array.isArray(d.items) && d.items.length > keepItems)
  if (richer) upd.items = richer.items
  if (!REAL_PAY.includes(keep.paymentMethod)) {
    const paid = rest.find(d => REAL_PAY.includes(d.paymentMethod))
    if (paid) {
      upd.paymentMethod = paid.paymentMethod
      if (paid.paymentSource) upd.paymentSource = paid.paymentSource
      if (paid.paymentDetail) upd.paymentDetail = paid.paymentDetail
    }
  }
  upd.notes = ((keep.notes || '') + ` · Auto-merge διπλού ${new Date().toISOString().slice(0, 10)} (script)`).trim()
  upd.updatedAt = FieldValue.serverTimestamp()
  await db.collection('expenses').doc(keep.id).update(upd)
  for (const d of rest) await db.collection('expenses').doc(d.id).delete()
}

// Remap: bank_transactions που έδειχναν σε διαγραμμένο διπλό → δείχνουν στο record που έμεινε
if (EXECUTE && exact.length) {
  const remap = {}   // deletedId -> keptId
  for (const g of exact) {
    const sorted = [...g].sort((a, b) => (a.createdAt?.seconds ?? Infinity) - (b.createdAt?.seconds ?? Infinity))
    const keep = sorted.find(e => e.status === 'confirmed') || sorted[0]
    for (const d of sorted) if (d.id !== keep.id) remap[d.id] = keep.id
  }
  const txSnap = await db.collection('bank_transactions').get()
  let fixed = 0
  for (const t of txSnap.docs) {
    const d = t.data()
    const u = {}
    if (d.matchedExpenseId && remap[d.matchedExpenseId]) u.matchedExpenseId = remap[d.matchedExpenseId]
    if (d.matchedExpenseIds) {
      try {
        const ids = JSON.parse(d.matchedExpenseIds)
        if (Array.isArray(ids) && ids.some(id => remap[id])) {
          u.matchedExpenseIds = JSON.stringify([...new Set(ids.map(id => remap[id] || id))])
        }
      } catch { /* not JSON */ }
    }
    if (Object.keys(u).length) { await t.ref.update(u); fixed++ }
  }
  console.log(`Bank txn remaps: ${fixed}`)
}
console.log(EXECUTE ? 'DONE' : 'Dry run — τρέξε ξανά με --execute για εφαρμογή')
process.exit(0)
