import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
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
  const [tab,     setTab]     = useState('pending')  // pending | approved | rejected | all
  const [search,  setSearch]  = useState('')
  const [editId,  setEditId]  = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), orderBy('timestamp', 'desc')),
      snap => setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  const counts = useMemo(() => ({
    pending:  results.filter(r => !r.status || r.status === 'pending').length,
    approved: results.filter(r => r.status === 'approved').length,
    rejected: results.filter(r => r.status === 'rejected').length,
    all:      results.length,
  }), [results])

  const filtered = useMemo(() => {
    let list = results
    if (tab === 'pending')  list = list.filter(r => !r.status || r.status === 'pending')
    if (tab === 'approved') list = list.filter(r => r.status === 'approved')
    if (tab === 'rejected') list = list.filter(r => r.status === 'rejected')
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(r =>
        `${r.reporterName} ${r.centerName} ${r.centerArea} ${r.pollName}`.toLowerCase().includes(s)
      )
    }
    return list
  }, [results, tab, search])

  async function approve(id) {
    await updateDoc(doc(db, 'ballot_results', id), { status: 'approved', seen: true, approvedAt: serverTimestamp() })
  }

  async function reject(id) {
    await updateDoc(doc(db, 'ballot_results', id), { status: 'rejected', seen: true })
  }

  async function resetPending(id) {
    await updateDoc(doc(db, 'ballot_results', id), { status: 'pending' })
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
      ...CANDIDATES.map(c => c.label), 'Σχόλια', 'Κατάσταση', 'Ημερομηνία'].join(',')
    const rows = filtered.map(r => [
      r.reporterName, r.reporterPhone || '', r.centerName, r.centerArea,
      r.pollName, r.pollNum,
      ...CANDIDATES.map(c => r[c.key] ?? ''),
      r.comments || '', r.status || 'pending', formatDate(r.timestamp),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url
    a.download = `apotelesmata_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const TABS = [
    { key: 'pending',  label: 'Εκκρεμή',        color: 'bg-yellow-100 text-yellow-800' },
    { key: 'approved', label: 'Εγκεκριμένα',    color: 'bg-green-100 text-green-800' },
    { key: 'rejected', label: 'Απορριφθέντα',   color: 'bg-red-100 text-red-700' },
    { key: 'all',      label: 'Όλα',             color: 'bg-gray-100 text-gray-700' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">📊 Αποτελέσματα Καταμέτρησης</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} εγγραφές</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/#/apotelesmata" target="_blank" rel="noreferrer"
            className="text-sm px-3 py-1.5 rounded-md border border-green-400 text-green-700 hover:bg-green-50 transition-colors">
            🌐 Public Page
          </a>
          <button onClick={exportCSV} className="btn-primary text-sm">Εξαγωγή CSV</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border-2 ${
              tab === t.key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {t.label}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${t.color}`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        className="input w-full sm:w-72"
        placeholder="Αναζήτηση ονόματος, κέντρου…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">Δεν υπάρχουν εγγραφές.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            editId === r.id
              ? <EditCard key={r.id} result={r} onClose={() => setEditId(null)} formatDate={formatDate} />
              : <ResultCard
                  key={r.id}
                  result={r}
                  onApprove={() => approve(r.id)}
                  onReject={() => reject(r.id)}
                  onEdit={() => setEditId(r.id)}
                  onReset={() => resetPending(r.id)}
                  onDelete={() => handleDelete(r.id)}
                  formatDate={formatDate}
                />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Result card (read mode)
// ─────────────────────────────────────────────────────────────────────────────

function ResultCard({ result: r, onApprove, onReject, onEdit, onReset, onDelete, formatDate }) {
  const status = r.status || 'pending'

  const statusStyle = {
    pending:  'bg-yellow-50 border-yellow-300',
    approved: 'bg-green-50 border-green-400',
    rejected: 'bg-red-50 border-red-300 opacity-70',
  }[status] || 'bg-white border-gray-200'

  const topBarStyle = {
    pending:  'bg-yellow-100 text-yellow-900',
    approved: 'bg-green-600 text-white',
    rejected: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-700'

  const statusLabel = { pending: '⏳ Εκκρεμεί', approved: '✅ Εγκεκριμένο', rejected: '❌ Απορρίφθηκε' }[status]

  return (
    <div className={`card overflow-hidden border ${statusStyle}`}>
      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-2 text-sm ${topBarStyle}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold">{statusLabel}</span>
          <span className="opacity-60">·</span>
          <span className="font-semibold">{r.reporterName}</span>
          {r.reporterPhone && <span className="opacity-70 text-xs">📞 {r.reporterPhone}</span>}
          <span className="opacity-60">·</span>
          <span className="text-xs opacity-80">{formatDate(r.timestamp)}</span>
        </div>
        <button onClick={onDelete} className="text-xs opacity-40 hover:opacity-80 transition-opacity ml-2">🗑️</button>
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
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {CANDIDATES.map((c, i) => (
            <div key={c.key} className={`rounded-lg p-2 text-center ${i === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className={`text-xs font-medium mb-1 ${i === 0 ? 'text-blue-600' : 'text-gray-500'}`}>{c.label}</div>
              <div className={`text-xl font-bold ${i === 0 ? 'text-blue-700' : 'text-gray-800'}`}>
                {r[c.key] ?? <span className="text-gray-300 text-sm">—</span>}
              </div>
            </div>
          ))}
        </div>

        {r.comments && (
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
            💬 {r.comments}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {status !== 'approved' && (
            <button onClick={onApprove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
              ✅ Έγκριση
            </button>
          )}
          {status !== 'rejected' && (
            <button onClick={onReject}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
              ❌ Απόρριψη
            </button>
          )}
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            ✏️ Επεξεργασία
          </button>
          {(status === 'approved' || status === 'rejected') && (
            <button onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-yellow-300 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-50 transition-colors">
              ↩ Επαναφορά
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit card (inline edit mode)
// ─────────────────────────────────────────────────────────────────────────────

function EditCard({ result: r, onClose, formatDate }) {
  const [form, setForm] = useState({
    reporterName: r.reporterName || '',
    reporterPhone: r.reporterPhone || '',
    comments: r.comments || '',
    ...Object.fromEntries(CANDIDATES.map(c => [c.key, r[c.key] != null ? String(r[c.key]) : ''])),
  })
  const [saving, setSaving] = useState(false)

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  async function handleSave() {
    setSaving(true)
    try {
      const voteNums = Object.fromEntries(
        CANDIDATES.map(c => [c.key, form[c.key] === '' ? null : Number(form[c.key])])
      )
      await updateDoc(doc(db, 'ballot_results', r.id), {
        reporterName: form.reporterName,
        reporterPhone: form.reporterPhone,
        comments: form.comments,
        ...voteNums,
      })
      onClose()
    } finally { setSaving(false) }
  }

  const inp = 'border border-gray-300 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:border-blue-400'
  const numInp = 'border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center font-bold w-full focus:outline-none focus:border-blue-400'

  return (
    <div className="card overflow-hidden border-2 border-blue-400">
      <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold flex items-center justify-between">
        <span>✏️ Επεξεργασία — {r.centerName} · {r.pollName} #{r.pollNum}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
      </div>
      <div className="px-4 py-4 space-y-4">

        {/* Reporter */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 block mb-1">Αναφέρων</label>
            <input className={inp} value={form.reporterName} onChange={e => set('reporterName', e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-500 block mb-1">Τηλέφωνο</label>
            <input className={inp} value={form.reporterPhone} onChange={e => set('reporterPhone', e.target.value)} />
          </div>
        </div>

        {/* Votes */}
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-2">Ψήφοι</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {CANDIDATES.map((c, i) => (
              <div key={c.key} className={`rounded-lg p-2 text-center ${i === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <div className="text-xs font-medium text-gray-500 mb-1">{c.label}</div>
                <input
                  type="text" inputMode="numeric" pattern="\d*"
                  className={numInp}
                  value={form[c.key]}
                  onChange={e => {
                    const v = e.target.value
                    if (v === '' || /^\d+$/.test(v)) set(c.key, v)
                  }}
                  placeholder="—"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Σχόλια</label>
          <textarea className={inp + ' resize-none'} rows={2} value={form.comments} onChange={e => set('comments', e.target.value)} />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Ακύρωση
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Αποθήκευση…' : '✔ Αποθήκευση'}
          </button>
        </div>
      </div>
    </div>
  )
}
