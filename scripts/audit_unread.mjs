import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

// line items live under THREE different field names depending on the import path
export function getLines(e) {
  for (const f of ['lineItems', 'lineItemsJson', 'items']) {
    let v = e[f]
    if (!v) continue
    if (typeof v === 'string') { try { v = JSON.parse(v) } catch { continue } }
    if (Array.isArray(v) && v.length) return v
  }
  return null
}
const hasImg = e => !!(e.fileUrl || e.filePath || e.pdfPage || e.imageKey)

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.docType !== 'deposit_slip')

let withL = 0, noLimgT = 0, noLnoImg = 0
const byVendor = {}
for (const e of all) {
  const n = getLines(e)
  const v = (e.vendor || '—').trim()
  byVendor[v] ??= { v, tot: 0, sum: 0, withL: 0, noLimg: 0, noLnoimg: 0 }
  const b = byVendor[v]
  b.tot++; b.sum += Number(e.total) || 0
  if (n) { withL++; b.withL++ }
  else if (hasImg(e)) { noLimgT++; b.noLimg++ }
  else { noLnoImg++; b.noLnoimg++ }
}

console.log(`ΣΥΝΟΛΟ εξόδων: ${all.length}   (€${all.reduce((s, e) => s + (Number(e.total) || 0), 0).toFixed(2)})`)
console.log(`  ✅ με line items                : ${withL}`)
console.log(`  📷 ΧΩΡΙΣ γραμμές ΑΛΛΑ με εικόνα : ${noLimgT}   ← αυτά μπορώ να διαβάσω`)
console.log(`  ∅  χωρίς γραμμές & χωρίς εικόνα : ${noLnoImg}\n`)

const list = Object.values(byVendor).filter(b => b.noLimg).sort((a, b) => b.noLimg - a.noLimg)
console.log(`Προμηθευτές με αδιάβαστα (${list.length}):`)
console.log(' αδιάβ  #tot   €σύνολο  προμηθευτής')
for (const b of list) {
  console.log(String(b.noLimg).padStart(5), String(b.tot).padStart(6), (b.sum.toFixed(0) + '€').padStart(10), ' ' + b.v.slice(0, 46))
}
writeFileSync('C:/Users/User/tmp_unread.json', JSON.stringify(
  all.filter(e => !getLines(e) && hasImg(e))
     .map(e => ({ id: e.id, vendor: e.vendor, date: e.date, inv: e.invoiceNumber, total: e.total, fileUrl: e.fileUrl, fileName: e.fileName })), null, 1))
console.log('\n→ λίστα αδιάβαστων: C:/Users/User/tmp_unread.json')
process.exit(0)
