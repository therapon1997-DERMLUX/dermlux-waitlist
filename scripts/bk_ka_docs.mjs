// Χρήση: node scripts/bk_ka_docs.mjs --from=YYYY-MM-DD --to=YYYY-MM-DD --dir=<φάκελος περιόδου> [--execute]
// Κάθε πληρωμή Κ.Α. της τράπεζας ↔ «Βεβαίωση πληρωμής» του portal (Desktop\DermLux\03_Λογιστής\Κοινωνικές_Ασφαλίσεις
// + Base44 SocialInsurancePayment). Γράφει ΜΟΝΟ supportingDoc/matchMethod στην κίνηση (όχι expenses). Dry run εκτός --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=').slice(1).join('=')
const FROM = arg('from', '2026-07-01'), TO = arg('to', '2026-09-30')
const DIR = arg('dir', 'C:/Users/User/bookkeeping-q3-26').replace(/\/?$/, '/')
const ROOT = 'C:/Users/User/Desktop/DermLux/03_Λογιστής/Κοινωνικές_Ασφαλίσεις/'
const bank = JSON.parse(readFileSync(DIR + 'snap_bank.json', 'utf8'))
const ka = []
for (const dir of readdirSync(ROOT)) {
  if (!existsSync(ROOT + dir) || dir.includes('.')) continue
  for (const f of readdirSync(ROOT + dir).filter(f => /^20\d\d-\d\d_data\.json$/.test(f))) {
    const d = JSON.parse(readFileSync(ROOT + dir + '/' + f, 'utf8'))
    ka.push({ dir, month: f.slice(0, 7), amount: Number(d.paid_amount ?? d.amount_paid ?? d.totals?.total), paid_at: d.paid_at, no: d.payment_number, file: `${ROOT}${dir}/${f.slice(0, 7)}_ΒΕΒΑΙΩΣΗ_ΠΛΗΡΩΜΗΣ.pdf` })
  }
}
const OTHER = /^(IEPE|EUGMED)/
const tx = bank.filter(t => t.tag === 'Εισφορές' && t.date >= FROM && t.date <= TO).sort((a, b) => a.date.localeCompare(b.date))
const used = new Set(), out = []
for (const t of tx) {
  const c = ka.filter(k => !used.has(k) && Math.abs(k.amount - Number(t.debit)) < 0.01 && Math.abs((Date.parse(t.date) - Date.parse(k.paid_at)) / 864e5) <= 6)
  if (c.length !== 1) { console.log('⚠', t.date, t.debit, 'υποψήφια', c.length); continue }
  used.add(c[0])
  const k = c[0], other = OTHER.test(k.dir) && !(k.dir.startsWith('IEPE') && t.account === '357046275557')   // Κ.Α. ΙΕΠΕ από λογαριασμό ΙΕΠΕ = δικά της, όχι ενδοεταιρικό
  const doc = `Κ.Α. ${k.dir.replace(/_/g, ' ')} · μήνας ${k.month} · Βεβαίωση πληρωμής αρ. ${k.no} (${k.paid_at.slice(0, 10)})${other ? ' · ⚠ ΑΛΛΗΣ ΕΤΑΙΡΕΙΑΣ — πληρώθηκε από DermLux (ενδοεταιρικό)' : ''}`
  out.push({ t, k, doc, other, pdf: existsSync(k.file) })
  console.log(t.date, String(t.debit).padStart(8), t.matchedExpenseId ? '(ήδη δεμένο σε παραστατικό)' : '', '→', doc, existsSync(k.file) ? '📄' : '— PDF λείπει')
}
writeFileSync(DIR + 'ka_matches.json', JSON.stringify(out.map(o => ({ tx: o.t.id, date: o.t.date, amount: Number(o.t.debit), doc: o.doc, other: o.other, file: o.k.file })), null, 1))
if (EXECUTE) {
  writeFileSync('C:/Users/User/backups/bk_ka_docs_backup_' + Date.now() + '.json', JSON.stringify(out.map(o => ({ id: o.t.id, supportingDoc: o.t.supportingDoc ?? null, matchMethod: o.t.matchMethod ?? null })), null, 1))
  const b = db.batch()
  for (const o of out) b.update(db.collection('bank_transactions').doc(o.t.id), { supportingDoc: o.doc, supportingDocFile: o.k.file, ...(o.t.matchedExpenseId ? {} : { matchMethod: 'bk_KA' }), ...(o.other ? { intercompany: o.k.dir.split('_')[0] } : {}) })
  await b.commit()
  console.log('✅ γράφτηκαν', out.length)
}
process.exit(0)
