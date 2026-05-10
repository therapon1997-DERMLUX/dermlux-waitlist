import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function VoteContacts() {
  const [contacts, setContacts] = useState([])
  const [search,   setSearch]   = useState('')
  const [area,     setArea]     = useState('')

  useEffect(() => {
    const q = query(collection(db, 'voteContacts'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, snap =>
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  const areas = useMemo(() =>
    [...new Set(contacts.map(c => c.area).filter(Boolean))].sort(),
    [contacts]
  )

  const filtered = useMemo(() => {
    let list = contacts
    if (area)  list = list.filter(c => c.area === area)
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(c =>
        `${c.firstName} ${c.lastName} ${c.phone} ${c.area}`.toLowerCase().includes(s)
      )
    }
    return list
  }, [contacts, area, search])

  function exportCSV() {
    const header = 'Όνομα,Επίθετο,Τηλέφωνο,Περιοχή,Σχόλιο,Καταχωρήθηκε από,Ημερομηνία'
    const rows = filtered.map(c => {
      const date = c.timestamp?.seconds
        ? new Date(c.timestamp.seconds * 1000).toLocaleDateString('el-GR')
        : c.timestamp
          ? new Date(c.timestamp).toLocaleDateString('el-GR')
          : ''
      return [
        c.firstName, c.lastName, c.phone, c.area,
        c.comment || '', c.addedByName || c.addedByUsername || '',
        date,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `vote-contacts-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete(id) {
    if (!window.confirm('Διαγραφή επαφής;')) return
    await deleteDoc(doc(db, 'voteContacts', id))
  }

  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Επαφές Ψηφοφόρων</h1>
          <p className="text-sm text-gray-500 mt-1">{contacts.length} σύνολο · {filtered.length} εμφανίζονται</p>
        </div>
        <button className="btn-primary text-sm" onClick={exportCSV}>
          Εξαγωγή CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input w-64"
          placeholder="Αναζήτηση ονόματος, τηλεφώνου…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-48" value={area} onChange={e => setArea(e.target.value)}>
          <option value="">Όλες οι περιοχές</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Όνομα</th>
                <th className="text-left px-4 py-3">Τηλέφωνο</th>
                <th className="text-left px-4 py-3">Περιοχή</th>
                <th className="text-left px-4 py-3">Σχόλιο</th>
                <th className="text-left px-4 py-3">Από</th>
                <th className="text-left px-4 py-3">Ημερομηνία</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Δεν βρέθηκαν επαφές.
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{c.firstName} {c.lastName}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-blue-100 text-blue-700">{c.area}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{c.comment || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.addedByName || c.addedByUsername || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(c.timestamp)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-600 text-xs transition-colors"
                      >
                        Διαγραφή
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
