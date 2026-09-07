/**
 * Builds the consumables price list from every expense line item.
 * Groups by normalised product name, shows qty bought, unit-price history,
 * discount %, and flags price changes.  Output: JSON + console summary.
 */
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const getLines = e => {
  for (const f of ['lineItems', 'lineItemsJson', 'items']) {
    let v = e[f]; if (!v) continue
    if (typeof v === 'string') { try { v = JSON.parse(v) } catch { continue } }
    if (Array.isArray(v) && v.length) return v
  }
  return null
}
const num = v => {
  if (v === undefined || v === null || v === '') return null      // '' must NOT become 0
  const n = Number(String(v).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

// normalise a product description into a grouping key
const norm = s => String(s || '').toUpperCase()
  .replace(/[«»"'`]/g, ' ')
  .replace(/\b(LOTNO|LOT|EXP)\b.*$/i, '')
  .replace(/\s+/g, ' ')
  .trim()

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.docType !== 'deposit_slip')

const prod = {}
let nLines = 0, nInv = 0
for (const e of all) {
  const li = getLines(e); if (!li) continue
  nInv++
  for (const it of li) {
    const desc = it.description || it.name || it.item || ''
    if (!desc) continue
    const k = norm(desc)
    if (!k || k.length < 3) continue
    const qty = num(it.quantity ?? it.qty) ?? 1
    let up = num(it.unit_price ?? it.unitPrice ?? it.price)
    const amt = num(it.amount ?? it.total ?? it.net)
    if (up == null && amt != null && qty) up = amt / qty
    const disc = num(it.disc_pct ?? it.discount_pct ?? it.discount)
    const list = num(it.list_price ?? it.listPrice)
    prod[k] ??= { name: desc.trim(), key: k, vendors: {}, buys: [], totalQty: 0, totalSpend: 0 }
    const p = prod[k]
    p.vendors[(e.vendor || '—').trim()] = (p.vendors[(e.vendor || '—').trim()] || 0) + 1
    p.totalQty += qty
    p.totalSpend += amt ?? (up != null ? up * qty : 0)
    p.buys.push({ date: e.date || '', qty, unit: up, list, disc, inv: e.invoiceNumber || '', vendor: (e.vendor || '').trim() })
    nLines++
  }
}
for (const p of Object.values(prod)) p.buys.sort((a, b) => (a.date || '').localeCompare(b.date || ''))

const list = Object.values(prod).sort((a, b) => b.totalSpend - a.totalSpend)
console.log(`τιμολόγια με γραμμές: ${nInv}   γραμμές: ${nLines}   ξεχωριστά προϊόντα: ${list.length}`)
writeFileSync('C:/Users/User/price_list_raw.json', JSON.stringify(list, null, 1))

const term = (process.argv[2] || '').toUpperCase()
const show = term ? list.filter(p => p.key.includes(term)) : list.slice(0, 40)
console.log(`\n${term ? 'Αναζήτηση "' + term + '"' : 'TOP 40 κατά δαπάνη'} — ${show.length} προϊόντα\n`)
for (const p of show.slice(0, 60)) {
  const units = [...new Set(p.buys.map(b => b.unit).filter(v => v != null).map(v => v.toFixed(2)))]
  const last = p.buys[p.buys.length - 1]
  console.log(
    `€${p.totalSpend.toFixed(0).padStart(7)}  qty ${String(Math.round(p.totalQty)).padStart(5)}  ${p.name.slice(0, 46).padEnd(46)}`,
    `| τιμές: ${units.slice(0, 6).join(' / ') || '—'}`,
    `| τελ ${last.date} @${last.unit != null ? last.unit.toFixed(2) : '?'}${last.disc ? ' (-' + last.disc + '%)' : ''}`,
    `| ${Object.keys(p.vendors)[0].slice(0, 22)}`)
}
process.exit(0)
