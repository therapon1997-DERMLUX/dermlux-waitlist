import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { isClientForDay, isClientForWeek, groupByDay, toDate } from '../utils/dateHelpers'
import { format, startOfWeek, subWeeks, isBefore, startOfDay, isWithinInterval, startOfToday, endOfDay } from 'date-fns'
import { el } from 'date-fns/locale'
import ClientCard from './ClientCard'
import AddClientModal from './AddClientModal'

const CITIES   = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES = ['Laser', 'Facial', 'Injectable', 'Body']

function isPast(client) {
  const today = startOfToday()
  const rangeEnd = toDate(client.dateRangeEnd)
  if (rangeEnd && isBefore(rangeEnd, today)) return true
  const prefs = [client.preferredDate1, client.preferredDate2, client.preferredDate3]
    .map(toDate).filter(Boolean)
  if (prefs.length > 0 && prefs.every(d => isBefore(d, today))) return true
  return false
}

function isToday(ts) {
  const d = toDate(ts)
  if (!d) return false
  return isWithinInterval(d, { start: startOfDay(new Date()), end: endOfDay(new Date()) })
}

export default function Dashboard() {
  const [clients,    setClients]    = useState([])
  const [hhClients,  setHhClients]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [hhLoading,  setHhLoading]  = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [section,    setSection]    = useState('waitlist') // 'waitlist' | 'happyhour'
  const [tab,        setTab]        = useState('today')
  const [cityFilter,    setCityFilter]    = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [showAdd,    setShowAdd]    = useState(false)

  const today        = useMemo(() => new Date(), [])
  const lastWeekStart = useMemo(() => startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), [today])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'clients')), snap => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLastUpdate(new Date())
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'happyhour')), snap => {
      setHhClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setHhLoading(false)
    })
    return unsub
  }, [])

  // Reset tab when switching sections
  function switchSection(s) {
    setSection(s)
    setTab(s === 'happyhour' ? 'all' : 'today')
    setCityFilter('All')
    setServiceFilter('All')
  }

  // ── Active collection for the selected section ────────────────────────────
  const collectionName = section === 'happyhour' ? 'happyhour' : 'clients'
  const activeClients  = section === 'happyhour' ? hhClients : clients
  const isLoading      = section === 'happyhour' ? hhLoading : loading

  const waiting   = useMemo(() => activeClients.filter(c => c.status === 'Waiting'), [activeClients])
  const scheduled = useMemo(() => activeClients.filter(c => c.status === 'Scheduled'), [activeClients])

  const filtered = useMemo(() => {
    let base = waiting
    if (cityFilter    !== 'All') base = base.filter(c => c.city    === cityFilter)
    if (serviceFilter !== 'All') base = base.filter(c => c.service === serviceFilter)
    return base
  }, [waiting, cityFilter, serviceFilter])

  const scheduledFiltered = useMemo(() => {
    let base = scheduled
    if (cityFilter    !== 'All') base = base.filter(c => c.city    === cityFilter)
    if (serviceFilter !== 'All') base = base.filter(c => c.service === serviceFilter)
    return base
  }, [scheduled, cityFilter, serviceFilter])

  const todayClients   = useMemo(() => filtered.filter(c => isClientForDay(c, today)), [filtered, today])
  const weekGroups     = useMemo(() => groupByDay(filtered, startOfWeek(today, { weekStartsOn: 1 })), [filtered, today])
  const pastWeekGroups = useMemo(() => groupByDay(filtered, lastWeekStart), [filtered, lastWeekStart])
  const unmanaged      = useMemo(() => filtered.filter(c => isPast(c)), [filtered])

  // ── Combined metrics (both collections) ──────────────────────────────────
  const allClients = useMemo(() => [...clients, ...hhClients], [clients, hhClients])

  const totalWaiting = useMemo(
    () => allClients.filter(c => c.status === 'Waiting').length,
    [allClients]
  )

  const todayContacts = useMemo(() => {
    const logs = []
    allClients.forEach(c => (c.contactHistory || []).forEach(h => {
      if (isToday(h.date)) logs.push({ ...h, clientName: c.name })
    }))
    return logs
  }, [allClients])

  const scheduledToday = todayContacts.filter(l => l.result === 'Scheduled')

  const totalUnmanaged = useMemo(
    () => allClients.filter(c => c.status === 'Waiting' && isPast(c)).length,
    [allClients]
  )

  // ── Leaderboard (both collections, today) ────────────────────────────────
  const leaderboard = useMemo(() => {
    const map = {}
    allClients.forEach(c => {
      (c.contactHistory || []).forEach(h => {
        if (h.result === 'Scheduled' && isToday(h.date)) {
          const name = h.userName || 'Άγνωστος'
          map[name] = (map[name] || 0) + 1
        }
      })
    })
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allClients])

  const tabClass = (t) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
    }`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* ── Metrics + Leaderboard ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Σε Αναμονή"     value={totalWaiting}           color="blue"   icon="📋" />
        <MetricCard label="Κλήσεις Σήμερα" value={todayContacts.length}   color="indigo" icon="📞" />
        <MetricCard label="Ραντεβού Σήμερα" value={scheduledToday.length} color="green"  icon="✅" />
        <MetricCard label="Αδιαχείριστοι"  value={totalUnmanaged}         color="orange" icon="⚠️" />
      </div>

      {/* ── Leaderboard ── */}
      {leaderboard.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏆</span>
            <h2 className="font-semibold text-gray-800">Leaderboard Σήμερα</h2>
            <span className="text-xs text-gray-400 ml-1">ραντεβού που κλείστηκαν</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {leaderboard.map((entry, i) => (
              <div key={entry.name}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                  ${i === 0 ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                    i === 1 ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                    i === 2 ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                    'bg-white text-gray-600 border border-gray-200'}`}>
                <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                <span>{entry.name}</span>
                <span className="font-bold text-base">{entry.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section Switcher ── */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => switchSection('waitlist')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            section === 'waitlist'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📋 Λίστα Αναμονής
          <span className={`ml-2 text-xs rounded-full px-2 py-0.5 font-medium ${
            section === 'waitlist' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
          }`}>
            {clients.filter(c => c.status === 'Waiting').length}
          </span>
        </button>
        <button
          onClick={() => switchSection('happyhour')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            section === 'happyhour'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ⚡ Happy Hour
          <span className={`ml-2 text-xs rounded-full px-2 py-0.5 font-medium ${
            section === 'happyhour' ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'
          }`}>
            {hhClients.filter(c => c.status === 'Waiting').length}
          </span>
        </button>
      </div>

      {/* Happy Hour info banner */}
      {section === 'happyhour' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-800 font-medium flex items-center gap-2">
          ⚡ Πελάτες Happy Hour — καλούνται μόνο για τελευταίας στιγμής διαθεσιμότητα ή ακυρώσεις.
        </div>
      )}

      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          {lastUpdate ? `Τελευταία ενημέρωση: ${format(lastUpdate, 'HH:mm:ss')}` : 'Φόρτωση…'}
        </p>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          {section === 'happyhour' ? '+ Νέος Happy Hour' : '+ Νέος Πελάτης'}
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 self-center">Πόλη:</span>
          {['All', ...CITIES].map(c => (
            <button key={c} onClick={() => setCityFilter(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                cityFilter === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}>
              {c === 'All' ? 'Όλες' : c}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 self-center">Υπηρεσία:</span>
          {['All', ...SERVICES].map(s => (
            <button key={s} onClick={() => setServiceFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                serviceFilter === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}>
              {s === 'All' ? 'Όλες' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {section === 'waitlist' && (
          <>
            <button className={tabClass('today')} onClick={() => setTab('today')}>
              Σήμερα <Pill n={todayClients.length} />
            </button>
            <button className={tabClass('week')} onClick={() => setTab('week')}>
              Εβδομάδα <Pill n={filtered.filter(c => isClientForWeek(c, today)).length} />
            </button>
            <button className={tabClass('pastweek')} onClick={() => setTab('pastweek')}>
              Περασμένη Εβδ. <Pill n={filtered.filter(c => isClientForWeek(c, lastWeekStart)).length} color="orange" />
            </button>
            <button className={tabClass('unmanaged')} onClick={() => setTab('unmanaged')}>
              Αδιαχείριστοι <Pill n={unmanaged.length} color="red" />
            </button>
          </>
        )}
        <button className={tabClass('scheduled')} onClick={() => setTab('scheduled')}>
          Ολοκληρωμένοι <Pill n={scheduledFiltered.length} color="green" />
        </button>
        <button className={tabClass('all')} onClick={() => setTab('all')}>
          Όλοι <Pill n={filtered.length} color="gray" />
        </button>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Φόρτωση…</div>
      ) : tab === 'today' ? (
        <GridView clients={todayClients} empty="Δεν υπάρχουν υποψήφιοι για σήμερα." collectionName={collectionName} />
      ) : tab === 'week' ? (
        <WeekView groups={weekGroups} empty="Δεν υπάρχουν υποψήφιοι για αυτή την εβδομάδα." collectionName={collectionName} />
      ) : tab === 'pastweek' ? (
        <WeekView groups={pastWeekGroups} empty="Δεν υπάρχουν από την περασμένη εβδομάδα." pastWeek collectionName={collectionName} />
      ) : tab === 'unmanaged' ? (
        <>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700 font-medium">
            ⚠️ Αυτοί οι πελάτες έχουν παρελθοντικές ημερομηνίες και είναι ακόμα σε αναμονή — χρειάζονται άμεση επικοινωνία.
          </div>
          <GridView clients={unmanaged} empty="Δεν υπάρχουν αδιαχείριστοι πελάτες." collectionName={collectionName} />
        </>
      ) : tab === 'scheduled' ? (
        <GridView clients={scheduledFiltered} empty="Δεν υπάρχουν ολοκληρωμένοι ακόμα." collectionName={collectionName} />
      ) : (
        <GridView clients={filtered} empty="Η λίστα αναμονής είναι άδεια." collectionName={collectionName} />
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} isHappyHour={section === 'happyhour'} />}
    </div>
  )
}

function Pill({ n, color = 'blue' }) {
  const cls = {
    blue:   'bg-blue-100 text-blue-700',
    red:    'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    green:  'bg-green-100 text-green-700',
    gray:   'bg-gray-100 text-gray-600',
  }
  return <span className={`ml-1.5 text-xs rounded-full px-2 py-0.5 font-medium ${cls[color]}`}>{n}</span>
}

function MetricCard({ label, value, color, icon }) {
  const cls = {
    blue:   'bg-blue-50 border-blue-100 text-blue-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    green:  'bg-green-50 border-green-100 text-green-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  }
  return (
    <div className={`card p-4 border ${cls[color]} flex items-center gap-3`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs opacity-75">{label}</div>
      </div>
    </div>
  )
}

function GridView({ clients, empty, collectionName }) {
  if (!clients.length) return <EmptyState msg={empty} />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(c => <ClientCard key={c.id} client={c} collectionName={collectionName} />)}
    </div>
  )
}

function WeekView({ groups, empty, pastWeek, collectionName }) {
  const hasAny = groups.some(g => g.clients.length > 0)
  if (!hasAny) return <EmptyState msg={empty} />
  return (
    <div className="space-y-6">
      {pastWeek && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-orange-700 font-medium">
          ⚠️ Αυτοί οι πελάτες δεν κλείστηκαν την περασμένη εβδομάδα — ελέγξτε αν χρειάζονται επαναπρογραμματισμό.
        </div>
      )}
      {groups.map(({ day, label, clients }) =>
        clients.length > 0 && (
          <div key={day.toISOString()}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
              {label} <span className="ml-2 badge bg-blue-100 text-blue-700">{clients.length}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(c => <ClientCard key={c.id} client={c} collectionName={collectionName} />)}
            </div>
          </div>
        )
      )}
    </div>
  )
}

function EmptyState({ msg }) {
  return (
    <div className="text-center py-20 text-gray-400">
      <div className="text-4xl mb-3">📋</div>
      <div>{msg}</div>
    </div>
  )
}
