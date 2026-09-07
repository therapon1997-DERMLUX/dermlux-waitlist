// Book the Meta (Facebook/Instagram) Ads VAT invoices that are missing from `expenses`.
// Source: transaction lists exported from Meta Business Suite → Billing & payments, one file per ad account.
// Meta charges the card every time the spend threshold is hit, so EACH transaction is its own VAT invoice.
// All are Meta Platforms Ireland reverse-charge: net = total, VAT 0, vatRate 0 (Art. 196, Dir. 2006/112/EC).
// Books only `paid` rows dated 2026-01-01 or later that carry an FBADS-… invoice number.
// Skips any invoiceNumber already present; flags look-alike expenses instead of booking them.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'

const ACCOUNTS = [
  { id: '25821256070891269', label: 'Dermlux', file: 'meta_tx_25821256070891269.txt' },
  { id: '1995592984674331', label: 'Dermlux (2)', file: 'meta_tx_1995592984674331.txt' },
  { id: '302554959050402', label: 'DermLux laser & aesthetics Medical Clinic', file: 'meta_tx_302554959050402.txt' },
  { id: '4335789980020248', label: 'DermLux Injectables', file: 'meta_tx_4335789980020248.txt' },
  { id: '1957438135163513', label: 'Dermlux new', file: 'meta_tx_1957438135163513.txt' },
  { id: '1568104744255933', label: 'dermlux clinics', file: 'meta_tx_1568104744255933.txt' },
]

// Existing expenses whose stored `date` is demonstrably not the period they cover.
// q1_26_r200: 13 line items all dated 27–31/3/2026 summing €401, and its own notes say the report
// title (1/1/2026–4/1/2026) contradicts the transactions. It is March spend stored as 1 April, so it
// must not be allowed to mask April. Owner-confirmed.
const DATE_CORRECTIONS = { q1_26_r200: '2026-03-31' }
// Rows the owner has reviewed and told us not to book (no tax document behind them).
const ROW_NOTES = {
  '27308355368855095-27408167015540598': 'Χωρίς τιμολόγιο ΦΠΑ. Η υπάρχουσα μηνιαία συγκεντρωτική εγγραφή Ιουνίου (€7.363,85) ΔΕΝ το περιλαμβάνει — γι\' αυτό διαφέρει κατά €1,44.',
  '28465135033177124-28415180074839279': 'Χωρίς τιμολόγιο ΦΠΑ. Είδωλο επιστροφής χρημάτων της Meta (€3,29 refunded 28/08/2026, σφάλμα χρέωσης) — πιθανόν χρειάζεται πιστωτικό σημείωμα, όχι δαπάνη.',
}
const FROM = '2026-01-01'
const RUN_AT = new Date().toISOString()
const money = (n) => `€${Number(n).toFixed(2)}`
const eq = (a, b) => Math.abs(Number(a) - Number(b)) < 0.005

// ── parse ────────────────────────────────────────────────────────────────────
const rows = [], malformed = []
for (const acc of ACCOUNTS) {
  const lines = readFileSync(S + acc.file, 'utf8').split(/\r?\n/)
  lines.forEach((raw, i) => {
    if (!raw.trim()) return
    const f = raw.split('|')
    const where = `${acc.file}:${i + 1}`
    if (f.length !== 5) { malformed.push({ where, raw, why: `${f.length} fields, expected 5` }); return }
    const [txId, date, amountStr, state, invRaw] = f.map(x => x.trim())
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) { malformed.push({ where, raw, why: 'bad date' }); return }
    const amount = Number(amountStr)
    if (!Number.isFinite(amount) || amount <= 0 || !/^\d+(\.\d{1,2})?$/.test(amountStr)) { malformed.push({ where, raw, why: 'bad amount' }); return }
    if (state !== 'paid' && state !== 'failed') { malformed.push({ where, raw, why: `unknown state "${state}"` }); return }
    if (!txId) { malformed.push({ where, raw, why: 'empty transaction id' }); return }
    const inv = invRaw
    if (inv && !/^FBADS-\d{3}-\d+$/.test(inv)) { malformed.push({ where, raw, why: `invoice number not FBADS-nnn-nnnnn ("${inv}")` }); return }
    rows.push({ where, account: acc, txId, date, amount, state, inv })
  })
}

