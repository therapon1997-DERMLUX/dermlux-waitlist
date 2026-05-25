import { useState, useEffect } from 'react'
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function MedicalRecords() {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', dob: '', city: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'patients'), orderBy('name'))
    return onSnapshot(q, snap => {
      setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [])

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  )

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'patients'), {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        createdAt: serverTimestamp(),
        createdBy: userProfile?.displayName || '',
        allergies: '',
        medications: '',
        conditions: '',
        contraindications: '',
        notes: '',
      })
      setForm({ name: '', phone: '', dob: '', city: '' })
      setShowAdd(false)
    } finally {
      setSaving(false)
    }
  }

  const cities = ['Πάφος', 'Λευκωσία', 'Λεμεσός', 'Λάρνακα']

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ασθενείς / Patients</h1>
          <p className="text-sm text-gray-500 mt-0.5">{patients.length} εγγραφές</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Νέος Ασθενής
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Αναζήτηση με όνομα ή τηλέφωνο..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Patient list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {search ? 'Δεν βρέθηκαν ασθενείς' : 'Δεν υπάρχουν ασθενείς ακόμα'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/medical/${p.id}`)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div>
                <p className="font-semibold text-gray-800">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.phone && <span className="mr-3">{p.phone}</span>}
                  {p.dob && <span className="mr-3">DOB: {p.dob}</span>}
                  {p.city && <span className="text-blue-600">{p.city}</span>}
                </p>
              </div>
              <span className="text-gray-400 text-lg">›</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Patient Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-800 text-lg">Νέος Ασθενής</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <form onSubmit={handleAdd} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ονοματεπώνυμο *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Όνομα Επώνυμο"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Τηλέφωνο</label>
                <input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+357 99 000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία Γέννησης</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Πόλη</label>
                <select
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Επιλέξτε...</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
