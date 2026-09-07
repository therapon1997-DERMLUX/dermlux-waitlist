// Book the OnlineJobs.ph subscription invoice (recruitment platform, Philippines hiring).
// US vendor (OnlineJobs.ph, Lehi UT) → no VAT charged, our CY VAT number is on the invoice as the
// customer, i.e. reverse charge in Cyprus: net = total, VAT 0, vatRate 0 — same treatment as the
// Meta Ireland invoices already in the books.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

const INV = {
  id: 'inv_onlinejobsph_898247',
  vendor: 'OnlineJobs.ph',
  vatNumber: '',
  invoiceNumber: '898247',
  date: '2026-08-31',
  net: 69,
  vat: 0,
  vatRate: 0,
  total: 69,
  currency: 'USD',
  category: '8122 · ΕΙΣΦΟΡΕΣ - ΣΥΝΔΡΟΜΕΣ',
  location: 'Γενικά',
  paymentMethod: 'Κάρτα',
  notes: 'OnlineJobs.ph Monthly Subscription — πλατφόρμα πρόσληψης προσωπικού από Φιλιππίνες. '
    + 'Χρέωση MasterCard ••••0885 στις 31/08/2026 02:23 MDT, order 898247, customer ID 922217. '
    + 'Αμερικανικός προμηθευτής χωρίς ΦΠΑ στο τιμολόγιο — αντίστροφη χρέωση (όπως τα τιμολόγια Meta). '
    + 'Η συνδρομή ΑΚΥΡΩΘΗΚΕ στις 05/09/2026 και η κάρτα αφαιρέθηκε — καμία ανανέωση στις 30/09. '
    + 'Το ποσό σε EUR θα προκύψει από το statement της κάρτας.',
}

const run = async () => {
  const col = db.collection('expenses')
  const dupSnap = await col.where('invoiceNumber', '==', INV.invoiceNumber).get()
  if (!dupSnap.empty) {
    console.log('ΥΠΑΡΧΕΙ ΗΔΗ:', dupSnap.docs.map(d => `${d.id} | ${d.data().vendor} | ${d.data().date}`).join(' · '))
    return
  }
  const lookalike = await col.where('vendor', '==', INV.vendor).get()
  if (!lookalike.empty) {
    console.log('Άλλες εγγραφές ίδιου προμηθευτή:',
      lookalike.docs.map(d => `${d.id} | ${d.data().date} | ${d.data().total}`).join(' · '))
  }
  const doc = { ...INV, createdAt: new Date().toISOString(), source: 'claude-import-2026-09-05' }
  delete doc.id
  console.log(EXECUTE ? 'ΓΡΑΦΩ:' : 'DRY RUN:', JSON.stringify(doc, null, 1))
  if (EXECUTE) {
    await col.doc(INV.id).set(doc, { merge: true })
    const back = await col.doc(INV.id).get()
    console.log('OK →', INV.id, JSON.stringify(back.data()).slice(0, 200))
  }
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
