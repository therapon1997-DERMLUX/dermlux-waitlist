import { useState, useMemo } from 'react'
import { getAuth } from 'firebase/auth'
import { CATEGORIES, LOCATIONS } from './ExpenseModal'

const WORKER = import.meta.env.VITE_WORKER_URL || ''

const eur = n => '€' + (Number(n) || 0).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = d => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const months = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`
}
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// ── PDF → images (lazy-loaded pdf.js) ────────────────────────────────────────
let _pdfjs = null
async function getPdfjs() {
  if (_pdfjs) return _pdfjs
  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  _pdfjs = pdfjs
  return pdfjs
}
async function pdfToImages(arrayBuffer) {
  const pdfjs = await getPdfjs()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const out = []
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const viewport = page.getViewport({ scale: 2 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
    out.push(canvas.toDataURL('image/jpeg', 0.85))
  }
  return out
}

// Fetch a receipt file (image or PDF) and return an array of image data-URLs.
// PDFs are rasterised page-by-page; images return a single-element array.
async function fetchReceiptImages(fileUrl) {
  if (!fileUrl) return []
  try {
    const token = await getAuth().currentUser?.getIdToken()
    if (!token) return []
    const res = await fetch(fileUrl, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return []
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    const isPdf = ct.includes('pdf') || /\.pdf(\?|$)/i.test(fileUrl)
    if (isPdf) {
      try { return await pdfToImages(await res.arrayBuffer()) } catch { return [] }
    }
    const blob = await res.blob()
    const dataUrl = await new Promise(resolve => {
      const r = new FileReader()
      r.onload = () => resolve(r.result)
      r.onerror = () => resolve(null)
      r.readAsDataURL(blob)
    })
    return dataUrl ? [dataUrl] : []
  } catch {
    return []
  }
}

function buildPrintHtml({ expenses, dateFrom, dateTo, cats, loc, receiptMap }) {
  const totals = { total: 0, vat: 0, net: 0 }
  const byCat = {}
  for (const e of expenses) {
    totals.total += Number(e.total) || 0
    totals.vat   += Number(e.vat)   || 0
    totals.net   += Number(e.net)   || 0
    byCat[e.category] = (byCat[e.category] || 0) + (Number(e.total) || 0)
  }
  const catRows = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const withReceiptCount = expenses.filter(e => (receiptMap[e.id] || []).length > 0).length

  const groups = catRows.map(([cat]) => ({ cat, rows: expenses.filter(e => (e.category || '') === cat) }))

  const generated = new Date().toLocaleDateString('el-GR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const filterLabel = [
    dateFrom || dateTo ? `${dateFrom || '…'} – ${dateTo || '…'}` : '',
    cats.length ? cats.join(', ') : '',
    loc || '',
  ].filter(Boolean).join(' · ') || 'Όλα'

  const summaryRows = groups.map(({ cat, rows }) => `
    <tr class="cat-header">
      <td colspan="6">${esc(cat)}</td>
      <td class="num bold">${eur(rows.reduce((s,e)=>s+(Number(e.total)||0),0))}</td>
    </tr>
    ${rows.map(e => `
    <tr>
      <td>${fmtDate(e.date)}</td>
      <td>${esc(e.vendor) || '—'}</td>
      <td class="muted">${esc(e.invoiceNumber)}</td>
      <td class="muted">${esc(e.notes)}</td>
      <td class="num">${e.net != null ? eur(e.net) : '—'}</td>
      <td class="num amber">${e.vat != null ? eur(e.vat) : '—'}${e.vatRate != null ? `<span class="rate"> ${e.vatRate}%</span>` : ''}</td>
      <td class="num bold">${eur(e.total)}</td>
    </tr>`).join('')}
  `).join('')

  // ── 1-1 receipt pages for EVERY invoice in range (regardless of category) ──
  // Sorted by date so the appendix is chronological.
  const ordered = [...expenses].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const receiptPages = ordered.map((e, idx) => {
    const imgs = receiptMap[e.id] || []
    const header = (extra) => `
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${esc(e.vendor) || '—'}</div>
          <div class="receipt-meta">${fmtDate(e.date)}${e.invoiceNumber ? ' · #' + esc(e.invoiceNumber) : ''}${extra || ''}</div>
          <div class="receipt-cat">${esc(e.category)}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-idx">${idx + 1}/${ordered.length}</div>
          <div class="receipt-total">${eur(e.total)}</div>
          ${e.vat != null ? `<div class="receipt-vat">ΦΠΑ ${eur(e.vat)}${e.vatRate != null ? ` (${e.vatRate}%)` : ''}</div>` : ''}
          ${e.net != null ? `<div class="receipt-net">Καθαρό ${eur(e.net)}</div>` : ''}
        </div>
      </div>`
    if (imgs.length === 0) {
      return `<div class="receipt-page">${header('')}
        <div class="no-img">${e.fileUrl ? 'Το αρχείο του αποδεικτικού δεν φορτώθηκε.' : 'Χωρίς αποδεικτικό αρχείο.'}</div>
      </div>`
    }
    return imgs.map((src, i) => `
      <div class="receipt-page">${header(imgs.length > 1 ? ` · σελ. ${i + 1}/${imgs.length}` : '')}
        <div class="receipt-img-wrap"><img src="${src}" alt="Αποδεικτικό ${esc(e.vendor)}" /></div>
      </div>`).join('')
  }).join('')

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="utf-8">
<title>Dermlux_Εξοδα_${(dateFrom || '') + (dateTo ? '_εως_' + dateTo : '')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }
  .cover { padding: 36px 40px 28px; border-bottom: 3px solid #16a34a; margin-bottom: 28px; }
  .cover-brand { font-size: 22px; font-weight: 700; color: #16a34a; letter-spacing: .5px; }
  .cover-title  { font-size: 16px; font-weight: 600; color: #222; margin-top: 6px; }
  .cover-meta   { font-size: 10px; color: #666; margin-top: 4px; }
  .cover-totals { display: flex; gap: 32px; margin-top: 20px; flex-wrap: wrap; }
  .cover-stat .val  { font-size: 20px; font-weight: 700; color: #111; }
  .cover-stat .lbl  { font-size: 9px; text-transform: uppercase; letter-spacing: .6px; color: #888; margin-top: 1px; }
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #16a34a; margin: 24px 40px 10px; }
  table { width: calc(100% - 80px); margin: 0 40px; border-collapse: collapse; }
  th { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #888; border-bottom: 1px solid #ddd; padding: 5px 6px; text-align: left; }
  td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .num { text-align: right; } .bold { font-weight: 600; } .amber { color: #b45309; }
  .muted { color: #777; font-size: 10px; } .rate { color: #aaa; font-size: 9px; }
  tr.cat-header td { background: #f0fdf4; font-weight: 700; font-size: 10.5px; color: #166534; padding: 6px 6px; border-top: 1px solid #bbf7d0; border-bottom: 1px solid #bbf7d0; }
  .grand-total { width: calc(100% - 80px); margin: 10px 40px 0; display: flex; justify-content: flex-end; padding: 8px 6px; border-top: 2px solid #16a34a; gap: 16px; font-weight: 700; font-size: 12px; }
  .cat-bars { margin: 16px 40px; }
  .cat-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .cat-bar-label { width: 200px; font-size: 10px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-bar-track { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .cat-bar-fill  { height: 100%; background: #16a34a; border-radius: 4px; }
  .cat-bar-val   { width: 80px; text-align: right; font-size: 10px; font-weight: 600; color: #333; }
  .appendix-note { margin: 22px 40px 0; font-size: 10px; color: #888; }
  .receipt-page { page-break-before: always; padding: 22px 32px; }
  .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 2px solid #16a34a; margin-bottom: 16px; }
  .receipt-vendor { font-size: 16px; font-weight: 700; color: #111; }
  .receipt-meta   { font-size: 11px; color: #666; margin-top: 3px; }
  .receipt-cat    { font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 3px; }
  .receipt-amounts { text-align: right; }
  .receipt-idx    { font-size: 9px; color: #aaa; letter-spacing: .5px; }
  .receipt-total  { font-size: 20px; font-weight: 700; color: #111; }
  .receipt-vat    { font-size: 11px; color: #b45309; margin-top: 2px; }
  .receipt-net    { font-size: 11px; color: #555; }
  .receipt-img-wrap { display: flex; justify-content: center; }
  .receipt-img-wrap img { max-width: 100%; max-height: 245mm; object-fit: contain; border: 1px solid #eee; border-radius: 4px; }
  .no-img { padding: 40px; text-align: center; color: #999; font-size: 12px; border: 1px dashed #ddd; border-radius: 8px; }
  @media print { @page { size: A4; margin: 0; } .no-print { display: none !important; } }
</style>
</head>
<body>
<div class="cover">
  <div class="cover-brand">DERMLUX LASER &amp; AESTHETICS LTD</div>
  <div class="cover-title">Έκθεση Εξόδων &amp; Αποδείξεων</div>
  <div class="cover-meta">Φίλτρα: ${esc(filterLabel)} &nbsp;·&nbsp; Δημιουργήθηκε: ${generated}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${eur(totals.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${eur(totals.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${eur(totals.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${expenses.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${withReceiptCount}/${expenses.length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${catRows.map(([c, v]) => `
  <div class="cat-bar-row">
    <div class="cat-bar-label">${esc(c)}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${catRows[0][1] ? Math.round(v/catRows[0][1]*100) : 0}%"></div></div>
    <div class="cat-bar-val">${eur(v)}</div>
  </div>`).join('')}
</div>

<h2>Αναλυτική Κατάσταση</h2>
<table>
  <thead>
    <tr>
      <th>Ημερομηνία</th><th>Προμηθευτής</th><th>Αρ. Τιμολογίου</th><th>Σημειώσεις</th>
      <th class="num">Καθαρό</th><th class="num">ΦΠΑ</th><th class="num">Σύνολο</th>
    </tr>
  </thead>
  <tbody>${summaryRows}</tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${eur(totals.net)}</span>
  <span>ΦΠΑ: ${eur(totals.vat)}</span>
  <span>Σύνολο: ${eur(totals.total)}</span>
</div>

<p class="appendix-note">Ακολουθούν όλα τα παραστατικά 1-1 (${ordered.length}), σε χρονολογική σειρά — ένα ανά σελίδα, έτοιμα για εκτύπωση.</p>

${receiptPages}

</body>
</html>`
}

