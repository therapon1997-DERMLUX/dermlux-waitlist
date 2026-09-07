// Book the Google Ads invoices that are missing from `expenses`, straight from the invoice PDFs.
// Figures come from the invoice itself (EUR column), never from a bank amount or a conversion.
// All are Google Ireland reverse-charge: net = total, VAT 0, vatRate 0.
// Skips any invoiceNumber already present. Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'

const figures = JSON.parse(readFileSync(S + 'google_inv_figures.json', 'utf8'))
// 5376802894 prints its date only in the billing list, not in a parseable line
const DATE_FIX = { '5376802894': '30 Sep 2025' }
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const iso = (s) => { const m = /(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/.exec(s || ''); return m ? `${m[3]}-${MONTHS[m[2]]}-${String(m[1]).padStart(2, '0')}` : null }

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const haveInv = new Set(exps.map(e => String(e.invoiceNumber || '').trim()).filter(Boolean))

const plan = []
for (const f of figures) {
  const num = f.invoice_no
  const date = iso(f.invoice_date || DATE_FIX[num])
  if (!date) { console.log('!! no date for', num); continue }
  if (haveInv.has(num)) { console.log(`skip ${num} — already booked`); continue }
  plan.push({
    docId: `google_inv_${num}`,
    doc: {
      vendor: 'Google Ireland Limited',
      vatNumber: 'IE6388047V',
      invoiceNumber: num,
      date,
      net: f.eur_total, vat: 0, vatRate: 0, total: f.eur_total, currency: 'EUR',
      category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ',
      location: 'Γενικά',
      paymentMethod: 'Κάρτα',
      status: 'confirmed',
      source: 'google_billing_import_2026_09',
      lineItems: [{ description: `Google Ads — ${f.period || date}`, quantity: 1, amount: f.eur_total }],
      notes: `Από το Google Ads Billing (λογ. ${f.account_id}, Billing ID ${f.billing_id}). `
        + `Τιμολόγιο σε USD $${(f.usd_total || 0).toFixed(2)} — καταχωρήθηκε το ΠΟΣΟ ΣΕ ΕΥΡΩ του ίδιου τιμολογίου (€${(f.eur_total || 0).toFixed(2)}), χωρίς δική μας μετατροπή. `
        + `ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (reverse charge, 0% ΦΠΑ) — απαιτεί αυτοεκκαθάριση ΦΠΑ στη δήλωση. `
        + `Περίοδος: ${f.period || '—'}.`,
    },
  })
}

console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'} — new expense records: ${plan.length}`)
let sum = 0
for (const p of plan) { sum += p.doc.total; console.log(`   ${p.doc.date}  ${p.doc.invoiceNumber}  €${p.doc.total.toFixed(2).padStart(9)}  ${p.doc.category}`) }
console.log(`   total €${sum.toFixed(2)}`)
writeFileSync('C:/Users/User/backups/google_invoice_booking_2026-09-01.json', JSON.stringify(plan, null, 1), 'utf8')
console.log('preview → C:/Users/User/backups/google_invoice_booking_2026-09-01.json')

if (EXECUTE) {
  const b = db.batch()
  for (const p of plan) b.create(db.collection('expenses').doc(p.docId), p.doc)
  await b.commit()
  console.log('DONE — created', plan.length)
}
process.exit(0)
