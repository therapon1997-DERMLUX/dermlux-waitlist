import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { isClientForDay, isClientForWeek, groupByDay, fmt } from '../utils/dateHelpers'
import { format, startOfWeek } from 'date-fns'
import { el } from 'date-fns/locale'
import ClientCard from './ClientCard'
import AddClientModal from './AddClientModal'

const CITIES   = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES = ['Laser', 'Facial', 'Injectable', 'Body']

export default function Dashboard() {
  const [clients, setClients]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [tab, setTab]             = useState('today')   // 'today' | 'week' | 'all'
  const [cityFilter, setCityFilter]    = useState('All')
  const [serviceFilter, setServiceFilter] = useState('All')
  const [showAdd, setShowAdd]     = useState(false)
  const today = useMemo(() => new Date(), [])

  useEffect(() => {
    const q = query(collection(db, 'clients'))
    const unsub = onSnapshot(q, snap => {
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLastUpdate(new Date())
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    let base = clients.filter(c => c.status === 'Waiting')
    if (cityFilter    !== 'All') base = base.filter(c => c.city    === cityFilter)
    if (serviceFilter !== 'All') base = base.filter(c => c.service === serviceFilter)
    return base
  }, [clients, cityFilter, serviceFilter])

  const todayClients = useMemo(
    () => filtered.filter(c => isClientForDay(c, today)),
    [filtered, today]
  )

  const weekGroups = useMemo(
    () => groupByDay(filtered, startOfWeek(today, { weekStartsOn: 1 })),
    [filtered, today]
  )

  const tabClass = (t) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      tab === t ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
    }`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Λίστα Αναμονής</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {lastUpdate
              ? `Τελευταία ενημέρωση: ${format(lastUpdate, 'HH:mm:ss')}`
              : 'Φόρτωση…'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + Νέος Πελάτης
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 self-center">Πόλη:</span>
          {['All', ...CITIES].map(c => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                cityFilter === c
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {c === 'All' ? 'Όλες' : c}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-gray-200 hidden sm:block" />
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600 self-center">Υπηρεσία:</span>
          {['All', ...SERVICES].map(s => (
            <button
              key={s}
              onClick={() => setServiceFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                serviceFilter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {s === 'All' ? 'Όλες' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button className={tabClass('today')} onClick={() => setTab('today')}>
          Σήμερα
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs rounded-full px-2">
            {todayClients.length}
          </span>
        </button>
        <button className={tabClass('week')} onClick={() => setTab('week')}>
          Εβδομάδα
          <span className="ml-2 bg-blue-100 text-blue-700 text-xs rounded-full px-2">
            {filtered.filter(c => isClientForWeek(c, today)).length}
          </span>
        </button>
        <button className={tabClass('all')} onClick={() => setTab('all')}>
          Όλοι στη λίστα
          <span className="ml-2 bg-gray-100 text-gray-600 text-xs rounded-full px-2">
            {filtered.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Φόρτωση…</div>
      ) : tab === 'today' ? (
        <TodayView clients={todayClients} />
      ) : tab === 'week' ? (
        <WeekView groups={weekGroups} />
      ) : (
        <AllView clients={filtered} />
      )}

      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

function TodayView({ clients }) {
  if (!clients.length)
    return <EmptyState msg="Δεν υπάρχουν υποψήφιοι πελάτες για σήμερα." />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(c => <ClientCard key={c.id} client={c} />)}
    </div>
  )
}

function WeekView({ groups }) {
  const hasAny = groups.some(g => g.clients.length > 0)
  if (!hasAny) return <EmptyState msg="Δεν υπάρχουν υποψήφιοι για αυτή την εβδομάδα." />

  return (
    <div className="space-y-6">
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

function AllView({ clients }) {
  if (!clients.length) return <EmptyState msg="Η λίστα αναμονής είναι άδεια." />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(c => <ClientCard key={c.id} client={c} />)}
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
