// Book the 11 receipts uploaded on 01/09/2026, read in full detail by two agents and
// verified by me against the existing collection.
//
// Design decisions, deliberate:
//  * The upload already created an EMPTY placeholder doc per file (with the fileUrl).
//    So we FILL those placeholders rather than creating new docs — no orphans, the file
//    stays attached to the record it belongs to.
//  * Where the invoice is ALREADY booked from an earlier upload (same invoice number,
//    same amounts to the cent), we do NOT create a second entry. Instead we enrich the
//    existing record (correct invoice number, correct document date, full line items,
//    attach this file) and mark the placeholder `docType: 'superseded'`.
//    Nothing is ever deleted — same convention used for the Google duplicates.
//  * Vendor arithmetic is booked AS PRINTED in the invoice summary box. Two IMPOPHAR
//    invoices have line detail that does not add up to their own summary (JULY_1 short by
//    EUR 1.80, AUGUST_5 short by EUR 25.20). The summary box is internally consistent
//    (net x 0.19 = VAT, net + VAT = total), so the summary is what goes in the books and
//    the delta is a question for the supplier. Nothing was adjusted to make it tie.
// Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')
const S = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/'

const imp = JSON.parse(readFileSync(S + 'receipts_new_impophar.json', 'utf8'))
const pho = JSON.parse(readFileSync(S + 'receipts_new_photos.json', 'utf8'))
const impRows = Array.isArray(imp) ? imp : (imp.invoices || imp.results || [])
const phoRows = Array.isArray(pho) ? pho : (pho.receipts || pho.results || [])
console.log(`read ${impRows.length} IMPOPHAR + ${phoRows.length} photo records`)

// Verified by me directly against Firestore: invoice number + amounts match to the cent.
const ALREADY = {
  '-10CRI2601513': { doc: 'Qh2pcGbAZJLBZlgPMY4m', storedNumber: '10CR12601513', storedDate: '2017-11-19', realDate: '2026-07-15' },
  '-10CRI2601765': { doc: 'AmgP2BzNgrCvGV65RxPC', storedNumber: 'CRI2601765',   storedDate: '2026-08-29', realDate: '2026-08-27' },
  '-11CRI2600130': { doc: 'XGjvatkRRGO9KfSwTVr6', storedNumber: '-11CRI2600130', storedDate: '2026-08-05', realDate: '2026-08-04' },
  'SCR180265':     { doc: 'qXRsRFKvc2pvLtY2oCFZ', storedNumber: 'SCR180265',    storedDate: '2026-08-31', realDate: '2026-08-25' },
}

const LOCMAP = { Paphos: 'Πάφος', Nicosia: 'Λευκωσία', Larnaca: 'Λάρνακα', Limassol: 'Λεμεσός' }
const norm = (v) => (v === undefined ? null : v)
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v))

const plan = { fill: [], enrich: [], supersede: [], skipped: [] }

const build = (r, kind) => {
  const inv = String(r.invoiceNumber || '').trim()
  const loc = r.location || r.suggestedLocation || null
  return {
    vendor: r.vendor,
    vatNumber: norm(r.vendorVat),
    invoiceNumber: inv || null,
    date: r.date,
    net: num(r.net), vat: num(r.vat), vatRate: num(r.vatRate), total: num(r.total),
    currency: r.currency || 'EUR',
    category: r.suggestedCategory || '6201 · ΑΓΟΡΕΣ',
    location: LOCMAP[loc] || loc || 'Γενικά',
    paymentMethod: r.paymentMethod || (/credit/i.test(String(r.paymentTerms || '')) ? 'Επί πιστώσει' : null),
    lineItems: (r.lineItems || []).map((li) => ({
      description: li.description,
      quantity: num(li.quantity),
      unitPrice: num(li.unitPrice),
      amount: num(li.lineValue ?? li.amount),
      itemCode: norm(li.itemCode),
    })),
    status: 'confirmed',
    source: 'claude_read_2026_09_01',
    docRead: 'claude_vision_or_textlayer',
    notes: [
      `Διαβάστηκε 01/09/2026 από το ${kind === 'pdf' ? 'text layer του PDF (χωρίς OCR)' : 'φωτογραφία με vision'}.`,
      r.paymentTerms ? `Όροι: ${r.paymentTerms}.` : '',
      r.comment ? `COMMENT στο έγγραφο: "${r.comment}".` : '',
      r.accountCode ? `Κωδ. λογαριασμού ${r.accountCode}.` : '',
      r.shop ? `Κατάστημα προμηθευτή: ${r.shop}.` : '',
      r.arithmeticNote || r.anomaly || '',
    ].filter(Boolean).join(' '),
  }
}

