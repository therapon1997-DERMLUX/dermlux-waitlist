// Owner rule, 01/09/2026: "παντα να επιλέγεις το pdf οταν υπάρχει καθως ειναι
// καλύτερης ποιότητας". Apply it in two places.
//
// A) The 3 records enriched earlier today survived as the older PHOTO record while the
//    data came from today's PDF. Move the PDF file onto the survivor so the record that
//    stays in the books carries the better document.
// B) Three invoices are double-booked (same invoice uploaded twice, once as a photo and
//    once as a PDF). Keep the PDF record, correct its date from the document itself
//    (both PDFs carried the UPLOAD date, not the invoice date), and supersede the photo.
//    For the Karpasia pair there is no PDF — both are photos — so the tie-break is the
//    record that is matched to a real bank debit, which also has the date that the
//    handwritten invoice actually shows (20/7/26).
// Nothing is deleted. Superseded rows keep their file and are zeroed so they cannot
// affect any total. Dry run unless --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXECUTE = process.argv.includes('--execute')

// A ── move today's PDF onto the surviving record
const SWAP = [
  { survivor: 'Qh2pcGbAZJLBZlgPMY4m', pdfFrom: 'ovsmFeUplbTgDCuFN3b0', inv: '-10CRI2601513' },
  { survivor: 'AmgP2BzNgrCvGV65RxPC', pdfFrom: '6rHHlUUVBXaG1RZu965t', inv: '-10CRI2601765' },
  { survivor: 'XGjvatkRRGO9KfSwTVr6', pdfFrom: 'sGRBbMZ37ixNjnkiGtvm', inv: '-11CRI2600130' },
]

// B ── resolve the pre-existing double bookings
const PAIRS = [
  { inv: 'SI01079672', keep: 'lQBKe3uzrqcvZDsUfOWh', drop: 'Bq3EsTL0kZmAKvZolnMn',
    fixDate: '2026-08-28', why: 'PDF 8_Invoice_SI01079672.pdf; Document Date on the PDF is 28/08/2026, the record held the upload date 31/08' },
  { inv: 'SI01079603', keep: 'mohXJ5Ljp53hATyqIfwK', drop: 'Gv6mCfLFytMgpEqxj4rY',
    fixDate: '2026-08-25', why: 'PDF 6_Invoice_SI01079603.pdf; Document Date on the PDF is 25/08/2026, the record held the upload date 31/08' },
  { inv: '0453394', keep: 'sVRGVUjl1n9XiXdxkXI6', drop: 'KNlHPlB4K7coVD8JOUoT',
    fixDate: null, why: 'both copies are photos, no PDF exists. Kept the one matched to a Bank of Cyprus debit; I read the handwritten invoice and its date is 20/7/26, which that record already holds. The dropped copy was dated 2017-06-20 — a year/month typo' },
]

const get = async (id) => {
  const s = await db.collection('expenses').doc(id).get()
  return s.exists ? { id, ...s.data() } : null
}

const report = { swap: [], pairs: [], problems: [] }
let released = 0

for (const s of SWAP) {
  const surv = await get(s.survivor), src = await get(s.pdfFrom)
  if (!surv || !src) { report.problems.push(`missing doc for swap ${s.inv}`); continue }
  if (!src.fileUrl) { report.problems.push(`no fileUrl on ${s.pdfFrom}`); continue }
  const isPdf = /\.pdf$/i.test(String(src.fileName || ''))
  if (!isPdf) { report.problems.push(`${s.pdfFrom} is not a PDF (${src.fileName}) — skipping`); continue }
  report.swap.push({ inv: s.inv, survivor: s.survivor,
    was: surv.fileName, becomes: src.fileName, keptAsSecondary: surv.fileName })
}

