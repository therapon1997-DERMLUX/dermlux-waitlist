import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { isClientForDay, isClientForWeek, groupByDay } from '../utils/dateHelpers'
import { format, startOfWeek, subWeeks } from 'date-fns'
import { el } from 'date-fns/locale'
import ClientCard from './ClientCard'
import AddClientModal from './AddClientModal'

const CITIES   = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES = ['Laser', 'Facial', 'Injectable', 'Body']

export default function Dashboard() {
  const [clients, setClients]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [tab, setTab]               = useState('today')
  const [cityFilter, setCityFilter]       = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [showAdd, setShowAdd]       = useState(false)
  const today    = useMemo(() => new Date(), [])
  const lastWeekStart = useMemo(() => startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), [today])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'clients')), snap => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLastUpdate(new Date())
      setLoading(false)
    })
    return unsub
  }, [])

  const waiting = useMemo(() => clients.filter(c => c.status === 'Waiting'), [clients])

  const filtered = useMemo(() => {
    let base = waiting
    if (cityFilter    !== 'All') base = base.filter(c => c.city    === cityFilter)
    if (serviceFilter !== 'All') base = base.filter(c => c.service === serviceFilter)
    return base
  }, [waiting, cityFilter, serviceFilter])

  const todayClients    = useMemo(() => filtered.filter(c => isClientForDay(c, today)), [filtered, today])
  const weekGroups      = useMemo(() => groupByDay(filtered, startOfWeek(today, { weekStartsOn: 1 })), [filtered, today])
  const pastWeekGroups  = useMemo(() => groupByDay(filtered, lastWeekStart), [filtered, lastWeekStart])
  const unmanaged       = useMemo(() => filtered.filter(c => !c.contactHistory?.length), [filtered])

  const tabClass = (t) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
    }`

  const badge = (n, color = 'blue') =>
    `ml-2 text-xs rounded-full px-2 ${color === 'red' ? 'bg-red-100 text-red-600' : color === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-700'}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Λίστα Αναμονής</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {lastUpdate ? `Τελευταία ενημέρωση: ${format(lastUpdate, 'HH:mm:ss')}` : 'Φόρτωση…'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>+ Νέος Πελάτης</button>
      </div>

      {/* Filters */}
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

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button className={tabClass('today')} onClick={() => setTab('today')}>
          Σήμερα <span className={badge(todayClients.length)}>{todayClients.length}</span>
        </button>
        <button className={tabClass('week')} onClick={() => setTab('week')}>
          Εβδομάδα <span className={badge(0)}>{filtered.filter(c => isClientForWeek(c, today)).length}</span>
        </button>
        <button className={tabClass('pastweek')} onClick={() => setTab('pastweek')}>
          Περασμένη Εβδομάδα <span className={badge(0, 'orange')}>{filtered.filter(c => isClientForWeek(c, lastWeekStart)).length}</span>
        </button>
        <button className={tabClass('unmanaged')} onClick={() => setTab('unmanaged')}>
          Αδιαχείριστοι <span className={badge(unmanaged.length, 'red')}>{unmanaged.length}</span>
        </button>
        <button className={tabClass('all')} onClick={() => setTab('all')}>
          Όλοι <span className={`ml-2 text-xs rounded-full px-2 bg-gray-100 text-gray-600`}>{filtered.length}</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Φόρτωση…</div>
      ) : tab === 'today' ? (
        <GridView clients={todayClients} empty="Δεν υπάρχουν υποψήφιοι για σήμερα." />
      ) : tab === 'week' ? (
        <WeekView groups={weekGroups} empty="Δεν υπάρχουν υποψήφιοι για αυτή την εβδομάδα." />
      ) : tab === 'pastweek' ? (
        <WeekView groups={pastWeekGroups} empty="Δεν υπάρχουν υποψήφιοι από την περασμένη εβδομάδα." pastWeek />
      ) : tab === 'unmanaged' ? (
        <GridView clients={unmanaged} empty="Δεν υπάρχουν αδιαχείριστοι πελάτες." />
      ) : (
        <GridView clients={filtered} empty="Η λίστα αναμονής είναι άδεια." />
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function GridView({ clients, empty }) {
  if (!clients.length) return <EmptyState msg={empty} />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(c => <ClientCard key={c.id} client={c} />)}
    </div>
  )
}

function WeekView({ groups, empty, pastWeek }) {
  const hasAny = groups.some(g => g.clients.length > 0)
  if (!hasAny) return <EmptyState msg={empty} />
  return (
    <div className="space-y-6">
      {pastWeek && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 text-sm text-orange-700 font-medium">
          ⚠️ Αυτοί οι πελάτες δεν κλείστηκαν την περασμένη εβδομάδα — ελέγξτε αν χρειάζονται επαναπρογραμματισμό.
        </div>
      )}
      {groups.map(({ day, label, clients }) => (
        clients.length > 0 && (
          <div key={day.toISOString()}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">
              {label}
              <span className="ml-2 badge bg-blue-100 text-blue-700">{clients.length}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map(c => <ClientCard key={c.id} client={c} />)}
            </div>
          </div>
        )
      ))}
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
