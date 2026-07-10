import { useState, useEffect, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import ExpenseModal, { CATEGORIES, LOCATIONS } from './ExpenseModal'
import ExportPrint from './ExportPrint'
import BankChip from './BankChip'

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
// Category name without the code, e.g. "8203 · ΔΙΑΦΗΜΙΣΕΙΣ" → "ΔΙΑΦΗΜΙΣΕΙΣ"
const catName = c => {
  if (!c) return '—'
  const parts = c.split('·')
  return (parts[1] || parts[0]).trim()
}

export default function Bookkeeping() {
  const { isAccountant } = useAuth()
  const readOnly = isAccountant
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [selYears, setSelYears]   = useState([nowYear])   // default: current year
  const [selMonths, setSelMonths] = useState([])          // default: all months of the year
  const [cat, setCat]           = useState('')
  const [loc, setLoc]           = useState('')
  const [onlyNeeds, setOnlyNeeds] = useState(false)
  const [showDups, setShowDups]   = useState(false)
  const [viewMode, setViewMode]   = useState('invoice')   // 'invoice' | 'merchant'
  const [openMerchant, setOpenMerchant] = useState(null)  // expanded merchant key
  const [savingCat, setSavingCat] = useState(null)        // docId being recategorised

  // Change an expense's category inline (onSnapshot refreshes the list)
  async function changeCategory(id, newCat) {
    if (readOnly) return
    setSavingCat(id)
    try { await updateDoc(doc(db, 'expenses', id), { category: newCat }) }
    catch (e) { console.error('recategorise failed', e) }
    finally { setSavingCat(null) }
  }

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'))
    return onSnapshot(q, snap => {
      // deposit_slip = αποδείξεις κατάθεσης ΑΤΜ — δικαιολογητικά τραπεζών, ΟΧΙ έξοδα
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(e => e.docType !== 'deposit_slip'))
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

  // Toggling a year resets the month filter → show ALL months of the selected year(s)
  const toggleYear = (y) => {
    setSelYears(prev => prev.includes(y) ? prev.filter(x => x !== y) : [...prev, y])
    setSelMonths([])
  }

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

  // Normalised vendor so "MJ Mediscience" == "MJ MEDISCIENCE LTD"
  const normVendor = v => (v || '').toLowerCase().trim()
    .replace(/[.,]/g, '')
    .replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g, '')
    .replace(/\s+/g, ' ').trim()

  // Πιθανά διπλά (π.χ. το ανέβασε η manager ΚΑΙ ο ιδιοκτήτης όταν το πλήρωσε):
  // (α) ίδιος προμηθευτής + ίδιος αρ. τιμολογίου, ή
  // (β) ίδιος προμηθευτής + ίδιο ποσό με ημερομηνίες ≤10 μέρες διαφορά.
  // Υπολογίζεται σε ΟΛΑ τα έξοδα (όχι στα φιλτραρισμένα) ώστε να πιάνει και cross-month.
  const dups = useMemo(() => {
    const groups = []
    const seen = new Set()
    const byInv = {}
    for (const e of expenses) {
      const v = normVendor(e.vendor)
      const inv = (e.invoiceNumber || '').trim().toUpperCase()
      if (v && inv) (byInv[v + '|' + inv] ||= []).push(e)
    }
    for (const arr of Object.values(byInv)) {
      if (arr.length > 1) { groups.push(arr); arr.forEach(e => seen.add(e.id)) }
    }
    const byAmt = {}
    for (const e of expenses) {
      const v = normVendor(e.vendor)
      if (!v || e.total == null || seen.has(e.id)) continue
      (byAmt[v + '|' + Number(e.total).toFixed(2)] ||= []).push(e)
    }
    for (const arr of Object.values(byAmt)) {
      if (arr.length < 2) continue
      arr.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      let cluster = [arr[0]]
      const flush = () => { if (cluster.length > 1) groups.push(cluster) }
      for (let i = 1; i < arr.length; i++) {
        const days = Math.abs(Date.parse(arr[i].date || 0) - Date.parse(cluster[cluster.length - 1].date || 0)) / 86400000
        if (days <= 10) cluster.push(arr[i])
        else { flush(); cluster = [arr[i]] }
      }
      flush()
    }
    const ids = new Set()
    groups.forEach(g => g.forEach(e => ids.add(e.id)))
    return { groups, ids }
  }, [expenses])

  // Group by merchant
  const merchants = useMemo(() => {
    const norm = normVendor
    const map = {}
    for (const e of filtered) {
      const k = norm(e.vendor) || '—'
      if (!map[k]) map[k] = { key: k, name: e.vendor || '—', rows: [], total: 0, cats: {} }
      const g = map[k]
      g.rows.push(e)
      g.total += Number(e.total) || 0
      if ((e.vendor || '').length > g.name.length) g.name = e.vendor   // keep fullest name
      if (e.category) g.cats[e.category] = (g.cats[e.category] || 0) + (Number(e.total) || 0)
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [filtered])

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
          {!readOnly && (
            <button onClick={() => setModal('new')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              + Νέο Έξοδο
            </button>
          )}
        </div>
      </div>

      {/* Filters — year & month pills, multi-select */}
      <div className="mb-5 space-y-2.5">
        <div className="flex gap-1.5 flex-wrap items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0">Έτος</span>
          {years.map(y => (
            <button key={y} onClick={() => toggleYear(y)}
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
          {dups.groups.length > 0 && (
            <button onClick={() => setShowDups(v => !v)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showDups
                  ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                  : 'bg-white border-amber-300 text-amber-700 hover:border-amber-500'}`}>
              👯 {dups.groups.length} πιθανά διπλά
            </button>
          )}
        </div>
      </div>

      {/* ─────────── Πιθανά διπλά ─────────── */}
      {showDups && dups.groups.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">👯 Πιθανά διπλά παραστατικά</h3>
          <p className="text-xs text-amber-700 mb-3">
            Ίδιος προμηθευτής με ίδιο αρ. τιμολογίου, ή ίδιο ποσό σε κοντινές ημερομηνίες (≤10 μέρες) — σε όλο το ιστορικό, ανεξαρτήτως φίλτρων.
            Άνοιξε το ένα από τα δύο και πάτα «Διαγραφή» αν όντως είναι το ίδιο τιμολόγιο.
          </p>
          <div className="space-y-3">
            {dups.groups.map((g, gi) => (
              <div key={gi} className="bg-white border border-amber-200 rounded-lg overflow-hidden">
                {g.map((e, i) => (
                  <button key={e.id} onClick={() => setModal(e)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-amber-50 transition-colors ${i < g.length - 1 ? 'border-b border-amber-100' : ''}`}>
                    <span className="text-xs text-gray-500 w-24 shrink-0">{fmtDate(e.date)}</span>
                    <span className="flex-1 min-w-0">
                      <span className="text-sm text-gray-800 truncate block">{e.vendor || '—'}</span>
                      <span className="text-[11px] text-gray-400">
                        {e.invoiceNumber ? `Αρ. ${e.invoiceNumber} · ` : ''}{e.location || '—'}
                        {e.createdBy ? ` · από ${e.createdBy}` : e.source === 'manager_upload' ? ' · από upload' : ''}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">{eur(e.total)}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ανά κατηγορία</h3>
            {cat && (
              <button onClick={() => setCat('')} className="text-xs text-green-600 hover:underline font-medium">
                ✕ καθαρισμός φίλτρου
              </button>
            )}
          </div>
          <div className="space-y-1">
            {groups.map(({ category: c, catTotal: v }) => {
              const active = cat === c
              return (
              <button key={c} onClick={() => setCat(active ? '' : c)}
                className={`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors text-left ${
                  active ? 'bg-green-50 ring-1 ring-green-300' : 'hover:bg-gray-50'}`}>
                <span className={`w-52 shrink-0 truncate ${active ? 'text-green-800 font-semibold' : 'text-gray-600'}`}>{c}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className={`h-full rounded-full ${active ? 'bg-gradient-to-r from-green-500 to-green-700' : 'bg-gradient-to-r from-green-400 to-green-600'}`}
                       style={{ width: `${(v / maxCat) * 100}%` }} />
                </div>
                <span className={`w-24 text-right font-semibold shrink-0 ${active ? 'text-green-800' : 'text-gray-700'}`}>{eur(v)}</span>
              </button>
            )})}
          </div>
          <p className="text-xs text-gray-400 mt-2">Κάνε κλικ σε μια κατηγορία για να δεις τις αποδείξεις της παρακάτω.</p>
        </div>
      )}

      {/* View toggle: per invoice vs per merchant */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">Προβολή</span>
        {[['invoice', '🧾 Ανά τιμολόγιο'], ['merchant', '🏷️ Ανά προμηθευτή']].map(([m, lbl]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              viewMode === m
                ? 'bg-green-600 border-green-600 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'}`}>
            {lbl}
          </button>
        ))}
        {viewMode === 'merchant' && <span className="text-sm text-gray-500 ml-1">{merchants.length} προμηθευτές</span>}
      </div>

      {/* ─────────── MERCHANT VIEW ─────────── */}
      {!loading && filtered.length > 0 && viewMode === 'merchant' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {merchants.map((mch) => {
            const open = openMerchant === mch.key
            const topCat = Object.entries(mch.cats).sort((a, b) => b[1] - a[1])[0]?.[0]
            const mNeeds = mch.rows.filter(e => missingFields(e).length > 0).length
            return (
              <div key={mch.key} className="border-b border-gray-100 last:border-0">
                <button onClick={() => setOpenMerchant(open ? null : mch.key)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors">
                  <span className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate block">{mch.name}</span>
                    <span className="text-xs text-gray-400">{mch.rows.length} τιμολόγια{topCat ? ` · κυρίως ${catName(topCat)}` : ''}</span>
                  </span>
                  {mNeeds > 0 && (
                    <span className="text-[10px] font-bold uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded">{mNeeds} needs action</span>
                  )}
                  <span className="text-sm font-bold text-gray-900 shrink-0">{eur(mch.total)}</span>
                </button>
                {open && (
                  <div className="bg-gray-50/60 border-t border-gray-100">
                    {mch.rows.map(e => {
                      const miss = missingFields(e)
                      return (
                        <div key={e.id} onClick={() => setModal(e)}
                          className={`flex items-center gap-3 pl-10 pr-4 py-2.5 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${miss.length ? 'hover:bg-red-50' : 'hover:bg-green-50'}`}>
                          <span className="text-xs text-gray-500 w-24 shrink-0">{fmtDate(e.date)}</span>
                          <select value={e.category || ''} disabled={readOnly}
                            onClick={ev => ev.stopPropagation()}
                            onChange={ev => { ev.stopPropagation(); changeCategory(e.id, ev.target.value) }}
                            className={`flex-1 min-w-0 text-xs bg-transparent border border-transparent rounded px-1 cursor-pointer hover:border-gray-300 hover:bg-white focus:bg-white focus:border-green-400 focus:outline-none ${savingCat === e.id ? 'opacity-40' : ''} ${miss.includes('category') ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                            {!CATEGORIES.includes(e.category) && e.category && <option value={e.category}>{catName(e.category)}</option>}
                            {CATEGORIES.map(c => <option key={c} value={c}>{catName(c)}</option>)}
                          </select>
                          <BankChip expense={e} />
                          {e.fileUrl
                            ? <span className="text-green-500 text-xs shrink-0" title="Έχει αποδεικτικό">📎</span>
                            : <span className="w-3 shrink-0" />}
                          <span className={`text-sm font-semibold text-right w-20 shrink-0 ${miss.includes('total') ? 'text-red-600' : 'text-gray-900'}`}>{eur(e.total)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200">
            <span className="text-sm font-semibold text-green-800">Σύνολο ({merchants.length} προμηθευτές)</span>
            <span className="text-lg font-bold text-green-900">{eur(totals.total)}</span>
          </div>
        </div>
      )}

      {/* ─────────── INVOICE VIEW (grouped by category) ─────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Φόρτωση…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Δεν υπάρχουν έξοδα για αυτά τα φίλτρα</div>
      ) : viewMode === 'invoice' ? (
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

                  {/* Vendor (+ needs-action badge + bank/cash chip) */}
                  <span className="text-sm font-medium text-gray-800 truncate flex items-center gap-1.5 min-w-0">
                    <span className={`truncate ${miss.includes('vendor') ? 'text-red-600' : ''}`}>{e.vendor || '— προμηθευτής'}</span>
                    {needs && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                        needs action
                      </span>
                    )}
                    {dups.ids.has(e.id) && (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded" title="Πιθανό διπλό — δες το κουμπί «πιθανά διπλά»">
                        διπλό;
                      </span>
                    )}
                    <BankChip expense={e} />
                  </span>

                  {/* Notes — hidden on mobile */}
                  <span className="hidden md:block text-xs text-gray-400 truncate">{e.notes || e.invoiceNumber || ''}</span>

                  {/* Category — inline editable */}
                  <select value={e.category || ''} disabled={readOnly}
                    onClick={ev => ev.stopPropagation()}
                    onChange={ev => { ev.stopPropagation(); changeCategory(e.id, ev.target.value) }}
                    title="Αλλαγή κατηγορίας"
                    className={`hidden md:block text-xs truncate bg-transparent border border-transparent rounded px-1 -ml-1 cursor-pointer hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none ${savingCat === e.id ? 'opacity-40' : ''} ${miss.includes('category') ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {!CATEGORIES.includes(e.category) && e.category && <option value={e.category}>{catName(e.category)}</option>}
                    {CATEGORIES.map(c => <option key={c} value={c}>{catName(c)}</option>)}
                  </select>

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
      ) : null}

      {modal && (
        <ExpenseModal
          existing={modal === 'new' ? null : modal}
          readOnly={readOnly}
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
