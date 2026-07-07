import { useState, useEffect, useRef } from 'react'
import {
  collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { LOCATIONS } from './ExpenseModal'

// Upload-only σελίδα για store managers (role 'expenses'): φωτογραφίζουν/ανεβάζουν
// αποδείξεις του καταστήματός τους. ΔΕΝ βλέπουν οικονομικά — μόνο τα δικά τους
// πρόσφατα uploads. Το AI διαβάζει το παραστατικό σιωπηλά και ο Θεράπων το
// εγκρίνει από τα Λογιστικά (status: pending).

const WORKER = import.meta.env.VITE_WORKER_URL || ''

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ExpenseUpload() {
  const { userProfile, currentUser } = useAuth()
  const [location, setLocation] = useState('')
  const [busy, setBusy]     = useState(false)
  const [msg, setMsg]       = useState('')
  const [error, setError]   = useState('')
  const [recent, setRecent] = useState([])
  const inputRef  = useRef(null)
  const cameraRef = useRef(null)

  // Προεπιλεγμένο location από το προφίλ του manager
  useEffect(() => {
    if (userProfile?.location && LOCATIONS.includes(userProfile.location)) setLocation(userProfile.location)
    else if (!location) setLocation(LOCATIONS[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile])

  async function loadRecent() {
    if (!currentUser) return
    try {
      const snap = await getDocs(query(
        collection(db, 'expenses'),
        where('createdByUid', '==', currentUser.uid),
        orderBy('createdAt', 'desc'), limit(15)))
      setRecent(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { /* index may be missing on first run — non-fatal */ }
  }
  useEffect(() => { loadRecent() }, [currentUser]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleFile(file) {
    if (!file || busy) return
    if (file.size > 12 * 1024 * 1024) { setError('Το αρχείο είναι πολύ μεγάλο (max 12MB).'); return }
    setError(''); setMsg('Μεταφόρτωση…'); setBusy(true)
    try {
      const base64  = await fileToBase64(file)
      const idToken = await currentUser.getIdToken()

      const uploadRes = await fetch(`${WORKER}/upload-invoice-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ base64, mediaType: file.type, fileName: file.name || `receipt_${Date.now()}` }),
      })
      if (!uploadRes.ok) throw new Error('Η μεταφόρτωση απέτυχε')
      const { fileUrl, fileName } = await uploadRes.json()

      // Σιωπηλή ανάγνωση AI — αν αποτύχει, το παραστατικό μπαίνει κενό για συμπλήρωση
      let f = {}
      setMsg('Ανάγνωση παραστατικού…')
      try {
        const res = await fetch(`${WORKER}/extract-invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ base64, mediaType: file.type, fileName: file.name }),
        })
        const data = await res.json()
        if (res.ok && data.fields) f = data.fields
      } catch { /* extraction optional */ }

      await addDoc(collection(db, 'expenses'), {
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
        location,
        paymentMethod: 'Μετρητά',
        notes: '',
        fileUrl, fileName,
        status: 'pending',
        source: 'manager_upload',
        createdAt: serverTimestamp(),
        createdBy: userProfile?.displayName || '',
        createdByUid: currentUser.uid,
      })
      setMsg('✓ Στάλθηκε! Μπορείς να ανεβάσεις και άλλη απόδειξη.')
      loadRecent()
    } catch (e) {
      setError(e.message || 'Κάτι πήγε στραβά — δοκίμασε ξανά.')
      setMsg('')
    } finally {
      setBusy(false)
      if (inputRef.current)  inputRef.current.value = ''
      if (cameraRef.current) cameraRef.current.value = ''
    }
  }

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
      {msg && !error && <div className="mb-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">{msg}</div>}

      <div
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]) }}
        className={`border-2 border-dashed border-gray-300 rounded-xl py-10 text-center transition-colors ${busy ? 'opacity-50' : 'cursor-pointer hover:border-green-400 hover:bg-green-50/40'}`}>
        <div className="text-4xl mb-2">{busy ? '⏳' : '🧾'}</div>
        <p className="text-gray-700 font-medium">{busy ? 'Επεξεργασία…' : 'Σύρε εδώ την απόδειξη'}</p>
        <p className="text-sm text-gray-500 mt-1">ή κάνε κλικ για επιλογή αρχείου</p>
      </div>

      <input ref={inputRef} type="file" accept="image/*,application/pdf"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <button type="button" disabled={busy} onClick={() => cameraRef.current?.click()}
          className="flex flex-col items-center gap-1 border border-green-200 bg-green-50 text-green-700 rounded-xl py-4 text-sm font-semibold active:bg-green-100 disabled:opacity-50">
          <span className="text-2xl">📷</span> Φωτογράφισε
        </button>
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-1 border border-gray-200 bg-gray-50 text-gray-700 rounded-xl py-4 text-sm font-semibold active:bg-gray-100 disabled:opacity-50">
          <span className="text-2xl">🖼️</span> Από gallery
        </button>
      </div>

      {recent.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Τα πρόσφατά σου</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {recent.map((r, i) => (
              <div key={r.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < recent.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-green-500">🧾</span>
                <span className="flex-1 min-w-0">
                  <span className="text-sm text-gray-800 truncate block">{r.vendor || r.fileName || 'Απόδειξη'}</span>
                  <span className="text-xs text-gray-400">{r.date} · {r.location}</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {r.status === 'confirmed' ? '✓ εγκρίθηκε' : 'σε έλεγχο'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
