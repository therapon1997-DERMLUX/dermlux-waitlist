// Read-only verification of the Meta import: count, sum, VAT treatment, per account/month.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const plan = JSON.parse(readFileSync('C:/Users/User/backups/meta_invoice_booking_2026-09-01.json', 'utf8'))
const planned = Array.isArray(plan) ? plan : (plan.plan || plan.records || [])
console.log(`plan entries: ${planned.length}`)

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const mine = exps.filter(e => e.source === 'meta_billing_import_2026_09')
console.log(`live docs with source=meta_billing_import_2026_09: ${mine.length}`)

const sum = mine.reduce((a, b) => a + Number(b.total || 0), 0)
console.log(`sum: €${sum.toFixed(2)}`)

const badVat = mine.filter(e => Number(e.vat || 0) !== 0 || Number(e.vatRate || 0) !== 0 || Number(e.net) !== Number(e.total))
console.log(`docs with wrong reverse-charge treatment (vat!=0 or net!=total): ${badVat.length}`)
const badVendor = mine.filter(e => e.vendor !== 'Meta Platforms Ireland Limited' || e.vatNumber !== 'IE9692928F')
console.log(`docs with wrong vendor/VAT number: ${badVendor.length}`)
const noInv = mine.filter(e => !/^FBADS-\d{3}-\d+$/.test(String(e.invoiceNumber || '')))
console.log(`docs without a valid FBADS invoice number: ${noInv.length}`)

const nums = mine.map(e => String(e.invoiceNumber))
console.log(`unique invoice numbers: ${new Set(nums).size} of ${nums.length}`)

const byAcct = {}
for (const e of mine) {
  const acct = (String(e.notes || '').match(/\b(\d{15,17})\b/) || [])[1]
    || (String(e.lineItems?.[0]?.description || '').match(/\b(\d{15,17})\b/) || [])[1] || '?'
  const m = String(e.date).slice(0, 7)
  byAcct[acct] = byAcct[acct] || {}
  byAcct[acct][m] = byAcct[acct][m] || { n: 0, sum: 0 }
  byAcct[acct][m].n++
  byAcct[acct][m].sum = +(byAcct[acct][m].sum + Number(e.total || 0)).toFixed(2)
}
console.log('\nper ad account × month:')
for (const [a, months] of Object.entries(byAcct)) {
  const tot = Object.values(months).reduce((s, v) => s + v.sum, 0)
  console.log(`  ${a}  €${tot.toFixed(2)}`)
  for (const m of Object.keys(months).sort()) console.log(`      ${m}  ${String(months[m].n).padStart(3)} tx  €${months[m].sum.toFixed(2)}`)
}

// total Meta 2026 in the books now
const all2026 = exps.filter(e => /meta/i.test(String(e.vendor || '')) && String(e.date || '') >= '2026-01-01')
console.log(`\nALL Meta-vendor expenses dated 2026+: ${all2026.length} docs, €${all2026.reduce((a, b) => a + Number(b.total || 0), 0).toFixed(2)}`)
process.exit(0)
