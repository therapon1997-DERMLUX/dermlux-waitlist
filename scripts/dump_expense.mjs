import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const term = (process.argv[2] || '').toLowerCase()
const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
const hay = e => [e.vendor, e.notes, e.invoiceNumber].filter(Boolean).join(' ').toLowerCase()
const rows = all.filter(e => hay(e).includes(term)).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
for (const e of rows.slice(0, 3)) {
  console.log('----', e.date, e.vendor, 'inv', e.invoiceNumber, '----')
  console.log('  total', e.total, 'net', e.net, 'vat', e.vat, e.vatRate + '%')
  console.log('  notes:', e.notes || '(none)')
  console.log('  fileUrl:', e.fileUrl || '(none)')
}
process.exit(0)
