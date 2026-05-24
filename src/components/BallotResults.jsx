import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

// ─────────────────────────────────────────────────────────────────────────────
// Candidate config
// ─────────────────────────────────────────────────────────────────────────────
const VOTE_CANDIDATES = [
  { key: 'nikoletta', label: 'Νικολέττα' },
  { key: 'pazaros',   label: 'Χ.Πάζαρος' },
  { key: 'koupparis', label: 'Κούππαρης' },
  { key: 'karseras',  label: 'Καρσεράς' },
  { key: 'giorgos',   label: 'Γιώργος' },
]
const EXTRA_CANDIDATES = [
  { key: 'lefka', label: 'Λευκά' },
  { key: 'akyra', label: 'Άκυρα' },
]
const ALL_CANDIDATES = [{ key: 'synolo', label: 'Σύνολο' }, ...VOTE_CANDIDATES, ...EXTRA_CANDIDATES]

function nikolettaPosition(r) {
  return [...VOTE_CANDIDATES]
    .map(c => ({ key: c.key, votes: r[c.key] ?? 0 }))
    .sort((a, b) => b.votes - a.votes)
    .findIndex(c => c.key === 'nikoletta')
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function BallotResults() {
  const [results,      setResults]      = useState([])
  const [search,       setSearch]       = useState('')
  const [editId,       setEditId]       = useState(null)
  const [showRejected, setShowRejected] = useState(false)

  // ── Firestore listener ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), orderBy('timestamp', 'desc')),
      snap => setResults(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  // ── Derived state ───────────────────────────────────────────────────────
  const agentResults = useMemo(() => results.filter(r => !r.isOfficial), [results])

  const pending  = useMemo(() => agentResults.filter(r => !r.status || r.status === 'pending'), [agentResults])
  const approved = useMemo(() => agentResults.filter(r => r.status === 'approved'), [agentResults])
  const rejected = useMemo(() => agentResults.filter(r => r.status === 'rejected'), [agentResults])

  // pollNums that already have an approved entry
  const approvedPollNums = useMemo(() =>
    new Set(approved.map(r => Number(r.pollNum)))
  , [approved])

  // Duplicate detection: pollNums that appear more than once across non-rejected agent results
  const duplicatePollNums = useMemo(() => {
    const counts = {}
    agentResults
      .filter(r => r.status !== 'rejected' && r.pollNum)
      .forEach(r => { counts[r.pollNum] = (counts[r.pollNum] || 0) + 1 })
    return new Set(Object.keys(counts).filter(k => counts[k] > 1).map(Number))
  }, [agentResults])

  // Progress: how many of 122 we've received (approved + pending)
  const TOTAL_POLLS = 122
  const receivedCount  = agentResults.filter(r => r.status !== 'rejected').length
  const remainingCount = Math.max(TOTAL_POLLS - receivedCount, 0)
  const pctDone = Math.round((approved.length / TOTAL_POLLS) * 100)

  const filterList = list => {
    if (!search) return list
    const s = search.toLowerCase()
    return list.filter(r =>
      `${r.reporterName} ${r.centerName} ${r.centerArea} ${r.pollName}`.toLowerCase().includes(s)
    )
  }

  // ── Actions ─────────────────────────────────────────────────────────────
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
    const header = ['Αναφέρων','Τηλέφωνο','Εκλογικό Κέντρο','Περιοχή','Κάλπη','#',
      ...ALL_CANDIDATES.map(c => c.label),'Σχόλια','Κατάσταση','Ημερομηνία'].join(',')
    const rows = agentResults.map(r => [
      r.reporterName, r.reporterPhone || '', r.centerName, r.centerArea,
      r.pollName, r.pollNum,
      ...ALL_CANDIDATES.map(c => r[c.key] ?? ''),
      r.comments || '', r.status || 'pending', formatDate(r.timestamp),
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    const csv   = [header, ...rows].join('\n')
    const blob  = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url   = URL.createObjectURL(blob)
    const a     = document.createElement('a'); a.href = url
    a.download  = `apotelesmata_${new Date().toISOString().slice(0,10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const pendingFiltered  = filterList(pending)
  const approvedFiltered = filterList(approved)
  const rejectedFiltered = filterList(rejected)

  const cardProps = { onEdit: id => setEditId(id), onApprove: approve, onReject: reject, onReset: resetPending, onDelete: handleDelete, formatDate }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">📊 Αποτελέσματα Καταμέτρησης</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pending.length} εκκρεμείς · {approved.length} ολοκληρωμένες · {rejected.length} απορριφθείσες
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <a href="/#/apotelesmata" target="_blank" rel="noreferrer"
            className="text-sm px-3 py-1.5 rounded-md border border-green-400 text-green-700 hover:bg-green-50 transition-colors">
            🌐 Public Page
          </a>
          <button onClick={exportCSV} className="btn-primary text-sm">Εξαγωγή CSV</button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="rounded-xl bg-white border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <span className="font-bold text-gray-700">Πρόοδος Κάλπων</span>
            <span className="text-green-600 font-semibold">✅ {approved.length} εγκεκριμένες</span>
            <span className="text-yellow-600 font-semibold">⏳ {pending.length} εκκρεμείς</span>
            <span className="text-gray-400">🔲 {remainingCount} αναμένονται ακόμα</span>
          </div>
          <span className="text-sm font-bold text-gray-500">{approved.length} / {TOTAL_POLLS} ({pctDone}%)</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500 transition-all duration-700"
            style={{ width: `${(approved.length / TOTAL_POLLS) * 100}%` }} />
          <div className="h-full bg-yellow-300 transition-all duration-700"
            style={{ width: `${(pending.length / TOTAL_POLLS) * 100}%` }} />
        </div>
        {duplicatePollNums.size > 0 && (
          <div className="mt-2 text-xs text-orange-600 font-semibold flex items-center gap-1">
            ⚠️ {duplicatePollNums.size} διπλοεγγεγραμμένες κάλπες: #{[...duplicatePollNums].sort((a,b)=>a-b).join(', #')}
          </div>
        )}
      </div>

      {/* ── Search ── */}
      <input
        className="input w-full sm:w-72"
        placeholder="Αναζήτηση ονόματος, κέντρου…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* ── Two-column: Ολοκληρωμένες | Εκκρεμείς ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT: Ολοκληρωμένες */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-gray-700">✅ Ολοκληρωμένες</h2>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">
              {approvedFiltered.length}
            </span>
          </div>
          {approvedFiltered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-300 text-sm">
              Καμία ολοκληρωμένη κάλπη ακόμα
            </div>
          ) : (
            <div className="space-y-3">
              {approvedFiltered.map(r =>
                editId === r.id
                  ? <EditCard key={r.id} result={r} onClose={() => setEditId(null)} formatDate={formatDate} />
                  : <ApprovedCard key={r.id} result={r} {...cardProps}
                      onEdit={() => setEditId(r.id)}
                      isDuplicate={duplicatePollNums.has(Number(r.pollNum))}
                    />
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Εκκρεμείς */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-gray-700">⏳ Εκκρεμείς</h2>
            <span className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-2 py-0.5 font-medium">
              {pendingFiltered.length}
            </span>
          </div>
          {pendingFiltered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-gray-300 text-sm">
              Δεν υπάρχουν εκκρεμείς κάλπες
            </div>
          ) : (
            <div className="space-y-3">
              {pendingFiltered.map(r =>
                editId === r.id
                  ? <EditCard key={r.id} result={r} onClose={() => setEditId(null)} formatDate={formatDate} />
                  : <PendingCard key={r.id} result={r} {...cardProps}
                      onEdit={() => setEditId(r.id)}
                      isDuplicate={duplicatePollNums.has(Number(r.pollNum))}
                      isAlreadyApproved={approvedPollNums.has(Number(r.pollNum))}
                    />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Rejected (collapsible) ── */}
      {rejected.length > 0 && (
        <div>
          <button
            onClick={() => setShowRejected(v => !v)}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          >
            {showRejected ? '▾' : '▸'} Απορριφθείσες ({rejectedFiltered.length})
          </button>
          {showRejected && (
            <div className="space-y-3 mt-3">
              {rejectedFiltered.map(r =>
                editId === r.id
                  ? <EditCard key={r.id} result={r} onClose={() => setEditId(null)} formatDate={formatDate} />
                  : <RejectedCard key={r.id} result={r} {...cardProps} onEdit={() => setEditId(r.id)} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pending card (yellow)
// ─────────────────────────────────────────────────────────────────────────────
function PendingCard({ result: r, isDuplicate, isAlreadyApproved, onApprove, onReject, onEdit, onDelete, formatDate }) {
  const borderClass = isAlreadyApproved ? 'border-green-500' : isDuplicate ? 'border-orange-400' : 'border-yellow-300'
  return (
    <div className={`card overflow-hidden border ${borderClass} bg-yellow-50`}>
      {isAlreadyApproved && (
        <div className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
          ✅ ΗΔΗ ΕΓΚΕΚΡΙΜΕΝΗ — Η κάλπη #{r.pollNum} έχει ήδη εγκριθεί!
        </div>
      )}
      {!isAlreadyApproved && isDuplicate && (
        <div className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
          ⚠️ ΔΙΠΛΟΤΥΠΟ — Υπάρχει ήδη καταχώρηση για την κάλπη #{r.pollNum}
        </div>
      )}
      <div className="bg-yellow-100 text-yellow-900 flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold">⏳ Εκκρεμεί</span>
          <span className="opacity-60">·</span>
          <span className="font-semibold">{r.reporterName}</span>
          {r.reporterPhone && <span className="opacity-70 text-xs">📞 {r.reporterPhone}</span>}
          <span className="opacity-60">·</span>
          <span className="text-xs opacity-80">{formatDate(r.timestamp)}</span>
        </div>
        <button onClick={() => onDelete(r.id)} className="text-xs opacity-40 hover:opacity-80 transition-opacity ml-2">🗑️</button>
      </div>
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-semibold text-gray-800 text-sm">{r.centerName}</span>
          <span className="text-gray-400 text-xs">{r.centerArea}</span>
          <span className="badge bg-blue-100 text-blue-700">{r.pollName} #{r.pollNum}</span>
        </div>

        <VoteGrid result={r} />

        {r.comments && (
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
            💬 {r.comments}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => onApprove(r.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
            ✅ Έγκριση
          </button>
          <button onClick={() => onReject(r.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
            ❌ Απόρριψη
          </button>
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            ✏️ Επεξεργασία
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Approved card (green/red) — with optional official side-by-side
// ─────────────────────────────────────────────────────────────────────────────
function ApprovedCard({ result: r, isDuplicate, onReset, onEdit, onDelete, formatDate }) {
  const pos      = nikolettaPosition(r)
  const isFirst  = pos === 0
  const isSecond = pos === 1

  const borderColor = isDuplicate ? 'border-orange-400' : isFirst ? 'border-green-400' : isSecond ? 'border-red-400'  : 'border-gray-300'
  const bgColor     = isFirst ? 'bg-green-50'      : isSecond ? 'bg-red-50'       : 'bg-gray-50'
  const headerBg    = isFirst ? 'bg-green-600 text-white' : isSecond ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
  const badge       = isFirst ? '🟢 1η Νικολέττα' : isSecond ? '🔴 2η Νικολέττα' : '⚪ —'

  return (
    <div className={`card overflow-hidden border ${borderColor} ${bgColor}`}>
      {isDuplicate && (
        <div className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
          ⚠️ ΔΙΠΛΟΤΥΠΟ — Υπάρχει ήδη καταχώρηση για την κάλπη #{r.pollNum}
        </div>
      )}
      <div className={`flex items-center justify-between px-4 py-2 text-sm ${headerBg}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold">{badge}</span>
          <span className="opacity-60">·</span>
          <span className="font-semibold">{r.centerName}</span>
          <span className="opacity-70 text-xs">{r.centerArea}</span>
        </div>
        <button onClick={() => onDelete(r.id)} className="text-xs opacity-40 hover:opacity-80 transition-opacity ml-2">🗑️</button>
      </div>
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge bg-blue-100 text-blue-700">{r.pollName} #{r.pollNum}</span>
          <span className="text-xs text-gray-400">{r.reporterName}</span>
          {r.reporterPhone && <span className="text-xs text-gray-400">📞 {r.reporterPhone}</span>}
          <span className="text-xs text-gray-400 ml-auto">{formatDate(r.approvedAt || r.timestamp)}</span>
        </div>

        <VoteGrid result={r} highlight />

        {r.comments && (
          <div className="text-sm text-gray-500 bg-white bg-opacity-60 rounded-lg px-3 py-2 mb-3">
            💬 {r.comments}
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            ✏️ Επεξεργασία
          </button>
          <button onClick={() => onReset(r.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-yellow-300 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-50 transition-colors">
            ↩ Επαναφορά
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Vote grid
// ─────────────────────────────────────────────────────────────────────────────
function VoteGrid({ result: r, highlight, compact }) {
  const pos = highlight ? nikolettaPosition(r) : -1
  const cols = compact ? 'grid-cols-2 gap-1' : 'grid-cols-3 sm:grid-cols-6 gap-2'

  return (
    <div className="mb-3">
      <div className={`grid ${cols}`}>
        <div className={`rounded-lg p-2 text-center bg-blue-50 border border-blue-200 ${compact ? 'col-span-2' : ''}`}>
          <div className="text-xs font-medium mb-1 text-blue-600">Σύνολο</div>
          <div className="text-xl font-bold text-blue-700">
            {r.synolo ?? <span className="text-gray-300 text-sm">—</span>}
          </div>
        </div>
        {VOTE_CANDIDATES.map((c, i) => {
          const isNiko = c.key === 'nikoletta'
          const isTop  = highlight && i === pos && pos === 0
          const isLow  = highlight && isNiko && pos > 0
          return (
            <div key={c.key} className={`rounded-lg p-2 text-center border ${
              isTop ? 'bg-green-100 border-green-400' :
              isLow ? 'bg-red-100 border-red-300' :
                      'bg-gray-50 border-gray-200'
            }`}>
              <div className={`text-xs font-medium mb-1 ${
                isTop ? 'text-green-700' : isLow ? 'text-red-600' : 'text-gray-500'
              }`}>{c.label}</div>
              <div className={`text-xl font-bold ${
                isTop ? 'text-green-800' : isLow ? 'text-red-700' : 'text-gray-800'
              }`}>
                {r[c.key] ?? <span className="text-gray-300 text-sm">—</span>}
              </div>
            </div>
          )
        })}
      </div>
      {/* Λευκά / Άκυρα */}
      {(r.lefka != null || r.akyra != null) && (
        <div className="flex gap-2 mt-1.5">
          {EXTRA_CANDIDATES.map(c => r[c.key] != null && (
            <div key={c.key} className="rounded-md px-2 py-1 bg-gray-100 border border-gray-200 text-xs flex items-center gap-1.5">
              <span className="text-gray-400">{c.label}:</span>
              <span className="font-bold text-gray-600">{r[c.key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Rejected card
// ─────────────────────────────────────────────────────────────────────────────
function RejectedCard({ result: r, onReset, onEdit, onDelete, formatDate }) {
  return (
    <div className="card overflow-hidden border border-red-200 bg-red-50 opacity-70">
      <div className="bg-red-100 text-red-800 flex items-center justify-between px-4 py-2 text-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold">❌ Απορρίφθηκε</span>
          <span className="opacity-60">·</span>
          <span className="font-semibold">{r.centerName}</span>
          <span className="text-xs opacity-70">{r.centerArea}</span>
          <span className="text-xs opacity-60">{r.pollName} #{r.pollNum}</span>
        </div>
        <button onClick={() => onDelete(r.id)} className="text-xs opacity-40 hover:opacity-80 transition-opacity ml-2">🗑️</button>
      </div>
      <div className="px-4 py-3">
        <VoteGrid result={r} />
        <div className="flex gap-2 mt-3">
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            ✏️ Επεξεργασία
          </button>
          <button onClick={() => onReset(r.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-yellow-300 text-yellow-700 text-sm font-medium rounded-lg hover:bg-yellow-50 transition-colors">
            ↩ Επαναφορά
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Edit card (inline)
// ─────────────────────────────────────────────────────────────────────────────
function EditCard({ result: r, onClose, formatDate }) {
  const [form, setForm] = useState({
    reporterName:  r.reporterName  || '',
    reporterPhone: r.reporterPhone || '',
    comments:      r.comments      || '',
    ...Object.fromEntries(ALL_CANDIDATES.map(c => [c.key, r[c.key] != null ? String(r[c.key]) : ''])),
  })
  const [saving, setSaving] = useState(false)

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  async function handleSave() {
    setSaving(true)
    try {
      const voteNums = Object.fromEntries(
        ALL_CANDIDATES.map(c => [c.key, form[c.key] === '' ? null : Number(form[c.key])])
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

  const inp    = 'border border-gray-300 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:border-blue-400'
  const numInp = 'border border-gray-300 rounded-md px-2 py-1.5 text-sm text-center font-bold w-full focus:outline-none focus:border-blue-400'

  return (
    <div className="card overflow-hidden border-2 border-blue-400">
      <div className="bg-blue-600 text-white px-4 py-2 text-sm font-bold flex items-center justify-between">
        <span>✏️ Επεξεργασία — {r.centerName} · {r.pollName} #{r.pollNum}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">✕</button>
      </div>
      <div className="px-4 py-4 space-y-4">
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
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-2">Ψήφοι</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ALL_CANDIDATES.map((c, i) => (
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
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1">Σχόλια</label>
          <textarea className={inp + ' resize-none'} rows={2} value={form.comments}
            onChange={e => set('comments', e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose}
            className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
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