export default function ExportPrint({ expenses }) {
  const [open, setOpen]       = useState(false)
  const [dateFrom, setFrom]   = useState('')
  const [dateTo, setTo]       = useState('')
  const [selCats, setSelCats] = useState([])
  const [selLoc, setSelLoc]   = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState('')

  const filtered = useMemo(() => expenses.filter(e => {
    if (dateFrom && e.date < dateFrom) return false
    if (dateTo   && e.date > dateTo)   return false
    if (selCats.length && !selCats.includes(e.category)) return false
    if (selLoc && e.location !== selLoc) return false
    return true
  }), [expenses, dateFrom, dateTo, selCats, selLoc])

  const withReceipt = filtered.filter(e => e.fileUrl).length

  function toggleCat(c) {
    setSelCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  // Excel: 3 φύλλα — Αναλυτικά, ΦΠΑ ανά συντελεστή (input VAT για δήλωση), Ανά κατηγορία
  async function exportExcel() {
    setLoading(true); setProgress('Δημιουργία Excel…')
    try {
      const XLSX = await import('xlsx')
      const rows = filtered.map(e => ({
        'Ημερομηνία': e.date || '', 'Προμηθευτής': e.vendor || '',
        'ΑΦΜ Προμηθευτή': e.vatNumber || '', 'Αρ. Τιμολογίου': e.invoiceNumber || '',
        'Κατηγορία': e.category || '', 'Τοποθεσία': e.location || '',
        'Πληρωμή': e.paymentMethod || '', 'Καθαρό': e.net ?? '', 'ΦΠΑ': e.vat ?? '',
        'ΦΠΑ %': e.vatRate ?? '', 'Σύνολο': e.total ?? '',
        'Τράπεζα': e.bankTagBank || (e.paymentMethod === 'Μετρητά' ? 'Ταμείο (μετρητά)' : ''),
        'Ημ/νία πληρωμής': e.bankTagDate || '', 'Ref τράπεζας': e.bankTagRef || '',
        'Σημειώσεις': e.notes || '', 'Αποδεικτικό': e.fileUrl ? 'ΝΑΙ' : 'ΟΧΙ',
      }))
      const byRate = {}
      for (const e of filtered) {
        const rate = e.vatRate ?? '—'
        const claim = (e.category || '').startsWith('8202') ? 'ΜΗ εκπιπτόμενο (εστίαση/φιλοξενία)' : 'Εκπιπτόμενο'
        const k = `${rate}|${claim}`
        if (!byRate[k]) byRate[k] = { rate, claim, net: 0, vat: 0, total: 0, n: 0 }
        byRate[k].net += Number(e.net) || 0; byRate[k].vat += Number(e.vat) || 0
        byRate[k].total += Number(e.total) || 0; byRate[k].n++
      }
      const vatRows = Object.values(byRate).sort((a, b) => (b.rate || 0) - (a.rate || 0)).map(r => ({
        'ΦΠΑ %': r.rate, 'Χαρακτηρισμός': r.claim, 'Παραστατικά': r.n,
        'Καθαρό': +r.net.toFixed(2), 'ΦΠΑ': +r.vat.toFixed(2), 'Σύνολο': +r.total.toFixed(2),
      }))
      const byCat = {}
      for (const e of filtered) {
        const c = e.category || '—'
        if (!byCat[c]) byCat[c] = { net: 0, vat: 0, total: 0, n: 0 }
        byCat[c].net += Number(e.net) || 0; byCat[c].vat += Number(e.vat) || 0
        byCat[c].total += Number(e.total) || 0; byCat[c].n++
      }
      const catRows2 = Object.entries(byCat).sort((a, b) => b[1].total - a[1].total).map(([c, v]) => ({
        'Κατηγορία': c, 'Παραστατικά': v.n, 'Καθαρό': +v.net.toFixed(2),
        'ΦΠΑ': +v.vat.toFixed(2), 'Σύνολο': +v.total.toFixed(2),
      }))
      const wb = XLSX.utils.book_new()
      const ws1 = XLSX.utils.json_to_sheet(rows)
      ws1['!cols'] = [{wch:11},{wch:32},{wch:12},{wch:18},{wch:26},{wch:10},{wch:10},{wch:10},{wch:9},{wch:6},{wch:10},{wch:16},{wch:12},{wch:22},{wch:28},{wch:10}]
      XLSX.utils.book_append_sheet(wb, ws1, 'Αναλυτικά')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(vatRows), 'ΦΠΑ ανά συντελεστή')
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(catRows2), 'Ανά κατηγορία')
      const label = [dateFrom, dateTo].filter(Boolean).join('_εως_') || 'ολα'
      XLSX.writeFile(wb, `Dermlux_Εξοδα_${label}.xlsx`)
    } finally {
      setLoading(false); setProgress('')
    }
  }

  async function generate() {
    if (!filtered.length) return
    // Open the tab SYNCHRONOUSLY (inside the click gesture) so it is not popup-blocked.
    const win = window.open('', '_blank')
    if (!win) {
      alert('Ο browser μπλόκαρε το νέο παράθυρο. Επίτρεψε τα pop-ups για αυτή τη σελίδα και ξαναπάτησε «PDF».')
      return
    }
    const setWinMsg = (msg) => {
      try {
        win.document.open()
        win.document.write(`<!doctype html><html lang="el"><head><meta charset="utf-8"><title>Δημιουργία…</title></head><body style="font-family:Segoe UI,Arial,sans-serif;padding:48px;color:#333"><h2 style="color:#16a34a;margin-bottom:8px">Δημιουργία εκτύπωσης…</h2><p>${esc(msg)}</p><p style="color:#999;margin-top:12px">Μην κλείσεις αυτό το παράθυρο.</p></body></html>`)
        win.document.close()
      } catch {}
    }
    setWinMsg('Προετοιμασία…')
    setLoading(true)
    try {
      const receiptMap = {}
      const withImg = filtered.filter(e => e.fileUrl)
      for (let i = 0; i < withImg.length; i++) {
        const e = withImg[i]
        const msg = `Φόρτωση αποδείξεων ${i + 1}/${withImg.length}…`
        setProgress(msg); setWinMsg(msg)
        const imgs = await fetchReceiptImages(e.fileUrl)
        if (imgs.length) receiptMap[e.id] = imgs
      }
      setProgress('Δημιουργία σελίδας…'); setWinMsg('Δημιουργία σελίδας…')
      const html = buildPrintHtml({ expenses: filtered, dateFrom, dateTo, cats: selCats, loc: selLoc, receiptMap })
      win.document.open(); win.document.write(html); win.document.close()
      win.focus()
      // Give the browser time to lay out all embedded images before printing.
      setTimeout(() => { try { win.print() } catch {} }, 900)
    } finally {
      setLoading(false); setProgress('')
    }
  }

  const inp = 'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full'

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Εκτύπωση / Export
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Εκτύπωση / Export PDF</h2>
            <p className="text-xs text-gray-400 mt-0.5">Report + όλες οι αποδείξεις 1-1 (και PDF), έτοιμες για print</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Εύρος ημερομηνιών</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Από</label>
                <input type="date" className={inp} value={dateFrom} onChange={e => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Έως</label>
                <input type="date" className={inp} value={dateTo} onChange={e => setTo(e.target.value)} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Τοποθεσία</label>
            <select className={inp} value={selLoc} onChange={e => setSelLoc(e.target.value)}>
              <option value="">Όλες</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Κατηγορίες</label>
              <div className="flex gap-2">
                <button onClick={() => setSelCats([...CATEGORIES])} className="text-xs text-green-600 hover:underline">Όλες</button>
                <span className="text-gray-300">·</span>
                <button onClick={() => setSelCats([])} className="text-xs text-gray-400 hover:underline">Καμία</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2">
              {CATEGORIES.map(c => (
                <label key={c} className="flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={selCats.includes(c)} onChange={() => toggleCat(c)}
                    className="accent-green-600 w-3.5 h-3.5" />
                  <span className="text-xs text-gray-700">{c}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {selCats.length === 0 ? 'Όλες οι κατηγορίες' : `${selCats.length} επιλεγμένες`}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">{filtered.length}</span> παραστατικά
              {withReceipt > 0 && <span className="text-green-600 ml-2">· {withReceipt} με αποδεικτικό</span>}
              {filtered.length - withReceipt > 0 && <span className="text-gray-400 ml-2">· {filtered.length - withReceipt} χωρίς</span>}
            </div>
            <div className="text-sm font-bold text-gray-800">
              {(() => { const t = filtered.reduce((s,e) => s + (Number(e.total)||0), 0); return '€' + t.toLocaleString('el-CY', {minimumFractionDigits:2,maximumFractionDigits:2}) })()}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 justify-center py-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">{progress}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)}
                className="py-2 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Ακύρωση
              </button>
              <button onClick={exportExcel} disabled={filtered.length === 0}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                📊 Excel
              </button>
              <button onClick={generate} disabled={filtered.length === 0}
                className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                🖨️ PDF
              </button>
            </div>
          )}
          <p className="text-[11px] text-gray-400 mt-2 text-center">Στο παράθυρο εκτύπωσης επίλεξε «Αποθήκευση ως PDF» για download.</p>
        </div>
      </div>
    </div>
  )
}