for (const [rows, kind] of [[impRows, 'pdf'], [phoRows, 'photo']]) {
  for (const r of rows) {
    const inv = String(r.invoiceNumber || '').trim()
    const hit = ALREADY[inv]
    if (hit) {
      plan.enrich.push({ existingDoc: hit.doc, inv, from: hit, data: build(r, kind), placeholder: r.docId, file: r.fileName })
      plan.supersede.push({ placeholder: r.docId, inv, pointsTo: hit.doc, file: r.fileName })
    } else if (!inv || !(Number(r.total) > 0)) {
      plan.skipped.push({ docId: r.docId, file: r.fileName, why: 'no invoice number or no total' })
    } else {
      plan.fill.push({ docId: r.docId, file: r.fileName, data: build(r, kind) })
    }
  }
}

const sum = (a) => a.reduce((s, x) => s + Number(x.data?.total || 0), 0)
console.log(`\nFILL placeholders (new invoices)   : ${plan.fill.length}   €${sum(plan.fill).toFixed(2)}`)
for (const f of plan.fill) {
  console.log(`   ${f.data.date}  ${String(f.data.invoiceNumber).padEnd(16)} €${String(f.data.total).padStart(9)}  ` +
              `${String(f.data.vendor).slice(0, 30).padEnd(30)} ${String(f.data.location).padEnd(9)} items=${f.data.lineItems.length}  ${f.file}`)
}
console.log(`\nENRICH already-booked records      : ${plan.enrich.length}`)
for (const e of plan.enrich) {
  console.log(`   ${e.existingDoc}  inv "${e.from.storedNumber}" -> "${e.inv}"   date ${e.from.storedDate} -> ${e.from.realDate}   ` +
              `+${e.data.lineItems.length} line items   (from ${e.file})`)
}
console.log(`\nSUPERSEDE placeholders (duplicates): ${plan.supersede.length}`)
for (const s of plan.supersede) console.log(`   ${s.placeholder}  ${s.file}  -> ${s.pointsTo}`)
if (plan.skipped.length) {
  console.log(`\nSKIPPED: ${plan.skipped.length}`)
  for (const s of plan.skipped) console.log(`   ${s.docId} ${s.file} — ${s.why}`)
}

writeFileSync('C:/Users/User/backups/new_receipts_booking_2026-09-01.json', JSON.stringify(plan, null, 1), 'utf8')
console.log('\nplan -> C:/Users/User/backups/new_receipts_booking_2026-09-01.json')

if (!EXECUTE) { console.log('\nDRY RUN — nothing written.'); process.exit(0) }

const b = db.batch()
for (const f of plan.fill) {
  b.update(db.collection('expenses').doc(f.docId), f.data)
}
for (const e of plan.enrich) {
  b.update(db.collection('expenses').doc(e.existingDoc), {
    invoiceNumber: e.inv,
    date: e.from.realDate,
    lineItems: e.data.lineItems,
    net: e.data.net, vat: e.data.vat, vatRate: e.data.vatRate, total: e.data.total,
    vatNumber: e.data.vatNumber,
    status: 'confirmed',
    correctedAt: new Date().toISOString(),
    correctedBy: 'claude_read_2026_09_01',
    notes: `${e.data.notes} ΔΙΟΡΘΩΣΗ 01/09/2026: ο αριθμός ήταν "${e.from.storedNumber}" (λάθος ανάγνωση) και η ημερομηνία ${e.from.storedDate}; ` +
      `το πρωτότυπο έγγραφο λέει ${e.inv} / ${e.from.realDate}. Προστέθηκαν και οι ${e.data.lineItems.length} γραμμές ειδών.`,
  })
}
for (const s of plan.supersede) {
  b.update(db.collection('expenses').doc(s.placeholder), {
    docType: 'superseded',
    status: 'superseded',
    supersededBy: s.pointsTo,
    notes: `Διπλότυπο. Το τιμολόγιο ${s.inv} είναι ήδη καταχωρημένο στο ${s.pointsTo} — εκείνο διορθώθηκε και εμπλουτίστηκε. ` +
      `Αυτή η εγγραφή κρατιέται μόνο για το αρχείο (${s.file}) και ΔΕΝ μετράει στα έξοδα.`,
    total: 0, net: 0, vat: 0,
  })
}
await b.commit()
console.log(`\nDONE — filled ${plan.fill.length}, enriched ${plan.enrich.length}, superseded ${plan.supersede.length}`)
process.exit(0)
