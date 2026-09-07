// READ-ONLY: which Google / Meta / TikTok platform invoices are already booked, so we know the gap.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))

const RX = /google|meta platforms|facebook|facebk|tiktok|instagram/i
const ads = exps.filter(e => RX.test(String(e.vendor || '')) || RX.test(String(e.notes || '')))
console.log(`platform-ad expenses booked: ${ads.length}`)

const byVendorMonth = {}
for (const e of ads) {
  const v = /google/i.test(e.vendor) ? 'Google' : /tiktok/i.test(e.vendor) ? 'TikTok' : /meta|facebook|facebk|instagram/i.test(e.vendor) ? 'Meta' : String(e.vendor).slice(0, 18)
  const m = String(e.date || '?').slice(0, 7)
  byVendorMonth[v] ||= {}
  byVendorMonth[v][m] ||= { n: 0, eur: 0, invs: [] }
  byVendorMonth[v][m].n++
  byVendorMonth[v][m].eur += Number(e.total || 0)
  byVendorMonth[v][m].invs.push(e.invoiceNumber || '(no inv)')
}
for (const [v, months] of Object.entries(byVendorMonth)) {
  console.log(`\n=== ${v}`)
  for (const [m, d] of Object.entries(months).sort())
    console.log(`   ${m}  ${String(d.n).padStart(3)} docs  €${d.eur.toFixed(2).padStart(10)}   ${d.invs.slice(0, 4).join(', ')}`)
}

console.log('\n--- ALL Google rows in detail ---')
for (const e of ads.filter(x => /google/i.test(x.vendor)).sort((a, b) => String(a.date).localeCompare(String(b.date))))
  console.log(`   ${e.date}  €${String(e.total).padStart(9)}  inv=${String(e.invoiceNumber || '—').padEnd(22)} cur=${e.currency || 'EUR'} src=${e.source || '—'}  ${String(e.vendor).slice(0, 30)}`)
process.exit(0)
