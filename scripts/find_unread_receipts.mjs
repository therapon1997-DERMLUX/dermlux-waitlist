// Read-only: which uploaded expense documents have NOT been read yet?
// "Unread" = has a file attached but no line items and/or no vendor/total filled in.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
console.log(`expenses total: ${exps.length}`)

const hasFile = exps.filter(e => e.fileUrl || e.fileName)
console.log(`with a file attached: ${hasFile.length}`)

const unread = hasFile.filter(e => {
  const noItems = !Array.isArray(e.lineItems) || e.lineItems.length === 0
  const noVendor = !e.vendor || String(e.vendor).trim() === ''
  const noTotal = !(Number(e.total) > 0)
  return noItems || noVendor || noTotal
})
console.log(`\nUNREAD / INCOMPLETE: ${unread.length}`)

unread.sort((a, b) => String(b.createdAt || b.date || '').localeCompare(String(a.createdAt || a.date || '')))
for (const e of unread) {
  const created = e.createdAt?.toDate ? e.createdAt.toDate().toISOString() : String(e.createdAt || '')
  console.log(`\n  id       : ${e.id}`)
  console.log(`  file     : ${e.fileName || '(no name)'}`)
  console.log(`  url      : ${e.fileUrl || '(none)'}`)
  console.log(`  uploaded : ${created.slice(0, 19)}   by ${e.createdBy || '?'}`)
  console.log(`  vendor   : ${e.vendor || '—'}   total: ${e.total ?? '—'}   date: ${e.date || '—'}`)
  console.log(`  status   : ${e.status || '—'}   source: ${e.source || '—'}   category: ${e.category || '—'}`)
  console.log(`  lineItems: ${Array.isArray(e.lineItems) ? e.lineItems.length : 'none'}`)
}

// also: anything created in the last 48h regardless of completeness, so a freshly
// uploaded-and-autofilled doc is not missed
const cutoff = new Date(Date.now() - 48 * 3600 * 1000).toISOString()
const fresh = exps.filter(e => {
  const c = e.createdAt?.toDate ? e.createdAt.toDate().toISOString() : String(e.createdAt || '')
  return c >= cutoff
})
console.log(`\n\nCREATED IN THE LAST 48h: ${fresh.length}`)
for (const e of fresh) {
  const c = e.createdAt?.toDate ? e.createdAt.toDate().toISOString() : String(e.createdAt || '')
  console.log(`   ${c.slice(0,19)}  ${e.id}  vendor=${e.vendor || '—'}  total=${e.total ?? '—'}  ` +
              `file=${e.fileName || '—'}  items=${Array.isArray(e.lineItems) ? e.lineItems.length : 0}`)
}

writeFileSync('C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/unread_receipts.json',
  JSON.stringify(unread.map(e => ({ id: e.id, fileName: e.fileName, fileUrl: e.fileUrl,
    vendor: e.vendor, total: e.total, date: e.date, status: e.status, source: e.source })), null, 1), 'utf8')
console.log('\nlist -> scratchpad/unread_receipts.json')
process.exit(0)
