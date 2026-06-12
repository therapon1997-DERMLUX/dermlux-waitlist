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

async function fetchImageAsDataUrl(fileUrl) {
  if (!fileUrl || !WORKER) return null
  try {
    const token = await getAuth().currentUser?.getIdToken()
    if (!token) return null
    const res = await fetch(`${WORKER}/invoices/${encodeURIComponent(fileUrl)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const blob = await res.blob()
    return new Promise(resolve => {
      const r = new FileReader()
      r.onload = () => resolve(r.result)
      r.onerror = () => resolve(null)
      r.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

function buildPrintHtml({ expenses, dateFrom, dateTo, cats, loc, imageMap }) {
  const totals = { total: 0, vat: 0, net: 0 }
  const byCat = {}
  for (const e of expenses) {
    totals.total += Number(e.total) || 0
    totals.vat   += Number(e.vat)   || 0
    totals.net   += Number(e.net)   || 0
    byCat[e.category] = (byCat[e.category] || 0) + (Number(e.total) || 0)
  }
  const catRows = Object.entries(byCat).sort((a, b) => b[1] - a[1])

  // Group by category for the summary table
  const groups = catRows.map(([cat]) => ({
    cat,
    rows: expenses.filter(e => (e.category || '') === cat),
  }))

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
      <td colspan="6">${cat}</td>
      <td class="num bold">${eur(rows.reduce((s,e)=>s+(Number(e.total)||0),0))}</td>
    </tr>
    ${rows.map(e => `
    <tr>
      <td>${fmtDate(e.date)}</td>
      <td>${e.vendor || '—'}</td>
      <td class="muted">${e.invoiceNumber || ''}</td>
      <td class="muted">${e.notes || ''}</td>
      <td class="num">${e.net != null ? eur(e.net) : '—'}</td>
      <td class="num amber">${e.vat != null ? eur(e.vat) : '—'}${e.vatRate != null ? `<span class="rate"> ${e.vatRate}%</span>` : ''}</td>
      <td class="num bold">${eur(e.total)}</td>
    </tr>`).join('')}
  `).join('')

  const receiptPages = expenses
    .filter(e => imageMap[e.id])
    .map(e => `
    <div class="receipt-page">
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${e.vendor || '—'}</div>
          <div class="receipt-meta">${fmtDate(e.date)}${e.invoiceNumber ? ' · #' + e.invoiceNumber : ''}</div>
          <div class="receipt-cat">${e.category || ''}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-total">${eur(e.total)}</div>
          ${e.vat != null ? `<div class="receipt-vat">ΦΠΑ ${eur(e.vat)}${e.vatRate != null ? ` (${e.vatRate}%)` : ''}</div>` : ''}
          ${e.net != null ? `<div class="receipt-net">Καθαρό ${eur(e.net)}</div>` : ''}
        </div>
      </div>
      <div class="receipt-img-wrap">
        <img src="${imageMap[e.id]}" alt="Αποδεικτικό ${e.vendor || ''}" />
      </div>
    </div>
  `).join('')

  const noReceiptList = expenses.filter(e => !imageMap[e.id])
    .map(e => `<li>${fmtDate(e.date)} · <strong>${e.vendor || '—'}</strong> · ${eur(e.total)}</li>`)
    .join('')

  return `<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="utf-8">
<title>Έκθεση Εξόδων — Dermlux</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }

  /* ── Cover / Header ── */
  .cover { padding: 36px 40px 28px; border-bottom: 3px solid #16a34a; margin-bottom: 28px; }
  .cover-brand { font-size: 22px; font-weight: 700; color: #16a34a; letter-spacing: .5px; }
  .cover-title  { font-size: 16px; font-weight: 600; color: #222; margin-top: 6px; }
  .cover-meta   { font-size: 10px; color: #666; margin-top: 4px; }
  .cover-totals { display: flex; gap: 32px; margin-top: 20px; }
  .cover-stat   { }
  .cover-stat .val  { font-size: 20px; font-weight: 700; color: #111; }
  .cover-stat .lbl  { font-size: 9px; text-transform: uppercase; letter-spacing: .6px; color: #888; margin-top: 1px; }

  /* ── Summary table ── */
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px;
       color: #16a34a; margin: 24px 40px 10px; }
  table { width: calc(100% - 80px); margin: 0 40px; border-collapse: collapse; }
  th { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #888;
       border-bottom: 1px solid #ddd; padding: 5px 6px; text-align: left; }
  td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .num { text-align: right; }
  .bold { font-weight: 600; }
  .amber { color: #b45309; }
  .muted { color: #777; font-size: 10px; }
  .rate { color: #aaa; font-size: 9px; }
  tr.cat-header td { background: #f0fdf4; font-weight: 700; font-size: 10.5px;
                     color: #166534; padding: 6px 6px; border-top: 1px solid #bbf7d0;
                     border-bottom: 1px solid #bbf7d0; }
  .grand-total { width: calc(100% - 80px); margin: 10px 40px 0; display: flex;
                 justify-content: flex-end; padding: 8px 6px; border-top: 2px solid #16a34a;
                 gap: 16px; font-weight: 700; font-size: 12px; }

  /* ── Category bars ── */
  .cat-bars { margin: 16px 40px; }
  .cat-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .cat-bar-label { width: 200px; font-size: 10px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-bar-track { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .cat-bar-fill  { height: 100%; background: #16a34a; border-radius: 4px; }
  .cat-bar-val   { width: 80px; text-align: right; font-size: 10px; font-weight: 600; color: #333; }

  /* ── No-receipt list ── */
  .no-receipt-section { margin: 20px 40px; padding: 12px 16px; background: #fafafa;
                         border: 1px solid #e5e5e5; border-radius: 6px; }
  .no-receipt-section h3 { font-size: 10px; font-weight: 600; color: #888; text-transform: uppercase;
                           letter-spacing: .5px; margin-bottom: 8px; }
  .no-receipt-section ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
  .no-receipt-section li { font-size: 10px; color: #555; }

  /* ── Receipt pages ── */
  .receipt-page { page-break-before: always; padding: 28px 40px; }
  .receipt-header { display: flex; justify-content: space-between; align-items: flex-start;
                    padding-bottom: 14px; border-bottom: 2px solid #16a34a; margin-bottom: 18px; }
  .receipt-vendor { font-size: 16px; font-weight: 700; color: #111; }
  .receipt-meta   { font-size: 11px; color: #666; margin-top: 3px; }
  .receipt-cat    { font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 3px; }
  .receipt-amounts { text-align: right; }
  .receipt-total  { font-size: 20px; font-weight: 700; color: #111; }
  .receipt-vat    { font-size: 11px; color: #b45309; margin-top: 2px; }
  .receipt-net    { font-size: 11px; color: #555; }
  .receipt-img-wrap { display: flex; justify-content: center; }
  .receipt-img-wrap img { max-width: 100%; max-height: 240mm; object-fit: contain; border: 1px solid #eee; border-radius: 4px; }

  @media print {
    @page { size: A4; margin: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-brand">DERMLUX LASER &amp; AESTHETICS LTD</div>
  <div class="cover-title">Έκθεση Εξόδων</div>
  <div class="cover-meta">Φίλτρα: ${filterLabel} &nbsp;·&nbsp; Δημιουργήθηκε: ${generated}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${eur(totals.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${eur(totals.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${eur(totals.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${expenses.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${Object.keys(imageMap).length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<!-- Category bars -->
<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${catRows.map(([c, v]) => `
  <div class="cat-bar-row">
    <div class="cat-bar-label">${c}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(v/catRows[0][1]*100)}%"></div></div>
    <div class="cat-bar-val">${eur(v)}</div>
  </div>`).join('')}
</div>

<!-- Summary table -->
<h2>Αναλυτική Κατάσταση</h2>
<table>
  <thead>
    <tr>
      <th>Ημερομηνία</th>
      <th>Προμηθευτής</th>
      <th>Αρ. Τιμολογίου</th>
      <th>Σημειώσεις</th>
      <th class="num">Καθαρό</th>
      <th class="num">ΦΠΑ</th>
      <th class="num">Σύνολο</th>
    </tr>
  </thead>
  <tbody>
    ${summaryRows}
  </tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${eur(totals.net)}</span>
  <span>ΦΠΑ: ${eur(totals.vat)}</span>
  <span>Σύνολο: ${eur(totals.total)}</span>
</div>

${noReceiptList ? `
<div class="no-receipt-section">
  <h3>Χωρίς αποδεικτικό (${expenses.length - Object.keys(imageMap).length})</h3>
  <ul>${noReceiptList}</ul>
</div>` : ''}

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

  async function generate() {
    setLoading(true)
    const imageMap = {}
    const withImg = filtered.filter(e => e.fileUrl)
    for (let i = 0; i < withImg.length; i++) {
      const e = withImg[i]
      setProgress(`Φόρτωση αποδείξεων ${i + 1}/${withImg.length}…`)
      const dataUrl = await fetchImageAsDataUrl(e.fileUrl)
      if (dataUrl) imageMap[e.id] = dataUrl
    }
    setProgress('')
    setLoading(false)

    const html = buildPrintHtml({ expenses: filtered, dateFrom, dateTo, cats: selCats, loc: selLoc, imageMap })
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 800)
  }

  const inp  = 'border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full'

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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">Εκτύπωση / Export PDF</h2>
            <p className="text-xs text-gray-400 mt-0.5">Report + αποδείξεις 1-1 σε πλήρη ανάλυση</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Date range */}
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

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Τοποθεσία</label>
            <select className={inp} value={selLoc} onChange={e => setSelLoc(e.target.value)}>
              <option value="">Όλες</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Categories */}
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {/* Summary of what will be printed */}
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
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors">
                Ακύρωση
              </button>
              <button onClick={generate} disabled={filtered.length === 0}
                className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                🖨️ Δημιουργία PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
