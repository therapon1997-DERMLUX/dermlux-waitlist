import { useState, useEffect, useRef } from 'react'
import {
  collection, addDoc, updateDoc, doc, serverTimestamp, query, where, limit, getDocs, orderBy,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { LOCATIONS } from './ExpenseModal'
import { findExactDupGroups, mergeGroup } from './mergeDups'

// Σελίδα «Αποδείξεις» — ροή: φωτογραφία/αρχείο → προεπισκόπηση με περικοπή (snip)
// → επιλογή «από πού πληρώθηκε» → Επιβεβαίωση & Αποστολή (ή Ακύρωση αν βγήκε κακή).
// Το ανέβασμα + η ανάγνωση AI τρέχουν στο παρασκήνιο όσο διαλέγουν πηγή πληρωμής.

const WORKER = import.meta.env.VITE_WORKER_URL || ''

const PAY_SOURCES = [
  { key: 'Ταμείο (μετρητά)', label: '💶 Μετρητά ταμείου', method: 'Μετρητά' },
  { key: 'BoC Κύριος',       label: '🏦 Τρ. Κύπρου — Κύριος', method: 'Τραπεζική' },
  { key: 'BoC Ταμείο',       label: '🏦 Τρ. Κύπρου — Ταμείο', method: 'Τραπεζική' },
  { key: 'Eurobank',         label: '🏦 Eurobank', method: 'Τραπεζική' },
  { key: 'Revolut',          label: '🏦 Revolut Business', method: 'Κάρτα' },
  { key: 'ΑΤΜ Κατάθεση',     label: '🏧 Απόδειξη κατάθεσης ΑΤΜ', method: 'Κατάθεση', docType: 'deposit_slip' },
  { key: 'Παραλαβή στο κέντρο', label: '📥 Παραλαβή τιμολογίου στο κέντρο', method: 'Επί πιστώσει', docType: 'unpaid_invoice' },
  { key: '',                 label: '❓ Δεν ξέρω / άλλο', method: 'Άλλο' },
]

const fileToDataUrl = f => new Promise((res, rej) => {
  const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f)
})

