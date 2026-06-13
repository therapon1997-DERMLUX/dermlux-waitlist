import { useState, useEffect, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase/config'
import ExpenseModal, { CATEGORIES, LOCATIONS } from './ExpenseModal'
import ExportPrint from './ExportPrint'

const eur = n => '€' + (Number(n) || 0).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtDate = d => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const months = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`
}
const MONTH_NAMES = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
const nowYear  = String(new Date().getFullYear())
const nowMonth = new Date().getMonth() + 1

const PLACEHOLDER = /να συμπληρωθεί/i
// Returns the list of required fields that are still missing on an expense.
export const missingFields = e => {
  const m = []
  if (!e.vendor || PLACEHOLDER.test(e.vendor)) m.push('vendor')
  if (e.total == null || Number(e.total) === 0)  m.push('total')
  if (e.net == null)      m.push('net')
  if (e.vat == null)      m.push('vat')
  if (!e.category)        m.push('category')
  return m
}
// Short category code, e.g. "8203 · ΔΙΑΦΗΜΙΣΕΙΣ" → "8203"
const catCode = c => (c || '').split('·')[0].trim() || '—'

export default function Bookkeeping() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [selYears, setSelYears]   = useState([nowYear])   // multi-select
  const [selMonths, setSelMonths] = useState([nowMonth])  // multi-select
  const [cat, setCat]           = useState('')
  const [loc, setLoc]           = useState('')
  const [onlyNeeds, setOnlyNeeds] = useState(false)

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'))
    return onSnapshot(q, snap => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }, () => setLoading(false))
  }, [])

  const years = useMemo(() => {
    const set = new Set(expenses.map(e => (e.date || '').slice(0, 4)).filter(Boolean))
    set.add(nowYear)
    return [...set].sort().reverse()
  }, [expenses])

  const toggleIn = (arr, set, v) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  const filtered = useMemo(() => expenses.filter(e => {
    const y = (e.date || '').slice(0, 4)
    const m = parseInt((e.date || '').slice(5, 7), 10)
    if (selYears.length  && !selYears.includes(y))  return false
    if (selMonths.length && !selMonths.includes(m)) return false
    if (cat && e.category !== cat) return false
    if (loc && e.location !== loc) return false
    if (onlyNeeds && missingFields(e).length === 0) return false
    return true
  }), [expenses, selYears, selMonths, cat, loc, onlyNeeds])

  // How many of the currently date/cat/loc-filtered expenses still need action
  const needsCount = useMemo(() => expenses.filter(e => {
    const y = (e.date || '').slice(0, 4)
    const m = parseInt((e.date || '').slice(5, 7), 10)
    if (selYears.length  && !selYears.includes(y))  return false
    if (selMonths.length && !selMonths.includes(m)) return false
    if (cat && e.category !== cat) return false
    if (loc && e.location !== loc) return false
    return missingFields(e).length > 0
  }).length, [expenses, selYears, selMonths, cat, loc])

  const totals = useMemo(() => {
    const t = { total: 0, vat: 0, net: 0, count: filtered.length, byCat: {} }
    for (const e of filtered) {
      t.total += Number(e.total) || 0
      t.vat   += Number(e.vat)   || 0
      t.net   += Number(e.net)   || 0
      t.byCat[e.category] = (t.byCat[e.category] || 0) + (Number(e.total) || 0)
    }
    return t
  }, [filtered])

  // Group filtered expenses by category, preserving sort-by-total order
  const groups = useMemo(() => {
    const catOrder = Object.entries(totals.byCat).sort((a, b) => b[1] - a[1]).map(([c]) => c)
    const map = {}
    for (const e of filtered) {
      const k = e.category || 'Άλλο'
      if (!map[k]) map[k] = []
      map[k].push(e)
    }
    // Sort each group newest-first (already from Firestore orderBy date desc)
    return catOrder.map(c => ({ category: c, rows: map[c] || [], catTotal: totals.byCat[c] || 0 }))
  }, [filtered, totals])

  const maxCat = groups[0]?.catTotal || 1

  const sel = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700'

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Λογιστικά / Έξοδα</h1>
          <p className="text-sm text-gray-500 mt-0.5">Καταχώρηση & ανάλυση εξόδων</p>
        </div>
        <div className="flex gap-2">
          <ExportPrint expenses={expenses} />
          <button onClick={() => setModal('new')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            + Νέο Έξοδο
          </button>
        </div>
      </div>

      {/* Filters — year & month pills, multi-select */}
      <div className="mb-5 space-y-2.5">
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0">Έτος</span>
          {years.map(y => (
            <button key={y} onClick={() => toggleIn(selYears, setSelYears, y)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selYears.includes(y)
                  ? 'bg-green-600 border-green-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
              {y}
            </button>
          ))}
          {selYears.length > 0 && (
            <button onClick={() => setSelYears([])} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
              όλα
            </button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0">Μήνας</span>
          {MONTH_NAMES.map((m, i) => (
            <button key={m} onClick={() => toggleIn(selMonths, setSelMonths, i + 1)}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selMonths.includes(i + 1)
                  ? 'bg-green-600 border-green-600 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
              {m}
            </button>
          ))}
          {selMonths.length > 0 && (
            <button onClick={() => setSelMonths([])} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
              όλοι
            </button>
          )}
        </div>
        <div className="flex gap-3 flex-wrap items-center">
          <select className={sel} value={cat} onChange={e => setCat(e.target.value)}>
            <option value="">Όλες οι κατηγορίες</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className={sel} value={loc} onChange={e => setLoc(e.target.value)}>
            <option value="">Όλες οι τοποθεσίες</option>
            {LOCATIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {needsCount > 0 && (
            <button onClick={() => setOnlyNeeds(v => !v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                onlyNeeds
                  ? 'bg-red-600 border-red-600 text-white shadow-sm'
                  : 'bg-white border-red-200 text-red-600 hover:border-red-400'}`}>
              ⚠ {needsCount} χρειάζονται συμπλήρωση
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Σύνολο εξόδων"  value={eur(totals.total)} accent="text-gray-900" />
        <Card label="ΦΠΑ (input)"     value={eur(totals.vat)}   accent="text-amber-600" />
        <Card label="Καθαρό"          value={eur(totals.net)}   accent="text-gray-700" />
        <Card label="Παραστατικά"     value={totals.count}      accent="text-green-700" />
      </div>

      {/* Category breakdown bars */}
      {groups.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Ανά κατηγορία</h3>
          <div className="space-y-2">
            {groups.map(({ category: c, catTotal: v }) => (
              <div key={c} className="flex items-center gap-3 text-sm">
                <span className="w-52 text-gray-600 shrink-0 truncate">{c}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                       style={{ width: `${(v / maxCat) * 100}%` }} />
                </div>
                <span className="w-24 text-right font-semibold text-gray-700 shrink-0">{eur(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense table — grouped by category like Expensify */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Φόρτωση…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Δεν υπάρχουν έξοδα για αυτά τα φίλτρα</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span />
            <span>Ημερομηνία</span>
            <span>Προμηθευτής</span>
            <span>Σημειώσεις</span>
            <span>Κατηγορία</span>
            <span className="text-right">Καθαρό</span>
            <span className="text-right">ΦΠΑ</span>
            <span className="text-right">Σύνολο</span>
          </div>

          {groups.map(({ category, rows, catTotal }) => (
            <div key={category}>
              {/* Category group header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-700">{category}</span>
                <span className="text-sm font-bold text-gray-800">{eur(catTotal)}</span>
              </div>

              {/* Rows */}
              {rows.map((e, i) => {
                const miss = missingFields(e)
                const needs = miss.length > 0
                return (
                <div key={e.id} onClick={() => setModal(e)}
                  className={`grid grid-cols-[1.6rem_1fr] md:grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 items-center px-4 py-3 cursor-pointer transition-colors ${i < rows.length - 1 ? 'border-b border-gray-100' : ''} ${needs ? 'bg-red-50/60 hover:bg-red-50 border-l-2 border-l-red-400' : 'hover:bg-green-50'}`}>

                  {/* Receipt icon */}
                  <span className="text-gray-300 text-base" title={e.fileUrl ? 'Έχει αποδεικτικό' : 'Χωρίς αποδεικτικό'}>
                    {e.fileUrl ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-200">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>

                  {/* Date */}
                  <span className="text-sm text-gray-500 whitespace-nowrap">{fmtDate(e.date)}</span>

                  {/* Vendor (+ needs-action badge) */}
                  <span className="text-sm font-medium text-gray-800 truncate flex items-center gap-1.5 min-w-0">
                    <span className={`truncate ${miss.includes('vendor') ? 'text-red-600' : ''}`}>{e.vendor || '— προμηθευτής'}</span>
                    {needs && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                        needs action
                      </span>
                    )}
                  </span>

                  {/* Notes — hidden on mobile */}
                  <span className="hidden md:block text-xs text-gray-400 truncate">{e.notes || e.invoiceNumber || ''}</span>

                  {/* Category */}
                  <span className={`hidden md:block text-xs truncate ${miss.includes('category') ? 'text-red-600 font-semibold' : 'text-gray-500'}`} title={e.category || ''}>
                    {catCode(e.category)}
                  </span>

                  {/* Net */}
                  <span className={`hidden md:block text-sm text-right ${miss.includes('net') ? 'text-red-500 font-semibold' : 'text-gray-600'}`}>
                    {e.net != null ? eur(e.net) : 'λείπει'}
                  </span>

                  {/* VAT */}
                  <span className={`hidden md:block text-sm text-right ${miss.includes('vat') ? 'text-red-500 font-semibold' : 'text-amber-600'}`}>
                    {e.vat != null ? eur(e.vat) : 'λείπει'}
                    {e.vatRate != null ? <span className="text-xs text-gray-400 ml-1">{e.vatRate}%</span> : null}
                  </span>

                  {/* Total */}
                  <span className={`text-sm font-semibold text-right ${miss.includes('total') ? 'text-red-600' : 'text-gray-900'}`}>{eur(e.total)}</span>
                </div>
              )})}

              {/* Group subtotal */}
              <div className="flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm font-bold text-gray-700">
                {eur(catTotal)}
              </div>
            </div>
          ))}

          {/* Grand total footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200">
            <span className="text-sm font-semibold text-green-800">Σύνολο ({totals.count} παραστατικά)</span>
            <span className="text-lg font-bold text-green-900">{eur(totals.total)}</span>
          </div>
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
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold mt-1 ${accent}`}>{value}</p>
    </div>
  )
}
