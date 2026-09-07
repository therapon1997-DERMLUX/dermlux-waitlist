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
  return null
}

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
const mj = all.filter(e => /medisci/i.test(e.vendor || ''))
console.log(`MJ Mediscience τιμολόγια: ${mj.length}\n`)
mj.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
for (const e of mj) {
  console.log(`── ${e.date || '—'} | ${e.invoiceNumber || '—'} | σύνολο €${e.total ?? '—'} | ${e.fileName || ''} | doc ${e.id}`)
  const lines = getLines(e)
  if (!lines) { console.log('   (χωρίς line items)'); continue }
  for (const l of lines) {
    const d = String(l.description || '')
    const mark = /ιν[αά]|fiber|fibre|optic|οπτικ/i.test(d) ? ' ◄◄◄ ΙΝΑ' : ''
    console.log(`   ${String(l.quantity ?? 1).padStart(4)} × ${d.slice(0, 80).padEnd(80)} €${l.amount ?? '—'}${mark}`)
  }
}
process.exit(0)
