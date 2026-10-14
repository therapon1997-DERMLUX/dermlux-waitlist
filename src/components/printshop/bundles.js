// Πακέτα παραστατικών (κοινά για Print Shop και Ερμογένη): ένα PDF, ZIP, Excel, εκτύπωση με αποδείξεις.
import { mergeToPdf, zipExpenses, expensesXlsxBlob, saveBlob } from './files'
import { fetchReceiptImages, buildPrintHtml, esc } from '../bookkeeping/ExportPrint'

const slug = s => String(s || 'Πακέτο').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, '_').slice(0, 60)

// format: pdf | zip | excel | print — onProgress(text)
export async function runBundle({ format, rows, title = 'Παραστατικά', onProgress = () => {} }) {
  const list = rows.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)))
  if (!list.length) throw new Error('Δεν υπάρχουν παραστατικά στο πακέτο')
  if (format === 'excel') {
    saveBlob(await expensesXlsxBlob(list), `${slug(title)}.xlsx`)
    return { done: true, message: `Excel με ${list.length} γραμμές` }
  }
  if (format === 'pdf') {
    const r = await mergeToPdf(list, (i, n) => onProgress(`Ένωση ${i}/${n}…`))
    saveBlob(r.blob, `${slug(title)}.pdf`)
    return { done: true, message: `PDF ${r.pages} σελίδων${r.skipped.length ? ` · ${r.skipped.length} χωρίς αρχείο` : ''}`, skipped: r.skipped }
  }
  if (format === 'zip') {
    const r = await zipExpenses(list, (i, n) => onProgress(`Αρχεία ${i}/${n}…`))
    saveBlob(r.blob, `${slug(title)}.zip`)
    return { done: true, message: `ZIP με ${list.length - r.skipped.length} αρχεία + ευρετήριο${r.skipped.length ? ` · ${r.skipped.length} χωρίς αρχείο` : ''}`, skipped: r.skipped }
  }
  if (format === 'print') return printWithReceipts(list, title, onProgress)
  throw new Error('Άγνωστη μορφή')
}

// Εκτύπωση report + όλες οι αποδείξεις (ίδιο με «Εκτύπωση / Export» των Λογιστικών).
// Το παράθυρο ανοίγει αμέσως (μέσα στο κλικ) για να μην το μπλοκάρει ο browser.
export async function printWithReceipts(list, title, onProgress = () => {}) {
  const win = window.open('', '_blank')
  if (!win) throw new Error('Ο browser μπλόκαρε το παράθυρο εκτύπωσης — επίτρεψε τα pop-ups για αυτή τη σελίδα.')
  const say = m => { try { win.document.open(); win.document.write(`<!doctype html><meta charset="utf-8"><body style="font-family:Segoe UI,Arial;padding:40px;color:#333"><h2 style="color:#047857">Ετοιμάζεται η εκτύπωση…</h2><p>${esc(m)}</p></body>`); win.document.close() } catch {} }
  say('Προετοιμασία…')
  const receiptMap = {}
  const withFile = list.filter(e => e.fileUrl)
  for (let i = 0; i < withFile.length; i++) {
    const m = `Αποδείξεις ${i + 1}/${withFile.length}…`; onProgress(m); say(m)
    try { const imgs = await fetchReceiptImages(withFile[i].fileUrl); if (imgs.length) receiptMap[withFile[i].id] = imgs } catch {}
  }
  const dates = list.map(e => e.date).filter(Boolean).sort()
  const html = buildPrintHtml({ expenses: list, dateFrom: dates[0] || '', dateTo: dates[dates.length - 1] || '', cats: [], loc: '', receiptMap })
  win.document.open(); win.document.write(html); win.document.close(); win.focus()
  setTimeout(() => { try { win.print() } catch {} }, 900)
  return { done: true, message: `Εκτύπωση ${list.length} παραστατικών` }
}
