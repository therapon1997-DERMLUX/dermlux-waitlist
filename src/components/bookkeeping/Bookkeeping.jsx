import { useState, useEffect, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'
import ExpenseModal, { CATEGORIES, LOCATIONS } from './ExpenseModal'

const eur = n => '€' + (Number(n) || 0).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const monthKey = d => (d || '').slice(0, 7)
const thisMonth = new Date().toISOString().slice(0, 7)

export default function Bookkeeping() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'new' | expenseObj
  const [month, setMonth]       = useState(thisMonth)
  const [cat, setCat]           = useState('')
  const [loc, setLoc]           = useState('')

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'))
    return onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
  }, [])

  const months = useMemo(() => {
    const set = new Set(expenses.map(e => monthKey(e.date)).filter(Boolean))
    set.add(thisMonth)
    return [...set].sort().reverse()
  }, [expenses])

  const filtered = useMemo(() => expenses.filter(e =>
    (!month || monthKey(e.date) === month) &&
    (!cat   || e.category === cat) &&
    (!loc   || e.location === loc)
  ), [expenses, month, cat, loc])

  const totals = useMemo(() => {
    const t = { total: 0, vat: 0, net: 0, count: filtered.length, byCat: {}, byLoc: {} }
    for (const e of filtered) {
      t.total += Number(e.total) || 0
      t.vat   += Number(e.vat)   || 0
      t.net   += Number(e.net)   || 0
      t.byCat[e.category] = (t.byCat[e.category] || 0) + (Number(e.total) || 0)
      t.byLoc[e.location] = (t.byLoc[e.location] || 0) + (Number(e.total) || 0)
    }
    return t
  }, [filtered])

  const catRows = Object.entries(totals.byCat).sort((a, b) => b[1] - a[1])
  const maxCat  = catRows[0]?.[1] || 1

  const select = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Λογιστικά / Έξοδα</h1>
          <p className="text-sm text-gray-500 mt-0.5">Καταχώρηση & ανάλυση εξόδων</p>
        </div>
        <button onClick={() => setModal('new')}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Νέο Έξοδο
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select className={select} value={month} onChange={e => setMonth(e.target.value)}>
          <option value="">Όλοι οι μήνες</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className={select} value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">Όλες οι κατηγορίες</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={select} value={loc} onChange={e => setLoc(e.target.value)}>
          <option value="">Όλες οι τοποθεσίες</option>
          {LOCATIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Σύνολο εξόδων" value={eur(totals.total)} accent="text-gray-900" />
        <Card label="ΦΠΑ (input)" value={eur(totals.vat)} accent="text-amber-600" />
        <Card label="Καθαρό" value={eur(totals.net)} accent="text-gray-700" />
        <Card label="Παραστατικά" value={totals.count} accent="text-blue-700" />
      </div>

      {/* Category breakdown */}
      {catRows.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Ανά κατηγορία</h3>
          <div className="space-y-2">
            {catRows.map(([c, v]) => (
              <div key={c} className="flex items-center gap-3 text-sm">
                <span className="w-28 text-gray-700 shrink-0">{c}</span>
                <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded" style={{ width: `${(v / maxCat) * 100}%` }} />
                </div>
                <span className="w-24 text-right font-medium text-gray-700 shrink-0">{eur(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Φόρτωση…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Δεν υπάρχουν έξοδα για αυτά τα φίλτρα</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {filtered.map(e => (
            <div key={e.id} onClick={() => setModal(e)}
              className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800 truncate">{e.vendor || '—'}</p>
                  {e.fileUrl && <span className="text-gray-400 text-xs">📎</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span>{e.date}</span>
                  <span className="mx-1.5">·</span>
                  <span className="text-blue-600">{e.category}</span>
                  {e.location && e.location !== 'Γενικά' && <><span className="mx-1.5">·</span><span>{e.location}</span></>}
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="font-semibold text-gray-900">{eur(e.total)}</p>
                {!!Number(e.vat) && <p className="text-xs text-gray-400">ΦΠΑ {eur(e.vat)}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ExpenseModal
          existing={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

function Card({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  )
}
