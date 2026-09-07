/**
 * Consumables price list: filters the product aggregate down to clinical
 * consumables, works out the effective unit price (incl. free-goods and
 * %-discounts), and detects price moves + supplier overlaps.
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
const norm = s => String(s || '').toUpperCase().replace(/[«»"'`]/g, ' ')
  .replace(/\bLOT\s*NO?\b.*$/i, '').replace(/\s+/g, ' ').trim()

// ---- what counts as a clinical consumable -------------------------------
const CONSUMABLE_VENDORS = /IMPOPHAR|PROCOPIOU|K&N|K & N|MJ MEDISCIENCE|HEALTHPRO|ARMAD|IAS BEAUTY|E.?FILLERS|HEBE|ELYSIA|KARPASIA|PANAYI|ANEMOS|IDEAL YOU|DIRECT DERMA|G\. NICOLAOU|NICOLAOU PHARMACY|DERMIS|ROYAL GEMS|GJK|HEALTHPHARMA/i
const CONSUMABLE_WORDS = /PRX|BIOREPEEL|PROFHILO|TEOSYAL|RHA|VISTABEL|BOTOX|ALLUZIENCE|AZZALURE|JUVEDERM|RESTYLANE|CELLBOOSTER|C\.?\s?PROF|MESOPEEL|MESOPEPTIDE|DUTEXOME|COSMELAN|DERMAMELAN|STARMASK|BODYSHOCK|EYECON|M\.?PEN|CARTRIDGE|NEEDLE|SYRINGE|RAZOR|GLOVE|GEL|MASK|AMPOULE|SERUM|CREAM|PEEL|SOLUTION|BOOSTER|TOWEL|EXAMINAT|COUCH|ULTRASOUND|LIDOCAINE|ANAESTH|ANESTH|EMLA|TONGUE DEPRESSOR|SPATULA|WAX|LANCET|SWAB|GAUZE|ALCOHOL|CHLORHEX|DISINFECT|FILLER|HYALURON|SKINBOOSTER|POLYNUCLEOTIDE|EXOSOME|PDRN|MICRONEEDL/i
// things that look like consumables but are equipment / services / overheads
const EXCLUDE = /MOTUS|BURIAN|MOVEO|HANDPIECE|EXAM TABLE|SERVICE LABOR|FLASH LAMP|O-RING|WEBSITE|SUBSCRIPTION|LICENSE|RENT|ΕΝΟΙΚΙ|SMS|EMAIL CREDIT|ADS MANAGEMENT|SOCIAL MEDIA|GRAPHIC DESIGN|VIDEO|ΜΙΣΘ|ΚΑΝΟΝΙΚΕΣ|ΕΙΣΦΟΡ|FOOD|DRINK|ΥΠΗΡΕΣΙ|ΧΡΕΩΣΕΙΣ|SHIPPING|COURIER|ΜΕΤΑΦΟΡ|TRAINING|ΣΕΜΙΝΑΡ|BASIN|MIRROR|WC |TOWEL RING|PAPER HOLDER|LAMP|ΤΟΙΧΟΠΟΙ|ΣΧΕΔΙΑΣ/i

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.docType !== 'deposit_slip')

const prod = {}
for (const e of all) {
  const li = getLines(e); if (!li) continue
  const vendor = (e.vendor || '—').trim()
  for (const it of li) {
    const desc = String(it.description || it.name || it.item || '').trim()
    if (!desc) continue
    const k = norm(desc); if (k.length < 4) continue
    const isCons = (CONSUMABLE_WORDS.test(desc) || CONSUMABLE_VENDORS.test(vendor)) && !EXCLUDE.test(desc)
    if (!isCons) continue
    const qty = num(it.quantity ?? it.qty) ?? 1
    let up = num(it.unit_price ?? it.unitPrice ?? it.price)
    const amt = num(it.amount ?? it.total ?? it.net)
    if (up == null && amt != null && qty) up = amt / qty
    // a line billed at 0 is FREE GOODS even when a list unit_price is printed
    // (K&N invoices PRX-T33 as 3 paid + 1 free: unit_price 205, amount 0)
    if (amt === 0 && qty > 0) up = 0
    prod[k] ??= { name: desc, key: k, vendors: {}, buys: [], qty: 0, spend: 0 }
    const p = prod[k]
    p.vendors[vendor] = (p.vendors[vendor] || 0) + 1
    p.qty += qty
    p.spend += amt ?? (up != null ? up * qty : 0)
    p.buys.push({
      date: e.date || '', qty, unit: up, amount: amt, vendor,
      list: num(it.list_price ?? it.listPrice), disc: num(it.disc_pct ?? it.discount_pct),
      inv: e.invoiceNumber || '',
    })
  }
}

const out = []
for (const p of Object.values(prod)) {
  p.buys.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const paid = p.buys.filter(b => b.unit != null)
  const priced = paid.filter(b => b.unit > 0)
  const freeUnits = p.buys.filter(b => b.unit === 0).reduce((s, b) => s + b.qty, 0)
  const effUnit = p.qty > 0 ? p.spend / p.qty : null          // includes free goods
  const lastPriced = priced[priced.length - 1] || null
  const firstPriced = priced[0] || null
  out.push({
    name: p.name, qty: Math.round(p.qty * 100) / 100, spend: Math.round(p.spend * 100) / 100,
    vendors: Object.entries(p.vendors).sort((a, b) => b[1] - a[1]).map(([v, n]) => ({ v, n })),
    orders: p.buys.length,
    listPrice: lastPriced?.list ?? null,
    lastUnit: lastPriced ? Math.round(lastPriced.unit * 100) / 100 : null,
    firstUnit: firstPriced ? Math.round(firstPriced.unit * 100) / 100 : null,
    lastDate: lastPriced?.date || '', firstDate: firstPriced?.date || '',
    lastDisc: lastPriced?.disc ?? null,
    effUnit: effUnit != null ? Math.round(effUnit * 100) / 100 : null,
    freeUnits: Math.round(freeUnits * 100) / 100,
    priceMovePct: (firstPriced && lastPriced && firstPriced.unit > 0 && firstPriced !== lastPriced)
      ? Math.round(((lastPriced.unit - firstPriced.unit) / firstPriced.unit) * 1000) / 10 : null,
    buys: p.buys.map(b => ({ d: b.date, q: b.qty, u: b.unit, disc: b.disc, list: b.list, v: b.vendor, inv: b.inv })),
  })
}
out.sort((a, b) => b.spend - a.spend)
writeFileSync('C:/Users/User/consumables.json', JSON.stringify(out, null, 1))

const totSpend = out.reduce((s, p) => s + p.spend, 0)
console.log(`αναλώσιμα: ${out.length} προϊόντα, συνολική δαπάνη €${totSpend.toFixed(0)}`)
console.log(`με δωρεάν τεμάχια: ${out.filter(p => p.freeUnits > 0).length}`)
console.log(`με καταγεγραμμένη έκπτωση %: ${out.filter(p => p.lastDisc).length}`)
console.log(`με μεταβολή τιμής: ${out.filter(p => p.priceMovePct).length}`)
console.log(`\nTOP 30:`)
for (const p of out.slice(0, 30)) {
  console.log(
    ('€' + p.spend.toFixed(0)).padStart(8),
    ('×' + p.qty).padStart(7),
    (p.name.slice(0, 44)).padEnd(44),
    ('@' + (p.lastUnit ?? '?')).padStart(9),
    (p.effUnit != null && p.effUnit !== p.lastUnit ? ('eff ' + p.effUnit) : '').padStart(10),
    (p.priceMovePct ? (p.priceMovePct > 0 ? '↑' : '↓') + Math.abs(p.priceMovePct) + '%' : '').padStart(7),
    ' ' + p.vendors[0].v.slice(0, 22))
}
process.exit(0)
