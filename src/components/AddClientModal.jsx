import { useState } from 'react'
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

const CITIES    = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES  = ['Laser', 'Facial', 'Injectable', 'Body']
const DURATIONS = ['30 λεπτά', '45 λεπτά', '1 ώρα', '1 ώρα και 30 λεπτά', '2 ώρες']
const TIMES     = ['Πρωί (09:00–12:00)', 'Μεσημέρι (12:00–15:00)', 'Απόγευμα (15:00–19:00)', 'Οποιαδήποτε ώρα']

function toTs(str) {
  return str ? Timestamp.fromDate(new Date(str)) : null
}

export default function AddClientModal({ onClose }) {
  const { currentUser, userProfile } = useAuth()

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    city: '', service: '',
    salesPerson: userProfile?.displayName || '',
    dateRangeStart: '', dateRangeEnd: '',
    preferredDate1: '', preferredDate2: '', preferredDate3: '',
    preferredTime: '', appointmentDuration: '',
    originalPrice: '', discountedPrice: '',
    whyWaiting: '', comments: '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name    = 'Υποχρεωτικό'
    if (!form.phone.trim()) e.phone   = 'Υποχρεωτικό'
    if (!form.city)         e.city    = 'Υποχρεωτικό'
    if (!form.service)      e.service = 'Υποχρεωτικό'
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSaving(true)
    try {
      await addDoc(collection(db, 'clients'), {
        name:        form.name.trim(),
        email:       form.email.trim(),
        phone:       form.phone.trim(),
        city:        form.city,
        service:     form.service,
        salesPerson: form.salesPerson,
        dateRangeStart:  toTs(form.dateRangeStart),
        dateRangeEnd:    toTs(form.dateRangeEnd),
        preferredDate1:  toTs(form.preferredDate1),
        preferredDate2:  toTs(form.preferredDate2),
        preferredDate3:  toTs(form.preferredDate3),
        preferredTime:       form.preferredTime,
        appointmentDuration: form.appointmentDuration,
        originalPrice:   form.originalPrice   ? Number(form.originalPrice)   : null,
        discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
        whyWaiting:  form.whyWaiting,
        comments:    form.comments,
        status:      'Waiting',
        contactHistory: [],
        calledBy:    null,
        leadCaptureDate: serverTimestamp(),
        createdAt:   serverTimestamp(),
        updatedAt:   serverTimestamp(),
        addedBy:     { uid: currentUser.uid, name: userProfile?.displayName || currentUser.email },
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const F = ({ label, error, children }) => (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl p-6 mt-4 mb-4">
        <h2 className="text-xl font-semibold mb-5">Νέος Πελάτης — Λίστα Αναμονής</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <F label="Ονοματεπώνυμο *" error={errors.name}>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </F>
          <F label="Τηλέφωνο *" error={errors.phone}>
            <input className="input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </F>
          <F label="Email">
            <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </F>
          <F label="Sales Person">
            <input className="input" value={form.salesPerson} onChange={e => set('salesPerson', e.target.value)} />
          </F>

          <F label="Πόλη *" error={errors.city}>
            <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
              <option value="">— Επιλογή —</option>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </F>
          <F label="Υπηρεσία *" error={errors.service}>
            <select className="input" value={form.service} onChange={e => set('service', e.target.value)}>
              <option value="">— Επιλογή —</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </F>

          <F label="Εύρος ημερομηνιών — Από">
            <input className="input" type="date" value={form.dateRangeStart} onChange={e => set('dateRangeStart', e.target.value)} />
          </F>
          <F label="Εύρος ημερομηνιών — Έως">
            <input className="input" type="date" value={form.dateRangeEnd} onChange={e => set('dateRangeEnd', e.target.value)} />
          </F>

          <F label="Επιθυμητή Ημ/νία 1">
            <input className="input" type="date" value={form.preferredDate1} onChange={e => set('preferredDate1', e.target.value)} />
          </F>
          <F label="Επιθυμητή Ημ/νία 2">
            <input className="input" type="date" value={form.preferredDate2} onChange={e => set('preferredDate2', e.target.value)} />
          </F>
          <F label="Επιθυμητή Ημ/νία 3">
            <input className="input" type="date" value={form.preferredDate3} onChange={e => set('preferredDate3', e.target.value)} />
          </F>

          <F label="Επιθυμητή Ώρα">
            <select className="input" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)}>
              <option value="">— Επιλογή —</option>
              {TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </F>

          <F label="Διάρκεια Ραντεβού">
            <select className="input" value={form.appointmentDuration} onChange={e => set('appointmentDuration', e.target.value)}>
              <option value="">— Επιλογή —</option>
              {DURATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </F>

          <F label="Αρχική Τιμή (€)">
            <input className="input" type="number" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} />
          </F>
          <F label="Τιμή με Έκπτωση (€)">
            <input className="input" type="number" value={form.discountedPrice} onChange={e => set('discountedPrice', e.target.value)} />
          </F>
        </div>

        <div className="mt-4 space-y-4">
          <F label="Γιατί είναι στη λίστα αναμονής;">
            <textarea className="input resize-none" rows={2} value={form.whyWaiting} onChange={e => set('whyWaiting', e.target.value)} />
          </F>
          <F label="Σχόλια">
            <textarea className="input resize-none" rows={2} value={form.comments} onChange={e => set('comments', e.target.value)} />
          </F>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={saving}>Ακύρωση</button>
          <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Αποθήκευση…' : 'Προσθήκη Πελάτη'}
          </button>
        </div>
      </div>
    </div>
  )
}