// duplicate transaction ids / invoice numbers inside the input itself
const seenTx = new Map(), seenInv = new Map(), inputDupes = []
for (const r of rows) {
  if (seenTx.has(r.txId)) inputDupes.push(`transaction id ${r.txId} appears twice (${seenTx.get(r.txId)} and ${r.where})`)
  else seenTx.set(r.txId, r.where)
  if (r.inv) {
    if (seenInv.has(r.inv)) inputDupes.push(`invoice ${r.inv} appears twice (${seenInv.get(r.inv)} and ${r.where})`)
    else seenInv.set(r.inv, r.where)
  }
}

// ── buckets ──────────────────────────────────────────────────────────────────
const failed = rows.filter(r => r.state === 'failed')
const paid = rows.filter(r => r.state === 'paid')
const preYear = paid.filter(r => r.date < FROM)
const inYear = paid.filter(r => r.date >= FROM)
const noInvoice = inYear.filter(r => !r.inv)
const bookable = inYear.filter(r => r.inv)

// ── existing expenses ────────────────────────────────────────────────────────
const exps = (await db.collection('expenses').get()).docs.map(d => ({ id: d.id, ...d.data() }))
const haveInv = new Set(exps.map(e => String(e.invoiceNumber || '').trim()).filter(Boolean))
const isFbads = (e) => /^FBADS-/.test(String(e.invoiceNumber || '').trim())
// Effective period of an existing doc — see DATE_CORRECTIONS.
const effDate = (e) => DATE_CORRECTIONS[e.id] || String(e.date || '')
// Candidate pool for duplicate hunting. Google Play is excluded on purpose: `expenses/q2_p251` is a
// "Meta Verified Plus (Instagram)" subscription billed through Google Play, not ad spend, and at
// €46,81 it sat within tolerance of a genuine €46,20 month of ad spend. Owner-confirmed exclusion.
const metaish = exps.filter(e => /meta|facebook/i.test(String(e.vendor || '')) && !/google\s*play/i.test(String(e.vendor || '')) && !isFbads(e))

// ── AGGREGATE-COVERAGE DETECTOR ──────────────────────────────────────────────
// The Google import double-booked because a period total had already been entered as ONE line.
// So: for every Meta-looking expense already in the books, test its total against the sum of
// our rows per (ad account × month), (ad account × quarter) and (ad account × whole export).
// A hit means that period is ALREADY in the books as a lump sum — every row in it is a duplicate.
// Tested per ad account (month / quarter / whole export) AND for all accounts combined
// (month / quarter / whole export), so a lump sum spanning several accounts cannot slip through.
const ALL = '*ALL-ACCOUNTS*'
const qtr = (d) => `${d.slice(0, 4)}-Q${Math.floor((Number(d.slice(5, 7)) - 1) / 3) + 1}`
const periodsOf = (r) => [`m:${r.date.slice(0, 7)}`, `q:${qtr(r.date)}`, 'all:']
const scopesOf = (r) => [r.account.id, ALL]
// Summed two ways, because a lump sum may or may not include transactions that got no VAT invoice id:
//   'paid'    = every paid transaction in the period
//   'invoiced'= only the paid transactions that carry an FBADS number
// Tolerance is €1.00, not a cent: a hand-entered lump sum is allowed to be a rounding off.
const TOL = 1.0
const periodSums = new Map() // `${accountId}|${period}` -> { paid, invoiced, rows[] }
const addTo = (k, r, invoiced) => {
  const v = periodSums.get(k) || { paid: 0, invoiced: 0, rows: [], first: r.date, last: r.date }
  v.paid += r.amount; if (invoiced) v.invoiced += r.amount
  if (r.date < v.first) v.first = r.date
  if (r.date > v.last) v.last = r.date
  v.rows.push(r); periodSums.set(k, v)
}
// An amount match alone is not enough — a lump sum must also be DATED like the period it covers.
// Without this, `expenses/q2_25_r069` (Meta, 2025-04-01, €11.397,14) matched the all-accounts
// May-2026 sum of €11.397,82 within tolerance and wrongly suppressed €1.289,14 of real spend.
// An aggregate is normally dated inside its period or shortly after it closes; 45 days is generous.
const GRACE_DAYS = 45
const datePlausible = (e, v) => {
  const d = effDate(e)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d < v.first) return false
  const limit = new Date(v.last + 'T00:00:00Z'); limit.setUTCDate(limit.getUTCDate() + GRACE_DAYS)
  return d <= limit.toISOString().slice(0, 10)
}
for (const r of inYear) for (const s of scopesOf(r)) for (const p of periodsOf(r)) addTo(`${s}|${p}`, r, !!r.inv)

