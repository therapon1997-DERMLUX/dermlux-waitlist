// Αρχεία παραστατικών: φόρτωση (με σύνδεση), αναγνώριση τύπου, λήψη, εκτύπωση, ένωση σε ένα PDF, ZIP, Excel.
// Τα αρχεία ζουν στο R2 πίσω από τον worker (/invoices/<key>) και θέλουν Firebase token.
import { auth } from '../../firebase/config'

const blobCache = new Map()   // fileUrl → Promise<{ blob, kind, ext }>

// Ο τύπος από τα πρώτα bytes — μερικά αρχεία έχουν αποθηκευτεί ως application/octet-stream
async function sniff(blob, nameHint = '') {
  const head = new Uint8Array(await blob.slice(0, 12).arrayBuffer())
  const s = String.fromCharCode(...head)
  if (s.startsWith('%PDF')) return { kind: 'pdf', mime: 'application/pdf', ext: 'pdf' }
  if (head[0] === 0xFF && head[1] === 0xD8) return { kind: 'image', mime: 'image/jpeg', ext: 'jpg' }
  if (head[0] === 0x89 && s.slice(1, 4) === 'PNG') return { kind: 'image', mime: 'image/png', ext: 'png' }
  if (s.startsWith('RIFF') && s.slice(8, 12) === 'WEBP') return { kind: 'image', mime: 'image/webp', ext: 'webp' }
  if (s.startsWith('GIF8')) return { kind: 'image', mime: 'image/gif', ext: 'gif' }
  const ext = (nameHint.split('.').pop() || '').toLowerCase()
  if (ext === 'pdf') return { kind: 'pdf', mime: 'application/pdf', ext }
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(ext)) return { kind: 'image', mime: blob.type || `image/${ext}`, ext }
  return { kind: 'other', mime: blob.type || 'application/octet-stream', ext: ext || 'bin' }
}

export async function fetchFile(fileUrl, nameHint = '') {
  if (!fileUrl) throw new Error('Δεν υπάρχει αρχείο')
  if (!blobCache.has(fileUrl)) {
    const p = (async () => {
      const token = await auth.currentUser?.getIdToken()
      const needsAuth = /workers\.dev\/invoices\//.test(fileUrl)
      const res = await fetch(fileUrl, needsAuth && token ? { headers: { Authorization: `Bearer ${token}` } } : {})
      if (!res.ok) throw new Error(res.status === 404 ? 'Το αρχείο δεν βρέθηκε στην αποθήκη' : `Σφάλμα φόρτωσης (${res.status})`)
      const raw = await res.blob()
      const t = await sniff(raw, nameHint || decodeURIComponent(fileUrl.split('/').pop() || ''))
      const blob = raw.type === t.mime ? raw : new Blob([raw], { type: t.mime })
      return { blob, kind: t.kind, ext: t.ext }
    })()
    blobCache.set(fileUrl, p)
    p.catch(() => blobCache.delete(fileUrl))
  }
  return blobCache.get(fileUrl)
}

const clean = s => String(s || '').normalize('NFC').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim()
export function fileNameFor(e, ext) {
  const parts = [e.date, clean(e.vendor).slice(0, 40), clean(e.invoiceNumber).slice(0, 30)].filter(Boolean)
  return `${parts.join('_') || 'parastatiko'}.${ext}`
}

export function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.rel = 'noopener'
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

export async function downloadExpense(e) {
  const f = await fetchFile(e.fileUrl, e.fileName)
  saveBlob(f.blob, fileNameFor(e, f.ext))
}

// Εκτύπωση ενός αρχείου: PDF μέσα σε κρυφό iframe, εικόνα σε σελίδα Α4
export async function printBlob(blob, kind, title = 'Εκτύπωση') {
  const url = URL.createObjectURL(blob)
  if (kind === 'pdf') {
    const fr = document.createElement('iframe')
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0'
    fr.src = url
    document.body.appendChild(fr)
    fr.onload = () => { setTimeout(() => { try { fr.contentWindow.focus(); fr.contentWindow.print() } catch { window.open(url, '_blank') } }, 300) }
    setTimeout(() => { fr.remove(); URL.revokeObjectURL(url) }, 120000)
    return
  }
  printHtml(`<img src="${url}" style="max-width:100%;max-height:100vh;display:block;margin:0 auto">`, title, 600)
}
export async function printExpense(e) {
  const f = await fetchFile(e.fileUrl, e.fileName)
  await printBlob(f.blob, f.kind, `${e.vendor || ''} ${e.invoiceNumber || ''}`)
}

