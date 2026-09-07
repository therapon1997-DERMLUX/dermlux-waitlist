// Book the single Google Ads invoice of the ESHOP account 940-928-7341 (DermLux Aesthetics).
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

const NUM = '5647948046'
const exists = (await db.collection('expenses').where('invoiceNumber', '==', NUM).get()).docs
console.log(`already booked with invoiceNumber ${NUM}: ${exists.length}`)
for (const d of exists) console.log('   ', d.id, JSON.stringify(d.data()).slice(0, 160))

const doc = {
  vendor: 'Google Ireland Limited',
  vatNumber: 'IE6388047V',
  invoiceNumber: NUM,
  date: '2026-07-31',
  net: 454.15, vat: 0, vatRate: 0, total: 454.15, currency: 'EUR',
  category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ',
  location: 'Γενικά',
  paymentMethod: 'Κάρτα',
  status: 'confirmed',
  source: 'google_billing_import_2026_09',
  lineItems: [
    { description: 'Google Ads — eshop (9–31 Ιουλ 2026)', quantity: 1, amount: 453.92 },
    { description: 'Turkey Regulatory Operating Cost', quantity: 1, amount: 0.19 },
    { description: 'UK DST Fee', quantity: 1, amount: 0.04 },
  ],
  notes: 'ΛΟΓΑΡΙΑΣΜΟΣ ESHOP 940-928-7341 «DermLux Aesthetics» (dermluxoffice@gmail.com), Billing ID 4825-9728-9928 — '
    + 'ΞΕΧΩΡΙΣΤΟΣ από τον λογαριασμό της κλινικής 207-393-9384. Είναι το ΜΟΝΟ τιμολόγιο αυτού του λογαριασμού· '
    + 'ο λογαριασμός ξεκίνησε 9 Ιουλίου 2026. Τιμολογημένο απευθείας σε ΕΥΡΩ (όχι USD όπως ο λογαριασμός της κλινικής). '
    + 'ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (reverse charge, ΦΠΑ 0%) — απαιτεί αυτοεκκαθάριση ΦΠΑ.',
}
console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'}: create google_inv_${NUM}  €${doc.total}`)
if (EXECUTE && exists.length === 0) {
  await db.collection('expenses').doc(`google_inv_${NUM}`).create(doc)
  console.log('created')
} else if (EXECUTE) console.log('SKIPPED — already booked')
process.exit(0)
