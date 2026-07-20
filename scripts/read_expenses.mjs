import admin from 'firebase-admin'
import { readFileSync } from 'fs'

const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const term = (process.argv[2] || '').toLowerCase()

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.docType !== 'deposit_slip')

const hay = e => [e.vendor, e.notes, e.invoiceNumber, e.category].filter(Boolean).join(' ').toLowerCase()
const rows = term ? all.filter(e => hay(e).includes(term)) : all

rows.sort((a, b) => (a.date || '').localeCompare(b.date || ''))

console.log(`TOTAL expenses in collection: ${all.length}`)
console.log(`Matching "${term}": ${rows.length}\n`)
for (const e of rows) {
  console.log([
    e.date || '—',
    (e.vendor || '—').padEnd(28).slice(0, 28),
    'inv:' + (e.invoiceNumber || '—'),
    'net:' + (e.net ?? '—'),
    'vat:' + (e.vat ?? '—') + (e.vatRate != null ? `(${e.vatRate}%)` : ''),
    'total:' + (e.total ?? '—'),
    e.location || '—',
    e.notes ? '| ' + String(e.notes).slice(0, 60) : '',
    e.fileUrl ? '📎' : '',
  ].join('  '))
}
process.exit(0)
