import { useState, useEffect } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval,
  addMonths, subMonths, format, isBefore,
} from 'date-fns'
import { el } from 'date-fns/locale'
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

const CITIES    = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES  = ['Laser', 'Facial', 'Injectable', 'Body']
const DURATIONS = ['30λ', '45λ', '1ώρα', '1:30', '2ώρες']
const TIMES     = ['Πρωί 09-12', 'Μεσημέρι 12-15', 'Απόγευμα 15-19', 'Οποιαδήποτε']

const WEEKDAYS = ['Δε', 'Τρ', 'Τε', 'Πε', 'Πα', 'Σά', 'Κυ']

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ mode = 'range', range, multiDates, onRangeChange, onMultiChange }) {
  const [viewMonth, setViewMonth] = useState(new Date())
  const [step, setStep] = useState('start') // range mode: 'start' | 'end'

  const monthStart = startOfMonth(viewMonth)
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd     = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 })
  const days       = eachDayOfInterval({ start: calStart, end: calEnd })

  function handleClick(day) {
    if (mode === 'range') {
      if (step === 'start') {
        onRangeChange({ start: day, end: null })
        setStep('end')
      } else {
        if (range.start && isBefore(day, range.start)) {
          onRangeChange({ start: day, end: range.start })
        } else {
          onRangeChange({ start: range.start, end: day })
        }
        setStep('start')
      }
    } else {
      const idx = multiDates.findIndex(d => isSameDay(d, day))
      if (idx >= 0) {
        onMultiChange(multiDates.filter((_, i) => i !== idx))
      } else if (multiDates.length < 3) {
        onMultiChange([...multiDates, day])
      }
    }
  }

  function dayClasses(day) {
    const inCurMonth = isSameMonth(day, viewMonth)
    const selected = mode === 'range'
      ? ((range.start && isSameDay(day, range.start)) || (range.end && isSameDay(day, range.end)))
      : multiDates.some(d => isSameDay(d, day))
    const inRange = mode === 'range' && range.start && range.end &&
      isWithinInterval(day, { start: range.start, end: range.end })

    return [
      'relative text-xs py-1.5 w-full text-center rounded-full transition-colors',
      !inCurMonth ? 'text-gray-300 cursor-default' : 'cursor-pointer',
      selected ? 'bg-blue-600 text-white font-semibold' : '',
      inRange && !selected ? 'bg-blue-100 text-blue-700 rounded-none' : '',
      inCurMonth && !selected && !inRange ? 'hover:bg-blue-50' : '',
    ].join(' ')
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3 bg-white select-none">
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold">
          ‹
        </button>
        <span className="text-sm font-semibold capitalize text-gray-700">
          {format(viewMonth, 'MMMM yyyy', { locale: el })}
        </span>
        <button type="button" onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map(day => {
          const idx = mode === 'multi' ? multiDates.findIndex(d => isSameDay(d, day)) : -1
          return (
            <button type="button" key={day.toISOString()} onClick={() => handleClick(day)} className={dayClasses(day)}>
              {format(day, 'd')}
              {idx >= 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px] bg-blue-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold border border-white">
                  {idx + 1}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {mode === 'range' && (
        <p className="text-[10px] text-center text-gray-400 mt-2">
          {step === 'start' ? 'Κάντε κλικ για την αρχή του εύρους' : 'Κάντε κλικ για το τέλος του εύρους'}
        </p>
      )}
      {mode === 'multi' && (
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Επιλέξτε έως 3 ημερομηνίες ({multiDates.length}/3)
        </p>
      )}
    </div>
  )
}

// ── Tag Button ────────────────────────────────────────────────────────────────
function TagBtn({ label, active, onClick, color = 'blue' }) {
  const colors = {
    blue:   active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600',
    purple: active ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400',
    pink:   active ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-600 border-gray-300 hover:border-pink-400',
    teal:   active ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400',
    green:  active ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-300 hover:border-green-400',
  }
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${colors[color]}`}>
      {label}
    </button>
  )
}

const SERVICE_COLORS = { Laser: 'purple', Facial: 'pink', Injectable: 'blue', Body: 'green' }

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AddClientModal({ onClose, isHappyHour = false }) {
  const { currentUser, userProfile } = useAuth()

  const [name, setName]             = useState('')
  const [phone, setPhone]           = useState('')
  const [email, setEmail]           = useState('')
  const [city, setCity]             = useState('')
  const [service, setService]       = useState('')
  const [preferredTime, setTime]    = useState('')
  const [duration, setDuration]     = useState('')
  const [range, setRange]           = useState({ start: null, end: null })
  const [multiDates, setMultiDates] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [salesPerson, setSalesPerson]   = useState(userProfile?.displayName || userProfile?.email || '')
  useEffect(() => {
    const name = userProfile?.displayName || userProfile?.email || ''
    if (name) setSalesPerson(name)
  }, [userProfile])
  const [originalPrice, setOriginalPrice]   = useState('')
  const [discountedPrice, setDiscountedPrice] = useState('')
  const [whyWaiting, setWhyWaiting] = useState('')
  const [comments, setComments]     = useState('')
  const [errors, setErrors]         = useState({})
  const [saving, setSaving]         = useState(false)

  function toTs(date) {
    return date ? Timestamp.fromDate(date) : null
  }

  function validate() {
    const e = {}
    if (!name.trim())  e.name    = true
    if (!phone.trim()) e.phone   = true
    if (!city)         e.city    = true
    if (!service)      e.service = true
    return e
  }

  async function handleSave() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      await addDoc(collection(db, isHappyHour ? 'happyhour' : 'clients'), {
        name:        name.trim(),
        email:       email.trim(),
        phone:       phone.trim(),
        city,
        service,
        salesPerson,
        dateRangeStart:  toTs(range.start),
        dateRangeEnd:    toTs(range.end),
        preferredDate1:  toTs(multiDates[0] || null),
        preferredDate2:  toTs(multiDates[1] || null),
        preferredDate3:  toTs(multiDates[2] || null),
        preferredTime,
        appointmentDuration: duration,
        originalPrice:   originalPrice   ? Number(originalPrice)   : null,
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        whyWaiting,
        comments,
        status:         'Waiting',
        contactHistory: [],
        calledBy:       null,
        leadCaptureDate: serverTimestamp(),
        createdAt:      serverTimestamp(),
        updatedAt:      serverTimestamp(),
        addedBy: { uid: currentUser.uid, name: userProfile?.displayName || currentUser.email },
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const fmtDate = d => d ? format(d, 'dd/MM/yyyy') : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="card w-full max-w-lg p-6 mt-4 mb-4 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {isHappyHour ? '⚡ Νέος Πελάτης Happy Hour' : 'Νέος Πελάτης'}
        </h2>

        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              className={`input ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Ονοματεπώνυμο *"
              value={name} onChange={e => { setName(e.target.value); setErrors(x => ({ ...x, name: false })) }}
              autoFocus
            />
          </div>
          <div>
            <input
              className={`input ${errors.phone ? 'border-red-400' : ''}`}
              placeholder="Τηλέφωνο *"
              type="tel"
              value={phone} onChange={e => { setPhone(e.target.value); setErrors(x => ({ ...x, phone: false })) }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Email (προαιρετικό)" type="email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Sales Person" value={salesPerson}
            onChange={e => setSalesPerson(e.target.value)} />
        </div>

        {/* City */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${errors.city ? 'text-red-500' : 'text-gray-500'}`}>
            Πόλη *
          </p>
          <div className="flex gap-2 flex-wrap">
            {CITIES.map(c => (
              <TagBtn key={c} label={c} active={city === c}
                onClick={() => { setCity(c); setErrors(x => ({ ...x, city: false })) }} />
            ))}
          </div>
        </div>

        {/* Service */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${errors.service ? 'text-red-500' : 'text-gray-500'}`}>
            Υπηρεσία *
          </p>
          <div className="flex gap-2 flex-wrap">
            {SERVICES.map(s => (
              <TagBtn key={s} label={s} active={service === s} color={SERVICE_COLORS[s]}
                onClick={() => { setService(s); setErrors(x => ({ ...x, service: false })) }} />
            ))}
          </div>
        </div>

        {/* Date Range Calendar */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Εύρος Ημερομηνιών
          </p>
          {(range.start || range.end) && (
            <div className="flex items-center gap-2 mb-2 text-sm text-blue-700 font-medium">
              <span>{fmtDate(range.start) || '—'}</span>
              <span>→</span>
              <span>{fmtDate(range.end) || '—'}</span>
              <button type="button" onClick={() => setRange({ start: null, end: null })}
                className="ml-auto text-xs text-gray-400 hover:text-red-500">✕ Καθαρισμός</button>
            </div>
          )}
          <MiniCalendar mode="range" range={range} onRangeChange={setRange} />
        </div>

        {/* Preferred Dates Calendar */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Συγκεκριμένες Επιθυμητές Ημερομηνίες
          </p>
          {multiDates.length > 0 && (
            <div className="flex gap-2 mb-2 flex-wrap">
              {multiDates.map((d, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  {i + 1}. {fmtDate(d)}
                  <button type="button" onClick={() => setMultiDates(multiDates.filter((_, j) => j !== i))}
                    className="hover:text-red-500 ml-0.5">✕</button>
                </span>
              ))}
            </div>
          )}
          <MiniCalendar mode="multi" multiDates={multiDates} onMultiChange={setMultiDates} />
        </div>

        {/* Preferred Time */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Ώρα</p>
          <div className="flex gap-2 flex-wrap">
            {TIMES.map(t => (
              <TagBtn key={t} label={t} active={preferredTime === t}
                onClick={() => setTime(preferredTime === t ? '' : t)} />
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Διάρκεια Ραντεβού</p>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map(d => (
              <TagBtn key={d} label={d} active={duration === d}
                onClick={() => setDuration(duration === d ? '' : d)} />
            ))}
          </div>
        </div>

        {/* Advanced (collapsible) */}
        <div className="border-t pt-3">
          <button type="button" onClick={() => setShowAdvanced(x => !x)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium">
            {showAdvanced ? '▲' : '▼'} Επιπλέον στοιχεία
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="input" type="number" placeholder="Αρχική τιμή €"
                  value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} />
                <input className="input" type="number" placeholder="Τιμή με έκπτωση €"
                  value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)} />
              </div>
              <textarea className="input resize-none" rows={2} placeholder="Γιατί είναι στη λίστα αναμονής;"
                value={whyWaiting} onChange={e => setWhyWaiting(e.target.value)} />
              <textarea className="input resize-none" rows={2} placeholder="Σχόλια…"
                value={comments} onChange={e => setComments(e.target.value)} />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={saving}>Ακύρωση</button>
          <button className="btn-primary flex-1" onClick={handleSave} disabled={saving}>
            {saving ? 'Αποθήκευση…' : 'Προσθήκη'}
          </button>
        </div>
      </div>
    </div>
  )
}
