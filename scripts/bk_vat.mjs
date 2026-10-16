// Σύνοψη ΦΠΑ εισροών περιόδου για τον λογιστή. READ-ONLY (τοπικό αντίγραφο bk_snapshot.mjs).
// Χρήση: node scripts/bk_vat.mjs --from=YYYY-MM-DD --to=YYYY-MM-DD --dir=<φάκελος περιόδου>  → <dir>/vat_summary.json (η αναφορά το δείχνει)
// Κανόνες (Θεράπων/λογιστής): ημερομηνία ΤΙΜΟΛΟΓΙΟΥ ορίζει την περίοδο · αντίστροφη χρέωση (Meta/Google IE, ξένες υπηρεσίες) = αυτοεκκαθάριση
// 19% και στις εκροές και στις εισροές · εστίαση/διασκέδαση = ΦΠΑ μη εκπιπτόμενος · statements/deposit slips/superseded/πιστωτικά-αντίγραφα εκτός.
import { readFileSync, writeFileSync } from 'fs'
const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=').slice(1).join('=')
const FROM = arg('from', '2026-07-01'), TO = arg('to', '2026-09-30')
const DIR = arg('dir', 'C:/Users/User/bookkeeping-q3-26').replace(/\/?$/, '/')
const n = v => Math.round(Number(v || 0) * 100) / 100
const exps = JSON.parse(readFileSync(DIR + 'snap_exp.json', 'utf8'))
  .filter(e => String(e.date) >= FROM && String(e.date) <= TO && !['statement', 'deposit_slip', 'superseded', 'refund_proof'].includes(e.docType) && e.status !== 'superseded' && !e.kaMonth && n(e.total) !== 0)   // Κ.Α. (kaMonth) = εκτός ΦΠΑ
const RC = /ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ|reverse charge/i
const RC_VENDOR = /Meta Platforms|Google Ireland|Anthropic|OpenAI|Voiso|Resend|Eleven ?Labs|TikTok|Expensify|IONOS|Monday\.com|Alibaba|EIMEC/i
const ENT = /SMOCLOCK|Foodhaus|Wolt|ψησταρ|ταβέρν|εστιατ|restaurant|cafe|caf[eé]|coffee|Starbucks|Costa|Zorbas|ZORPIAS|φούρν|bakery|souvl|σουβλ|pizza|sushi|bar\b|Cito Gourmet|CANEO/i
const rateOf = e => { let r = Number(e.vatRate); if (r > 0 && r < 1) r *= 100; return Math.round(r) }
const byRate = {}, rc = [], ent = [], unknown = []
for (const e of exps) {
  const isRC = RC.test(e.notes || '') || (RC_VENDOR.test(e.vendor || '') && n(e.vat) === 0)
  if (isRC) { rc.push(e); continue }
  if (e.vatDeductible === false || ENT.test(`${e.vendor} ${e.category}`)) { ent.push(e); continue }   // vatDeductible:false = τιμολόγιο σε φυσικό πρόσωπο κ.λπ.
  const r = rateOf(e)
  if (!(r >= 0) || (n(e.vat) > 0 && r === 0)) { unknown.push(e); continue }
  const b = (byRate[r] ||= { n: 0, net: 0, vat: 0, total: 0 }); b.n++; b.net += n(e.net); b.vat += n(e.vat); b.total += n(e.total)
}
const sum = (L, k) => n(L.reduce((s, e) => s + n(e[k]), 0))
const out = {
  period: { from: FROM, to: TO },
  input_vat_by_rate: Object.fromEntries(Object.entries(byRate).map(([r, b]) => [r + '%', { invoices: b.n, net: n(b.net), vat: n(b.vat), total: n(b.total) }])),
  input_vat_deductible: n(Object.values(byRate).reduce((s, b) => s + b.vat, 0)),
  reverse_charge: { invoices: rc.length, net: sum(rc, 'net') || sum(rc, 'total'), self_assessed_vat_19: n((sum(rc, 'net') || sum(rc, 'total')) * 0.19), note: 'Δηλώνεται και ως εκροή και ως εισροή (καθαρό αποτέλεσμα 0) — ο λογιστής το περνά στις θέσεις αντίστροφης χρέωσης.' },
  non_deductible_entertainment: { invoices: ent.length, vat: sum(ent, 'vat'), total: sum(ent, 'total'), list: ent.map(e => `${e.date} ${e.vendor} €${n(e.total)}`) },
  needs_check: unknown.map(e => ({ date: e.date, vendor: e.vendor, inv: e.invoiceNumber, net: n(e.net), vat: n(e.vat), rate: e.vatRate, total: n(e.total) })),
}
writeFileSync(DIR + 'vat_summary.json', JSON.stringify(out, null, 1))
console.log('ΦΠΑ εισροών ανά συντελεστή:', out.input_vat_by_rate)
console.log('εκπιπτόμενος ΦΠΑ εισροών: €' + out.input_vat_deductible, '· αντίστροφη χρέωση: καθαρό €' + out.reverse_charge.net, '→ ΦΠΑ 19% €' + out.reverse_charge.self_assessed_vat_19, '· εστίαση (μη εκπιπτ.): ' + ent.length + ' €' + out.non_deductible_entertainment.vat, '· για έλεγχο:', unknown.length)
