import { useState } from 'react'
import { doc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

const RESULTS = [
  {
    value: 'Scheduled',
    label: 'Κλείστηκε Ραντεβού',
    color: 'text-green-700',
    desc: 'Ο πελάτης κλείνει ραντεβού. Μεταφέρεται στους Ολοκληρωμένους και προστίθεται στο leaderboard.',
  },
  {
    value: 'Will Call Back',
    label: 'Θα ξανακαλέσουμε',
    color: 'text-orange-600',
    desc: 'Ο πελάτης ενδιαφέρεται αλλά δεν κλείστηκε τώρα. Μένει στη λίστα για επανακλήση.',
  },
  {
    value: 'No Answer',
    label: 'Δεν απάντησε',
    color: 'text-yellow-600',
    desc: 'Δεν σήκωσε το τηλέφωνο. Μένει στη λίστα, καταγράφεται η απόπειρα.',
  },
  {
    value: 'Not Interested',
    label: 'Δεν ενδιαφέρεται',
    color: 'text-red-600',
    desc: 'Ο πελάτης αρνήθηκε. Αφαιρείται οριστικά από τη λίστα αναμονής.',
  },
  {
    value: 'Other',
    label: 'Άλλο',
    color: 'text-gray-600',
    desc: 'Διάφορο αποτέλεσμα. Μένει στη λίστα — χρησιμοποίησε τα σχόλια για λεπτομέρειες.',
  },
]

const STAYS_WAITING = ['Will Call Back', 'No Answer', 'Other']

export default function ContactResultModal({ client, onClose, collectionName = 'clients' }) {
  const { currentUser, userProfile } = useAuth()
  const [result, setResult]             = useState('')
  const [notes, setNotes]               = useState('')
  const [nextCallDate, setNextCallDate]  = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')

  // Date update section
  const [updateDates, setUpdateDates]   = useState(false)
  const [dateMode, setDateMode]         = useState('range') // 'range' | 'specific'
  const [rangeStart, setRangeStart]     = useState('')
  const [rangeEnd, setRangeEnd]         = useState('')
  const [date1, setDate1]               = useState('')
  const [date2, setDate2]               = useState('')
  const [date3, setDate3]               = useState('')

  async function handleSave() {
    if (!result) return
    setSaving(true)
    setError('')
    try {
      // Use ISO string for date — avoids Firestore arrayUnion issues with nested Timestamps
      const logEntry = {
        date:          new Date().toISOString(),
        userId:        currentUser.uid,
        userName:      userProfile?.displayName || currentUser.email,
        result,
        notes,
        nextCallDate:  nextCallDate  || null,
        scheduledDate: scheduledDate || null,
      }

      const newStatus = result === 'Scheduled'      ? 'Scheduled'
                      : result === 'Not Interested' ? 'Not Interested'
                      : 'Waiting'

      const updates = {
        contactHistory: arrayUnion(logEntry),
        calledBy:       null,
        status:         newStatus,
        updatedAt:      serverTimestamp(),
      }

      // Optionally update availability dates when client stays on the waiting list
      if (updateDates && STAYS_WAITING.includes(result)) {
        if (dateMode === 'range') {
          updates.dateRangeStart  = rangeStart ? Timestamp.fromDate(new Date(rangeStart)) : null
          updates.dateRangeEnd    = rangeEnd   ? Timestamp.fromDate(new Date(rangeEnd))   : null
          updates.preferredDate1  = null
          updates.preferredDate2  = null
          updates.preferredDate3  = null
        } else {
          updates.preferredDate1  = date1 ? Timestamp.fromDate(new Date(date1)) : null
          updates.preferredDate2  = date2 ? Timestamp.fromDate(new Date(date2)) : null
          updates.preferredDate3  = date3 ? Timestamp.fromDate(new Date(date3)) : null
          updates.dateRangeStart  = null
          updates.dateRangeEnd    = null
        }
      }

      await updateDoc(doc(db, collectionName, client.id), updates)
      onClose()
    } catch (err) {
      setError(err.message || 'Σφάλμα κατά την αποθήκευση. Δοκιμάστε ξανά.')
    } finally {
      setSaving(false)
    }
  }

  const staysWaiting = STAYS_WAITING.includes(result)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="card w-full max-w-md p-6 space-y-4 my-4">
        <h2 className="text-lg font-semibold">Αποτέλεσμα Επικοινωνίας</h2>
        <p className="text-sm text-gray-500">{client.name} — {client.phone}</p>

        {/* Result options */}
        <div className="space-y-2">
          {RESULTS.map(r => (
            <label key={r.value}
              className={`flex items-start gap-3 cursor-pointer px-3 py-2.5 rounded-lg border transition-colors ${
                result === r.value ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-gray-50'
              }`}>
              <input
                type="radio"
                name="result"
                value={r.value}
                checked={result === r.value}
                onChange={() => { setResult(r.value); setUpdateDates(false) }}
                className="accent-blue-600 mt-0.5 shrink-0"
              />
              <div>
                <div className={`font-medium text-sm ${r.color}`}>{r.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Next call date — Will Call Back */}
        {result === 'Will Call Back' && (
          <div>
            <label className="label">Επόμενη κλήση</label>
            <input type="date" className="input" value={nextCallDate} onChange={e => setNextCallDate(e.target.value)} />
          </div>
        )}

        {/* Appointment date — Scheduled */}
        {result === 'Scheduled' && (
          <div>
            <label className="label">Ημερομηνία ραντεβού</label>
            <input type="date" className="input" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
          </div>
        )}

        {/* Date update section — only for results that keep client Waiting */}
        {staysWaiting && (
          <div className="border-t pt-3">
            <button type="button"
              onClick={() => setUpdateDates(x => !x)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-medium">
              <span>{updateDates ? '▲' : '▼'}</span>
              Αλλαγή ημερομηνιών διαθεσιμότητας
            </button>

            {updateDates && (
              <div className="mt-3 space-y-3">
                {/* Mode toggle */}
                <div className="flex gap-2">
                  {['range', 'specific'].map(m => (
                    <button key={m} type="button"
                      onClick={() => setDateMode(m)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        dateMode === m
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}>
                      {m === 'range' ? 'Εύρος ημερομηνιών' : 'Συγκεκριμένες ημερομηνίες'}
                    </button>
                  ))}
                </div>

                {dateMode === 'range' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Από</label>
                      <input type="date" className="input" value={rangeStart} onChange={e => setRangeStart(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Έως</label>
                      <input type="date" className="input" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="label">Ημερομηνία 1</label>
                      <input type="date" className="input" value={date1} onChange={e => setDate1(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Ημερομηνία 2 (προαιρετική)</label>
                      <input type="date" className="input" value={date2} onChange={e => setDate2(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Ημερομηνία 3 (προαιρετική)</label>
                      <input type="date" className="input" value={date3} onChange={e => setDate3(e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
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

        {/* Error message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </div>
        )}

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