const coverage = new Map() // `${scope}|${period}` -> existing expense doc that already carries it
const aggregateHits = []
for (const e of metaish) {
  for (const [k, v] of periodSums) {
    const variant = Math.abs(e.total - v.paid) <= TOL ? 'all paid transactions'
      : Math.abs(e.total - v.invoiced) <= TOL ? 'only the transactions with an FBADS invoice id' : null
    if (!variant) continue
    if (!datePlausible(e, v)) continue
    const basis = variant.startsWith('all') ? v.paid : v.invoiced
    if (!coverage.has(k)) coverage.set(k, e)
    aggregateHits.push({
      key: k, scope: k.split('|')[0], period: k.split('|')[1], basis: variant,
      sum: Number(basis.toFixed(2)), delta: Number((e.total - basis).toFixed(2)), rowCount: v.rows.length,
      rowSpan: `${v.first}…${v.last}`, existingDate: effDate(e),
      existing: { id: e.id, vendor: e.vendor || '—', date: e.date || '—', total: e.total, invoiceNumber: String(e.invoiceNumber || '').trim() || null, source: e.source || '—' },
    })
  }
}
const coveredBy = (r) => {
  for (const s of scopesOf(r)) for (const p of periodsOf(r)) {
    const e = coverage.get(`${s}|${p}`)
    if (e) return { scope: s, period: p, e }
  }
  return null
}
// Is an existing expense attributable to one specific ad account? (rule (c), relaxed)
const mentionsAccount = (e, accountId) => new RegExp(`(^|\\D)${accountId}(\\D|$)`).test(
  [e.invoiceNumber, e.notes, e.vendor, ...(Array.isArray(e.lineItems) ? e.lineItems.map(l => l && l.description) : [])].filter(Boolean).join(' '))

const plan = [], alreadyBooked = [], suspects = []
for (const r of bookable) {
  if (haveInv.has(r.inv)) { alreadyBooked.push(r); continue }
  const hits = []
  // (a) STRONG: this account+period (or all accounts combined) is already booked as one lump sum
  const cov = coveredBy(r)
  if (cov) hits.push({ id: cov.e.id, why: `STRONG — ${cov.scope === ALL ? 'all accounts combined' : 'ad account ' + cov.scope} period ${cov.period} already booked as one lump sum of €${Number(cov.e.total).toFixed(2)}`, vendor: cov.e.vendor || '—', date: cov.e.date || '—', total: cov.e.total, invoiceNumber: String(cov.e.invoiceNumber || '').trim() || null })
  // (b) same date + same total anywhere in the books
  for (const e of exps) {
    if (isFbads(e)) continue
    if (effDate(e) === r.date && eq(e.total, r.amount) && !hits.some(h => h.id === e.id))
      hits.push({ id: e.id, why: 'WEAK — same date + same total', vendor: e.vendor || '—', date: effDate(e), total: e.total, invoiceNumber: String(e.invoiceNumber || '').trim() || null })
  }
  // (c) a Meta/Facebook expense in the same month — ONLY if it is attributable to THIS ad account.
  //     (The blunt "any Meta vendor in the same month" test suppressed genuine spend belonging to
  //      other ad accounts, so it now requires the ad account id to appear on the existing doc.)
  for (const e of metaish) {
    if (effDate(e).slice(0, 7) === r.date.slice(0, 7) && mentionsAccount(e, r.account.id) && !hits.some(h => h.id === e.id))
      hits.push({ id: e.id, why: `WEAK — Meta expense in the same month naming ad account ${r.account.id}`, vendor: e.vendor || '—', date: effDate(e), total: e.total, invoiceNumber: String(e.invoiceNumber || '').trim() || null })
  }
  if (hits.length) { suspects.push({ row: r, hits, strong: !!cov }); continue }

  const total = r.amount
  plan.push({
    docId: `meta_tx_${r.inv}`,
    doc: {
      vendor: 'Meta Platforms Ireland Limited',
      vatNumber: 'IE9692928F',
      invoiceNumber: r.inv,
      date: r.date,
      net: total, vat: 0, vatRate: 0, total, currency: 'EUR',
      category: '8203 · ΔΙΑΦΗΜΙΣΕΙΣ',
      location: 'Γενικά',
      paymentMethod: 'Κάρτα',
      status: 'confirmed',
      source: 'meta_billing_import_2026_09',
      createdAt: RUN_AT,
      createdBy: 'claude-meta-import',
      lineItems: [{ description: `Meta Ads — ${r.account.id} — ${r.date}`, quantity: 1, amount: total }],
      notes: `Από το Meta Business Suite (Billing & payments) — διαφημιστικός λογαριασμός ${r.account.id} (${r.account.label}). `
        + `Αναγνωριστικό συναλλαγής: ${r.txId}. `
        + `ΑΝΤΙΣΤΡΟΦΗ ΧΡΕΩΣΗ (reverse charge, 0% ΦΠΑ, Άρθρο 196 Οδηγίας 2006/112/ΕΚ) — απαιτεί αυτοεκκαθάριση ΦΠΑ στη δήλωση. `
        + `Η Meta χρεώνει την κάρτα κάθε φορά που η δαπάνη φτάνει το όριο χρέωσης, άρα κάθε συναλλαγή αποτελεί ξεχωριστό τιμολόγιο ΦΠΑ.`,
    },
  })
}

