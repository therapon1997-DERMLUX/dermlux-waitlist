// One-off: import Meta + Google ad invoices (Apr-Jun 2026) into the bookkeeping
// module — uploads PDFs to Firebase Storage (expenses/) and creates `expenses`
// docs with the exact same field shape as ExpenseModal.jsx.
// Reverse charge: EU suppliers (IE) → VAT 0%, net = total.
// Run: node scripts/import_ad_invoices.mjs [--execute]
import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

const EXECUTE = process.argv.includes('--execute')
const KEY = 'C:/Users/User/Downloads/serviceaccountkey.json'
const BASE = 'C:/Users/User/dermlux-assets/ad-invoices'

const sa = JSON.parse(readFileSync(KEY, 'utf8'))
initializeApp({ credential: cert(sa), storageBucket: `${sa.project_id}.firebasestorage.app` })
const db = getFirestore()

const ROWS = [
  // Meta — two ad accounts, monthly billing reports (totals read from the PDFs)
  { file: `${BASE}/zip1/2026-04-01--2026-05-01_Invoice_Summary.pdf`, vendor: 'Meta Platforms Ireland Limited', vatNumber: 'IE9692928F', invoiceNumber: 'META-1568104744255933-2026-04', date: '2026-04-30', total: 1972.67, notes: 'Meta Ads · Account 1568104744255933 · Billing report 01/04–01/05/2026 · Visa ····3068' },
  { file: `${BASE}/zip1/2026-05-01--2026-06-01_Invoice_Summary.pdf`, vendor: 'Meta Platforms Ireland Limited', vatNumber: 'IE9692928F', invoiceNumber: 'META-1568104744255933-2026-05', date: '2026-05-31', total: 6644.68, notes: 'Meta Ads · Account 1568104744255933 · Billing report 01/05–01/06/2026 · Visa ····3068' },
  { file: `${BASE}/zip1/2026-05-01--2026-06-01_Invoice_Summary (1).pdf`, vendor: 'Meta Platforms Ireland Limited', vatNumber: 'IE9692928F', invoiceNumber: 'META-1957438135163513-2026-05', date: '2026-05-31', total: 3464.00, notes: 'Meta Ads · Account 1957438135163513 · Billing report 01/05–01/06/2026 · Visa ····3068' },
  { file: `${BASE}/zip1/2026-06-01--2026-07-01_Invoice_Summary.pdf`, vendor: 'Meta Platforms Ireland Limited', vatNumber: 'IE9692928F', invoiceNumber: 'META-1568104744255933-2026-06', date: '2026-06-30', total: 7363.85, notes: 'Meta Ads · Account 1568104744255933 · Billing report 01/06–01/07/2026 · Visa ····3068' },
  { file: `${BASE}/zip1/2026-06-01--2026-07-01_Invoice_Summary (1).pdf`, vendor: 'Meta Platforms Ireland Limited', vatNumber: 'IE9692928F', invoiceNumber: 'META-1957438135163513-2026-06', date: '2026-06-30', total: 7296.00, notes: 'Meta Ads · Account 1957438135163513 · Billing report 01/06–01/07/2026 · Visa ····3068' },
  // Google — USD invoices; EUR equivalent as printed on the invoice
  { file: `${BASE}/zip2/Google april.pdf`, vendor: 'Google Ireland Limited', vatNumber: 'IE6388047V', invoiceNumber: '5569813596', date: '2026-04-30', total: 3457.00, notes: 'Google Ads 01–30/04/2026 · τιμολόγιο USD $4,046.77 · EUR ισοδύναμο βάσει τιμολογίου' },
  { file: `${BASE}/zip2/google may.pdf`, vendor: 'Google Ireland Limited', vatNumber: 'IE6388047V', invoiceNumber: '5591076124', date: '2026-05-31', total: 3079.56, notes: 'Google Ads 01–31/05/2026 · τιμολόγιο USD $3,585.84 · EUR ισοδύναμο βάσει τιμολογίου' },
  { file: `${BASE}/zip2/google june.pdf`, vendor: 'Google Ireland Limited', vatNumber: 'IE6388047V', invoiceNumber: '5618598972', date: '2026-06-30', total: 2356.79, notes: 'Google Ads 01–30/06/2026 · τιμολόγιο USD $2,688.15 · EUR ισοδύναμο βάσει τιμολογίου' },
]

const bucket = getStorage().bucket()

for (const r of ROWS) {
  // duplicate guard by invoiceNumber
  const dup = await db.collection('expenses').where('invoiceNumber', '==', r.invoiceNumber).limit(1).get()
  if (!dup.empty) { console.log(`SKIP (exists): ${r.invoiceNumber}`); continue }

  const fileName = r.file.split('/').pop()
  const dest = `expenses/${Date.parse(r.date)}_${fileName.replace(/[^\w.\-()]+/g, '_')}`

  if (!EXECUTE) {
    console.log(`DRY RUN: ${r.vendor} · ${r.invoiceNumber} · €${r.total.toFixed(2)} · ${r.date} → ${dest}`)
    continue
  }

  await bucket.upload(r.file, { destination: dest, metadata: { contentType: 'application/pdf' } })
  const [fileUrl] = await bucket.file(dest).getSignedUrl({ action: 'read', expires: '2036-01-01' })

  await db.collection('expenses').add({
    vendor: r.vendor,
    vatNumber: r.vatNumber,
    invoiceNumber: r.invoiceNumber,
    date: r.date,
    net: r.total, // reverse charge (EU supplier): VAT 0%, net = total
    vat: 0,
    vatRate: 0,
    total: r.total,
    currency: 'EUR',
    category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ',
    location: 'Γενικά',
    paymentMethod: 'Κάρτα',
    notes: r.notes + ' · Αντίστροφη χρέωση (reverse charge)',
    fileUrl,
    fileName,
    status: 'confirmed',
    source: 'bulk-import',
    createdAt: FieldValue.serverTimestamp(),
    createdBy: 'Claude bulk import 10/07/2026',
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`ADDED: ${r.invoiceNumber} · €${r.total.toFixed(2)}`)
}
console.log(EXECUTE ? 'DONE' : 'Dry run complete — rerun with --execute')
process.exit(0)
