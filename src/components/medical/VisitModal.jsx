import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'

const TREATMENT_TYPES = ['Laser', 'Facial', 'Injectable', 'Body', 'Άλλο / Other']

export default function VisitModal({ patient, onClose }) {
  const { userProfile } = useAuth()
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    treatment: '',
    products: '',
    units: '',
    staff: userProfile?.displayName || '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    if (!form.treatment) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'visits'), {
        patientId: patient.id,
        patientName: patient.name,
        date: form.date,
        treatment: form.treatment,
        products: form.products.trim(),
        units: form.units.trim(),
        staff: form.staff.trim(),
        notes: form.notes.trim(),
        createdAt: serverTimestamp(),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold text-gray-800 text-lg">Νέα Επίσκεψη / New Visit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ημερομηνία / Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Τύπος Θεραπείας / Treatment *</label>
            <select
              required
              value={form.treatment}
              onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Επιλέξτε...</option>
              {TREATMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Προϊόντα / Products</label>
            <input
              value={form.products}
              onChange={e => setForm(f => ({ ...f, products: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="π.χ. Botox, Juvederm..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Δόση / Units</label>
            <input
              value={form.units}
              onChange={e => setForm(f => ({ ...f, units: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="π.χ. 20 units, 1ml..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Θεραπευτής / Practitioner</label>
            <input
              value={form.staff}
              onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Σημειώσεις / Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Παρατηρήσεις θεραπείας..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  )
}
