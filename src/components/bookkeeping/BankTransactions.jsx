import { useState, useEffect, useMemo } from 'react'
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { BANK_STYLE } from './BankChip'

// «Τράπεζες» — έλεγχος όπως τον κάνει ο λογιστής: κάθε λογαριασμός ξεχωριστά,
// κάθε γραμμή πρέπει να δικαιολογείται (παραστατικό / μισθός / εσωτερική μεταφορά /
// προμήθεια τράπεζας / είσπραξη) — ό,τι δεν δικαιολογείται σημαίνεται ⚠ για να
// βρεθεί το δικαιολογητικό. Έσοδα ανά τράπεζα χωρίς τις εσωτερικές μεταφορές.
// Free-tier friendly: φορτώνει μόνο την επιλεγμένη περίοδο (μήνα ή τρίμηνο).

const eur = n => n == null ? '' : '€' + Number(n).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const MONTH_NAMES = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
const fmtDate = d => {
  if (!d) return '—'
  const [, m, day] = d.split('-')
  return `${parseInt(day)} ${MONTH_NAMES[parseInt(m) - 1]}`
}

// Λογαριασμοί Dermlux LTD + η Ιατρική ΙΕΠΕ (ΞΕΧΩΡΙΣΤΗ εταιρεία — εκτός συνόλων Dermlux)
const ACCOUNTS = [
  { key: '357041157122',    bank: 'Bank of Cyprus', label: 'Κύριος ···1157122' },
  { key: '357542264638',    bank: 'Bank of Cyprus', label: 'Ταμείο ···2264638' },
  { key: '589-01-H59895-01', bank: 'Eurobank',      label: '···H59895' },
  { key: 'revolut',         bank: 'Revolut',        label: 'Business' },
  { key: '357046275557',    bank: 'Bank of Cyprus', label: '⚕️ Ιατρική ΙΕΠΕ', company: 'IEPE' },
]
const IEPE_ACCOUNT = '357046275557'

// Μια συναλλαγή μπορεί να πληρώνει ΠΟΛΛΑ τιμολόγια μαζί (ομαδικές πληρωμές)
export const matchedIds = t => {
  if (t.matchedExpenseIds) {
    try { const a = JSON.parse(t.matchedExpenseIds); if (Array.isArray(a) && a.length) return a } catch { /* noop */ }
  }
  return t.matchedExpenseId ? [t.matchedExpenseId] : []
}

const FEE_RE = /CardTxnAdmin|COMMISSION|CHARGES|Ledger Fee|Maintenance|SUBSCR\.? FEE|Account Fee|Transfer Fees|MAINT\. FEES|Προμήθεια του Revolut/i
const REFUND_RE = /refund|επιστροφή|epistrofi/i
// Εστίαση/entertainment: το ΦΠΑ δεν εκπίπτει — δικαιολογείται ως φιλοξενία, δεν θέλει τιμολόγιο ΦΠΑ
const ENTERTAIN_RE = /SMOCLOCK|FOODHAUS|PANDORA BAKERIES|STOP KIOSK|FLYING DRAGON|WOLT|FOODY|CAFFE|COFFEE|RESTAURANT|PIZZ|GRILL|SOUVLA|TAVERN|BAKERIES|ZORPAS|GREGORY/i
// Διαφημίσεις πλατφορμών — όλες στην κάρτα BoC· invoices από τα Billing των πλατφορμών
const ADS_RE = /FACEBK|GOOGLE ADS|GOOGLE INSTAGRAM|TIKTOK/i

