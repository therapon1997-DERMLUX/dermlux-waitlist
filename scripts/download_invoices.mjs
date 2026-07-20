import admin from 'firebase-admin'
import { readFileSync, mkdirSync, writeFileSync } from 'fs'

const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
const BUCKETS = [`${key.project_id}.firebasestorage.app`, `${key.project_id}.appspot.com`]
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const term = (process.argv[2] || '').toLowerCase()
const limit = Number(process.argv[3] || 6)
const outDir = 'C:/Users/User/tmp_invoices'
mkdirSync(outDir, { recursive: true })

const snap = await db.collection('expenses').get()
const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
const hay = e => [e.vendor, e.notes, e.invoiceNumber].filter(Boolean).join(' ').toLowerCase()
let rows = all.filter(e => hay(e).includes(term) && e.fileUrl).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
rows = rows.slice(0, limit)

const pathFromUrl = (u) => {
  const i = u.indexOf('/invoices/')
  if (i === -1) return null
  return decodeURIComponent(u.slice(i + '/invoices/'.length))
}

for (const e of rows) {
  const p = pathFromUrl(e.fileUrl)
  if (!p) { console.log('SKIP (no path)', e.invoiceNumber); continue }
  const ext = p.split('.').pop()
  const safe = `${term}_${e.date}_${(e.invoiceNumber || e.id).replace(/[^\w.-]/g, '_')}.${ext}`
  let ok = false
  for (const b of BUCKETS) {
    try {
      const [buf] = await admin.storage().bucket(b).file(p).download()
      writeFileSync(`${outDir}/${safe}`, buf)
      console.log(`OK  ${e.date}  ${e.vendor}  total ${e.total}  -> ${safe}`)
      ok = true
      break
    } catch (err) { /* try next bucket */ }
  }
  if (!ok) console.log(`FAIL ${e.date} ${e.invoiceNumber} (${p})`)
}
process.exit(0)
