import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function VoteContacts() {
  const [contacts,   setContacts]   = useState([])
  const [volunteers, setVolunteers] = useState([])
  const [search,     setSearch]     = useState('')
  const [area,       setArea]       = useState('')

  useEffect(() => {
    const unsub1 = onSnapshot(
      query(collection(db, 'voteContacts'), orderBy('timestamp', 'desc')),
      snap => setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    const unsub2 = onSnapshot(
      query(collection(db, 'volunteers'), orderBy('updatedAt', 'desc')),
      snap => setVolunteers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return () => { unsub1(); unsub2() }
  }, [])

  // ── Metrics ────────────────────────────────────────────────────────────────

  const today = useMemo(() => {
    const now = new Date()
    return contacts.filter(c => {
      const d = c.timestamp?.seconds ? new Date(c.timestamp.seconds * 1000) : new Date(c.timestamp)
      return d.toDateString() === now.toDateString()
    }).length
  }, [contacts])

  const topArea = useMemo(() => {
    const counts = {}
    contacts.forEach(c => { if (c.area) counts[c.area] = (counts[c.area] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || null
  }, [contacts])

  const contactsByVolunteer = useMemo(() => {
    const counts = {}
    contacts.forEach(c => {
      const key = c.addedByUserId || c.addedByName || '—'
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [contacts])

  // ── Filters ────────────────────────────────────────────────────────────────

  const areas = useMemo(() =>
    [...new Set(contacts.map(c => c.area).filter(Boolean))].sort(),
    [contacts]
  )

  const filtered = useMemo(() => {
    let list = contacts
    if (area)   list = list.filter(c => c.area === area)
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(c =>
        `${c.fullName || c.firstName + ' ' + c.lastName} ${c.phone} ${c.area}`.toLowerCase().includes(s)
      )
    }
    return list
  }, [contacts, area, search])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function exportCSV() {
    const header = 'Ονοματεπώνυμο,Τηλέφωνο,Περιοχή,Σχόλιο,Καταχωρήθηκε από,Ημερομηνία'
    const rows = filtered.map(c => {
      const date = c.timestamp?.seconds
        ? new Date(c.timestamp.seconds * 1000).toLocaleDateString('el-GR')
        : c.timestamp ? new Date(c.timestamp).toLocaleDateString('el-GR') : ''
      return [
        c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
        c.phone, c.area, c.comment || '',
        c.addedByName || c.addedByUsername || '', date,
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    })
    const csv  = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `vote-contacts-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
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

  function formatDateShort(ts) {
    if (!ts) return '—'
    const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Επαφές Ψηφοφόρων</h1>
          <p className="text-sm text-gray-500 mt-1">{contacts.length} σύνολο · {filtered.length} εμφανίζονται</p>
        </div>
        <button className="btn-primary text-sm" onClick={exportCSV}>Εξαγωγή CSV</button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Σύνολο Επαφών</p>
          <p className="text-3xl font-bold mt-1">{contacts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Σήμερα</p>
          <p className="text-3xl font-bold mt-1">{today}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Εθελοντές</p>
          <p className="text-3xl font-bold mt-1">{volunteers.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Κορυφαία Περιοχή</p>
          {topArea ? (
            <>
              <p className="text-lg font-bold mt-1 truncate">{topArea[0]}</p>
              <p className="text-xs text-gray-400">{topArea[1]} επαφές</p>
            </>
          ) : <p className="text-lg font-bold mt-1">—</p>}
        </div>
      </div>

      {/* Volunteers table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Εθελοντές</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Ονοματεπώνυμο</th>
                  <th className="text-left px-4 py-3">Περιοχή</th>
                  <th className="text-left px-4 py-3">Επαφές</th>
                  <th className="text-left px-4 py-3">Τελευταία Ενημέρωση Προφίλ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {volunteers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      Δεν υπάρχουν εθελοντές ακόμα.
                    </td>
                  </tr>
                ) : (
                  volunteers.map(v => {
                    const count = contactsByVolunteer[v.telegramUserId] || 0
                    return (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{v.firstName} {v.lastName}</td>
                        <td className="px-4 py-3">
                          <span className="badge bg-purple-100 text-purple-700">{v.area || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{count}</span>
                          <span className="text-gray-400 text-xs ml-1">επαφές</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                          {formatDateShort(v.updatedAt)}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contacts table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Λίστα Επαφών</h2>

        <div className="flex flex-wrap gap-3 mb-4">
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

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Ονοματεπώνυμο</th>
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
                      <td className="px-4 py-3 font-medium">{c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim()}</td>
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

    </div>
  )
}