// ── report ───────────────────────────────────────────────────────────────────
const group = (list, keyFn) => list.reduce((m, r) => { const k = keyFn(r); (m[k] ||= []).push(r); return m }, {})
const sum = (list, f = r => r.amount) => list.reduce((s, r) => s + f(r), 0)

console.log(`\n${EXECUTE ? 'EXECUTE' : 'DRY RUN'} — Meta Ads invoice booking`)
console.log(`parsed ${rows.length} rows | malformed ${malformed.length} | paid ${paid.length} | failed ${failed.length}`)

console.log(`\n=== WOULD BOOK: ${plan.length} records, ${money(sum(plan, p => p.doc.total))} ===`)
for (const acc of ACCOUNTS) {
  const mine = plan.filter(p => p.doc.lineItems[0].description.includes(acc.id))
  if (!mine.length) continue
  console.log(`\n  ad account ${acc.id} — ${acc.label}: ${mine.length} invoices, ${money(sum(mine, p => p.doc.total))}`)
  const byMonth = group(mine, p => p.doc.date.slice(0, 7))
  for (const m of Object.keys(byMonth).sort())
    console.log(`     ${m}   ${String(byMonth[m].length).padStart(3)} inv   ${money(sum(byMonth[m], p => p.doc.total)).padStart(11)}`)
}
const byMonthAll = group(plan, p => p.doc.date.slice(0, 7))
console.log(`\n  ALL ACCOUNTS BY MONTH`)
for (const m of Object.keys(byMonthAll).sort())
  console.log(`     ${m}   ${String(byMonthAll[m].length).padStart(3)} inv   ${money(sum(byMonthAll[m], p => p.doc.total)).padStart(11)}`)
console.log(`  GRAND TOTAL: ${money(sum(plan, p => p.doc.total))}`)

console.log(`\n=== EXCLUDED — failed card attempts (never real expenses): ${failed.length}, ${money(sum(failed))} ===`)
for (const r of failed) console.log(`   ${r.date}  ${money(r.amount).padStart(10)}  acct ${r.account.id}  tx ${r.txId}`)

console.log(`\n=== EXCLUDED — paid but before ${FROM}: ${preYear.length}, ${money(sum(preYear))} ===`)
for (const r of preYear) console.log(`   ${r.date}  ${money(r.amount).padStart(10)}  ${r.inv || '(no invoice number)'}  acct ${r.account.id}`)

