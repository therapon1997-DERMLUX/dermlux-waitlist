import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { toDate } from '../utils/dateHelpers'

const CITIES   = ['Paphos', 'Nicosia', 'Limassol', 'Larnaca']
const SERVICES = ['Laser', 'Facial', 'Injectable', 'Body']

function isToday(ts) {
  const d = toDate(ts)
  if (!d) return false
  const now = new Date()
  return isWithinInterval(d, { start: startOfDay(now), end: endOfDay(now) })
}

function isThisWeek(ts) {
  const d = toDate(ts)
  if (!d) return false
  const now = new Date()
  return isWithinInterval(d, {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end:   endOfWeek(now,   { weekStartsOn: 1 }),
  })
}

export default function AdminPanel() {
  const { createUser } = useAuth()
  const [clients,   setClients]   = useState([])
  const [hhClients, setHhClients] = useState([])
  const [users,     setUsers]     = useState([])
  const [showCreateUser, setShowCreateUser] = useState(false)

  useEffect(() => {
    const u1 = onSnapshot(query(collection(db, 'clients')), snap =>
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    const u2 = onSnapshot(query(collection(db, 'users')), snap =>
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    const u3 = onSnapshot(query(collection(db, 'happyhour')), snap =>
      setHhClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return () => { u1(); u2(); u3() }
  }, [])

  const allClients = useMemo(() => [...clients, ...hhClients], [clients, hhClients])

  // ---- Metrics (both regular + happy hour) ----
  const todayContacts = useMemo(() => {
    const logs = []
    allClients.forEach(c => {
      (c.contactHistory || []).forEach(h => {
        if (isToday(h.date)) logs.push({ ...h, clientName: c.name })
      })
    })
    return logs
  }, [allClients])

  const weekContacts = useMemo(() => {
    const logs = []
    allClients.forEach(c => {
      (c.contactHistory || []).forEach(h => {
        if (isThisWeek(h.date)) logs.push({ ...h, clientName: c.name })
      })
    })
    return logs
  }, [allClients])

  const scheduledToday = todayContacts.filter(l => l.result === 'Scheduled').length
  const scheduledWeek  = weekContacts.filter(l => l.result === 'Scheduled').length

  // Per agent today
  const agentStats = useMemo(() => {
    const map = {}
    todayContacts.forEach(l => {
      if (!map[l.userName]) map[l.userName] = { total: 0, scheduled: 0 }
      map[l.userName].total++
      if (l.result === 'Scheduled') map[l.userName].scheduled++
    })
    return Object.entries(map).map(([name, s]) => ({ name, ...s }))
  }, [todayContacts])

  // By city (all clients)
  const cityStats = useMemo(() =>
    CITIES.map(city => ({
      city,
      waiting:   allClients.filter(c => c.city === city && c.status === 'Waiting').length,
      scheduled: allClients.filter(c => c.city === city && c.status === 'Scheduled').length,
    })), [allClients])

  // By service (all clients)
  const serviceStats = useMemo(() =>
    SERVICES.map(service => ({
      service,
      waiting: allClients.filter(c => c.service === service && c.status === 'Waiting').length,
    })), [allClients])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Σε αναμονή" value={allClients.filter(c => c.status === 'Waiting').length} color="blue" />
        <StatCard label="Κλήσεις σήμερα" value={todayContacts.length} color="indigo" />
        <StatCard label="Ραντεβού σήμερα" value={scheduledToday} color="green" />
        <StatCard label="Ραντεβού εβδομάδας" value={scheduledWeek} color="teal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent stats today */}
        <div className="card p-5 col-span-1">
          <h2 className="font-semibold text-gray-800 mb-4">Agents — Σήμερα</h2>
          {agentStats.length === 0 ? (
            <p className="text-sm text-gray-400">Καμία επαφή ακόμα.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs border-b">
                  <th className="text-left pb-2">Agent</th>
                  <th className="text-right pb-2">Κλήσεις</th>
                  <th className="text-right pb-2">Ραντεβού</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agentStats.map(a => (
                  <tr key={a.name}>
                    <td className="py-2 font-medium">{a.name}</td>
                    <td className="py-2 text-right text-gray-600">{a.total}</td>
                    <td className="py-2 text-right text-green-600 font-semibold">{a.scheduled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* City breakdown */}
        <div className="card p-5 col-span-1">
          <h2 className="font-semibold text-gray-800 mb-4">Ανά Πόλη</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b">
                <th className="text-left pb-2">Πόλη</th>
                <th className="text-right pb-2">Αναμονή</th>
                <th className="text-right pb-2">Κλεισμένα</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cityStats.map(c => (
                <tr key={c.city}>
                  <td className="py-2 font-medium">{c.city}</td>
                  <td className="py-2 text-right text-gray-600">{c.waiting}</td>
                  <td className="py-2 text-right text-green-600">{c.scheduled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Service breakdown */}
        <div className="card p-5 col-span-1">
          <h2 className="font-semibold text-gray-800 mb-4">Ανά Υπηρεσία</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs border-b">
                <th className="text-left pb-2">Υπηρεσία</th>
                <th className="text-right pb-2">Σε αναμονή</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {serviceStats.map(s => (
                <tr key={s.service}>
                  <td className="py-2 font-medium">{s.service}</td>
                  <td className="py-2 text-right text-gray-600">{s.waiting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User management */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Χρήστες</h2>
          <button className="btn-primary text-sm" onClick={() => setShowCreateUser(true)}>
            + Νέος Χρήστης
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b">
              <th className="text-left pb-2">Όνομα</th>
              <th className="text-left pb-2">Email</th>
              <th className="text-left pb-2">Ρόλος</th>
              <th className="text-left pb-2">Κατάσταση</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-2 font-medium">{u.displayName}</td>
                <td className="py-2 text-gray-500">{u.email}</td>
                <td className="py-2">
                  <span className={`badge ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    className={`badge cursor-pointer ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    onClick={() => updateDoc(doc(db, 'users', u.id), { active: !u.active })}
                  >
                    {u.active ? 'Ενεργός' : 'Ανενεργός'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateUser && <CreateUserModal onClose={() => setShowCreateUser(false)} createUser={createUser} />}
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    teal:   'bg-teal-50 text-teal-700 border-teal-100',
  }
  return (
    <div className={`card p-5 border ${colors[color]}`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1 opacity-80">{label}</div>
    </div>
  )
}

function CreateUserModal({ onClose, createUser }) {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole]             = useState('agent')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  async function handleCreate() {
    if (!email || !password || !displayName) return
    setSaving(true)
    setError('')
    try {
      await createUser(email, password, displayName, role)
      onClose()
    } catch (e) {
      setError(e.message || 'Σφάλμα κατά τη δημιουργία χρήστη.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Νέος Χρήστης</h2>
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
        <div>
          <label className="label">Ονοματεπώνυμο</label>
          <input className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Κωδικός</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="label">Ρόλος</label>
          <select className="input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
            <option value="ekloges">Εκλογές</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={saving}>Ακύρωση</button>
          <button className="btn-primary flex-1" onClick={handleCreate} disabled={saving || !email || !password || !displayName}>
            {saving ? 'Δημιουργία…' : 'Δημιουργία'}
          </button>
        </div>
      </div>
    </div>
  )
}
