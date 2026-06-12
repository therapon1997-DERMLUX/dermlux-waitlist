import { useState, useEffect, useRef, useCallback } from 'react'
import {
  collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp,
  query, where, getDocs, limit,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'

export const CATEGORIES = [
  '6201 · ΑΓΟΡΕΣ',
  '8103 · ΕΝΟΙΚΙΑ',
  '8105 · ΠΛΗΡΩΜΕΣ ΕΙΣ ΤΡΙΤΟΥΣ',
  '8106 · ΤΗΛΕΦΩΝΙΚΑ',
  '8108 · ΗΛΕΚΤΡΙΣΜΟΣ',
  '8109 · ΝΕΡΟ',
  '8110 · ΚΑΘΑΡΙΟΤΗΤΑ',
  '8111 · ΓΡΑΦΙΚΗ ΥΛΗ',
  '8112 · ΣΥΝΤΗΡΙΣΗ ΜΗΧΑΝΗΜΑΤΩΝ',
  '8115 · ΕΛΕΓΚΤΙΚΑ',
  '8116 · ΑΣΦΑΛΙΣΤΡΑ',
  '8117 · ΔΙΚΗΓΟΡΙΚΑ',
  '8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ',
  '8120 · ΦΟΡΟΙ & ΑΔΕΙΕΣ',
  '8122 · ΕΙΣΦΟΡΕΣ - ΣΥΝΔΡΟΜΕΣ',
  '8133 · ΣΥΝΤΗΡΙΣΗ ΚΤΙΡΙΩΝ',
  '8136 · ΑΛΛΑ ΕΞΟΔΑ ΠΡΟΣΩΠΙΚΟΥ',
  '8138 · ΕΦΟΔΙΑ & ΣΥΝΤΗΡΙΣΗ Η/Υ',
  '8144 · ΕΚΤΕΛΩΝΙΣΤΙΚΑ',
  '8151 · ΑΝΑΛΥΣΕΙΣ ΧΗΜΕΙΟΥ',
  '8201 · ΠΡΟΜΗΘΕΙΑ - BONUS',
  '8202 · ΠΕΡΙΠΟΙΗΣΗ ΠΕΛΑΤΩΝ',
  '8203 · ΔΙΑΦΗΜΙΣΕΙΣ',
  '8204 · ΜΕΤΑΦΟΡΙΚΑ',
  '8205 · ΕΞΟΔΑ ΟΧΗΜΑΤΩΝ',
  '8400 · ΤΟΚΟΙ & ΕΞΟΔΑ ΤΡΕΧΟΥΜΕΝΟΥ',
]
export const LOCATIONS  = ['Πάφος', 'Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Γενικά']
export const PAYMENT_METHODS = ['Μετρητά', 'Κάρτα', 'Τραπεζική', 'Άλλο']

const WORKER = import.meta.env.VITE_WORKER_URL || ''

const blank = {
  vendor: '', vatNumber: '', invoiceNumber: '', date: new Date().toISOString().slice(0, 10),
  net: '', vat: '', vatRate: 19, total: '', currency: 'EUR',
  category: '8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ', location: 'Γενικά', paymentMethod: 'Κάρτα', notes: '',
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ExpenseModal({ existing, onClose }) {
  const { userProfile, currentUser } = useAuth()
  const editing = !!existing
  const [form, setForm]       = useState(existing ? {
    ...blank, ...existing,
    vendor:        existing.vendor        ?? '',
    vatNumber:     existing.vatNumber     ?? '',
    invoiceNumber: existing.invoiceNumber ?? '',
    notes:         existing.notes        ?? '',
    net:           existing.net           ?? '',
    vat:           existing.vat           ?? '',
    vatRate:       existing.vatRate       ?? 19,
    total:         existing.total         ?? '',
    currency:      existing.currency      || 'EUR',
    category:      existing.category      || '8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ',
    location:      existing.location      || 'Γενικά',
    paymentMethod: existing.paymentMethod || 'Κάρτα',
  } : blank)
  const [fileUrl, setFileUrl] = useState(existing?.fileUrl || '')
  const [fileName, setFileName] = useState(existing?.fileName || '')
  const [stage, setStage]     = useState(editing ? 'form' : 'upload') // upload | reading | form
  const [aiMsg, setAiMsg]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [duplicate, setDuplicate] = useState(null) // { id, vendor, date, total, invoiceNumber }
  const [dupOverride, setDupOverride] = useState(false)
  const inputRef  = useRef(null)
  const dupTimer  = useRef(null)

  // Allow pasting a screenshot (snip) straight into the modal
  useEffect(() => {
    if (stage !== 'upload') return
    function onPaste(e) {
      const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'))
      if (item) handleFile(item.getAsFile())
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [stage])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  // When net + vatRate change, auto-suggest VAT and total (only if user hasn't typed total)
  function recalc(next) {
    const net = parseFloat(next.net)
    const rate = parseFloat(next.vatRate)
    if (!isNaN(net) && !isNaN(rate)) {
      const vat = +(net * rate / 100).toFixed(2)
      return { ...next, vat, total: +(net + vat).toFixed(2) }
    }
    return next
  }

  const checkDuplicate = useCallback(async (invoiceNum) => {
    const num = (invoiceNum || '').trim()
    if (!num) { setDuplicate(null); return }
    try {
      const snap = await getDocs(
        query(collection(db, 'expenses'), where('invoiceNumber', '==', num), limit(3))
      )
      const others = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(d => d.id !== existing?.id)
      setDuplicate(others.length > 0 ? others[0] : null)
      setDupOverride(false)
    } catch { /* non-fatal */ }
  }, [existing?.id])

  // Debounced check when user types invoice number manually
  function handleInvoiceNumberChange(v) {
    set('invoiceNumber', v)
    clearTimeout(dupTimer.current)
    dupTimer.current = setTimeout(() => checkDuplicate(v), 600)
  }

  async function handleFile(file) {
    if (!file) return
    if (file.size > 12 * 1024 * 1024) { setError('Το αρχείο είναι πολύ μεγάλο (max 12MB).'); return }
    setError('')
    setStage('reading')
    setAiMsg('Μεταφόρτωση αρχείου…')
    try {
      const base64  = await fileToBase64(file)
      const idToken = await currentUser.getIdToken()

      // 1. Upload to R2 via Worker
      const uploadRes = await fetch(`${WORKER}/upload-invoice-file`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body:    JSON.stringify({ base64, mediaType: file.type, fileName: file.name || `invoice_${Date.now()}` }),
      })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { fileUrl: url, fileName: safe } = await uploadRes.json()
      setFileUrl(url)
      setFileName(file.name || safe)

      // 2. Ask the AI to read it (optional — skip gracefully if not configured)
      if (WORKER) {
        setAiMsg('Ανάγνωση τιμολογίου με AI…')
        try {
          const res = await fetch(`${WORKER}/extract-invoice`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
            body:    JSON.stringify({ base64, mediaType: file.type, fileName: file.name }),
          })
          const data = await res.json()
          if (res.ok && data.fields) {
            const f = data.fields
            setForm(prev => recalc({
              ...prev,
              vendor:        f.vendor         ?? prev.vendor,
              vatNumber:     f.vat_number     ?? prev.vatNumber,
              invoiceNumber: f.invoice_number ?? prev.invoiceNumber,
              date:          f.date           || prev.date,
              net:           f.net    ?? prev.net,
              vat:           f.vat    ?? prev.vat,
              vatRate:       f.vat_rate ?? prev.vatRate,
              total:         f.total  ?? prev.total,
              currency:      f.currency || prev.currency,
              category:      CATEGORIES.includes(f.category) ? f.category : prev.category,
            }))
            setAiMsg('✓ Συμπληρώθηκε αυτόματα — ελέγξτε και αποθηκεύστε.')
            if (f.invoice_number) checkDuplicate(f.invoice_number)
          } else {
            setAiMsg('Η αυτόματη ανάγνωση δεν ήταν διαθέσιμη — συμπληρώστε χειροκίνητα.')
          }
        } catch {
          setAiMsg('Η αυτόματη ανάγνωση απέτυχε — συμπληρώστε χειροκίνητα.')
        }
      } else {
        setAiMsg('Συμπληρώστε τα στοιχεία χειροκίνητα.')
      }
    } catch (e) {
      console.error(e)
      setError('Η μεταφόρτωση απέτυχε: ' + e.message)
    } finally {
      setStage('form')
    }
  }

  async function openInvoice(url) {
    try {
      const idToken = await currentUser.getIdToken()
      const res = await fetch(url, { headers: { Authorization: `Bearer ${idToken}` } })
      if (!res.ok) throw new Error('Failed to load')
      const blob    = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      window.open(blobUrl, '_blank')
    } catch (e) {
      setError('Αδυναμία φόρτωσης αρχείου: ' + e.message)
    }
  }

  async function save(e) {
    e.preventDefault()
    if (!form.vendor.trim()) { setError('Ο προμηθευτής είναι υποχρεωτικός.'); return }
    if (duplicate && !dupOverride) { setError('Υπάρχει ήδη τιμολόγιο με αυτόν τον αριθμό. Επιβεβαιώστε ότι δεν είναι duplicate.'); return }
    setSaving(true); setError('')
    const payload = {
      vendor: form.vendor.trim(),
      vatNumber: form.vatNumber?.trim() || '',
      invoiceNumber: form.invoiceNumber?.trim() || '',
      date: form.date,
      net: parseFloat(form.net) || 0,
      vat: parseFloat(form.vat) || 0,
      vatRate: parseFloat(form.vatRate) || 0,
      total: parseFloat(form.total) || 0,
      currency: form.currency || 'EUR',
      category: form.category,
      location: form.location,
      paymentMethod: form.paymentMethod,
      notes: form.notes?.trim() || '',
      fileUrl, fileName,
      updatedAt: serverTimestamp(),
    }
    try {
      if (editing) {
        await updateDoc(doc(db, 'expenses', existing.id), payload)
      } else {
        await addDoc(collection(db, 'expenses'), {
          ...payload,
          status: 'confirmed',
          source: WORKER ? 'ai' : 'manual',
          createdAt: serverTimestamp(),
          createdBy: userProfile?.displayName || '',
        })
      }
      onClose()
    } catch (e) {
      setError('Η αποθήκευση απέτυχε: ' + e.message)
      setSaving(false)
    }
  }

  async function remove() {
    if (!editing) return
    if (!confirm('Διαγραφή αυτού του εξόδου;')) return
    setSaving(true)
    try { await deleteDoc(doc(db, 'expenses', existing.id)); onClose() }
    catch (e) { setError('Η διαγραφή απέτυχε: ' + e.message); setSaving(false) }
  }

  const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-xl">
          <h2 className="font-bold text-gray-800 text-lg">{editing ? 'Επεξεργασία Εξόδου' : 'Νέο Έξοδο'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {error && <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}

        {/* Upload stage */}
        {stage === 'upload' && (
          <div className="px-6 py-6">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
              className="border-2 border-dashed border-gray-300 rounded-xl py-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
            >
              <div className="text-4xl mb-2">🧾</div>
              <p className="text-gray-700 font-medium">Σύρετε εδώ το τιμολόγιο</p>
              <p className="text-sm text-gray-500 mt-1">ή κάντε κλικ για επιλογή αρχείου · ή επικολλήστε (Ctrl+V) στιγμιότυπο</p>
              <p className="text-xs text-gray-400 mt-2">Φωτογραφία ή PDF — το AI θα διαβάσει τα στοιχεία</p>
            </div>
            <input ref={inputRef} type="file" accept="image/*,application/pdf" capture="environment"
              className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
            <button onClick={() => setStage('form')} className="mt-4 w-full text-sm text-blue-600 hover:underline">
              Παράλειψη — καταχώρηση χειροκίνητα
            </button>
          </div>
        )}

        {/* Reading stage */}
        {stage === 'reading' && (
          <div className="px-6 py-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600 text-sm">{aiMsg}</p>
          </div>
        )}

        {/* Form stage */}
        {stage === 'form' && (
          <form onSubmit={save} className="px-6 py-4 space-y-4">
            {aiMsg && <div className="bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2">{aiMsg}</div>}

            {duplicate && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 text-base mt-0.5">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">Πιθανό duplicate</p>
                    <p className="text-amber-700 mt-0.5">
                      Τιμολόγιο <strong>#{duplicate.invoiceNumber}</strong> υπάρχει ήδη:&nbsp;
                      <strong>{duplicate.vendor}</strong> · {duplicate.date} · €{duplicate.total}
                    </p>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input type="checkbox" checked={dupOverride} onChange={e => setDupOverride(e.target.checked)}
                        className="accent-amber-600" />
                      <span className="text-amber-800 text-xs font-medium">Δεν είναι duplicate — αποθήκευση κανονικά</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {fileUrl && (
              <button type="button" onClick={() => openInvoice(fileUrl)}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                📎 {fileName || 'Συνημμένο αρχείο'}
              </button>
            )}

            <div>
              <label className={label}>Προμηθευτής *</label>
              <input className={field} value={form.vendor} onChange={e => set('vendor', e.target.value)} placeholder="Επωνυμία προμηθευτή" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>ΑΦΜ / VAT No</label>
                <input className={field} value={form.vatNumber} onChange={e => set('vatNumber', e.target.value)} />
              </div>
              <div>
                <label className={label}>Αρ. Τιμολογίου</label>
                <input className={field} value={form.invoiceNumber}
                  onChange={e => handleInvoiceNumberChange(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Ημερομηνία</label>
                <input type="date" className={field} value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div>
                <label className={label}>Νόμισμα</label>
                <input className={field} value={form.currency} onChange={e => set('currency', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={label}>Καθαρό</label>
                <input type="number" step="0.01" className={field} value={form.net}
                  onChange={e => setForm(f => recalc({ ...f, net: e.target.value }))} />
              </div>
              <div>
                <label className={label}>ΦΠΑ %</label>
                <input type="number" step="1" className={field} value={form.vatRate}
                  onChange={e => setForm(f => recalc({ ...f, vatRate: e.target.value }))} />
              </div>
              <div>
                <label className={label}>Ποσό ΦΠΑ</label>
                <input type="number" step="0.01" className={field} value={form.vat} onChange={e => set('vat', e.target.value)} />
              </div>
            </div>

            <div>
              <label className={label}>Σύνολο</label>
              <input type="number" step="0.01" className={`${field} font-semibold`} value={form.total} onChange={e => set('total', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={label}>Κατηγορία</label>
                <select className={field} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Τοποθεσία</label>
                <select className={field} value={form.location} onChange={e => set('location', e.target.value)}>
                  {LOCATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={label}>Τρόπος Πληρωμής</label>
              <select className={field} value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
                {PAYMENT_METHODS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={label}>Σημειώσεις</label>
              <textarea rows={2} className={field} value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

            <div className="flex gap-3 pt-2">
              {editing && (
                <button type="button" onClick={remove} disabled={saving}
                  className="px-4 border border-red-300 text-red-600 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors">
                  Διαγραφή
                </button>
              )}
              <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Ακύρωση
              </button>
              <button type="submit" disabled={saving || (duplicate && !dupOverride)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50
                  ${duplicate && !dupOverride
                    ? 'bg-amber-500 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                {saving ? 'Αποθήκευση…' : duplicate && !dupOverride ? '⚠️ Duplicate' : 'Αποθήκευση'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
