import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

// «Τράπεζες» — statement view: κάθε γραμμή όπως τη δίνει η τράπεζα, με δίπλα το
// συνδεδεμένο παραστατικό (αν έχει ταιριάξει), tag Μισθών, και σήμανση για
// αταίριαστες χρεώσεις. Free-tier friendly: φορτώνει ΜΟΝΟ τον επιλεγμένο μήνα
// (range query στο date, string ISO) — όχι ολόκληρη τη συλλογή.

const eur = n => n == null ? '' : '€' + Number(n).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const MONTH_NAMES = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
const BANK_STYLE = {
  'Bank of Cyprus': { label: 'BoC', cls: 'bg-red-600 text-white' },
  'Eurobank':       { label: 'EB',  cls: 'bg-blue-900 text-white' },
  'Revolut':        { label: 'R',   cls: 'bg-gray-900 text-white' },
}
const fmtDate = d => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${parseInt(day)} ${MONTH_NAMES[parseInt(m) - 1]}`
}

export default function BankTransactions() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [bank, setBank]   = useState('')          // '' = όλες
  const [view, setView]   = useState('all')       // all | salaries | unmatched | matched
  const [txns, setTxns]   = useState([])
  const [loading, setLoading] = useState(true)
  const [openTx, setOpenTx]   = useState(null)    // expanded txn id
  const [expCache, setExpCache] = useState({})    // matchedExpenseId -> expense doc

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const from = `${year}-${String(month).padStart(2, '0')}-01`
    const to   = `${year}-${String(month).padStart(2, '0')}-31`
    const q = query(collection(db, 'bank_transactions'),
                    where('date', '>=', from), where('date', '<=', to),
                    orderBy('date', 'desc'))
    getDocs(q).then(snap => {
      if (cancelled) return
      setTxns(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }).catch(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [year, month])

  // Φόρτωσε το συνδεδεμένο έξοδο on-demand (1 read) όταν ανοίγει μια γραμμή
  async function toggleTx(t) {
    const next = openTx === t.id ? null : t.id
    setOpenTx(next)
    if (next && t.matchedExpenseId && !expCache[t.matchedExpenseId]) {
      try {
        const s = await getDoc(doc(db, 'expenses', t.matchedExpenseId))
        if (s.exists()) setExpCache(prev => ({ ...prev, [t.matchedExpenseId]: { id: s.id, ...s.data() } }))
      } catch { /* ignore */ }
    }
  }

  const filtered = useMemo(() => txns.filter(t => {
    if (bank && t.bank !== bank) return false
    if (view === 'salaries'  && t.tag !== 'Μισθοί') return false
    if (view === 'unmatched' && (!t.debit || t.tag === 'Μισθοί' || t.matchedExpenseId)) return false
    if (view === 'matched'   && !t.matchedExpenseId) return false
    return true
  }), [txns, bank, view])

  const totals = useMemo(() => {
    let deb = 0, cre = 0, sal = 0, matched = 0, unmatched = 0
    for (const t of txns) {
      deb += t.debit  || 0
      cre += t.credit || 0
      if (t.tag === 'Μισθοί') sal += t.debit || 0
      if (t.debit && t.matchedExpenseId) matched++
      if (t.debit && !t.matchedExpenseId && t.tag !== 'Μισθοί') unmatched++
    }
    return { deb, cre, sal, matched, unmatched }
  }, [txns])

  const pill = (active) => `px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
    active ? 'bg-blue-700 border-blue-700 text-white shadow-sm'
           : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700'}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Τράπεζες</h1>
          <p className="text-sm text-gray-500 mt-0.5">Statement όπως το δίνει η τράπεζα, με τα αποδεικτικά δίπλα</p>
        </div>
        <div className="flex gap-2 items-center">
          <select value={year} onChange={e => setYear(+e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={month} onChange={e => setMonth(+e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Φίλτρα τράπεζας + view */}
      <div className="flex gap-1.5 flex-wrap items-center mb-3">
        <button onClick={() => setBank('')} className={pill(bank === '')}>Όλες</button>
        {Object.entries(BANK_STYLE).map(([b, st]) => (
          <button key={b} onClick={() => setBank(bank === b ? '' : b)} className={pill(bank === b)}>
            <span className={`inline-block text-[10px] font-black px-1.5 rounded-full mr-1 ${st.cls}`}>{st.label}</span>{b}
          </button>
        ))}
        <span className="mx-2 text-gray-300">|</span>
        {[['all', 'Όλα'], ['matched', '📎 Με παραστατικό'], ['unmatched', '⚠ Χωρίς παραστατικό'], ['salaries', '👥 Μισθοί']].map(([v, lbl]) => (
          <button key={v} onClick={() => setView(v)} className={pill(view === v)}>{lbl}</button>
        ))}
      </div>

      {/* Σύνοψη μήνα */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <Card label="Χρεώσεις"   value={eur(totals.deb)} accent="text-red-700" />
        <Card label="Πιστώσεις"  value={eur(totals.cre)} accent="text-green-700" />
        <Card label="Μισθοί"     value={eur(totals.sal)} accent="text-indigo-700" />
        <Card label="Με παραστατικό" value={totals.matched} accent="text-green-700" />
        <Card label="Χωρίς παραστατικό" value={totals.unmatched} accent="text-amber-600" />
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Φόρτωση…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Καμία συναλλαγή για αυτά τα φίλτρα</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[3.2rem_4.5rem_1fr_6rem_6rem_6.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Τράπεζα</span><span>Ημ/νία</span><span>Περιγραφή</span>
            <span className="text-right">Χρέωση</span><span className="text-right">Πίστωση</span><span className="text-right">Υπόλοιπο</span>
          </div>
          {filtered.map((t, i) => {
            const st = BANK_STYLE[t.bank] || { label: '?', cls: 'bg-gray-500 text-white' }
            const exp = t.matchedExpenseId ? expCache[t.matchedExpenseId] : null
            const open = openTx === t.id
            const clickable = !!t.matchedExpenseId
            return (
              <div key={t.id} className={i < filtered.length - 1 ? 'border-b border-gray-100' : ''}>
                <div onClick={() => clickable && toggleTx(t)}
                  className={`grid grid-cols-[3.2rem_4.5rem_1fr_6rem_6rem_6.5rem] gap-x-3 items-center px-4 py-2.5 ${clickable ? 'cursor-pointer hover:bg-blue-50' : ''}`}>
                  <span className={`inline-flex justify-center text-[10px] font-black px-1.5 py-0.5 rounded-full w-fit ${st.cls}`} title={t.account}>
                    {st.label}
                  </span>
                  <span className="text-xs text-gray-500">{fmtDate(t.date)}</span>
                  <span className="text-xs text-gray-700 truncate flex items-center gap-1.5 min-w-0">
                    <span className="truncate">{t.description}</span>
                    {t.tag === 'Μισθοί' && <span className="shrink-0 text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">👥 Μισθοί</span>}
                    {t.matchedExpenseId && <span className="shrink-0 text-green-500" title="Συνδεδεμένο παραστατικό — κλικ">📎</span>}
                    {t.debit && !t.matchedExpenseId && t.tag !== 'Μισθοί' && (
                      <span className="shrink-0 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">χωρίς παραστατικό</span>
                    )}
                  </span>
                  <span className="text-sm text-right font-semibold text-red-700">{t.debit ? eur(t.debit) : ''}</span>
                  <span className="text-sm text-right font-semibold text-green-700">{t.credit ? eur(t.credit) : ''}</span>
                  <span className="text-xs text-right text-gray-400">{eur(t.balance)}</span>
                </div>
                {open && t.matchedExpenseId && (
                  <div className="px-6 pb-3 bg-blue-50/50">
                    {exp ? (
                      <div className="flex items-center gap-4 bg-white border border-blue-200 rounded-lg p-3">
                        {exp.fileUrl
                          ? <a href={exp.fileUrl} target="_blank" rel="noreferrer"
                               className="shrink-0 w-16 h-20 border border-gray-200 rounded overflow-hidden bg-gray-50 flex items-center justify-center text-2xl hover:ring-2 hover:ring-blue-400" title="Άνοιγμα παραστατικού">
                              🧾
                            </a>
                          : <span className="shrink-0 w-16 h-20 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-300">—</span>}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{exp.vendor}</p>
                          <p className="text-xs text-gray-500">{exp.invoiceNumber && `Αρ. ${exp.invoiceNumber} · `}{exp.date} · {exp.category}</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{eur(exp.total)} <span className="text-xs font-normal text-gray-400">(ΦΠΑ {eur(exp.vat)})</span></p>
                          {exp.fileUrl && <a href={exp.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Άνοιγμα αποδεικτικού ↗</a>}
                        </div>
                      </div>
                    ) : <p className="text-xs text-gray-400 py-2">Φόρτωση παραστατικού…</p>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">
        💡 Οι γραμμές με 📎 έχουν συνδεδεμένο παραστατικό — κλικ για να το δεις. Οι χρεώσεις «χωρίς παραστατικό»
        είναι είτε πληρωμές χωρίς τιμολόγιο στο σύστημα, είτε κάρτες/μεταφορές που δεν αντιστοιχούν σε έξοδο.
      </p>
    </div>
  )
}

function Card({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold mt-0.5 ${accent}`}>{value}</p>
    </div>
  )
}
