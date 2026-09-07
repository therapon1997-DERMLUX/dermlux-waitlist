import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const ID = 'hist_card25q1_r254'
const s = await db.collection('expenses').doc(ID).get()
if (!s.exists) { console.log('not found'); process.exit(0) }
const prev = s.data()
console.log(`${ID}  €${prev.total}  ${prev.date}  inv=${prev.invoiceNumber || '—'}  vendor=${prev.vendor}`)
writeFileSync('C:/Users/User/backups/google_last_remnant_2026-09-01.json', JSON.stringify({ [ID]: prev }, null, 1), 'utf8')
if (EXECUTE) {
  await db.collection('expenses').doc(ID).update({
    total: 0, net: 0, vat: 0, docType: 'superseded',
    notes: `${prev.notes ? prev.notes + ' ' : ''}⚠️ ΑΠΟΣΥΡΘΗΚΕ 01/09/2026 — υπόλειμμα €0,51 Φεβρουαρίου 2025 (γραμμή προσαρμογής του τιμολογίου). `
      + `Αυθεντικό: google_inv_5198023468 €2.987,55. Το αρχικό ποσό μηδενίστηκε ώστε να μη διπλομετράται.`,
  })
  console.log('retired')
} else console.log('DRY RUN')
process.exit(0)
