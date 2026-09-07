import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

function getLines(e) {
  for (const f of ['lineItems', 'lineItemsJson', 'items']) {
    let v = e[f]
    if (!v) continue
    if (typeof v === 'string') { try { v = JSON.parse(v) } catch { continue } }
    if (Array.isArray(v) && v.length) return v
  }
  return []
}

const RX = /fibra|fiber|fibre|οπτικ|ίνα|ina 1200|1200μm|1200u/i
const snap = await db.collection('expenses').get()
console.log('Έξοδα με πιθανή αναφορά σε ίνα (όλοι οι προμηθευτές):\n')
for (const d of snap.docs) {
  const e = d.data()
  const hay = [e.vendor, e.notes, ...getLines(e).map(l => l.description)].filter(Boolean).join(' | ')
  if (RX.test(hay)) {
    console.log(`── ${e.date} | ${e.vendor} | ${e.invoiceNumber || '—'} | €${e.total} | loc: ${e.location || '—'} | doc ${d.id}`)
    for (const l of getLines(e)) if (RX.test(l.description || '')) console.log(`     ${l.quantity}× ${l.description} €${l.amount}`)
    if (e.notes && RX.test(e.notes)) console.log(`     notes: ${String(e.notes).slice(0, 150)}`)
  }
}
console.log('\n--- Το τιμολόγιο της ίνας (q2_p049) πλήρες: ---')
const f = (await db.collection('expenses').doc('q2_p049').get()).data()
console.log(JSON.stringify({ date: f.date, vendor: f.vendor, inv: f.invoiceNumber, total: f.total, location: f.location, notes: f.notes, category: f.category }, null, 1))
process.exit(0)
