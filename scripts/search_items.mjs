import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const kw = (process.argv[2] || '').toLowerCase()
const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

const out = []
for (const e of all) {
  let li = null
  try { li = e.lineItemsJson ? JSON.parse(e.lineItemsJson) : null } catch {}
  if (!Array.isArray(li)) continue
  for (const it of li) {
    const name = (it.description || it.name || '').trim()
    if (!name.toLowerCase().includes(kw)) continue
    out.push({ date: e.date, vendor: e.vendor, name, qty: it.quantity ?? it.qty ?? '', up: it.unit_price ?? it.unitPrice ?? '', inv: e.invoiceNumber || '—' })
  }
}
out.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
console.log(`"${kw}": ${out.length} γραμμές\n`)
for (const o of out) {
  console.log(`${o.date}  ${(o.vendor||'—').slice(0,22).padEnd(22)}  ${o.name.slice(0,44).padEnd(44)}  q${o.qty} × €${o.up}  [${o.inv}]`)
}
process.exit(0)