// Πώς δικαιολογείται η γραμμή; null = ΔΕΝ δικαιολογείται (θέλει δικαιολογητικό)
function justification(t) {
  const ids = matchedIds(t)
  if (t.credit) {
    if (t.flow === 'cards')        return { label: '💳 Έσοδα καρτών',    cls: 'bg-green-100 text-green-700' }
    if (t.flow === 'cash_deposit') return { label: '💶 Κατάθεση μετρητών', cls: 'bg-green-100 text-green-700' }
    if (t.flow === 'internal')     return { label: '🔁 Εσωτερική',       cls: 'bg-gray-200 text-gray-600' }
    if (t.flow === 'loan')         return { label: '🏛️ Δάνειο/κεφάλαια', cls: 'bg-purple-100 text-purple-700' }
    if (t.flow === 'other_in')     return { label: '↙ Λοιπή είσπραξη',   cls: 'bg-teal-100 text-teal-700' }
    return { label: '↙ Είσπραξη', cls: 'bg-teal-100 text-teal-700' }
  }
  if (ids.length === 1) return { label: '📎 παραστατικό', cls: 'bg-green-100 text-green-700', receipts: 1 }
  if (ids.length > 1)   return { label: `📎 ×${ids.length} ομαδική`, cls: 'bg-green-100 text-green-700', receipts: ids.length }
  if (t.tag === 'Μισθοί')     return { label: '👥 Μισθοί',           cls: 'bg-indigo-100 text-indigo-700' }
  if (t.tag === 'Εισφορές')   return { label: '🏛️ Εισφορές ΚΑ',      cls: 'bg-violet-100 text-violet-700' }
  if (t.flow === 'internal')  return { label: '🔁 Εσωτερική',        cls: 'bg-gray-200 text-gray-600' }
  if (FEE_RE.test(t.description || '')) return { label: '🏦 Προμήθεια τράπεζας', cls: 'bg-sky-100 text-sky-700' }
  if (ADS_RE.test(t.description || '')) return { label: '📣 Διαφημίσεις', cls: 'bg-blue-100 text-blue-700' }
  if (ENTERTAIN_RE.test(t.description || '')) return { label: '🍽 Εστίαση (ΦΠΑ μη εκπιπτ.)', cls: 'bg-orange-100 text-orange-700' }
  // Voiso: τα top-ups αντιστοιχούν στο μηνιαίο statement — δένεται όταν εισαχθεί το αντίστοιχο τρίμηνο
  if (/SEMANTRONICS/i.test(t.description || '')) return { label: '📞 Voiso (τηλεφωνία)', cls: 'bg-cyan-100 text-cyan-700' }
  // Πάγιες SEPA χρεώσεις κοινής ωφέλειας — οι λογαριασμοί υπάρχουν στα Λογιστικά (ποσά με συμψηφισμούς)
  if (/Eac Bill/i.test(t.description || '')) return { label: '💡 ΑΗΚ (SEPA)', cls: 'bg-yellow-100 text-yellow-700' }
  if (/Primetel.*Sepa|Primetel Bill/i.test(t.description || '')) return { label: '📞 Primetel (SEPA)', cls: 'bg-cyan-100 text-cyan-700' }
  if (REFUND_RE.test(t.description || '')) return { label: '↩ Επιστροφή πελάτη', cls: 'bg-rose-100 text-rose-700' }
  return null
}

// Αναγνώσιμη περιγραφή: βγάζει μπροστά το κείμενο ΤΟΥ ΧΡΗΣΤΗ (ό,τι έγραψε στη μεταφορά)
// και κρύβει τα τεχνικά προθέματα της τράπεζας. Το πλήρες κείμενο μένει σε tooltip.
function humanDesc(t) {
  const d = t.description || ''
  let m = d.match(/^1Bank - Transfer-Internet-Debit\s+(.+)$/i)
  if (m) return { main: m[1].trim(), sub: '1Bank μεταφορά' }
  m = d.match(/^1Bank - Credit Advice\s+(.+)$/i)
  if (m) return { main: m[1].trim(), sub: '1Bank πίστωση' }
  m = d.match(/OUTWARD\s+\S+\s+to\s+([^>]{3,45}?)\s*a\/c\s*\S*\s*>?\s*(.*)$/i)
  if (m) return { main: `προς ${m[1].trim()}${m[2] ? ` — ${m[2].trim()}` : ''}`, sub: 'Έμβασμα' }
  m = d.match(/INWARD\s+\S+\s+by\s+UAB Phoenix Payments\s*>?\s*(.*)$/i)
  if (m) return { main: `Εκκαθάριση καρτών (JCC/Phoenix) ${m[1] || ''}`.trim(), sub: 'Είσπραξη' }
  m = d.match(/INWARD\s+\S+\s+by\s+([^>]{3,45})\s*>?\s*(.*)$/i)
  if (m) return { main: `από ${m[1].trim()}${m[2] ? ` — ${m[2].trim()}` : ''}`, sub: 'Είσπραξη' }
  m = d.match(/^(?:\w{2}\s+\d{4}\s+)?(.{3,42}?)\s+PURCHASE\s+(?:CY\s+)?Card/i)
  if (m) return { main: m[1].trim(), sub: 'Αγορά με κάρτα' }
  m = d.match(/^CardTxnAdmin/i)
  if (m) return { main: 'Προμήθεια συναλλαγής κάρτας', sub: 'Τραπεζικό έξοδο' }
  return { main: d, sub: '' }
}