// Εκτύπωση έτοιμου HTML (statements, λίστες, καρτέλες) — ελληνικά χωρίς πρόβλημα, «Αποθήκευση ως PDF» από τον browser
export function printHtml(bodyHtml, title = 'Εκτύπωση', delay = 400, preOpened = null) {
  const w = preOpened || window.open('', '_blank')
  if (!w) { alert('Ο browser μπλόκαρε το παράθυρο εκτύπωσης. Επίτρεψε τα pop-ups για αυτή τη σελίδα.'); return }
  w.document.open()
  w.document.write(`<!doctype html><html lang="el"><head><meta charset="utf-8"><title>${title.replace(/</g, '&lt;')}</title>
<style>
  @page { size: A4; margin: 12mm }
  body { font: 11px/1.45 "Segoe UI", Arial, sans-serif; color: #111; margin: 0 }
  h1 { font-size: 17px; margin: 0 0 2px } h2 { font-size: 13px; margin: 16px 0 6px; border-bottom: 1.5px solid #111; padding-bottom: 3px }
  .sub { color: #555; margin: 0 0 10px } .muted { color: #666 }
  table { width: 100%; border-collapse: collapse; margin: 4px 0 10px } th, td { border-bottom: 1px solid #ddd; padding: 3px 5px; text-align: left; vertical-align: top }
  th { background: #f3f4f6; font-weight: 600 } td.n, th.n { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums }
  tr.tot td { font-weight: 700; border-top: 1.5px solid #111 } .warn { color: #b45309 } .bad { color: #b91c1c }
  .pill { display: inline-block; padding: 0 6px; border-radius: 8px; background: #eef2f7; font-size: 10px }
  @media print { .noprint { display: none } thead { display: table-header-group } tr { page-break-inside: avoid } }
</style></head><body>${bodyHtml}</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => { try { w.print() } catch {} }, delay)
}

// Πολλά παραστατικά → ΕΝΑ PDF (με σειρά). Εικόνες γίνονται σελίδες A4, PDF αντιγράφονται αυτούσια.
const withTimeout = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`${what}: πέρασε το όριο χρόνου`)), ms))])

export async function mergeToPdf(expenses, onProgress = () => {}) {
  const { PDFDocument } = await import('pdf-lib')
  const out = await PDFDocument.create()
  const skipped = []
  const A4 = [595.28, 841.89]
  for (let i = 0; i < expenses.length; i++) {
    const e = expenses[i]
    onProgress(i + 1, expenses.length)
    if (!e.fileUrl) { skipped.push(e); continue }
    try {
      // Ένα βαρύ ή χαλασμένο αρχείο δεν πρέπει να κολλάει όλο το πακέτο: 45" ανά αρχείο, μετά παραλείπεται
      const f = await withTimeout(fetchFile(e.fileUrl, e.fileName), 45000, e.fileName || 'αρχείο')
      const bytes = new Uint8Array(await f.blob.arrayBuffer())
      if (f.kind === 'pdf') {
        const src = await withTimeout(PDFDocument.load(bytes, { ignoreEncryption: true }), 45000, e.fileName || 'PDF')
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach(p => out.addPage(p))
      } else if (f.kind === 'image') {
        let img
        if (f.ext === 'png') img = await out.embedPng(bytes)
        else if (f.ext === 'jpg') img = await out.embedJpg(bytes)
        else { // webp/gif/heic → μέσω canvas σε PNG
          const bmp = await createImageBitmap(f.blob)
          const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height
          c.getContext('2d').drawImage(bmp, 0, 0)
          const png = await new Promise(r => c.toBlob(r, 'image/png'))
          img = await out.embedPng(new Uint8Array(await png.arrayBuffer()))
        }
        const page = out.addPage(A4)
        const scale = Math.min((A4[0] - 40) / img.width, (A4[1] - 40) / img.height, 1)
        const w = img.width * scale, h = img.height * scale
        page.drawImage(img, { x: (A4[0] - w) / 2, y: A4[1] - 20 - h, width: w, height: h })
      } else skipped.push(e)
    } catch { skipped.push(e) }
  }
  const pdfBytes = await out.save()
  return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), skipped, pages: out.getPageCount() }
}

// ZIP με τα πρωτότυπα αρχεία + ευρετήριο Excel
export async function zipExpenses(expenses, onProgress = () => {}) {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const used = new Set(); const skipped = []
  for (let i = 0; i < expenses.length; i++) {
    const e = expenses[i]
    onProgress(i + 1, expenses.length)
    if (!e.fileUrl) { skipped.push(e); continue }
    try {
      const f = await fetchFile(e.fileUrl, e.fileName)
      let name = fileNameFor(e, f.ext), k = 2
      while (used.has(name)) name = fileNameFor(e, f.ext).replace(/\.(\w+)$/, ` (${k++}).$1`)
      used.add(name)
      zip.file(name, f.blob)
    } catch { skipped.push(e) }
  }
  zip.file('Ευρετήριο.xlsx', await expensesXlsxBlob(expenses))
  return { blob: await zip.generateAsync({ type: 'blob' }), skipped }
}

export const expenseRow = e => ({
  'Ημερομηνία': e.date || '', 'Προμηθευτής': e.vendor || '', 'ΑΦΜ': e.vatNumber || '', 'Αρ. τιμολογίου': e.invoiceNumber || '',
  'Κατηγορία': e.category || '', 'Κατάστημα': e.location || '', 'Πληρωμή': e.paymentMethod || '',
  'Καθαρό': e.net ?? '', 'ΦΠΑ': e.vat ?? '', 'ΦΠΑ %': e.vatRate ?? '', 'Σύνολο': e.total ?? '', 'Νόμισμα': e.currency || 'EUR',
  'Τράπεζα': e.bankTagBank || (e.paymentMethod === 'Μετρητά' ? 'Ταμείο (μετρητά)' : ''), 'Ημ/νία πληρωμής': e.bankTagDate || '',
  'Αρχείο': e.fileUrl ? 'ΝΑΙ' : 'ΟΧΙ', 'Σημειώσεις': e.notes || '',
})
export async function expensesXlsxBlob(expenses) {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenses.map(expenseRow)), 'Παραστατικά')
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
export async function rowsXlsxBlob(rows, sheet = 'Φύλλο1') {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sheet.slice(0, 31))
  const out = XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
  return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
