// Full reconciliation: every Google Ads invoice (from the PDFs) against what is booked.
// READ-ONLY.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'
const figures = JSON.parse(readFileSync(S + 'google_inv_figures.json', 'utf8'))

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const google = exps.filter(e => /google/i.test(String(e.vendor || '')) && e.docType !== 'statement')

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const iso = (s) => { const m = /(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/.exec(s || ''); return m ? `${m[3]}-${MONTHS[m[2]]}-${String(m[1]).padStart(2, '0')}` : null }

console.log(`invoices parsed from PDFs: ${figures.length}`)
console.log(`Google expenses booked   : ${google.length}\n`)
console.log(`${'invoice'.padEnd(12)}${'date'.padEnd(12)}${'€ invoice'.padStart(11)}${'€ booked'.padStart(11)}${'gap'.padStart(11)}  status`)

let gapTotal = 0, invTotal = 0
const byInv = new Map()
for (const e of google) { const k = String(e.invoiceNumber || '').trim(); if (k) (byInv.get(k) || byInv.set(k, []).get(k)).push(e) }

for (const f of figures.sort((a, b) => String(iso(a.invoice_date)).localeCompare(String(iso(b.invoice_date))))) {
  const num = f.invoice_no
  const d = iso(f.invoice_date)
  const inv = f.eur_total || 0
  invTotal += inv
  const hits = byInv.get(num) || []
  // also look for a booking in the same month with no invoice number
  const month = (d || '').slice(0, 7)
  const loose = google.filter(e => !String(e.invoiceNumber || '').trim() && String(e.date || '').startsWith(month))
  const booked = hits.reduce((s, e) => s + Number(e.total || 0), 0) + loose.reduce((s, e) => s + Number(e.total || 0), 0)
  const gap = Math.round((inv - booked) * 100) / 100
  gapTotal += gap
  let status = ''
  if (hits.length > 1) status = `🔴 ${hits.length} καταχωρήσεις με τον ΙΔΙΟ αριθμό`
  else if (Math.abs(gap) < 0.02) status = '✅'
  else if (booked === 0) status = '🔴 ΔΕΝ ΥΠΑΡΧΕΙ'
  else status = `⚠️ απόκλιση`
  if (loose.length) status += ` (+${loose.length} χωρίς αρ. τιμολ. στον ίδιο μήνα)`
  console.log(`${num.padEnd(12)}${String(d).padEnd(12)}${inv.toFixed(2).padStart(11)}${booked.toFixed(2).padStart(11)}${gap.toFixed(2).padStart(11)}  ${status}`)
}
console.log(`\n${'ΣΥΝΟΛΑ'.padEnd(24)}${invTotal.toFixed(2).padStart(11)}${''.padStart(11)}${gapTotal.toFixed(2).padStart(11)}`)

// bookings that do not correspond to any invoice at all
const invNums = new Set(figures.map(f => f.invoice_no))
const orphans = google.filter(e => { const k = String(e.invoiceNumber || '').trim(); return k && !invNums.has(k) })
console.log(`\nκαταχωρήσεις με αριθμό που ΔΕΝ αντιστοιχεί σε κανένα κατεβασμένο τιμολόγιο: ${orphans.length}`)
for (const o of orphans) console.log(`   ${o.date}  €${o.total}  inv=${o.invoiceNumber}  ${o.vendor}  src=${o.source}`)
process.exit(0)
