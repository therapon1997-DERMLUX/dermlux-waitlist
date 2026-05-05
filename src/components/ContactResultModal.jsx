import { useState } from 'react'
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

const RESULTS = [
  { value: 'Scheduled',      label: 'Κλείστηκε Ραντεβού', color: 'text-green-700' },
  { value: 'Will Call Back', label: 'Θα ξανακαλέσουμε',  color: 'text-orange-600' },
  { value: 'No Answer',      label: 'Δεν απάντησε',       color: 'text-yellow-600' },
  { value: 'Not Interested', label: 'Δεν ενδιαφέρεται',   color: 'text-red-600'    },
  { value: 'Other',          label: 'Άλλο',               color: 'text-gray-600'   },
]

export default function ContactResultModal({ client, onClose }) {
  const { currentUser, userProfile } = useAuth()
  const [result, setResult]           = useState('')
  const [notes, setNotes]             = useState('')
  const [nextCallDate, setNextCallDate] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [saving, setSaving]           = useState(false)

  async function handleSave() {
    if (!result) return
    setSaving(true)
    try {
      const logEntry = {
        date:      Timestamp.now(),
        userId:    currentUser.uid,
        userName:  userProfile?.displayName || currentUser.email,
        result,
        notes,
        nextCallDate:   nextCallDate   ? Timestamp.fromDate(new Date(nextCallDate))   : null,
        scheduledDate:  scheduledDate  ? Timestamp.fromDate(new Date(scheduledDate))  : null,
      }

      const newStatus = result === 'Scheduled'      ? 'Scheduled'
                      : result === 'Not Interested' ? 'Not Interested'
                      : 'Waiting'

      await updateDoc(doc(db, 'clients', client.id), {
        contactHistory: arrayUnion(logEntry),
        calledBy:       null,
        status:         newStatus,
        updatedAt:      serverTimestamp(),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Αποτέλεσμα Επικοινωνίας</h2>
        <p className="text-sm text-gray-500">{client.name} — {client.phone}</p>

        <div className="space-y-2">
          {RESULTS.map(r => (
            <label key={r.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="result"
                value={r.value}
                checked={result === r.value}
                onChange={() => setResult(r.value)}
                className="accent-blue-600"
              />
              <span className={`font-medium text-sm ${r.color}`}>{r.label}</span>
            </label>
          ))}
        </div>

        {result === 'Will Call Back' && (
          <div>
            <label className="label">Επόμενη κλήση</label>
            <input type="date" className="input" value={nextCallDate} onChange={e => setNextCallDate(e.target.value)} />
          </div>
        )}

        {result === 'Scheduled' && (
          <div>
            <label className="label">Ημερομηνία ραντεβού</label>
            <input type="date" className="input" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
          </div>
        )}

        <div>
          <label className="label">Σχόλια</label>
          <textarea
            className="input resize-none"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Προαιρετικά σχόλια…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={saving}>Ακύρωση</button>
          <button className="btn-primary flex-1" onClick={handleSave} disabled={!result || saving}>
            {saving ? 'Αποθήκευση…' : 'Αποθήκευση'}
          </button>
        </div>
      </div>
    </div>
  )
}
