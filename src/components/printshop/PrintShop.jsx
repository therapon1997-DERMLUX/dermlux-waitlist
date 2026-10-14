// Print Shop — εκτυπώσεις και λήψεις για το λογιστήριο (και τον admin).
// Αναζήτηση παντού, περίοδος, παραστατικά, τράπεζα, καρτέλες προμηθευτών, έτοιμα πακέτα,
// σημειώσεις/αιτήματα και ιστορικό αλλαγών. Ό,τι αρχείο: προβολή, λήψη, εκτύπωση, καλάθι.
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  loadExpenses, loadBank, onBooksChange, ACCOUNTS, accountOf, accountLabel, txKind, KIND_LABEL, linkedIds,
  periodRange, MONTHS, matchExpense, matchTx, loadNotes, addNote, setNoteStatus, loadChanges, fold,
} from './booksData'
import { printHtml, rowsXlsxBlob, saveBlob, downloadExpense, printExpense } from './files'
import { runBundle } from './bundles'
import { expensesListHtml, statementHtml, ledgerHtml, vatHtml, vatSummary } from './printViews'
import { emit, on, getBasket, setBasket, addToBasket, setHermesContext } from './bridge'
import { whoFrom, FIELD_LABELS } from '../bookkeeping/changeLog'
import { eur, fmtDate } from '../bookkeeping/ExportPrint'
import { CATEGORIES, LOCATIONS, PAYMENT_METHODS } from '../bookkeeping/ExpenseModal'

const TABS = [
  { k: 'docs', label: 'Παραστατικά' }, { k: 'bank', label: 'Τράπεζα' }, { k: 'suppliers', label: 'Προμηθευτές' },
  { k: 'packs', label: 'Έτοιμα πακέτα' }, { k: 'notes', label: 'Σημειώσεις & αιτήματα' }, { k: 'changes', label: 'Ιστορικό αλλαγών' },
]
const today = () => new Date().toISOString().slice(0, 10)
const nowY = new Date().getFullYear()
const curQ = Math.floor(new Date().getMonth() / 3) + 1
const n = v => Number(v) || 0

function useProgress() {
  const [p, setP] = useState('')
  return [p, setP]
}

function Pill({ active, children, onClick }) {
  return <button type="button" onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${active ? 'bg-emerald-800 border-emerald-800 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-600'}`}>{children}</button>
}
function Action({ children, onClick, disabled, primary, title }) {
  return <button type="button" onClick={onClick} disabled={disabled} title={title}
    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${primary
      ? 'bg-emerald-800 text-white hover:bg-emerald-900' : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-600 hover:text-emerald-900'}`}>{children}</button>
}
function IconBtn({ children, onClick, title, disabled }) {
  return <button type="button" onClick={onClick} title={title} aria-label={title} disabled={disabled}
    className="w-8 h-8 inline-flex items-center justify-center rounded-md text-gray-500 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-30">{children}</button>
}
function Empty({ children }) { return <div className="text-center text-sm text-gray-500 py-12 border border-dashed border-gray-200 rounded-xl bg-white">{children}</div> }

