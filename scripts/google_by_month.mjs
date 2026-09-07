// READ-ONLY: every Google booking, month by month, next to the invoice figure for that month.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'
const figures = JSON.parse(readFileSync(S + 'google_inv_figures.json', 'utf8'))
const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const iso = (s) => { const m = /(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/.exec(s || ''); return m ? `${m[3]}-${MONTHS[m[2]]}-${String(m[1]).padStart(2, '0')}` : null }
const DATE_FIX = { '5376802894': '2025-09-30' }

const invByMonth = new Map()
for (const f of figures) {
  const d = iso(f.invoice_date) || DATE_FIX[f.invoice_no]
  if (d) invByMonth.set(d.slice(0, 7), { num: f.invoice_no, eur: f.eur_total, usd: f.usd_total })
}

const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const google = exps.filter(e => /google/i.test(String(e.vendor || '')) && !/play/i.test(String(e.vendor || '')))
const byMonth = {}
for (const e of google) { const m = String(e.date || '?').slice(0, 7); (byMonth[m] ||= []).push(e) }

const months = [...new Set([...Object.keys(byMonth), ...invByMonth.keys()])].sort()
let overBooked = 0, missing = 0
for (const m of months) {
  const inv = invByMonth.get(m)
  const rows = (byMonth[m] || []).sort((a, b) => Number(b.total) - Number(a.total))
  const booked = rows.reduce((s, e) => s + Number(e.total || 0), 0)
  const target = inv ? inv.eur : 0
  const diff = Math.round((booked - target) * 100) / 100
  const flag = !inv ? '❓ καμία τιμολόγηση' : Math.abs(diff) < 0.02 ? '✅' : diff > 0 ? `🔴 ΥΠΕΡ +${diff.toFixed(2)}` : `🔴 ΥΠΟ ${diff.toFixed(2)}`
  if (diff > 0.02) overBooked += diff
  if (diff < -0.02) missing += -diff
  console.log(`\n${m}  τιμολόγιο ${inv ? inv.num + ' €' + inv.eur.toFixed(2) : '—'}   στα βιβλία €${booked.toFixed(2)}   ${flag}`)
  for (const e of rows)
    console.log(`     ${e.date}  €${String(Number(e.total).toFixed(2)).padStart(9)}  inv=${String(e.invoiceNumber || '—').padEnd(12)} src=${String(e.source || '—').padEnd(28)} id=${e.id}`)
}
console.log(`\n\nΣΥΝΟΛΟ υπερκαταχώρηση: €${overBooked.toFixed(2)}`)
console.log(`ΣΥΝΟΛΟ υποκαταχώρηση : €${missing.toFixed(2)}`)
process.exit(0)
