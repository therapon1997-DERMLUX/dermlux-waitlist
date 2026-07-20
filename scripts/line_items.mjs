import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const term = (process.argv[2] || '').toLowerCase()
const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
const hay = e => [e.vendor, e.notes, e.invoiceNumber].filter(Boolean).join(' ').toLowerCase()
const rows = all.filter(e => hay(e).includes(term)).sort((a, b) => (a.date || '').localeCompare(b.date || ''))

// Aggregate: description -> {count, prices:Set, lastDate, lastPrice}
const agg = {}
let withLines = 0
for (const e of rows) {
  let li = null
  try { li = e.lineItemsJson ? JSON.parse(e.lineItemsJson) : null } catch {}
  if (!Array.isArray(li) || !li.length) continue
  withLines++
  for (const it of li) {
    const name = (it.description || it.name || '—').trim()
    const qty = it.quantity ?? it.qty ?? ''
    const up = it.unit_price ?? it.unitPrice ?? ''
    const k = name.toLowerCase()
    if (!agg[k]) agg[k] = { name, times: 0, prices: new Set(), last: '' }
    agg[k].times++
    if (up !== '' && up != null) agg[k].prices.add(Number(up))
    agg[k].last = `${e.date} q${qty}×${up} (inv ${e.invoiceNumber || '—'})`
  }
}
console.log(`${term}: ${rows.length} τιμολόγια, ${withLines} με γραμμές\n`)
const list = Object.values(agg).sort((a, b) => b.times - a.times)
for (const a of list) {
  const prices = [...a.prices].sort((x, y) => x - y)
  console.log(`${String(a.times).padStart(3)}×  ${a.name.slice(0, 50).padEnd(50)}  unit_price: ${prices.join(' / ') || '—'}   [τελ: ${a.last}]`)
}
process.exit(0)