for (const p of PAIRS) {
  const keep = await get(p.keep), drop = await get(p.drop)
  if (!keep || !drop) { report.problems.push(`missing doc for pair ${p.inv}`); continue }
  if (String(keep.invoiceNumber || '').replace(/\D/g, '') !== String(drop.invoiceNumber || '').replace(/\D/g, '')) {
    report.problems.push(`${p.inv}: invoice digits differ (${keep.invoiceNumber} vs ${drop.invoiceNumber}) — NOT touching`)
    continue
  }
  if (Math.abs(Number(keep.total) - Number(drop.total)) > 0.011) {
    report.problems.push(`${p.inv}: totals differ (${keep.total} vs ${drop.total}) — NOT touching`)
    continue
  }
  if (drop.bankTagBank && !keep.bankTagBank) {
    report.problems.push(`${p.inv}: the copy I would DROP is the bank-matched one — NOT touching`)
    continue
  }
  released += Number(drop.total || 0)
  report.pairs.push({ inv: p.inv, keep: p.keep, keepFile: keep.fileName, keepDate: keep.date,
    newDate: p.fixDate || keep.date, drop: p.drop, dropFile: drop.fileName, dropDate: drop.date,
    total: Number(drop.total || 0), bankTag: keep.bankTagBank || null, why: p.why })
}

console.log(`\nA) move the PDF onto the surviving record: ${report.swap.length}`)
for (const s of report.swap) console.log(`   ${s.inv}  ${s.survivor}  file ${s.was} -> ${s.becomes}`)
console.log(`\nB) resolve double bookings: ${report.pairs.length}`)
for (const p of report.pairs) {
  console.log(`   ${p.inv}  KEEP ${p.keep} (${p.keepFile}${p.bankTag ? ', bank-matched' : ''})  date ${p.keepDate} -> ${p.newDate}`)
  console.log(`             DROP ${p.drop} (${p.dropFile}, dated ${p.dropDate})  €${p.total.toFixed(2)}`)
  console.log(`             why: ${p.why}`)
}
console.log(`\nexpenses released by removing the duplicates: €${released.toFixed(2)}`)
if (report.problems.length) {
  console.log(`\n⚠️  SAFETY STOPS (${report.problems.length}) — these were left alone:`)
  for (const x of report.problems) console.log(`   ${x}`)
}

writeFileSync('C:/Users/User/backups/pdf_preference_2026-09-01.json', JSON.stringify(report, null, 1), 'utf8')
console.log('\nplan -> C:/Users/User/backups/pdf_preference_2026-09-01.json')
if (!EXECUTE) { console.log('\nDRY RUN — nothing written.'); process.exit(0) }

const b = db.batch()
for (const s of SWAP) {
  const hit = report.swap.find((x) => x.survivor === s.survivor)
  if (!hit) continue
  const src = await get(s.pdfFrom)
  b.update(db.collection('expenses').doc(s.survivor), {
    fileUrl: src.fileUrl, fileName: src.fileName,
    secondaryFileName: hit.keptAsSecondary || null,
    fileNote: `Κανόνας ιδιοκτήτη 01/09/2026: όταν υπάρχει PDF, κρατάμε το PDF. Το αρχείο άλλαξε από ` +
              `"${hit.keptAsSecondary}" (φωτογραφία) σε "${src.fileName}" (PDF, καλύτερης ποιότητας).`,
  })
}
for (const p of report.pairs) {
  if (p.newDate !== p.keepDate) {
    b.update(db.collection('expenses').doc(p.keep), {
      date: p.newDate,
      notes: `ΔΙΟΡΘΩΣΗ 01/09/2026: η ημερομηνία ήταν ${p.keepDate} (ημερομηνία μεταφόρτωσης). ` +
             `Το ίδιο το έγγραφο λέει ${p.newDate}.`,
    })
  }
  b.update(db.collection('expenses').doc(p.drop), {
    docType: 'superseded', status: 'superseded', supersededBy: p.keep,
    total: 0, net: 0, vat: 0,
    notes: `Διπλότυπο του ${p.inv}. Κρατήθηκε η εγγραφή ${p.keep} (${p.keepFile}). ${p.why}. ` +
           `Αυτή η εγγραφή μηδενίστηκε και ΔΕΝ μετράει στα έξοδα· το αρχείο (${p.dropFile}) κρατιέται για το αρχείο. ` +
           `Ήταν καταχωρημένη με ημερομηνία ${p.dropDate} και ποσό €${p.total.toFixed(2)}.`,
  })
}
await b.commit()
console.log(`\nDONE — swapped ${report.swap.length} files, resolved ${report.pairs.length} duplicate pairs, released €${released.toFixed(2)}`)
process.exit(0)
