import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

const CANDIDATES = [
  { key: 'synolo',    label: 'Σύνολο' },
  { key: 'nikoletta', label: 'Νικολέττα' },
  { key: 'pazaros',   label: 'Χ.Πάζαρος' },
  { key: 'koupparis', label: 'Κούππαρης' },
  { key: 'karseras',  label: 'Καρσεράς' },
  { key: 'giorgos',   label: 'Γιώργος' },
]

export default function BallotResults() {
  const [results, setResults] = useState([])
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all') // all | unseen

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), orderBy('timestamp', 'desc')),
      snap => setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  const unseen = useMemo(() => results.filter(r => r.seen === false).length, [results])

  const filtered = useMemo(() => {
    let list = results
    if (filter === 'unseen') list = list.filter(r => r.seen === false)
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(r =>
        `${r.reporterName} ${r.centerName} ${r.centerArea} ${r.pollName}`.toLowerCase().includes(s)
      )
    }
    return list
  }, [results, search, filter])

  async function markSeen(id) {
    await updateDoc(doc(db, 'ballot_results', id), { seen: true })
  }

  async function markAllSeen() {
    const unseenIds = results.filter(r => r.seen === false).map(r => r.id)
    await Promise.all(unseenIds.map(id => updateDoc(doc(db, 'ballot_results', id), { seen: true })))
  }

  async function handleDelete(id) {
    if (!window.confirm('Διαγραφή αυτής της καταχώρησης;')) return
    await deleteDoc(doc(db, 'ballot_results', id))
  }

  function formatDate(ts) {
    if (!ts) return '—'
    const d = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    return d.toLocaleString('el-GR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  function exportCSV() {
    const header = ['Αναφέρων', 'Τηλέφωνο', 'Εκλογικό Κέντρο', 'Περιοχή', 'Κάλπη', '#',
      ...CANDIDATES.map(c => c.label), 'Σχόλια', 'Ημερομηνία'].join(',')
    const rows = filtered.map(r => [
      r.reporterName,
      r.reporterPhone || '',
      r.centerName,
      r.centerArea,
      r.pollName,
      r.pollNum,
      ...CANDIDATES.map(c => r[c.key] ?? ''),
      r.comments || '',
      formatDate(r.timestamp),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `apotelesmata_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📊 Αποτελέσματα Καταμέτρησης
            {unseen > 0 && (
              <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6">
                {unseen}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{results.length} σύνολο · {filtered.length} εμφανίζονται</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unseen > 0 && (
            <button onClick={markAllSeen} className="text-sm px-3 py-1.5 rounded-md border border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors">
              Σήμανση όλων ως αναγνωσμένα
            </button>
          )}
          <button onClick={exportCSV} className="btn-primary text-sm">Εξαγωγή CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input w-64"
          placeholder="Αναζήτηση ονόματος, κέντρου…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-48" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Όλα</option>
          <option value="unseen">Μόνο νέα {unseen > 0 ? `(${unseen})` : ''}</option>
        </select>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          Δεν υπάρχουν αποτελέσματα ακόμα.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <ResultCard
              key={r.id}
              result={r}
              onMarkSeen={() => markSeen(r.id)}
              onDelete={() => handleDelete(r.id)}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ResultCard({ result: r, onMarkSeen, onDelete, formatDate }) {
  const isNew = r.seen === false

  return (
    <div className={`card overflow-hidden transition-all ${isNew ? 'ring-2 ring-blue-400' : ''}`}>
      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-sm ${isNew ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
        <div className="flex items-center gap-3">
          {isNew && <span className="text-xs font-bold bg-white text-blue-600 px-2 py-0.5 rounded-full">ΝΕΟ</span>}
          <span className="font-semibold">{r.reporterName}</span>
          {r.reporterPhone && <><span className="opacity-70">·</span><span>📞 {r.reporterPhone}</span></>}
          <span className="opacity-70">·</span>
          <span>{formatDate(r.timestamp)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isNew && (
            <button
              onClick={onMarkSeen}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${isNew ? 'border-white/50 hover:bg-white/20' : 'border-gray-300 hover:bg-gray-200'}`}
            >
              ✓ Αναγνώσθηκε
            </button>
          )}
          <button onClick={onDelete} className={`text-xs opacity-60 hover:opacity-100 transition-opacity ${isNew ? 'text-white' : 'text-red-500'}`}>
            Διαγραφή
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {/* Center + poll */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-semibold text-gray-800 text-sm">{r.centerName}</span>
          <span className="text-gray-400 text-xs">{r.centerArea}</span>
          <span className="badge bg-blue-100 text-blue-700">{r.pollName} #{r.pollNum}</span>
        </div>

        {/* Vote grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CANDIDATES.map((c, i) => (
            <div
              key={c.key}
              className={`rounded-lg p-2 text-center ${i === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}
            >
              <div className={`text-xs font-medium mb-1 ${i === 0 ? 'text-blue-600' : 'text-gray-500'}`}>{c.label}</div>
              <div className={`text-xl font-bold ${i === 0 ? 'text-blue-700' : 'text-gray-800'}`}>
                {r[c.key] ?? <span className="text-gray-300 text-base">—</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Comments */}
        {r.comments && (
          <div className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            💬 {r.comments}
          </div>
        )}
      </div>
    </div>
  )
}