console.log(`\n=== PAID BUT NO VAT INVOICE ID — never booked, needs my review: ${noInvoice.length}, ${money(sum(noInvoice))} ===`)
for (const r of noInvoice) {
  console.log(`   ${r.date}  ${money(r.amount).padStart(10)}  acct ${r.account.id} (${r.account.label})  tx ${r.txId}`)
  if (ROW_NOTES[r.txId]) console.log(`        note: ${ROW_NOTES[r.txId]}`)
}

console.log(`\n=== ALREADY IN THE BOOKS (invoiceNumber match, skipped): ${alreadyBooked.length}, ${money(sum(alreadyBooked))} ===`)
for (const r of alreadyBooked) console.log(`   ${r.date}  ${money(r.amount).padStart(10)}  ${r.inv}`)

console.log(`\n=== ALREADY BOOKED AS A LUMP SUM — aggregate-coverage hits (tolerance €${TOL.toFixed(2)}): ${aggregateHits.length} ===`)
for (const a of aggregateHits)
  console.log(`   scope ${(a.scope === ALL ? 'ALL ACCOUNTS' : a.scope).padEnd(19)} ${a.period.padEnd(11)}  ${a.rowCount} rows, ${a.basis}`
    + `\n      arithmetic: our ${money(a.sum)}  vs  booked ${money(a.existing.total)}   Δ ${money(a.delta)}   (our rows ${a.rowSpan}, aggregate dated ${a.existingDate})`
    + `\n      ↔ expenses/${a.existing.id}  "${a.existing.vendor}"  ${a.existing.date}  inv=${a.existing.invoiceNumber || '—'}  src=${a.existing.source}`)

const strong = suspects.filter(s => s.strong), weak = suspects.filter(s => !s.strong)
console.log(`\n=== POSSIBLE DUPLICATE — needs my review: ${suspects.length}, ${money(sum(suspects, s => s.row.amount))} ===`)
console.log(`  STRONG (period already booked as a lump sum): ${strong.length}, ${money(sum(strong, s => s.row.amount))}`)
for (const [k, v] of Object.entries(group(strong, s => `${s.row.account.id} ${s.row.date.slice(0, 7)}`)).sort())
  console.log(`     acct+month ${k}   ${String(v.length).padStart(3)} inv   ${money(sum(v, s => s.row.amount)).padStart(11)}   ↔ ${v[0].hits[0].invoiceNumber || 'expenses/' + v[0].hits[0].id}`)
console.log(`  WEAK (only a same-month / same-date coincidence): ${weak.length}, ${money(sum(weak, s => s.row.amount))}`)
for (const [k, v] of Object.entries(group(weak, s => `${s.row.account.id} ${s.row.date.slice(0, 7)}`)).sort())
  console.log(`     acct+month ${k}   ${String(v.length).padStart(3)} inv   ${money(sum(v, s => s.row.amount)).padStart(11)}   flagged against: ${[...new Set(v.flatMap(s => s.hits.map(h => h.vendor + ' ' + money(h.total))))].join(' | ')}`)
console.log(`  (full row-by-row detail with every matched doc id is in the JSON)`)

console.log(`\n=== THE SEAM — every ad account × month: booked per transaction vs suppressed as already-aggregated ===`)
for (const acc of ACCOUNTS) {
  const mine = inYear.filter(r => r.account.id === acc.id)
  if (!mine.length) continue
  console.log(`   acct ${acc.id} — ${acc.label}: ${mine.length} paid tx, ${money(sum(mine))}`)
  const bm = group(mine, r => r.date.slice(0, 7))
  for (const m of Object.keys(bm).sort()) {
    const inPlan = plan.filter(p => p.doc.date.slice(0, 7) === m && p.doc.lineItems[0].description.includes(acc.id))
    const sup = suspects.filter(s => s.row.account.id === acc.id && s.row.date.slice(0, 7) === m)
    const cov = coveredBy({ account: acc, date: m + '-01' })
    const verdict = inPlan.length ? `BOOK ${inPlan.length} tx ${money(sum(inPlan, p => p.doc.total))}`
      : cov ? `SUPPRESSED — already booked as ${cov.scope === ALL ? 'a combined' : 'a monthly/period'} aggregate via expenses/${cov.e.id} (${cov.e.invoiceNumber || 'no invoice number'})`
        : sup.length ? `SUPPRESSED — weak flag only, ${sup.length} tx` : 'nothing bookable (no FBADS id)'
    console.log(`      ${m}   ${String(bm[m].length).padStart(3)} tx   ${money(sum(bm[m])).padStart(11)}   ${verdict}`)
  }
}
const metaBooked2026 = metaish.filter(e => String(e.date || '') >= '2026-01-01')
console.log(`\n=== Meta-looking expenses already in the books for 2026 (${metaBooked2026.length}) ===`)
for (const e of metaBooked2026.sort((a, b) => String(a.date).localeCompare(String(b.date))))
  console.log(`   ${String(e.date).padEnd(11)} ${money(e.total).padStart(12)}  "${e.vendor}"  inv=${String(e.invoiceNumber || '—')}  src=${e.source || '—'}  id=${e.id}`)