// Αντισυμβαλλόμενος (προμηθευτής/δικαιούχος) από την περιγραφή — για το group ανά προμηθευτή
function payee(t) {
  const d = t.description || ''
  let m = d.match(/to ([^>]{3,45}?)\s*a\/c/i)
  if (m) return m[1].trim()
  m = d.match(/^([A-Z0-9Α-ΩΆ-Ώ .&'*-]{3,42}?)\s+PURCHASE/i)
  if (m) return m[1].trim()
  m = d.match(/^\w{2}\s+\d{4}\s+(.{3,42}?)\s+PURCHASE/i)
  if (m) return m[1].trim()
  m = d.match(/^(.{3,40}?)\s+Bill\b/i)
  if (m) return m[1].trim()
  return null
}

export default function BankTransactions() {
  const now = new Date()
  const [period, setPeriod] = useState('month')   // 'month' | 'quarter'
  const [year, setYear]     = useState(now.getFullYear())
  const [month, setMonth]   = useState(now.getMonth() + 1)
  const [quarter, setQuarter] = useState(Math.floor(now.getMonth() / 3) + 1)
  const [account, setAccount] = useState('')      // '' = όλοι οι λογαριασμοί
  const [view, setView]     = useState('all')     // all | pending | income | salaries | vendors | matched
  const [txns, setTxns]     = useState([])
  const [loading, setLoading] = useState(true)
  const [openTx, setOpenTx]   = useState(null)
  const [openVendor, setOpenVendor] = useState(null)
  const [expCache, setExpCache] = useState({})
  const [shown, setShown] = useState(150)   // σταδιακό rendering — δεν κολλάει το scroll
  const [cashExpenses, setCashExpenses] = useState(null)  // lazy: έξοδα μετρητών (ταμείο)

  // Cash view: τα έξοδα με πληρωμή «Μετρητά» δεν περνούν από καμία τράπεζα —
  // φορτώνονται από τα expenses (μία φορά) και φιλτράρονται ανά περίοδο client-side
  useEffect(() => {
    if (view !== 'cash' || cashExpenses !== null) return
    getDocs(query(collection(db, 'expenses'),
                  where('paymentMethod', '==', 'Μετρητά'), limit(500)))
      .then(snap => setCashExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() => setCashExpenses([]))
  }, [view, cashExpenses])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const mFrom = period === 'quarter' ? (quarter - 1) * 3 + 1 : month
    const mTo   = period === 'quarter' ? (quarter - 1) * 3 + 3 : month
    const from = `${year}-${String(mFrom).padStart(2, '0')}-01`
    const to   = `${year}-${String(mTo).padStart(2, '0')}-31`
    const q = query(collection(db, 'bank_transactions'),
                    where('date', '>=', from), where('date', '<=', to),
                    orderBy('date', 'desc'))
    getDocs(q).then(snap => {
      if (cancelled) return
      setTxns(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }).catch(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [year, month, quarter, period])

  async function toggleTx(t) {
    const next = openTx === t.id ? null : t.id
    setOpenTx(next)
    if (!next) return
    for (const id of matchedIds(t)) {
      if (expCache[id]) continue
      try {
        const s = await getDoc(doc(db, 'expenses', id))
        if (s.exists()) setExpCache(prev => ({ ...prev, [id]: { id: s.id, ...s.data() } }))
      } catch { /* ignore */ }
    }
  }

  const inAccount = t => {
    // «Όλοι» = ΜΟΝΟ Dermlux LTD — η ΙΕΠΕ είναι άλλη εταιρεία, φαίνεται μόνο με το δικό της chip
    if (!account) return t.account !== IEPE_ACCOUNT
    if (account === 'revolut') return t.bank === 'Revolut'
    return t.account === account
  }

  const scoped = useMemo(() => txns.filter(inAccount), [txns, account]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => scoped.filter(t => {
    const j = justification(t)
    if (view === 'pending')  return t.debit && !j
    if (view === 'income')   return !!t.credit
    if (view === 'salaries') return t.tag === 'Μισθοί'
    if (view === 'matched')  return matchedIds(t).length > 0
    return true
  }), [scoped, view])

  // Νέα φίλτρα/περίοδος → ξεκίνα πάλι από τις πρώτες 150 γραμμές
  useEffect(() => { setShown(150) }, [view, account, year, month, quarter, period])

  // Metrics — έσοδα ΧΩΡΙΣ εσωτερικές μεταφορές (αλλιώς διπλομετριούνται)
  const M = useMemo(() => {
    const m = { cards: 0, cash: 0, otherIn: 0, internalIn: 0, loan: 0,
                out: 0, internalOut: 0, sal: 0, pending: 0, pendingSum: 0, matched: 0 }
    for (const t of scoped) {
      if (t.credit) {
        if (t.flow === 'cards') m.cards += t.credit
        else if (t.flow === 'cash_deposit') m.cash += t.credit
        else if (t.flow === 'internal') m.internalIn += t.credit
        else if (t.flow === 'loan') m.loan += t.credit
        else m.otherIn += t.credit
      }
      if (t.debit) {
        if (t.flow === 'internal') m.internalOut += t.debit
        else m.out += t.debit
        if (t.tag === 'Μισθοί') m.sal += t.debit
        const j = justification(t)
        if (!j) { m.pending++; m.pendingSum += t.debit }
        if (matchedIds(t).length) m.matched++
      }
    }
    m.income = m.cards + m.cash + m.otherIn
    return m
  }, [scoped])

  // Εμβάσματα/πληρωμές ανά προμηθευτή (χωρίς μισθούς & εσωτερικές)
  const vendors = useMemo(() => {
    const map = {}
    for (const t of scoped) {
      if (!t.debit || t.tag === 'Μισθοί' || t.flow === 'internal') continue
      if (FEE_RE.test(t.description || '')) continue
      const p = payee(t) || (matchedIds(t).length ? '(μεταφορά με παραστατικό)' : '(μεταφορά — ελεύθερο κείμενο)')
      const k = p.toUpperCase().replace(/\s+/g, ' ')
      if (!map[k]) map[k] = { name: p, total: 0, rows: [] }
      map[k].total += t.debit
      map[k].rows.push(t)
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [scoped])

  const pill = (active) => `px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
    active ? 'bg-blue-700 border-blue-700 text-white shadow-sm'
           : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700'}`

  const periodLabel = period === 'quarter' ? `Q${quarter} ${year}` : `${MONTH_NAMES[month - 1]} ${year}`

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Τράπεζες</h1>
          <p className="text-sm text-gray-500 mt-0.5">Κάθε λογαριασμός ξεχωριστά — κάθε γραμμή πρέπει να δικαιολογείται</p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {[['month', 'Μήνας'], ['quarter', 'Τρίμηνο']].map(([p, lbl]) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-2 text-sm font-medium ${period === p ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {lbl}
              </button>
            ))}
          </div>
          <select value={year} onChange={e => setYear(+e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            {[2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {period === 'month' ? (
            <select value={month} onChange={e => setMonth(+e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          ) : (
            <select value={quarter} onChange={e => setQuarter(+e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              {[1, 2, 3, 4].map(q => <option key={q} value={q}>Q{q}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Λογαριασμοί — ένας ένας όπως τους ελέγχει ο λογιστής */}
      <div className="flex gap-1.5 flex-wrap items-center mb-3">
        <button onClick={() => setAccount('')} className={pill(account === '')}>Όλοι οι λογαριασμοί</button>
        {ACCOUNTS.map(a => {
          const st = BANK_STYLE[a.bank]
          const active = account === a.key
          return (
            <button key={a.key} onClick={() => setAccount(active ? '' : a.key)}
                    className={`${pill(active)} inline-flex items-center gap-1.5`}>
              {st?.logo
                ? <img src={st.logo} alt={a.bank} className={`h-3.5 w-auto ${active ? 'brightness-0 invert' : ''}`} />
                : <span className={`text-[10px] font-black px-1.5 rounded-full ${st?.cls || 'bg-gray-500 text-white'}`}>{st?.label}</span>}
              <span className="text-xs">{a.label}</span>
            </button>
          )
        })}
      </div>

      {/* Views */}
      <div className="flex gap-1.5 flex-wrap items-center mb-4">
        {[['all', 'Όλα'], ['pending', `⚠ Θέλουν δικαιολογητικό${M.pending ? ` (${M.pending})` : ''}`],
          ['income', '↙ Εισπράξεις'], ['matched', '📎 Με παραστατικό'], ['salaries', '👥 Μισθοί'],
          ['vendors', '🏷️ Ανά προμηθευτή'], ['cash', '💶 Cash (ταμείο)']].map(([v, lbl]) => (
          <button key={v} onClick={() => setView(v)} className={pill(view === v)}>{lbl}</button>
        ))}
      </div>

      {/* Metrics — τι ΜΠΗΚΕ (χωρίς εσωτερικές), τι βγήκε */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-[10px] text-green-600 uppercase tracking-wide font-bold">Μπήκε στις τράπεζες ({periodLabel})</p>
          <p className="text-xl font-bold text-green-800 mt-0.5">{eur(M.income)}</p>
          <p className="text-[11px] text-green-700 mt-1">
            💳 Κάρτες {eur(M.cards)} · 💶 Μετρητά {eur(M.cash)}{M.otherIn > 0 && <> · Λοιπά {eur(M.otherIn)}</>}
          </p>
        </div>
        <Card label="Βγήκε (χωρίς εσωτερικές)" value={eur(M.out)} accent="text-red-700" />
        <Card label="Μισθοί" value={eur(M.sal)} accent="text-indigo-700" />
        <div className={`border rounded-xl p-3 ${M.pending ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-200'}`}>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">⚠ Θέλουν δικαιολογητικό</p>
          <p className={`text-lg font-bold mt-0.5 ${M.pending ? 'text-amber-700' : 'text-green-700'}`}>
            {M.pending ? `${M.pending} · ${eur(M.pendingSum)}` : 'Καμία ✓'}
          </p>
        </div>
      </div>
      {(M.internalIn > 0 || M.internalOut > 0 || M.loan > 0) && (
        <p className="text-[11px] text-gray-400 mb-1">
          🔁 Εσωτερικές μεταφορές (ΔΕΝ μετράνε στα έσοδα): μπήκαν {eur(M.internalIn)} · βγήκαν {eur(M.internalOut)}
          {M.loan > 0 && <> · 🏛️ Δάνειο/κεφάλαια {eur(M.loan)}</>}
        </p>
      )}
      <p className="text-[11px] text-gray-400 mb-4">
        ℹ️ «Μπήκε» ≠ τζίρος Base44: οι κάρτες εκκαθαρίζονται με 1–3 μέρες καθυστέρηση και κρατήσεις,
        τα μετρητά μετράνε μόνο όταν κατατεθούν. Λείπει ακόμα το πλήρες statement του λογαριασμού
        Ταμείου BoC — οι μεταφορές «από ταμείο» φαίνονται προσωρινά ως εσωτερικές.
      </p>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Φόρτωση…</div>

      ) : view === 'cash' ? (
        /* ─────────── ΕΞΟΔΑ ΜΕΤΡΗΤΩΝ (ΤΑΜΕΙΟ) — δεν περνούν από τράπεζα ─────────── */
        (() => {
          if (cashExpenses === null) return <div className="text-center py-16 text-gray-400">Φόρτωση…</div>
          const mFrom = period === 'quarter' ? (quarter - 1) * 3 + 1 : month
          const mTo   = period === 'quarter' ? (quarter - 1) * 3 + 3 : month
          const from = `${year}-${String(mFrom).padStart(2, '0')}-01`
          const to   = `${year}-${String(mTo).padStart(2, '0')}-31`
          const rows = cashExpenses.filter(e => e.date >= from && e.date <= to)
                                   .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
          const sum = rows.reduce((s2, e) => s2 + (Number(e.total) || 0), 0)
          return rows.length === 0
            ? <div className="text-center py-16 text-gray-400">Κανένα έξοδο μετρητών στην περίοδο</div>
            : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50 border-b border-emerald-200">
                <span className="text-sm font-semibold text-emerald-800">💶 Πληρωμένα από ταμείο (μετρητά) — {periodLabel}</span>
                <span className="text-sm font-bold text-emerald-900">{eur(sum)} · {rows.length} παραστατικά</span>
              </div>
              {rows.map((e, i) => (
                <div key={e.id} className={`flex items-center gap-3 px-4 py-2.5 ${i < rows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <span className="text-xs text-gray-500 w-16 shrink-0">{fmtDate(e.date)}</span>
                  <span className="flex-1 min-w-0 text-sm text-gray-800 truncate">
                    {e.vendor || '—'}
                    {e.location && e.location !== 'Γενικά' && <span className="text-xs text-gray-400"> · {e.location}</span>}
                  </span>
                  {e.fileUrl
                    ? <a href={e.fileUrl} target="_blank" rel="noreferrer" className="shrink-0 text-green-500" title="Άνοιγμα αποδεικτικού">📎</a>
                    : <span className="shrink-0 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full">χωρίς αποδεικτικό</span>}
                  <span className="text-sm font-semibold text-gray-900 w-20 text-right shrink-0">{eur(e.total)}</span>
                </div>
              ))}
            </div>
          )
        })()

      ) : view === 'vendors' ? (
        /* ─────────── ΕΜΒΑΣΜΑΤΑ / ΠΛΗΡΩΜΕΣ ΑΝΑ ΠΡΟΜΗΘΕΥΤΗ ─────────── */
        vendors.length === 0 ? <div className="text-center py-16 text-gray-400">Καμία πληρωμή προμηθευτή στην περίοδο</div> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {vendors.map(v => {
            const open = openVendor === v.name
            return (
              <div key={v.name} className="border-b border-gray-100 last:border-0">
                <button onClick={() => setOpenVendor(open ? null : v.name)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors">
                  <span className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate block">{v.name}</span>
                    <span className="text-xs text-gray-400">{v.rows.length} πληρωμές</span>
                  </span>
                  <span className="text-sm font-bold text-gray-900">{eur(v.total)}</span>
                </button>
                {open && (
                  <div className="bg-gray-50/60 border-t border-gray-100">
                    {v.rows.map(t => (
                      <Row key={t.id} t={t} open={openTx === t.id} onToggle={() => toggleTx(t)} expCache={expCache} indent />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-t border-blue-200">
            <span className="text-sm font-semibold text-blue-800">Σύνολο ({vendors.length} προμηθευτές)</span>
            <span className="text-lg font-bold text-blue-900">{eur(vendors.reduce((s, v) => s + v.total, 0))}</span>
          </div>
        </div>
        )

      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {account === 'revolut' ? 'Revolut Business: δεν έχουν φορτωθεί ακόμα κινήσεις — εκκρεμεί το export' : 'Καμία συναλλαγή για αυτά τα φίλτρα'}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[4.5rem_4.5rem_1fr_6rem_6rem_6.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <span>Τράπεζα</span><span>Ημ/νία</span><span>Περιγραφή & αντιστοίχιση</span>
            <span className="text-right">Χρέωση</span><span className="text-right">Πίστωση</span><span className="text-right">Υπόλοιπο</span>
          </div>
          {filtered.slice(0, shown).map((t, i) => (
            <div key={t.id} className={i < filtered.length - 1 ? 'border-b border-gray-100' : ''}>
              <Row t={t} open={openTx === t.id} onToggle={() => toggleTx(t)} expCache={expCache} />
            </div>
          ))}
          {filtered.length > shown && (
            <button onClick={() => setShown(v => v + 200)}
              className="w-full py-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              Φόρτωσε περισσότερα ({filtered.length - shown} ακόμα)
            </button>
          )}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3">
        💡 Κάθε γραμμή δείχνει με τι αντιστοιχεί: 📎 παραστατικό (κλικ για προβολή, ×N = ομαδική πληρωμή), 👥 μισθός,
        🔁 εσωτερική μεταφορά (δεν μετρά στα έσοδα), 🏦 προμήθεια τράπεζας, 💳/💶 εισπράξεις.
        Ό,τι έχει ⚠ χρειάζεται δικαιολογητικό — όπως θα το ζητούσε ο λογιστής.
      </p>
    </div>
  )
}

function Row({ t, open, onToggle, expCache, indent = false }) {
  const st = BANK_STYLE[t.bank] || { label: '?', cls: 'bg-gray-500 text-white' }
  const ids = matchedIds(t)
  const j = justification(t)
  const clickable = ids.length > 0
  return (
    <>
      <div onClick={() => clickable && onToggle()}
        className={`grid grid-cols-[4.5rem_4.5rem_1fr_6rem_6rem_6.5rem] gap-x-3 items-center ${indent ? 'pl-10 pr-4' : 'px-4'} py-2.5 ${clickable ? 'cursor-pointer hover:bg-blue-50' : ''} ${!j && t.debit ? 'bg-amber-50/50' : ''}`}>
        <span title={`${t.bank} — ${t.account || ''}`} className="inline-flex items-center">
          {st.logo
            ? <img src={st.logo} alt={t.bank} className="h-3 w-auto max-w-[4rem]" />
            : <span className={`inline-flex justify-center text-[10px] font-black px-1.5 py-0.5 rounded-full w-fit ${st.cls}`}>{st.label}</span>}
        </span>
        <span className="text-xs text-gray-500">{fmtDate(t.date)}</span>
        <span className="text-xs text-gray-700 truncate flex items-center gap-1.5 min-w-0" title={t.description}>
          {(() => { const h = humanDesc(t); return (
            <span className="truncate">
              <span className="font-medium">{h.main}</span>
              {h.sub && <span className="text-gray-400"> · {h.sub}</span>}
            </span>
          )})()}
          {j
            ? <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${j.cls}`}>{j.label}</span>
            : t.debit
              ? <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-300 px-1.5 py-0.5 rounded-full">⚠ θέλει δικαιολογητικό</span>
              : null}
        </span>
        <span className="text-sm text-right font-semibold text-red-700">{t.debit ? eur(t.debit) : ''}</span>
        <span className="text-sm text-right font-semibold text-green-700">{t.credit ? eur(t.credit) : ''}</span>
        <span className="text-xs text-right text-gray-400">{eur(t.balance)}</span>
      </div>
      {open && ids.length > 0 && (
        <div className="px-6 pb-3 bg-blue-50/50 space-y-2">
          {ids.length > 1 && (
            <p className="text-[11px] text-blue-700 font-medium pt-2">
              Ομαδική πληρωμή {ids.length} τιμολογίων — σύνολο παραστατικών {eur(ids.reduce((s, id) => s + (Number(expCache[id]?.total) || 0), 0))}
            </p>
          )}
          {ids.map(id => {
            const exp = expCache[id]
            if (!exp) return <p key={id} className="text-xs text-gray-400 py-2">Φόρτωση παραστατικού…</p>
            return (
              <div key={id} className="flex items-center gap-4 bg-white border border-blue-200 rounded-lg p-3">
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
            )
          })}
        </div>
      )}
    </>
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
