// Bring the Google Ads bookings in line with the invoices, one month at a time.
// NOTHING is deleted. Superseded records keep their row and image but are zeroed out and
// marked docType='superseded' with a note pointing at the authoritative record — the same
// pattern already used for ACD statements.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

// ── retire: zero the amounts, keep the record ────────────────────────────────
const RETIRE = [
  { id: 'q1_26_r079',        why: 'Διπλό Ιανουαρίου 2026. Κρατούσε ΛΑΘΟΣ αριθμό τιμολογίου (5540824632 = Μάρτιος). Αυθεντικό: google_inv_5487681494 €2.095,81.' },
  { id: 'q1_26_r142',        why: 'Διπλό Φεβρουαρίου 2026 (χωρίς αρ. τιμολογίου). Αυθεντικό: google_inv_5508938982 €1.944,00.' },
  { id: 'hist_card25q1_r270', why: 'Διπλό Φεβρουαρίου 2025 με τον ίδιο αρ. τιμολογίου 5198023468. Το τιμολόγιο είναι €2.987,55 — αυθεντικό: google_inv_5198023468.' },
  { id: 'hist_card25q1_r255', why: 'Διπλό Φεβρουαρίου 2025 με τον ίδιο αρ. τιμολογίου 5198023468. Το τιμολόγιο είναι €2.987,55 — αυθεντικό: google_inv_5198023468.' },
  { id: 'hist_card25q1_r269', why: 'Υπόλειμμα €0,31 Μαρτίου 2025: ήταν μόνο οι γραμμές προσαρμογής του τιμολογίου (€0,26+€0,05). Αυθεντικό: google_inv_5219960999 €3.216,61.' },
  { id: 'hist_card25q1_r233', why: 'Υπόλειμμα €0,74 Ιανουαρίου 2025. Αυθεντικό ποσό τιμολογίου 5172402275: €2.672,47.' },
]

// ── create: the invoice that is missing entirely ─────────────────────────────
const CREATE = [{
  docId: 'google_inv_5148048526',
  doc: {
    vendor: 'Google Ireland Limited', vatNumber: 'IE6388047V', invoiceNumber: '5148048526',
    date: '2024-12-31', net: 1232.77, vat: 0, vatRate: 0, total: 1232.77, currency: 'EUR',
    category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ', location: 'Γενικά', paymentMethod: 'Κάρτα', status: 'confirmed',
    source: 'google_billing_import_2026_09',
    lineItems: [{ description: 'Google Ads — 1 Dec 2024 - 31 Dec 2024', quantity: 1, amount: 1232.77 }],
    notes: 'Από το Google Ads Billing (λογ. 207-393-9384). Δεν υπήρχε ΚΑΘΟΛΟΥ στα βιβλία. '
      + 'ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (reverse charge, 0% ΦΠΑ) — απαιτεί αυτοεκκαθάριση ΦΠΑ.',
  },
}, {
  docId: 'google_inv_5198023468',
  doc: {
    vendor: 'Google Ireland Limited', vatNumber: 'IE6388047V', invoiceNumber: '5198023468',
    date: '2025-02-28', net: 2987.55, vat: 0, vatRate: 0, total: 2987.55, currency: 'EUR',
    category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ', location: 'Γενικά', paymentMethod: 'Κάρτα', status: 'confirmed',
    source: 'google_billing_import_2026_09',
    lineItems: [{ description: 'Google Ads — 1 Feb 2025 - 28 Feb 2025', quantity: 1, amount: 2987.55 }],
    notes: 'Αντικαθιστά ΔΥΟ λανθασμένες καταχωρήσεις του ίδιου τιμολογίου (€3.208,48 + €3.011,39 = €6.220,38) '
      + 'που είχαν μπει από τραπεζικά ποσά. Το τιμολόγιο λέει €2.987,55. '
      + 'ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (reverse charge, 0% ΦΠΑ).',
  },
}]