export default function PrintShop() {
  const { currentUser, userProfile, isAdmin } = useAuth()
  const who = whoFrom(currentUser, userProfile)
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'docs')
  const [q, setQ] = useState(params.get('q') || '')
  const [period, setPeriod] = useState(() => {
    const f = params.get('from'), t = params.get('to')
    return f && t ? { kind: 'custom', from: f, to: t } : { kind: 'quarter', year: nowY, n: curQ }
  })
  const [expenses, setExpenses] = useState(null)
  const [err, setErr] = useState('')
  const [, force] = useState(0)
  const searchRef = useRef(null)

  const [from, to] = useMemo(() => {
    if (period.kind === 'all') return ['2023-01-01', today()]
    if (period.kind === 'custom') return [period.from || '2023-01-01', period.to || today()]
    return periodRange(period.kind, period.year, period.n)
  }, [period])
  const periodLabel = period.kind === 'all' ? 'Όλες οι ημερομηνίες' : period.kind === 'year' ? `Έτος ${period.year}`
    : period.kind === 'quarter' ? `Q${period.n} ${period.year}` : period.kind === 'month' ? `${MONTHS[period.n - 1]} ${period.year}` : `${fmtDate(from)} – ${fmtDate(to)}`

  useEffect(() => { loadExpenses().then(setExpenses).catch(e => setErr(e.message)) }, [])
  useEffect(() => onBooksChange(() => { loadExpenses().then(l => setExpenses([...l])); force(x => x + 1) }), [])
  useEffect(() => { setHermesContext({ page: 'Print Shop', tab: TABS.find(t => t.k === tab)?.label || tab, period: `${periodLabel} (${from} έως ${to})`, query: q }) }, [tab, periodLabel, from, to, q])
  // Ο Ερμογένης μπορεί να ανοίξει καρτέλα/αναζήτηση/περίοδο
  useEffect(() => on('printshop:open', o => {
    if (o.tab) setTab(o.tab)
    if (o.query != null) setQ(o.query)
    if (o.from && o.to) setPeriod({ kind: 'custom', from: o.from, to: o.to })
  }), [])
  useEffect(() => {
    const k = e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName)) { e.preventDefault(); searchRef.current?.focus() } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => { const p = {}; if (tab !== 'docs') p.tab = tab; if (q) p.q = q; setParams(p, { replace: true }) }, [tab, q])

  const expById = useMemo(() => new Map((expenses || []).map(e => [e.id, e])), [expenses])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-28">
      <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Print Shop</h1>
          <p className="text-sm text-gray-500">Εκτυπώσεις, λήψεις και φάκελοι για το λογιστήριο · {periodLabel}</p>
        </div>
        <PeriodPicker period={period} setPeriod={setPeriod} />
      </header>

      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>⌕</span>
        <input id="ps-search" ref={searchRef} value={q} onChange={e => setQ(e.target.value)}
          placeholder="Αναζήτηση: προμηθευτής, αρ. τιμολογίου, ποσό (π.χ. 1240,76), περιγραφή τράπεζας…  (πάτα / για αναζήτηση)"
          className="w-full pl-10 pr-24 py-3 rounded-xl border border-gray-200 bg-white shadow-sm text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600" />
        {q && <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800">Καθαρισμός</button>}
      </div>

      <nav className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-5 -mx-1 px-1" role="tablist">
        {TABS.map(t => (
          <button key={t.k} role="tab" aria-selected={tab === t.k} onClick={() => setTab(t.k)}
            className={`px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t.k ? 'border-emerald-700 text-emerald-900 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{t.label}</button>
        ))}
      </nav>

      {err && <p className="text-sm text-red-600 mb-3">Σφάλμα φόρτωσης: {err}</p>}
      {!expenses && !err && <p className="text-sm text-gray-500 animate-pulse py-10 text-center">Φόρτωση παραστατικών…</p>}

      {expenses && tab === 'docs' && <DocsTab expenses={expenses} q={q} from={from} to={to} periodLabel={periodLabel} />}
      {expenses && tab === 'bank' && <BankTab q={q} from={from} to={to} period={period} expById={expById} periodLabel={periodLabel} />}
      {expenses && tab === 'suppliers' && <SuppliersTab expenses={expenses} q={q} from={from} to={to} period={period} />}
      {expenses && tab === 'packs' && <PacksTab expenses={expenses} from={from} to={to} periodLabel={periodLabel} expById={expById} />}
      {tab === 'notes' && <NotesTab who={who} isAdmin={isAdmin} q={q} expById={expById} />}
      {tab === 'changes' && <ChangesTab q={q} />}

      <BasketBar expById={expById} />
    </div>
  )
}

function PeriodPicker({ period, setPeriod }) {
  const years = []; for (let y = nowY; y >= 2024; y--) years.push(y)
  const sel = 'border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600'
  const kind = period.kind
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select id="ps-kind" className={sel} value={kind} onChange={e => {
        const k = e.target.value
        setPeriod(k === 'all' ? { kind: 'all' } : k === 'custom' ? { kind: 'custom', from: `${nowY}-01-01`, to: today() }
          : { kind: k, year: period.year || nowY, n: k === 'month' ? new Date().getMonth() + 1 : k === 'quarter' ? curQ : 0 })
      }}>
        <option value="month">Μήνας</option><option value="quarter">Τρίμηνο</option><option value="year">Έτος</option>
        <option value="custom">Από – έως</option><option value="all">Όλα</option>
      </select>
      {(kind === 'month' || kind === 'quarter' || kind === 'year') && (
        <select id="ps-year" className={sel} value={period.year} onChange={e => setPeriod({ ...period, year: +e.target.value })}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      )}
      {kind === 'quarter' && (
        <select id="ps-q" className={sel} value={period.n} onChange={e => setPeriod({ ...period, n: +e.target.value })}>
          {[1, 2, 3, 4].map(x => <option key={x} value={x}>Q{x} ({MONTHS[(x - 1) * 3].slice(0, 3)}–{MONTHS[(x - 1) * 3 + 2].slice(0, 3)})</option>)}
        </select>
      )}
      {kind === 'month' && (
        <select id="ps-m" className={sel} value={period.n} onChange={e => setPeriod({ ...period, n: +e.target.value })}>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
      )}
      {kind === 'custom' && (<>
        <input id="ps-from" type="date" className={sel} value={period.from} onChange={e => setPeriod({ ...period, from: e.target.value })} />
        <span className="text-gray-400">–</span>
        <input id="ps-to" type="date" className={sel} value={period.to} onChange={e => setPeriod({ ...period, to: e.target.value })} />
      </>)}
    </div>
  )
}

// ---------------- Παραστατικά ----------------
function DocsTab({ expenses, q, from, to, periodLabel }) {
  const [cat, setCat] = useState(''), [loc, setLoc] = useState(''), [pay, setPay] = useState('')
  const [noFile, setNoFile] = useState(false), [unpaid, setUnpaid] = useState(false)
  const [sel, setSel] = useState(new Set())
  const [show, setShow] = useState(150)
  const [prog, setProg] = useProgress()
  const rows = useMemo(() => expenses.filter(e => {
    if (!q && (e.date < from || e.date > to)) return false
    if (q && !matchExpense(e, q)) return false
    if (cat && e.category !== cat) return false
    if (loc && e.location !== loc) return false
    if (pay && e.paymentMethod !== pay) return false
    if (noFile && e.fileUrl) return false
    if (unpaid && (e.bankTagDate || e.paymentMethod === 'Μετρητά')) return false
    return true
  }), [expenses, q, from, to, cat, loc, pay, noFile, unpaid])
  const tot = rows.reduce((a, e) => ({ total: a.total + n(e.total), vat: a.vat + n(e.vat) }), { total: 0, vat: 0 })
  const chosen = sel.size ? rows.filter(r => sel.has(r.id)) : rows
  const label = sel.size ? `${sel.size} επιλεγμένα` : `όλα τα ${rows.length}`
  const bundle = fmt => { setProg('…'); runBundle({ format: fmt, rows: chosen, title: `Παραστατικά ${periodLabel}`, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }
  const sel2 = 'border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-white'
  const toggle = id => setSel(s => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x })

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select id="d-cat" className={sel2} value={cat} onChange={e => setCat(e.target.value)}><option value="">Όλες οι κατηγορίες</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
        <select id="d-loc" className={sel2} value={loc} onChange={e => setLoc(e.target.value)}><option value="">Όλα τα καταστήματα</option>{LOCATIONS.map(c => <option key={c}>{c}</option>)}</select>
        <select id="d-pay" className={sel2} value={pay} onChange={e => setPay(e.target.value)}><option value="">Κάθε πληρωμή</option>{PAYMENT_METHODS.map(c => <option key={c}>{c}</option>)}</select>
        <label className="text-sm text-gray-700 flex items-center gap-1.5"><input id="d-nofile" type="checkbox" checked={noFile} onChange={e => setNoFile(e.target.checked)} /> Χωρίς αρχείο</label>
        <label className="text-sm text-gray-700 flex items-center gap-1.5"><input id="d-unpaid" type="checkbox" checked={unpaid} onChange={e => setUnpaid(e.target.checked)} /> Χωρίς πληρωμή</label>
        {q && <span className="text-xs text-gray-500">Η αναζήτηση ψάχνει σε όλες τις ημερομηνίες</span>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <p className="text-sm text-gray-600"><b className="text-gray-900">{rows.length}</b> παραστατικά · σύνολο <b className="text-gray-900 tabular-nums">{eur(tot.total)}</b> · ΦΠΑ <span className="tabular-nums">{eur(tot.vat)}</span></p>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-gray-500 mr-1">{label}:</span>
          <Action primary disabled={!chosen.length} onClick={() => bundle('pdf')}>Ένα PDF</Action>
          <Action disabled={!chosen.length} onClick={() => bundle('zip')}>ZIP</Action>
          <Action disabled={!chosen.length} onClick={() => bundle('excel')}>Excel</Action>
          <Action disabled={!chosen.length} onClick={() => bundle('print')}>Εκτύπωση με αποδείξεις</Action>
          <Action disabled={!chosen.length} onClick={() => printHtml(expensesListHtml(chosen, 'Παραστατικά', q ? `Αναζήτηση «${q}»` : periodLabel), 'Παραστατικά')}>Εκτύπωση λίστας</Action>
          <Action disabled={!chosen.length} onClick={() => { addToBasket(chosen.map(e => e.id)); setProg(`✓ ${chosen.length} στο καλάθι`) }}>🧺 Στο καλάθι</Action>
        </div>
      </div>
      {prog && <p className="text-sm text-emerald-900 mb-2">{prog}</p>}
      {!rows.length ? <Empty>Δεν βρέθηκαν παραστατικά{q ? ` για «${q}»` : ' στην περίοδο'}.</Empty> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-2 w-8"><input id="d-all" type="checkbox" aria-label="Επιλογή όλων" checked={sel.size > 0 && sel.size === rows.length} onChange={e => setSel(e.target.checked ? new Set(rows.map(r => r.id)) : new Set())} /></th>
                <th className="p-2 text-left">Ημ/νία</th><th className="p-2 text-left">Προμηθευτής</th><th className="p-2 text-left hidden md:table-cell">Κατηγορία</th>
                <th className="p-2 text-right">Σύνολο</th><th className="p-2 text-left hidden sm:table-cell">Πληρωμή</th><th className="p-2 text-right">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, show).map((e, idx) => (
                <tr key={e.id} className="border-t border-gray-100 hover:bg-emerald-50/40">
                  <td className="p-2"><input type="checkbox" aria-label="Επιλογή" checked={sel.has(e.id)} onChange={() => toggle(e.id)} /></td>
                  <td className="p-2 whitespace-nowrap tabular-nums text-gray-600">{fmtDate(e.date)}</td>
                  <td className="p-2 min-w-0">
                    <button className="text-left hover:underline text-gray-900 font-medium" onClick={() => emit('preview', { items: rows, index: idx })}>{e.vendor || '—'}</button>
                    <div className="text-xs text-gray-500">{e.invoiceNumber || 'χωρίς αριθμό'}{e.location ? ` · ${e.location}` : ''}{e.reverseCharge ? ' · αντίστροφη χρέωση' : ''}</div>
                  </td>
                  <td className="p-2 text-xs text-gray-600 hidden md:table-cell">{e.category}</td>
                  <td className="p-2 text-right whitespace-nowrap tabular-nums font-medium">{eur(e.total)}{e.currency && e.currency !== 'EUR' ? <span className="text-xs text-gray-500"> {e.currency}</span> : ''}</td>
                  <td className="p-2 text-xs hidden sm:table-cell">{e.bankTagDate ? <span className="text-emerald-800">✓ {fmtDate(e.bankTagDate)}</span> : e.paymentMethod === 'Μετρητά' ? <span className="text-gray-600">Μετρητά</span> : <span className="text-amber-700">χωρίς πληρωμή</span>}</td>
                  <td className="p-2 text-right whitespace-nowrap">
                    <IconBtn title="Προβολή" onClick={() => emit('preview', { items: rows, index: idx })}>👁</IconBtn>
                    <IconBtn title={e.fileUrl ? 'Λήψη' : 'Δεν υπάρχει αρχείο'} disabled={!e.fileUrl} onClick={() => downloadExpense(e).catch(x => setProg('⚠ ' + x.message))}>⬇</IconBtn>
                    <IconBtn title="Εκτύπωση" disabled={!e.fileUrl} onClick={() => printExpense(e).catch(x => setProg('⚠ ' + x.message))}>🖨</IconBtn>
                    <IconBtn title="Στο καλάθι" onClick={() => { addToBasket([e.id]); setProg('✓ Στο καλάθι') }}>🧺</IconBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > show && <button onClick={() => setShow(s => s + 300)} className="w-full py-3 text-sm text-emerald-900 hover:bg-emerald-50 border-t border-gray-100">Δείξε περισσότερα ({rows.length - show} ακόμα)</button>}
        </div>
      )}
    </section>
  )
}

// ---------------- Τράπεζα ----------------
function BankTab({ q, from, to, period, expById, periodLabel }) {
  const [acc, setAcc] = useState('all'), [kind, setKind] = useState('all')
  const [txs, setTxs] = useState(null), [err, setErr] = useState('')
  const [prog, setProg] = useProgress()
  const tooWide = period.kind === 'all' || (new Date(to) - new Date(from)) / 864e5 > 400
  useEffect(() => {
    if (tooWide) { setTxs(null); return }
    setTxs(null); setErr('')
    loadBank(from, to).then(setTxs).catch(e => setErr(e.message))
  }, [from, to, tooWide])
  const rows = useMemo(() => (txs || []).filter(t => {
    if (acc !== 'all' && accountOf(t) !== acc) return false
    if (!matchTx(t, q)) return false
    const k = txKind(t, expById)
    if (kind === 'missing' && k !== 'missing') return false
    if (kind === 'out' && !(n(t.debit) > 0)) return false
    if (kind === 'in' && !(n(t.credit) > 0)) return false
    return true
  }), [txs, acc, q, kind, expById])
  const docsOf = rows => rows.flatMap(t => linkedIds(t).map(i => expById.get(i)).filter(Boolean))
  const sel = 'border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm bg-white'
  if (tooWide) return <Empty>Για την τράπεζα διάλεξε μήνα, τρίμηνο ή έτος (πάνω δεξιά).</Empty>
  return (
    <section>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select id="b-acc" className={sel} value={acc} onChange={e => setAcc(e.target.value)}>
          <option value="all">Όλοι οι λογαριασμοί</option>{ACCOUNTS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>
        {[['all', 'Όλες'], ['out', 'Χρεώσεις'], ['in', 'Πιστώσεις'], ['missing', 'Χωρίς παραστατικό']].map(([k, l]) => <Pill key={k} active={kind === k} onClick={() => setKind(k)}>{l}</Pill>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-white border border-gray-200 rounded-xl px-3 py-2">
        <p className="text-sm text-gray-600"><b className="text-gray-900">{rows.length}</b> κινήσεις · χρεώσεις <b className="tabular-nums text-gray-900">{eur(rows.reduce((a, t) => a + n(t.debit), 0))}</b> · πιστώσεις <span className="tabular-nums">{eur(rows.reduce((a, t) => a + n(t.credit), 0))}</span></p>
        <div className="flex flex-wrap gap-1.5">
          <Action primary disabled={!rows.length} onClick={() => printHtml(statementHtml(rows, expById, { from, to, account: acc }), `Τράπεζα ${periodLabel}`)}>Εκτύπωση statement</Action>
          <Action disabled={!rows.length} onClick={async () => saveBlob(await rowsXlsxBlob(rows.map(t => ({
            'Ημερομηνία': t.date, 'Λογαριασμός': accountLabel(accountOf(t)), 'Περιγραφή': t.description, 'Χρέωση': t.debit ?? '', 'Πίστωση': t.credit ?? '', 'Υπόλοιπο': t.balance ?? '',
            'Δικαιολογητικό': linkedIds(t).map(i => expById.get(i)).filter(Boolean).map(e => `${e.vendor} ${e.invoiceNumber || ''}`).join('; ') || KIND_LABEL[txKind(t, expById)],
          })), 'Κινήσεις'), `Τράπεζα_${from}_${to}.xlsx`)}>Excel</Action>
          <Action disabled={!docsOf(rows).length} onClick={() => { setProg('…'); runBundle({ format: 'pdf', rows: docsOf(rows), title: `Δικαιολογητικά τράπεζας ${periodLabel}`, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }}>PDF δικαιολογητικών</Action>
          <Action disabled={!docsOf(rows).length} onClick={() => { setProg('…'); runBundle({ format: 'zip', rows: docsOf(rows), title: `Δικαιολογητικά τράπεζας ${periodLabel}`, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }}>ZIP δικαιολογητικών</Action>
        </div>
      </div>
      {prog && <p className="text-sm text-emerald-900 mb-2">{prog}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {!txs && !err ? <p className="text-sm text-gray-500 animate-pulse py-8 text-center">Φόρτωση κινήσεων…</p> : !rows.length ? <Empty>Καμία κίνηση με αυτά τα φίλτρα.</Empty> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide"><tr>
              <th className="p-2 text-left">Ημ/νία</th><th className="p-2 text-left">Περιγραφή</th><th className="p-2 text-right">Ποσό</th><th className="p-2 text-left">Δικαιολογητικό</th></tr></thead>
            <tbody>
              {rows.slice(0, 600).map(t => {
                const k = txKind(t, expById); const docs = linkedIds(t).map(i => expById.get(i)).filter(Boolean)
                return (
                  <tr key={t.id} className="border-t border-gray-100 align-top">
                    <td className="p-2 whitespace-nowrap tabular-nums text-gray-600">{fmtDate(t.date)}<div className="text-[11px] text-gray-400">{accountLabel(accountOf(t)).split(' ···')[0]}</div></td>
                    <td className="p-2 text-gray-800 break-words max-w-[520px]">{t.description}</td>
                    <td className={`p-2 text-right whitespace-nowrap tabular-nums font-medium ${n(t.credit) > 0 ? 'text-emerald-800' : 'text-gray-900'}`}>{n(t.credit) > 0 ? '+' + eur(t.credit) : '−' + eur(t.debit)}</td>
                    <td className="p-2 text-xs">
                      {docs.length ? docs.map((e, j) => <button key={e.id} onClick={() => emit('preview', { items: docs, index: j })} className="block text-left text-emerald-900 hover:underline">📄 {e.vendor} {e.invoiceNumber || ''}</button>)
                        : <span className={k === 'missing' ? 'text-amber-700 font-medium' : 'text-gray-500'}>{k === 'rent' ? t.rentLabel || 'Ενοίκιο' : k === 'standing' ? t.standingLabel : KIND_LABEL[k]}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// ---------------- Προμηθευτές ----------------
function SuppliersTab({ expenses, q, from, to, period }) {
  const [vendor, setVendor] = useState('')
  const [allTime, setAllTime] = useState(true)
  const [prog, setProg] = useProgress()
  const vendors = useMemo(() => {
    const m = new Map()
    for (const e of expenses) {
      const k = (e.vendor || '—').trim()
      const v = m.get(k) || { name: k, n: 0, total: 0, last: '' }
      v.n++; v.total += n(e.total); if (e.date > v.last) v.last = e.date
      m.set(k, v)
    }
    return [...m.values()].filter(v => !q || fold(v.name).includes(fold(q))).sort((a, b) => b.total - a.total)
  }, [expenses, q])
  const rows = useMemo(() => vendor ? expenses.filter(e => (e.vendor || '—').trim() === vendor && (allTime || (e.date >= from && e.date <= to))) : [], [vendor, expenses, allTime, from, to])
  return (
    <section className="grid lg:grid-cols-[340px_1fr] gap-4">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <p className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">{vendors.length} προμηθευτές{q ? ` για «${q}»` : ''} · ταξινόμηση κατά ποσό</p>
        <div className="max-h-[65vh] overflow-auto">
          {vendors.map(v => (
            <button key={v.name} onClick={() => setVendor(v.name)}
              className={`w-full text-left px-3 py-2 border-b border-gray-50 hover:bg-emerald-50/60 ${vendor === v.name ? 'bg-emerald-50' : ''}`}>
              <div className="text-sm font-medium text-gray-900 truncate">{v.name}</div>
              <div className="text-xs text-gray-500 tabular-nums">{v.n} παραστατικά · {eur(v.total)} · τελευταίο {fmtDate(v.last)}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        {!vendor ? <Empty>Διάλεξε προμηθευτή για να δεις την καρτέλα του.</Empty> : (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{vendor}</h2>
                <label className="text-sm text-gray-600 flex items-center gap-1.5 mt-1"><input id="s-all" type="checkbox" checked={allTime} onChange={e => setAllTime(e.target.checked)} /> Όλο το ιστορικό (αλλιώς μόνο η περίοδος)</label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Action primary onClick={() => printHtml(ledgerHtml(vendor, rows, allTime ? {} : { from, to }), `Καρτέλα ${vendor}`)}>Εκτύπωση καρτέλας</Action>
                <Action onClick={() => { setProg('…'); runBundle({ format: 'pdf', rows, title: `${vendor} τιμολόγια`, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }}>PDF τιμολογίων</Action>
                <Action onClick={() => { setProg('…'); runBundle({ format: 'zip', rows, title: `${vendor} τιμολόγια`, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }}>ZIP</Action>
                <Action onClick={() => runBundle({ format: 'excel', rows, title: `${vendor} καρτέλα` })}>Excel</Action>
              </div>
            </div>
            {prog && <p className="text-sm text-emerald-900 mb-2">{prog}</p>}
            <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-500">Τιμολόγια</div><div className="font-semibold tabular-nums">{rows.length} · {eur(rows.reduce((a, e) => a + n(e.total), 0))}</div></div>
              <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-500">Με πληρωμή</div><div className="font-semibold tabular-nums">{eur(rows.filter(e => e.bankTagDate || e.paymentMethod === 'Μετρητά').reduce((a, e) => a + n(e.total), 0))}</div></div>
              <div className="bg-gray-50 rounded-lg p-2"><div className="text-xs text-gray-500">Χωρίς πληρωμή</div><div className="font-semibold tabular-nums text-amber-800">{eur(rows.filter(e => !e.bankTagDate && e.paymentMethod !== 'Μετρητά').reduce((a, e) => a + n(e.total), 0))}</div></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase"><tr><th className="p-2 text-left">Ημ/νία</th><th className="p-2 text-left">Αρ.</th><th className="p-2 text-right">Ποσό</th><th className="p-2 text-left">Πληρωμή</th><th></th></tr></thead>
                <tbody>
                  {rows.slice().sort((a, b) => b.date.localeCompare(a.date)).map((e, i, arr) => (
                    <tr key={e.id} className="border-t border-gray-100">
                      <td className="p-2 tabular-nums text-gray-600 whitespace-nowrap">{fmtDate(e.date)}</td>
                      <td className="p-2">{e.invoiceNumber || '—'}</td>
                      <td className="p-2 text-right tabular-nums">{eur(e.total)}</td>
                      <td className="p-2 text-xs">{e.bankTagDate ? `${e.bankTagBank || ''} · ${fmtDate(e.bankTagDate)}` : e.paymentMethod === 'Μετρητά' ? 'Μετρητά' : <span className="text-amber-700">χωρίς πληρωμή</span>}</td>
                      <td className="p-2 text-right"><IconBtn title="Προβολή" onClick={() => emit('preview', { items: arr, index: i })}>👁</IconBtn></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ---------------- Έτοιμα πακέτα ----------------
function PacksTab({ expenses, from, to, periodLabel, expById }) {
  const [prog, setProg] = useProgress()
  const [bank, setBank] = useState(null)
  const inPeriod = useMemo(() => expenses.filter(e => e.date >= from && e.date <= to), [expenses, from, to])
  const assets = inPeriod.filter(e => /ΠΑΓΙΟ/i.test(e.notes || ''))
  const foreign = inPeriod.filter(e => (e.currency && e.currency !== 'EUR') || /alibaba|temu/i.test(e.vendor || ''))
  const noFile = inPeriod.filter(e => !e.fileUrl)
  const getBank = async () => bank || loadBank(from, to).then(b => { setBank(b); return b })
  const go = (format, rows, title) => { setProg('…'); runBundle({ format, rows, title, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }
  const Card = ({ title, desc, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div><h3 className="font-semibold text-gray-900">{title}</h3><p className="text-sm text-gray-500 mt-0.5">{desc}</p></div>
      <div className="flex flex-wrap gap-1.5 mt-auto">{children}</div>
    </div>
  )
  return (
    <section>
      <p className="text-sm text-gray-600 mb-3">Έτοιμα για <b>{periodLabel}</b> ({fmtDate(from)} – {fmtDate(to)}). Αλλάζεις περίοδο πάνω δεξιά.</p>
      {prog && <p className="text-sm text-emerald-900 mb-3">{prog}</p>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <Card title="Φάκελος περιόδου" desc={`${inPeriod.length} παραστατικά · ${eur(inPeriod.reduce((a, e) => a + n(e.total), 0))}. Report και όλες οι αποδείξεις.`}>
          <Action primary disabled={!inPeriod.length} onClick={() => go('print', inPeriod, `Φάκελος ${periodLabel}`)}>Εκτύπωση με αποδείξεις</Action>
          <Action disabled={!inPeriod.length} onClick={() => go('pdf', inPeriod, `Φάκελος ${periodLabel}`)}>Ένα PDF</Action>
          <Action disabled={!inPeriod.length} onClick={() => go('zip', inPeriod, `Φάκελος ${periodLabel}`)}>ZIP</Action>
          <Action disabled={!inPeriod.length} onClick={() => go('excel', inPeriod, `Φάκελος ${periodLabel}`)}>Excel</Action>
        </Card>
        <Card title="Statement τράπεζας" desc="Όλοι οι λογαριασμοί, με το δικαιολογητικό κάθε κίνησης.">
          <Action primary onClick={async () => { const w = window.open('', '_blank'); const b = await getBank(); printHtml(statementHtml(b, expById, { from, to, account: 'all' }), `Τράπεζα ${periodLabel}`, 400, w) }}>Εκτύπωση</Action>
        </Card>
        <Card title="ΦΠΑ εισροών" desc="Ανά συντελεστή (με αντίστροφη χρέωση και μη εκπιπτόμενο) και ανά κατηγορία.">
          <Action primary disabled={!inPeriod.length} onClick={() => printHtml(vatHtml(inPeriod, { from, to }), `ΦΠΑ ${periodLabel}`)}>Εκτύπωση</Action>
          <Action disabled={!inPeriod.length} onClick={async () => { const { byRate } = vatSummary(inPeriod); saveBlob(await rowsXlsxBlob(byRate.map(r => ({ 'Συντελεστής': r.rate, 'Χαρακτηρισμός': r.claim, 'Παραστατικά': r.n, 'Καθαρό': +r.net.toFixed(2), 'ΦΠΑ': +r.vat.toFixed(2), 'Σύνολο': +r.total.toFixed(2) })), 'ΦΠΑ'), `ΦΠΑ_${from}_${to}.xlsx`) }}>Excel</Action>
        </Card>
        <Card title="Πληρωμές χωρίς παραστατικό" desc="Χρεώσεις τράπεζας της περιόδου που δεν έχουν ακόμα τιμολόγιο (εκτός μισθών, ενοικίων, εσωτερικών).">
          <Action primary onClick={async () => { const w = window.open('', '_blank'); const b = await getBank(); const m = b.filter(t => txKind(t, expById) === 'missing'); printHtml(statementHtml(m, expById, { from, to, account: 'all' }).replace('Κινήσεις τράπεζας', 'Πληρωμές χωρίς παραστατικό'), 'Χωρίς παραστατικό', 400, w) }}>Εκτύπωση λίστας</Action>
        </Card>
        <Card title="Πάγια" desc={`${assets.length} παραστατικά με σημείωση «ΠΑΓΙΟ» (μηχανήματα, έπιπλα, εξοπλισμός).`}>
          <Action primary disabled={!assets.length} onClick={() => printHtml(expensesListHtml(assets, 'Πάγια', periodLabel), 'Πάγια')}>Εκτύπωση λίστας</Action>
          <Action disabled={!assets.length} onClick={() => go('pdf', assets, `Πάγια ${periodLabel}`)}>PDF</Action>
        </Card>
        <Card title="Εισαγωγές / ξένο νόμισμα" desc={`${foreign.length} αγορές (Alibaba, Temu, USD).`}>
          <Action primary disabled={!foreign.length} onClick={() => printHtml(expensesListHtml(foreign, 'Εισαγωγές / ξένο νόμισμα', periodLabel), 'Εισαγωγές')}>Εκτύπωση λίστας</Action>
          <Action disabled={!foreign.length} onClick={() => go('pdf', foreign, `Εισαγωγές ${periodLabel}`)}>PDF</Action>
        </Card>
        <Card title="Παραστατικά χωρίς αρχείο" desc={`${noFile.length} εγγραφές χωρίς συνημμένο.`}>
          <Action primary disabled={!noFile.length} onClick={() => printHtml(expensesListHtml(noFile, 'Παραστατικά χωρίς αρχείο', periodLabel), 'Χωρίς αρχείο')}>Εκτύπωση λίστας</Action>
        </Card>
      </div>
    </section>
  )
}

// ---------------- Σημειώσεις & αιτήματα ----------------
function NotesTab({ who, isAdmin, q, expById }) {
  const [notes, setNotes] = useState(null)
  const [text, setText] = useState(''), [type, setType] = useState('request')
  const [filter, setFilter] = useState('open')
  const [reply, setReply] = useState({})
  const reload = useCallback(() => loadNotes().then(setNotes).catch(() => setNotes([])), [])
  useEffect(() => { reload() }, [reload])
  const rows = (notes || []).filter(x => (filter === 'all' || x.status === filter) && (!q || fold(`${x.text} ${x.targetLabel} ${x.reply}`).includes(fold(q))))
  return (
    <section className="grid lg:grid-cols-[380px_1fr] gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit">
        <h3 className="font-semibold text-gray-900 mb-2">Νέα σημείωση ή αίτημα</h3>
        <div className="flex gap-1.5 mb-2"><Pill active={type === 'request'} onClick={() => setType('request')}>Αίτημα προς Θεράπωνα</Pill><Pill active={type === 'note'} onClick={() => setType('note')}>Σημείωση</Pill></div>
        <textarea id="n-text" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="π.χ. Χρειάζομαι το τιμολόγιο της ΑΗΚ για Μάιο 2025 (Πάφος)"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
        <div className="mt-2"><Action primary disabled={!text.trim()} onClick={async () => { await addNote({ who, type, text: text.trim() }); setText(''); reload() }}>Αποθήκευση</Action></div>
      </div>
      <div>
        <div className="flex gap-1.5 mb-3">{[['open', 'Ανοιχτά'], ['done', 'Ολοκληρωμένα'], ['all', 'Όλα']].map(([k, l]) => <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>{l}</Pill>)}</div>
        {!notes ? <p className="text-sm text-gray-500 animate-pulse">Φόρτωση…</p> : !rows.length ? <Empty>Δεν υπάρχουν {filter === 'open' ? 'ανοιχτά ' : ''}αιτήματα.</Empty> : rows.map(x => (
          <div key={x.id} className={`bg-white border rounded-xl p-3 mb-2 ${x.status === 'done' ? 'border-gray-200 opacity-80' : 'border-amber-200'}`}>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-1">
              <span className={`px-2 py-0.5 rounded-full ${x.type === 'request' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-700'}`}>{x.type === 'request' ? 'Αίτημα' : 'Σημείωση'}</span>
              <span>{x.name || x.email}</span><span>· {x.atIso ? new Date(x.atIso).toLocaleString('el-GR', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span>
              {x.status === 'done' && <span className="text-emerald-800">· ✓ ολοκληρώθηκε</span>}
            </div>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{x.text}</p>
            {x.targetId && expById.get(x.targetId) && <button className="text-xs text-emerald-900 hover:underline mt-1" onClick={() => emit('preview', { items: [expById.get(x.targetId)], index: 0 })}>📄 {x.targetLabel}</button>}
            {x.reply && <p className="text-sm text-emerald-900 bg-emerald-50 rounded-lg px-2.5 py-1.5 mt-2">↳ {x.reply}</p>}
            {isAdmin && x.status !== 'done' && (
              <div className="flex gap-1.5 mt-2">
                <input value={reply[x.id] || ''} onChange={e => setReply(r => ({ ...r, [x.id]: e.target.value }))} placeholder="Απάντηση (προαιρετικά)"
                  className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm" />
                <Action primary onClick={async () => { await setNoteStatus(x.id, 'done', reply[x.id] || ''); reload() }}>Ολοκληρώθηκε</Action>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// ---------------- Ιστορικό αλλαγών ----------------
function ChangesTab({ q }) {
  const [rows, setRows] = useState(null)
  useEffect(() => { loadChanges().then(setRows).catch(() => setRows([])) }, [])
  const list = (rows || []).filter(r => !q || fold(`${r.label} ${r.name} ${r.note} ${JSON.stringify(r.changes)}`).includes(fold(q)))
  const show = v => v === null || v === undefined || v === '' ? '—' : typeof v === 'number' ? v.toLocaleString('el-GR') : String(v)
  return (
    <section>
      <p className="text-sm text-gray-600 mb-3">Κάθε διόρθωση σε παραστατικό καταγράφεται εδώ: ποιος, πότε, τι ήταν και τι έγινε.</p>
      {!rows ? <p className="text-sm text-gray-500 animate-pulse">Φόρτωση…</p> : !list.length ? <Empty>Καμία αλλαγή ακόμα.</Empty> : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {list.map(r => (
            <div key={r.id} className="p-3">
              <div className="flex flex-wrap gap-x-2 text-xs text-gray-500"><b className="text-gray-800">{r.name || r.email}</b><span>{r.role === 'accountant' ? 'λογιστήριο' : r.role}</span><span>· {r.atIso ? new Date(r.atIso).toLocaleString('el-GR', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span><span>· {r.label}</span></div>
              {r.note && <p className="text-sm text-gray-700 mt-1">Λόγος: {r.note}</p>}
              <ul className="mt-1 text-sm">
                {(r.changes || []).map((c, i) => <li key={i} className="text-gray-800"><span className="text-gray-500">{FIELD_LABELS[c.field] || c.field}:</span> <span className="line-through text-gray-400">{show(c.before)}</span> → <b>{show(c.after)}</b></li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ---------------- Καλάθι ----------------
function BasketBar({ expById }) {
  const [ids, setIds] = useState(getBasket())
  const [open, setOpen] = useState(false)
  const [prog, setProg] = useProgress()
  useEffect(() => on('basket', setIds), [])
  const items = ids.map(i => expById.get(i)).filter(Boolean)
  if (!ids.length) return null
  const go = fmt => { setProg('…'); runBundle({ format: fmt, rows: items, title: 'Καλάθι', onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }
  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-6rem)]">
      {open && (
        <div className="mb-2 w-[min(420px,calc(100vw-6rem))] bg-white border border-gray-200 rounded-2xl shadow-xl p-3">
          <div className="flex items-center justify-between mb-2"><b className="text-sm">Καλάθι · {items.length} έγγραφα</b><button className="text-sm text-gray-500 hover:text-red-700" onClick={() => setBasket([])}>Άδειασμα</button></div>
          <div className="max-h-60 overflow-auto divide-y divide-gray-100 text-sm">
            {items.map((e, i) => (
              <div key={e.id} className="flex items-center gap-2 py-1.5">
                <button className="flex-1 min-w-0 text-left truncate hover:underline" onClick={() => emit('preview', { items, index: i })}>{fmtDate(e.date)} · {e.vendor} {e.invoiceNumber || ''}</button>
                <span className="tabular-nums text-gray-600">{eur(e.total)}</span>
                <button className="text-gray-400 hover:text-red-700" aria-label="Αφαίρεση" onClick={() => setBasket(ids.filter(x => x !== e.id))}>×</button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <Action primary onClick={() => go('pdf')}>Ένα PDF</Action><Action onClick={() => go('zip')}>ZIP</Action>
            <Action onClick={() => go('print')}>Εκτύπωση</Action><Action onClick={() => go('excel')}>Excel</Action>
          </div>
          {prog && <p className="text-xs text-emerald-900 mt-2">{prog}</p>}
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-lg px-4 py-2.5 text-sm font-semibold">🧺 Καλάθι ({ids.length})</button>
    </div>
  )
}
