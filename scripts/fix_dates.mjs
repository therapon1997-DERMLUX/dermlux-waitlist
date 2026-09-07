/** Corrects invoice dates on the records Claude read (they held the UPLOAD date). */
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXEC = process.argv.includes('--execute')

const manifest = JSON.parse(readFileSync('C:/Users/User/unread_invoices/manifest.json', 'utf8'))
const ex = ['extracted.json', 'extracted_2.json', 'extracted_3.json']
  .flatMap(f => JSON.parse(readFileSync('C:/Users/User/unread_invoices/' + f, 'utf8')))

const resolve = f => manifest.find(m => m.file === f) || manifest.find(m => m.file.startsWith(f.split('_')[0] + '_'))

const changes = [], backup = []
for (const r of ex) {
  if (!r.date) continue
  const m = resolve(r.file); if (!m) continue
  const snap = await db.collection('expenses').doc(m.id).get(); if (!snap.exists) continue
  const cur = snap.data()
  if (cur.date === r.date) continue
  backup.push({ id: m.id, date: cur.date, invoiceNumber: cur.invoiceNumber })
  changes.push({ id: m.id, vendor: r.vendor, from: cur.date, to: r.date, inv: r.invoiceNumber })
  if (EXEC) await db.collection('expenses').doc(m.id).update({ date: r.date, uploadDate: cur.date })
}
writeFileSync('C:/Users/User/dermlux-waitlist/backups/expense_dates_before_fix.json', JSON.stringify(backup, null, 1))
console.log(`${EXEC ? 'ΔΙΟΡΘΩΘΗΚΑΝ' : 'DRY RUN'}: ${changes.length} ημερομηνίες`)
for (const c of changes) console.log(`  ${(c.vendor || '').slice(0, 30).padEnd(30)} ${c.from} → ${c.to}   inv ${c.inv}`)

// --- duplicate check on vendor + invoice number ---------------------------
const all = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const byInv = {}
for (const e of all) {
  const inv = String(e.invoiceNumber || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
  if (!inv || inv.length < 4) continue
  const v = String(e.vendor || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const k = v + '|' + inv
  ;(byInv[k] ??= []).push(e)
}
const dups = Object.entries(byInv).filter(([, g]) => g.length > 1)
console.log(`\nΠιθανά διπλά (ίδιος προμηθευτής + αρ. τιμολογίου): ${dups.length}`)
for (const [k, g] of dups.slice(0, 25)) {
  console.log('  ' + k)
  for (const e of g) console.log(`     ${e.id.slice(0, 8)}  ${e.date}  €${e.total}  ${e.source || ''}`)
}
process.exit(0)