export default function ExpenseUpload() {
  const { userProfile, currentUser, isAdmin } = useAuth()
  const [location, setLocation] = useState('')
  const [stage, setStage] = useState('pick')      // pick | preview | send
  const [img, setImg]     = useState(null)        // { dataUrl, type, name, isPdf }
  const [sel, setSel]     = useState(null)        // crop selection (σε συντεταγμένες οθόνης)
  const [source, setSource] = useState(null)      // επιλεγμένη πηγή πληρωμής
  const [bankMode, setBankMode] = useState(null)  // 'transfer' | 'card' όταν η πηγή είναι τράπεζα
  const [openRow, setOpenRow] = useState(null)    // expanded πρόσφατο upload
  const [editRow, setEditRow] = useState(null)    // { id, vendor, invoiceNumber, date, total } σε επεξεργασία
  const [editSaving, setEditSaving] = useState(false)
  const [upload, setUpload] = useState(null)      // { fileUrl, fileName, fields } όταν ολοκληρωθεί
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy]   = useState(false)
  const [msg, setMsg]     = useState('')
  const [error, setError] = useState('')
  const [recent, setRecent] = useState([])
  const inputRef  = useRef(null)
  const cameraRef = useRef(null)
  const imgRef    = useRef(null)
  const dragRef   = useRef(null)

  useEffect(() => {
    if (userProfile?.location && LOCATIONS.includes(userProfile.location)) setLocation(userProfile.location)
    else if (!location) setLocation(LOCATIONS[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile])

  async function loadRecent() {
    if (!currentUser) return
    try {
      // Admin βλέπει ΟΛΑ τα πρόσφατα uploads· managers μόνο τα δικά τους.
      const q = isAdmin
        ? query(collection(db, 'expenses'), orderBy('createdAt', 'desc'), limit(60))
        : query(collection(db, 'expenses'), where('createdByUid', '==', currentUser.uid), limit(60))
      const snap = await getDocs(q)
      let rows = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      // Auto-hide: μετά από 30 μέρες φεύγουν από εδώ (μένουν κανονικά στα Λογιστικά)
      const cutoff = Date.now() / 1000 - 30 * 24 * 3600
      rows = rows.filter(r => (r.createdAt?.seconds || 0) >= cutoff)
      setRecent(rows.slice(0, 40))
    } catch { /* non-fatal */ }
  }
  useEffect(() => { loadRecent() }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  function reset() {
    setStage('pick'); setImg(null); setSel(null); setSource(null); setBankMode(null)
    setUpload(null); setUploading(false); setMsg(''); setError('')
    if (inputRef.current)  inputRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  // ── Βήμα 1: επιλογή/λήψη αρχείου → προεπισκόπηση ──
  async function handleFile(file) {
    if (!file || busy) return
    if (file.size > 12 * 1024 * 1024) { setError('Το αρχείο είναι πολύ μεγάλο (max 12MB).'); return }
    setError('')
    const isPdf = (file.type || '').includes('pdf')
    const dataUrl = await fileToDataUrl(file)
    setImg({ dataUrl, type: file.type || 'image/jpeg', name: file.name || `receipt_${Date.now()}`, isPdf })
    setSel(null)
    if (isPdf) { startUpload(dataUrl, file.type, file.name); setStage('send') }
    else setStage('preview')
  }

  // ── Περικοπή: σύρσιμο ορθογωνίου πάνω στην εικόνα (mouse & touch) ──
  function pointerPos(e) {
    const rect = imgRef.current.getBoundingClientRect()
    return { x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
             y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height) }
  }
  function onPointerDown(e) {
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const p = pointerPos(e)
    dragRef.current = p
    setSel({ x: p.x, y: p.y, w: 0, h: 0 })
  }
  function onPointerMove(e) {
    if (!dragRef.current) return
    const p = pointerPos(e)
    const s = dragRef.current
    setSel({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) })
  }
  function onPointerUp() { dragRef.current = null }

  function applyCrop() {
    if (!sel || sel.w < 15 || sel.h < 15 || !imgRef.current) return
    const el = imgRef.current
    const scaleX = el.naturalWidth / el.clientWidth
    const scaleY = el.naturalHeight / el.clientHeight
    const canvas = document.createElement('canvas')
    canvas.width  = Math.round(sel.w * scaleX)
    canvas.height = Math.round(sel.h * scaleY)
    canvas.getContext('2d').drawImage(el,
      sel.x * scaleX, sel.y * scaleY, sel.w * scaleX, sel.h * scaleY,
      0, 0, canvas.width, canvas.height)
    setImg(prev => ({ ...prev, dataUrl: canvas.toDataURL('image/jpeg', 0.92), type: 'image/jpeg' }))
    setSel(null)
  }

  // ── Ανέβασμα + ανάγνωση AI στο παρασκήνιο (ξεκινά με το «Συνέχεια») ──
  async function startUpload(dataUrl, type, name) {
    setUploading(true); setUpload(null)
    try {
      const base64 = dataUrl.split(',')[1]
      const idToken = await currentUser.getIdToken()
      const uploadRes = await fetch(`${WORKER}/upload-invoice-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ base64, mediaType: type, fileName: name }),
      })
      if (!uploadRes.ok) throw new Error('Η μεταφόρτωση απέτυχε')
      const { fileUrl, fileName } = await uploadRes.json()
      let fields = {}
      try {
        const res = await fetch(`${WORKER}/extract-invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ base64, mediaType: type, fileName: name }),
        })
        const data = await res.json()
        if (res.ok && data.fields) fields = data.fields
      } catch { /* προαιρετικό */ }
      setUpload({ fileUrl, fileName, fields })
    } catch (e) {
      setError(e.message || 'Η μεταφόρτωση απέτυχε — δοκίμασε ξανά.')
      setStage('preview')
    } finally {
      setUploading(false)
    }
  }

  function continueToSend() {
    setSel(null)
    startUpload(img.dataUrl, img.type, img.name)
    setStage('send')
  }

  // Οι τραπεζικές πηγές θέλουν και δεύτερη επιλογή: έμβασμα ή κάρτα
  const needsBankMode = source?.method === 'Τραπεζική'
  const readyToSend = upload && source && (!needsBankMode || bankMode)

  // ── Βήμα 3: Επιβεβαίωση & Αποστολή ──
  async function confirmAndSend() {
    if (!readyToSend || busy) return
    setBusy(true); setError('')
    const f = upload.fields || {}
    try {
      const newRef = await addDoc(collection(db, 'expenses'), {
        vendor:        f.vendor         || '',
        vatNumber:     f.vat_number     || '',
        invoiceNumber: f.invoice_number || '',
        date:          f.date           || new Date().toISOString().slice(0, 10),
        net:   f.net   ?? null,
        vat:   f.vat   ?? null,
        vatRate: f.vat_rate ?? null,
        total: f.total ?? null,
        currency: f.currency || 'EUR',
        category: f.category || '',
        items: Array.isArray(f.line_items) ? f.line_items : [],
        location,
        paymentMethod: needsBankMode ? (bankMode === 'card' ? 'Κάρτα' : 'Τραπεζική') : source.method,
        paymentSource: source.key,
        paymentDetail: needsBankMode ? (bankMode === 'card' ? 'Κάρτα τράπεζας' : 'Έμβασμα (bank transfer)') : '',
        docType: source.docType || 'expense',
        notes: '',
        fileUrl: upload.fileUrl, fileName: upload.fileName,
        status: 'pending',
        source: 'manager_upload',
        createdAt: serverTimestamp(),
        createdBy: userProfile?.displayName || '',
        createdByUid: currentUser.uid,
      })
      // Αν ο admin ανέβασε τιμολόγιο που υπάρχει ήδη (π.χ. το είχε βάλει η manager
      // στην παραλαβή), το σίγουρο διπλό συγχωνεύεται αυτόματα σε ένα record.
      let merged = false
      if (isAdmin && (f.invoice_number || '').trim()) {
        try {
          const dupSnap = await getDocs(query(collection(db, 'expenses'),
            where('invoiceNumber', '==', f.invoice_number), limit(10)))
          const cands = dupSnap.docs.map(d => ({ id: d.id, ...d.data() }))
          const g = findExactDupGroups(cands).find(gr => gr.some(e => e.id === newRef.id))
          if (g) { await mergeGroup(g); merged = true }
        } catch { /* non-fatal — το πιάνει το sweep στα Λογιστικά */ }
      }
      reset()
      setMsg(merged
        ? '✓ Στάλθηκε — υπήρχε ήδη το ίδιο τιμολόγιο και συγχωνεύτηκαν αυτόματα σε ένα.'
        : '✓ Στάλθηκε! Μπορείς να ανεβάσεις και άλλη απόδειξη.')
      loadRecent()
    } catch (e) {
      setError('Η αποθήκευση απέτυχε: ' + e.message)
    } finally {
      setBusy(false)
    }
  }

  const btn = 'rounded-xl py-3 px-4 text-sm font-semibold disabled:opacity-50 transition-colors'

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800">Αποδείξεις</h1>
      <p className="text-sm text-gray-500 mt-0.5 mb-5">Φωτογράφισε ή ανέβασε τις αποδείξεις του καταστήματος</p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Κατάστημα</label>
        <select value={location} onChange={e => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
      {msg && !error && stage === 'pick' && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">{msg}</div>}

      {/* ─── ΒΗΜΑ 1: Λήψη/επιλογή ─── */}
      {stage === 'pick' && (
        <>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
            className="border-2 border-dashed border-gray-300 rounded-xl py-10 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/40 transition-colors">
            <div className="text-4xl mb-2">🧾</div>
            <p className="text-gray-700 font-medium">Σύρε εδώ την απόδειξη</p>
            <p className="text-sm text-gray-500 mt-1">ή κάνε κλικ για επιλογή αρχείου</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button type="button" onClick={() => cameraRef.current?.click()}
              className={`${btn} flex flex-col items-center gap-1 border border-green-200 bg-green-50 text-green-700 active:bg-green-100`}>
              <span className="text-2xl">📷</span> Φωτογράφισε
            </button>
            <button type="button" onClick={() => inputRef.current?.click()}
              className={`${btn} flex flex-col items-center gap-1 border border-gray-200 bg-gray-50 text-gray-700 active:bg-gray-100`}>
              <span className="text-2xl">🖼️</span> Από gallery
            </button>
          </div>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*,application/pdf"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

      {/* ─── ΒΗΜΑ 2: Προεπισκόπηση + περικοπή ─── */}
      {stage === 'preview' && img && (
        <div className="border-2 border-blue-200 bg-blue-50/40 rounded-xl p-3">
          <p className="font-semibold text-gray-800 mb-1">👀 Προεπισκόπηση</p>
          <p className="text-xs text-gray-500 mb-2">Σύρε πάνω στην εικόνα για να κόψεις ό,τι περισσεύει — ή συνέχισε ως έχει.</p>
          <div className="relative inline-block max-w-full select-none touch-none"
               onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
            <img ref={imgRef} src={img.dataUrl} alt="Απόδειξη"
                 className="max-w-full max-h-[55vh] rounded-lg border border-gray-300 pointer-events-none" draggable={false} />
            {sel && sel.w > 4 && (
              <div className="absolute border-2 border-blue-500 bg-blue-400/20 pointer-events-none rounded-sm"
                   style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }} />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <button type="button" onClick={reset}
              className={`${btn} border border-red-200 bg-white text-red-600 hover:bg-red-50`}>
              ✕ Ακύρωση
            </button>
            <button type="button" onClick={applyCrop} disabled={!sel || sel.w < 15}
              className={`${btn} border border-blue-300 bg-white text-blue-700 hover:bg-blue-50`}>
              ✂ Κόψε
            </button>
            <button type="button" onClick={continueToSend}
              className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
              Συνέχεια →
            </button>
          </div>
        </div>
      )}

      {/* ─── ΒΗΜΑ 3: Πηγή πληρωμής + Επιβεβαίωση ─── */}
      {stage === 'send' && img && (
        <div className="border-2 border-blue-200 bg-blue-50/40 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            {img.isPdf
              ? <span className="w-14 h-16 border border-gray-300 rounded bg-white flex items-center justify-center text-2xl">📄</span>
              : <img src={img.dataUrl} alt="" className="w-14 h-16 object-cover rounded border border-gray-300" />}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800">💳 Από πού πληρώθηκε;</p>
              <p className="text-xs text-gray-500 truncate">
                {uploading ? '⏳ Ανέβασμα & ανάγνωση…'
                  : upload?.fields?.vendor
                    ? `${upload.fields.vendor}${upload.fields.total ? ` — €${upload.fields.total}` : ''}`
                    : upload ? 'Ανέβηκε ✓' : ''}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PAY_SOURCES.map(srcOpt => (
              <button key={srcOpt.label} type="button" onClick={() => { setSource(srcOpt); setBankMode(null) }}
                className={`border rounded-xl py-3 px-2 text-sm font-medium transition-colors ${
                  source?.label === srcOpt.label
                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'}`}>
                {srcOpt.label}
              </button>
            ))}
          </div>
          {needsBankMode && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-1.5">Πώς πληρώθηκε από την τράπεζα;</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setBankMode('transfer')}
                  className={`border rounded-xl py-2.5 px-2 text-sm font-medium transition-colors ${
                    bankMode === 'transfer' ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                  ↔️ Έμβασμα (transfer)
                </button>
                <button type="button" onClick={() => setBankMode('card')}
                  className={`border rounded-xl py-2.5 px-2 text-sm font-medium transition-colors ${
                    bankMode === 'card' ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                  💳 Κάρτα τράπεζας
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button type="button" onClick={reset} disabled={busy}
              className={`${btn} border border-red-200 bg-white text-red-600 hover:bg-red-50`}>
              ✕ Ακύρωση
            </button>
            <button type="button" onClick={confirmAndSend} disabled={!readyToSend || uploading || busy}
              className={`${btn} bg-green-600 text-white hover:bg-green-700`}>
              {busy ? 'Αποστολή…' : uploading ? '⏳ Περίμενε…' : '✅ Επιβεβαίωση & Αποστολή'}
            </button>
          </div>
          {!source && <p className="text-[11px] text-gray-400 mt-2 text-center">Διάλεξε από πού πληρώθηκε για να ενεργοποιηθεί η αποστολή</p>}
          {source && needsBankMode && !bankMode && <p className="text-[11px] text-indigo-500 mt-2 text-center">Διάλεξε έμβασμα ή κάρτα για να ενεργοποιηθεί η αποστολή</p>}
        </div>
      )}

      {recent.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Τα πρόσφατά σου</h2>
          <p className="text-[11px] text-gray-400 -mt-1 mb-2">Πάτησε πάνω σε μια απόδειξη για αναλυτικά περιεχόμενα. Μετά από 30 μέρες φεύγει από εδώ (μένει στα Λογιστικά).</p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {recent.map((r, i) => (
              <div key={r.id} className={i < recent.length - 1 ? 'border-b border-gray-100' : ''}>
                <button type="button"
                  onClick={() => { setOpenRow(openRow === r.id ? null : r.id); setEditRow(null) }}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${openRow === r.id ? 'bg-blue-50/60' : ''}`}>
                  <span className="text-green-500">{r.docType === 'deposit_slip' ? '🏧' : r.docType === 'unpaid_invoice' ? '📥' : '🧾'}</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-sm text-gray-800 truncate block">{r.vendor || r.fileName || 'Απόδειξη'}</span>
                    <span className="text-xs text-gray-400">
                      {r.date} · {r.location}{r.paymentSource ? ` · ${r.paymentSource}` : ''}
                    </span>
                  </span>
                  {isAdmin && r.total != null && <span className="text-sm font-semibold text-gray-700">€{Number(r.total).toFixed(2)}</span>}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.status === 'confirmed' ? '✓ εγκρίθηκε' : 'σε έλεγχο'}
                  </span>
                  <span className="text-gray-300 text-xs">{openRow === r.id ? '▲' : '▼'}</span>
                </button>

                {openRow === r.id && (
                  <div className="px-4 pb-3 pt-1 bg-blue-50/40 border-t border-blue-100 text-sm">
                    {editRow?.id === r.id ? (
                      /* ── Φόρμα διόρθωσης ── */
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <label className="col-span-2 text-xs text-gray-500">Προμηθευτής
                          <input className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.vendor} onChange={e => setEditRow({ ...editRow, vendor: e.target.value })} />
                        </label>
                        <label className="text-xs text-gray-500">Αρ. τιμολογίου
                          <input className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.invoiceNumber} onChange={e => setEditRow({ ...editRow, invoiceNumber: e.target.value })} />
                        </label>
                        <label className="text-xs text-gray-500">Ημερομηνία
                          <input type="date" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.date} onChange={e => setEditRow({ ...editRow, date: e.target.value })} />
                        </label>
                        <label className="text-xs text-gray-500">Σύνολο (€)
                          <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.total} onChange={e => setEditRow({ ...editRow, total: e.target.value })} />
                        </label>
                        <label className="text-xs text-gray-500">Καθαρό (€)
                          <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.net} onChange={e => setEditRow({ ...editRow, net: e.target.value })} />
                        </label>
                        <label className="text-xs text-gray-500">ΦΠΑ (€)
                          <input type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm mt-0.5 bg-white"
                            value={editRow.vat} onChange={e => setEditRow({ ...editRow, vat: e.target.value })} />
                        </label>
                        <div className="col-span-2 grid grid-cols-2 gap-2 mt-1">
                          <button type="button" onClick={() => setEditRow(null)} disabled={editSaving}
                            className="rounded-lg py-2 text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
                            Ακύρωση
                          </button>
                          <button type="button" disabled={editSaving}
                            onClick={async () => {
                              setEditSaving(true)
                              try {
                                await updateDoc(doc(db, 'expenses', r.id), {
                                  vendor: editRow.vendor,
                                  invoiceNumber: editRow.invoiceNumber,
                                  date: editRow.date,
                                  total: editRow.total === '' ? null : Number(editRow.total),
                                  net: editRow.net === '' ? null : Number(editRow.net),
                                  vat: editRow.vat === '' ? null : Number(editRow.vat),
                                  updatedAt: serverTimestamp(),
                                  updatedBy: userProfile?.displayName || '',
                                })
                                setEditRow(null)
                                loadRecent()
                              } catch (e) { setError('Η διόρθωση απέτυχε: ' + e.message) }
                              finally { setEditSaving(false) }
                            }}
                            className="rounded-lg py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                            {editSaving ? 'Αποθήκευση…' : '💾 Αποθήκευση'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Αναλυτικά περιεχόμενα ── */
                      <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                          <p><span className="text-gray-400">Αρ. τιμολογίου:</span> <span className="text-gray-700 font-medium">{r.invoiceNumber || '—'}</span></p>
                          <p><span className="text-gray-400">ΑΦΜ:</span> <span className="text-gray-700">{r.vatNumber || '—'}</span></p>
                          <p><span className="text-gray-400">Πληρωμή:</span> <span className="text-gray-700">{r.paymentMethod || '—'}{r.paymentDetail ? ` (${r.paymentDetail})` : ''}</span></p>
                          <p><span className="text-gray-400">Κατηγορία:</span> <span className="text-gray-700">{r.category || '—'}</span></p>
                          {isAdmin && (
                            <p className="col-span-2"><span className="text-gray-400">Ποσά:</span>{' '}
                              <span className="text-gray-700">καθαρό €{r.net != null ? Number(r.net).toFixed(2) : '—'} · ΦΠΑ €{r.vat != null ? Number(r.vat).toFixed(2) : '—'} · σύνολο <b>€{r.total != null ? Number(r.total).toFixed(2) : '—'}</b></span>
                            </p>
                          )}
                        </div>

                        {Array.isArray(r.items) && r.items.length > 0 && (
                          <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
                            {r.items.map((it, j) => (
                              <div key={j} className={`flex items-center gap-2 px-2.5 py-1.5 text-xs ${j < r.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <span className="flex-1 text-gray-700 truncate">{it.description || it.name || '—'}</span>
                                {(it.quantity ?? it.qty) != null && <span className="text-gray-400">×{it.quantity ?? it.qty}</span>}
                                {isAdmin && (it.amount != null || it.total != null) &&
                                  <span className="text-gray-700 font-medium">€{Number(it.amount ?? it.total).toFixed(2)}</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-2.5">
                          {r.fileUrl && (
                            <a href={r.fileUrl} target="_blank" rel="noreferrer"
                              className="flex-1 text-center rounded-lg py-1.5 text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
                              📎 Άνοιγμα αρχείου
                            </a>
                          )}
                          {(isAdmin || r.createdByUid === currentUser?.uid) && (
                            <button type="button"
                              onClick={() => setEditRow({
                                id: r.id,
                                vendor: r.vendor || '',
                                invoiceNumber: r.invoiceNumber || '',
                                date: r.date || '',
                                total: r.total ?? '',
                                net: r.net ?? '',
                                vat: r.vat ?? '',
                              })}
                              className="flex-1 rounded-lg py-1.5 text-xs font-semibold border border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                              ✏️ Διόρθωση
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