// ── correct: bookings made from bank amounts, no invoice number attached ─────
const CORRECT = [
  { id: 'hist_card25q1_r234', inv: '5172402275', total: 2672.47, month: 'Ιαν 2025' },
  { id: 'hist_extraboc_r003', inv: '5247291376', total: 1828.05, month: 'Απρ 2025' },
  { id: 'hist_extraboc_r005', inv: '5274220617', total: 1847.01, month: 'Μάι 2025' },
  { id: 'hist_extraboc_r025', inv: '5301471468', total: 1002.35, month: 'Ιουν 2025' },
  { id: 'q1_26_r204',        inv: '5540824632', total: 3045.97, month: 'Μαρ 2026' },
]

const before = {}
for (const id of [...RETIRE.map(r => r.id), ...CORRECT.map(c => c.id)]) {
  const s = await db.collection('expenses').doc(id).get()
  before[id] = s.exists ? s.data() : null
  if (!s.exists) console.log('!! missing expense', id)
}
writeFileSync('C:/Users/User/backups/google_books_fix_backup_2026-09-01.json',
  JSON.stringify({ before, RETIRE, CREATE, CORRECT }, null, 1), 'utf8')
console.log('backup → C:/Users/User/backups/google_books_fix_backup_2026-09-01.json')

console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'}`)
console.log(`\nΑΠΟΣΥΡΟΝΤΑΙ (μηδενισμός ποσών, η εγγραφή μένει): ${RETIRE.length}`)
for (const r of RETIRE) {
  const b = before[r.id]
  console.log(`   ${r.id.padEnd(22)} €${String(Number(b?.total || 0).toFixed(2)).padStart(9)} → €0.00   ${b?.date}`)
}
console.log(`\nΔΗΜΙΟΥΡΓΟΥΝΤΑΙ: ${CREATE.length}`)
for (const c of CREATE) console.log(`   ${c.doc.date}  ${c.doc.invoiceNumber}  €${c.doc.total.toFixed(2)}`)
console.log(`\nΔΙΟΡΘΩΝΟΝΤΑΙ (ποσό τιμολογίου + αρ. τιμολογίου): ${CORRECT.length}`)
for (const c of CORRECT) {
  const b = before[c.id]
  console.log(`   ${c.id.padEnd(22)} ${c.month.padEnd(10)} €${String(Number(b?.total || 0).toFixed(2)).padStart(9)} → €${c.total.toFixed(2).padStart(9)}  inv ${b?.invoiceNumber || '—'} → ${c.inv}`)
}
const net = CREATE.reduce((s, c) => s + c.doc.total, 0)
  - RETIRE.reduce((s, r) => s + Number(before[r.id]?.total || 0), 0)
  + CORRECT.reduce((s, c) => s + (c.total - Number(before[c.id]?.total || 0)), 0)
console.log(`\nΚΑΘΑΡΗ ΜΕΤΑΒΟΛΗ ΣΤΑ ΕΞΟΔΑ: €${net.toFixed(2)}`)

if (EXECUTE) {
  const b = db.batch()
  for (const r of RETIRE) {
    const prev = before[r.id]
    b.update(db.collection('expenses').doc(r.id), {
      total: 0, net: 0, vat: 0, docType: 'superseded',
      notes: `${prev?.notes ? prev.notes + ' ' : ''}⚠️ ΑΠΟΣΥΡΘΗΚΕ 01/09/2026 — ${r.why} `
        + `Το αρχικό ποσό ήταν €${Number(prev?.total || 0).toFixed(2)} και μηδενίστηκε ώστε να μη διπλομετράται.`,
    })
  }
  for (const c of CREATE) b.create(db.collection('expenses').doc(c.docId), c.doc)
  for (const c of CORRECT) {
    const prev = before[c.id]
    b.update(db.collection('expenses').doc(c.id), {
      invoiceNumber: c.inv, total: c.total, net: c.total, vat: 0, vatRate: 0,
      notes: `${prev?.notes ? prev.notes + ' ' : ''}✔️ Διορθώθηκε 01/09/2026 από το τιμολόγιο Google ${c.inv} (${c.month}): `
        + `€${Number(prev?.total || 0).toFixed(2)} → €${c.total.toFixed(2)}. Το προηγούμενο ποσό είχε μπει από τραπεζική κίνηση. `
        + `ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (0% ΦΠΑ).`,
    })
  }
  await b.commit()
  console.log('\nDONE')
}
process.exit(0)