if (malformed.length) {
  console.log(`\n=== MALFORMED INPUT LINES: ${malformed.length} ===`)
  for (const m of malformed) console.log(`   ${m.where}  ${m.why}  ::  ${m.raw}`)
}
if (inputDupes.length) {
  console.log(`\n=== DUPLICATES INSIDE THE INPUT FILES: ${inputDupes.length} ===`)
  for (const d of inputDupes) console.log(`   ${d}`)
}

const out = 'C:/Users/User/backups/meta_invoice_booking_2026-09-01.json'
writeFileSync(out, JSON.stringify({
  generatedAt: new Date().toISOString(),
  mode: EXECUTE ? 'execute' : 'dry-run',
  bookFrom: FROM,
  accounts: ACCOUNTS,
  dateCorrections: DATE_CORRECTIONS,
  totals: {
    parsed: rows.length, malformed: malformed.length,
    wouldBook: plan.length, wouldBookTotal: Number(sum(plan, p => p.doc.total).toFixed(2)),
    failedExcluded: failed.length, failedTotal: Number(sum(failed).toFixed(2)),
    preYearExcluded: preYear.length, preYearTotal: Number(sum(preYear).toFixed(2)),
    paidNoInvoiceId: noInvoice.length, alreadyBooked: alreadyBooked.length,
    possibleDuplicates: suspects.length,
    possibleDuplicatesStrong: suspects.filter(s => s.strong).length,
    possibleDuplicatesTotal: Number(sum(suspects, s => s.row.amount).toFixed(2)),
  },
  aggregateHits,
  plan,
  excluded: {
    failed: failed.map(r => ({ date: r.date, amount: r.amount, txId: r.txId, account: r.account.id })),
    preYear: preYear.map(r => ({ date: r.date, amount: r.amount, invoiceNumber: r.inv || null, txId: r.txId, account: r.account.id })),
    paidNoInvoiceId: noInvoice.map(r => ({ date: r.date, amount: r.amount, txId: r.txId, account: r.account.id, note: ROW_NOTES[r.txId] || null })),
    alreadyBooked: alreadyBooked.map(r => ({ date: r.date, amount: r.amount, invoiceNumber: r.inv })),
    possibleDuplicates: suspects.map(s => ({ strong: s.strong, metaRow: { date: s.row.date, amount: s.row.amount, invoiceNumber: s.row.inv, txId: s.row.txId, account: s.row.account.id }, existing: s.hits })),
    metaAlreadyInBooks2026: metaBooked2026.map(e => ({ id: e.id, date: e.date, total: e.total, vendor: e.vendor, invoiceNumber: e.invoiceNumber || null, source: e.source || null })),
  },
  malformed, inputDupes,
}, null, 1), 'utf8')
console.log(`\npreview → ${out}`)

if (EXECUTE) {
  for (let i = 0; i < plan.length; i += 400) {
    const chunk = plan.slice(i, i + 400)
    const b = db.batch()
    for (const p of chunk) b.create(db.collection('expenses').doc(p.docId), p.doc)
    await b.commit()
    console.log(`  committed ${i + chunk.length}/${plan.length}`)
  }
  console.log('DONE — created', plan.length)
} else {
  console.log('DRY RUN — nothing written to Firestore. Re-run with --execute to book.')
}
process.exit(0)
