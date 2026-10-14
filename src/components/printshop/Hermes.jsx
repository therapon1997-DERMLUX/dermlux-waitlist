// Ερμογένης — βοηθός λογιστηρίου (κάτω δεξιά, για λογιστή και admin).
// Το μοντέλο τρέχει στον worker (/assistant)· τα εργαλεία τρέχουν εδώ (hermesTools). Οι συζητήσεις
// αποθηκεύονται στο Firestore (hermes_chats) για να τις βλέπει και ο Θεράπων.
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { collection, doc, setDoc, getDocs, query, orderBy, limit as qlimit, where } from 'firebase/firestore'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { runTool, applyConfirmed } from './hermesTools'
import { loadExpenses, loadRules } from './booksData'
import { runBundle } from './bundles'
import { printHtml, downloadExpense, printExpense } from './files'
import { ledgerHtml } from './printViews'
import { emit, getHermesContext, addToBasket } from './bridge'
import { whoFrom } from '../bookkeeping/changeLog'
import { eur, fmtDate } from '../bookkeeping/ExportPrint'

const WORKER = import.meta.env.VITE_WORKER_URL || ''
const MAX_TOOL_ROUNDS = 8
const firstName = p => (p?.displayName || '').trim().split(/\s+/)[0] || ''
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Καλημέρα' : h < 18 ? 'Καλησπέρα' : 'Καλησπέρα' }

function Spinner() { return <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin align-middle" /> }

export default function Hermes() {
  const { currentUser, userProfile, isAdmin, isAccountant } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const who = useMemo(() => whoFrom(currentUser, userProfile), [currentUser, userProfile])
  const [open, setOpen] = useState(() => { try { return localStorage.getItem('hermes_open') === '1' } catch { return false } })
  const [wide, setWide] = useState(false)
  const [chatId, setChatId] = useState(() => { try { return localStorage.getItem('hermes_chat') || '' } catch { return '' } })
  const [turns, setTurns] = useState([])          // για το μοντέλο (role/content)
  const [feed, setFeed] = useState([])            // για την οθόνη: {kind:'user'|'assistant'|'tool'|'attach'|'error', ...}
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState('')
  const [unread, setUnread] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const visible = (isAdmin || isAccountant) && WORKER && !/^\/(login|eshop|unsubscribe)/.test(location.pathname)

  useEffect(() => { try { localStorage.setItem('hermes_open', open ? '1' : '0') } catch {} ; if (open) { setUnread(false); setTimeout(() => inputRef.current?.focus(), 50) } }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ block: 'end' }) }, [feed, busy, open])

  // Φόρτωση παλιάς συζήτησης (ίδιος χρήστης) ή νέα με χαιρετισμό
  useEffect(() => {
    if (!visible) return
    let alive = true
    ;(async () => {
      if (chatId) {
        try {
          const s = await getDocs(query(collection(db, 'hermes_chats'), where('uid', '==', who.uid), orderBy('updatedAt', 'desc'), qlimit(1)))
          const d = s.docs[0]
          if (d && d.id === chatId && alive) { const x = d.data(); setTurns(x.turns || []); setFeed(x.feed || []); return }
        } catch {}
      }
      if (alive) startNew()
    })()
    return () => { alive = false }
  }, [visible, who.uid])

  function startNew() {
    const id = `${who.uid}_${Date.now()}`
    setChatId(id); try { localStorage.setItem('hermes_chat', id) } catch {}
    setTurns([])
    const name = firstName(userProfile)
    setFeed([{ kind: 'assistant', text: `${greet()}${name ? ' ' + name : ''}! Είμαι ο Ερμογένης, ο βοηθός σου για τα βιβλία της DermLux.\n\nΓράψε μου απλά, όπως θα έλεγες σε συνάδελφο, π.χ.:\n- «βρες μου το τιμολόγιο της MJ του Ιουλίου»\n- «ετοίμασέ μου όλα τα παραστατικά Ιούλιο–Σεπτέμβριο σε ένα PDF»\n- «πόσο ΦΠΑ έχουμε το τρίμηνο;»\n- «το TikTok δεν έχει ΦΠΑ, διόρθωσέ το»\n\nΌ,τι ετοιμάζω το βάζω εδώ στο chat, με κουμπί για να το κατεβάσεις ή να το τυπώσεις. Αν χρειαστείς οτιδήποτε, πες μου και θα το κανονίσω.` }])
  }

  const persist = useCallback((t, f) => {
    if (!chatId) return
    setDoc(doc(db, 'hermes_chats', chatId), { uid: who.uid, name: who.name, email: who.email, role: who.role, turns: t, feed: f.map(x => x.kind === 'attach' ? { ...x, attach: { ...x.attach, _blobs: undefined } } : x), updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {})
  }, [chatId, who])

  async function callWorker(messages) {
    const token = await currentUser.getIdToken()
    const r = await fetch(`${WORKER}/assistant`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ messages }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(j.error || `Σφάλμα ${r.status}`)
    return j
  }

  async function send(text) {
    const msg = (text ?? input).trim()
    if (!msg || busy) return
    setInput('')
    const ctx = getHermesContext()
    // Μνήμη κανόνων (όπως ο Επόπτης του sales): ό,τι έχει ορίσει το λογιστήριο ισχύει πάντα
    let rulesText = ''
    try { const rules = await loadRules(); if (rules.length) rulesText = ' · κανόνες που έχει ορίσει το λογιστήριο: ' + rules.map(r => `«${r.vendorMatch}»: ${Object.entries(r.set || {}).map(([k, v]) => k + '=' + v).join(', ')} (${r.reason})`).join('; ') } catch {}
    const ctxText = `<context>χρήστης: ${who.name || who.email} (${who.role === 'accountant' ? 'λογιστήριο' : 'ιδιοκτήτης'}) · σήμερα: ${new Date().toISOString().slice(0, 10)} · σελίδα: ${ctx.page || location.pathname}${ctx.tab ? ' / ' + ctx.tab : ''}${ctx.period ? ' · περίοδος: ' + ctx.period : ''}${ctx.query ? ' · αναζήτηση: «' + ctx.query + '»' : ''}${rulesText}</context>\n`
    let t = [...turns, { role: 'user', content: ctxText + msg }]
    let f = [...feed, { kind: 'user', text: msg }]
    setTurns(t); setFeed(f); setBusy('Σκέφτομαι…')
    try {
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const out = await callWorker(t)
        const content = out.content || []
        t = [...t, { role: 'assistant', content }]
        const texts = content.filter(b => b.type === 'text' && b.text?.trim()).map(b => b.text)
        if (texts.length) f = [...f, { kind: 'assistant', text: texts.join('\n\n') }]
        if (out.stop_reason === 'refusal') { f = [...f, { kind: 'error', text: 'Με αυτό δεν μπορώ να βοηθήσω. Αν είναι σημαντικό, πες το στον Θεράπωνα.' }]; break }
        const uses = content.filter(b => b.type === 'tool_use')
        if (out.stop_reason !== 'tool_use' || !uses.length) break
        setFeed(f); setBusy('Ψάχνω στα βιβλία…')
        const results = []
        for (const u of uses) {
          let res
          try { res = await runTool(u.name, u.input || {}, { who, navigate }) }
          catch (err) { res = { result: { error: err.message } } }
          if (res.attach) f = [...f, { kind: 'attach', attach: res.attach, id: u.id }]
          results.push({ type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(res.result).slice(0, 60000) })
        }
        t = [...t, { role: 'user', content: results }]
        setFeed(f)
      }
    } catch (err) {
      f = [...f, { kind: 'error', text: 'Κάτι δεν πήγε καλά: ' + err.message + '. Δοκίμασε ξανά σε λίγο — αν συνεχίζει, πες το στον Θεράπωνα.' }]
    }
    setTurns(t); setFeed(f); setBusy(''); persist(t, f)
    if (!open) setUnread(true)
  }

  // Μετά από επιβεβαίωση αλλαγής: ενημέρωσε το μοντέλο (χωρίς νέα απάντηση) και την κάρτα
  async function confirmChange(idx) {
    const item = feed[idx]; if (!item || item.attach.state !== 'pending') return
    setBusy('Εφαρμόζω την αλλαγή…')
    try {
      const done = await applyConfirmed(item.attach, who)
      const f = feed.map((x, i) => i === idx ? { ...x, attach: { ...x.attach, state: 'done', done } } : x)
      const t = [...turns, { role: 'user', content: `[σύστημα] Ο χρήστης επιβεβαίωσε: εφαρμόστηκε η αλλαγή σε ${done} παραστατικά${item.attach.save_rule ? ' και αποθηκεύτηκε κανόνας' : ''}.` }, { role: 'assistant', content: [{ type: 'text', text: `Έγινε — ενημέρωσα ${done} παραστατικά${item.attach.save_rule ? ' και κράτησα τον κανόνα για τα επόμενα' : ''}.` }] }]
      setFeed([...f, { kind: 'assistant', text: `Έγινε — ενημέρωσα ${done} παραστατικά${item.attach.save_rule ? ' και κράτησα τον κανόνα για τα επόμενα' : ''}. Η αλλαγή γράφτηκε στο ιστορικό.` }])
      setTurns(t); persist(t, f)
    } catch (err) { setFeed(f => [...f, { kind: 'error', text: 'Η αλλαγή δεν έγινε: ' + err.message }]) }
    setBusy('')
  }
  function rejectChange(idx) {
    const f = feed.map((x, i) => i === idx ? { ...x, attach: { ...x.attach, state: 'rejected' } } : x)
    const t = [...turns, { role: 'user', content: '[σύστημα] Ο χρήστης ΑΚΥΡΩΣΕ την προτεινόμενη αλλαγή — δεν εφαρμόστηκε τίποτα.' }, { role: 'assistant', content: [{ type: 'text', text: 'Εντάξει, δεν άλλαξα τίποτα.' }] }]
    setFeed(f); setTurns(t); persist(t, f)
  }

  if (!visible) return null
  const quick = ['Τι λείπει αυτόν τον μήνα;', 'Όλα τα παραστατικά του τριμήνου σε ένα PDF', 'Πόσο ΦΠΑ έχουμε το τρίμηνο;', 'Δείξε μου τι άλλαξε πρόσφατα']

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Άνοιγμα Ερμογένη"
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-xl pl-3 pr-4 py-2.5 text-sm font-semibold">
          <span className="w-7 h-7 rounded-full bg-white/15 grid place-items-center text-base">Ε</span>Ερμογένης
          {unread && <span className="w-2 h-2 rounded-full bg-amber-300" />}
        </button>
      )}
      {open && (
        <div className={`fixed z-50 bg-white shadow-2xl border border-gray-200 flex flex-col overflow-hidden
          ${wide ? 'inset-2 sm:inset-6 rounded-2xl' : 'bottom-0 right-0 w-full h-[85vh] rounded-t-2xl sm:bottom-4 sm:right-4 sm:w-[440px] sm:h-[min(680px,calc(100vh-2rem))] sm:rounded-2xl'}`}>
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-emerald-800 text-white">
            <span className="w-8 h-8 rounded-full bg-white/15 grid place-items-center font-bold">Ε</span>
            <div className="flex-1 min-w-0"><div className="font-semibold leading-tight">Ερμογένης</div><div className="text-[11px] text-emerald-100 truncate">Βρίσκει, ετοιμάζει, διορθώνει — ρώτα ό,τι θες</div></div>
            <button onClick={startNew} title="Νέα συζήτηση" className="text-xs px-2 py-1 rounded-md hover:bg-white/15">Νέα</button>
            <button onClick={() => setWide(w => !w)} title={wide ? 'Μικρότερο' : 'Μεγαλύτερο'} className="hidden sm:block text-xs px-2 py-1 rounded-md hover:bg-white/15">{wide ? '⤡' : '⤢'}</button>
            <button onClick={() => setOpen(false)} aria-label="Κλείσιμο" className="w-8 h-8 rounded-md hover:bg-white/15 text-xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
            {feed.map((m, i) => <Message key={i} m={m} idx={i} onConfirm={confirmChange} onReject={rejectChange} busy={!!busy} />)}
            {busy && <div className="text-xs text-gray-500 flex items-center gap-2"><Spinner /> {busy}</div>}
            <div ref={bottomRef} />
          </div>

          {feed.filter(x => x.kind === 'user').length === 0 && !busy && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-gray-50">
              {quick.map(q => <button key={q} onClick={() => send(q)} className="text-xs bg-white border border-gray-200 rounded-full px-2.5 py-1 hover:border-emerald-600 hover:text-emerald-900">{q}</button>)}
            </div>
          )}
          <form onSubmit={e => { e.preventDefault(); send() }} className="border-t border-gray-100 p-2 flex items-end gap-2 bg-white">
            <textarea id="hermes-input" ref={inputRef} value={input} onChange={e => setInput(e.target.value)} rows={1} placeholder="Γράψε εδώ τι χρειάζεσαι…"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 max-h-32" />
            <button type="submit" disabled={!input.trim() || !!busy} className="bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-xl px-3.5 py-2 text-sm font-semibold">Στείλε</button>
          </form>
        </div>
      )}
    </>
  )
}

function Message({ m, idx, onConfirm, onReject, busy }) {
  if (m.kind === 'user') return <div className="flex justify-end"><div className="max-w-[85%] bg-emerald-800 text-white rounded-2xl rounded-br-md px-3.5 py-2 text-sm whitespace-pre-wrap">{m.text}</div></div>
  if (m.kind === 'error') return <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{m.text}</div>
  if (m.kind === 'attach') return <Attachment a={m.attach} idx={idx} onConfirm={onConfirm} onReject={onReject} busy={busy} />
  return (
    <div className="flex gap-2 items-start">
      <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs grid place-items-center shrink-0 mt-0.5">Ε</span>
      <div className="max-w-[88%] bg-white border border-gray-200 rounded-2xl rounded-tl-md px-3.5 py-2 text-sm text-gray-900 prose prose-sm prose-p:my-1 prose-ul:my-1 prose-table:my-1 prose-th:px-2 prose-td:px-2 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
      </div>
    </div>
  )
}

function useDocs(ids) {
  const [docs, setDocs] = useState(null)
  useEffect(() => { loadExpenses().then(all => { const m = new Map(all.map(e => [e.id, e])); setDocs(ids.map(i => m.get(i)).filter(Boolean)) }) }, [ids.join(',')])
  return docs
}

function Attachment({ a, idx, onConfirm, onReject, busy }) {
  const [prog, setProg] = useState('')
  const docs = useDocs(a.ids || [])
  const Card = ({ title, children }) => (
    <div className="ml-8 bg-white border border-emerald-100 rounded-2xl rounded-tl-md overflow-hidden">
      {title && <div className="px-3 py-2 bg-emerald-50 text-sm font-semibold text-emerald-900">{title}</div>}
      <div className="p-2.5">{children}</div>
      {prog && <div className="px-3 pb-2 text-xs text-emerald-900">{prog}</div>}
    </div>
  )
  const B = ({ children, onClick, primary, disabled }) => <button type="button" onClick={onClick} disabled={disabled}
    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium disabled:opacity-40 ${primary ? 'bg-emerald-800 text-white hover:bg-emerald-900' : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-600'}`}>{children}</button>
  const go = (format, rows, title) => { setProg('Ετοιμάζω…'); runBundle({ format, rows, title, onProgress: setProg }).then(r => setProg('✓ ' + r.message)).catch(e => setProg('⚠ ' + e.message)) }

  if (a.type === 'docs') {
    if (!docs) return <Card title={a.title}><span className="text-xs text-gray-500">Φόρτωση…</span></Card>
    return (
      <Card title={a.title}>
        <div className="divide-y divide-gray-100">
          {docs.map((e, i) => (
            <div key={e.id} className="py-1.5 flex items-center gap-2">
              <button className="flex-1 min-w-0 text-left" onClick={() => emit('preview', { items: docs, index: i })}>
                <div className="text-sm font-medium text-gray-900 truncate">{e.vendor} <span className="text-gray-400 font-normal">{e.invoiceNumber || ''}</span></div>
                <div className="text-xs text-gray-500">{fmtDate(e.date)} · {eur(e.total)}{e.fileUrl ? '' : ' · χωρίς αρχείο'}</div>
              </button>
              <B onClick={() => emit('preview', { items: docs, index: i })}>Προβολή</B>
              <B primary disabled={!e.fileUrl} onClick={() => downloadExpense(e).catch(x => setProg('⚠ ' + x.message))}>Λήψη</B>
              <B disabled={!e.fileUrl} onClick={() => printExpense(e).catch(x => setProg('⚠ ' + x.message))}>🖨</B>
            </div>
          ))}
        </div>
        {docs.length > 1 && <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100">
          <B primary onClick={() => go('pdf', docs, a.title)}>Όλα σε ένα PDF</B><B onClick={() => go('zip', docs, a.title)}>ZIP</B><B onClick={() => addToBasket(docs.map(e => e.id))}>🧺 Καλάθι</B>
        </div>}
      </Card>
    )
  }
  if (a.type === 'bundle') {
    const fmtLabel = { pdf: 'Ένα PDF', zip: 'ZIP με τα αρχεία', excel: 'Excel', print: 'Εκτύπωση' }[a.format] || a.format
    return (
      <Card title={a.title}>
        <p className="text-sm text-gray-700 mb-2">{a.ids.length} παραστατικά{docs ? ` · ${eur(docs.reduce((s, e) => s + (Number(e.total) || 0), 0))}` : ''} · {fmtLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          <B primary disabled={!docs} onClick={() => go(a.format, docs, a.title)}>{a.format === 'print' ? '🖨 Τύπωσέ το' : '⬇ Κατέβασέ το (' + fmtLabel + ')'}</B>
          {a.format !== 'pdf' && <B disabled={!docs} onClick={() => go('pdf', docs, a.title)}>Ένα PDF</B>}
          {a.format !== 'zip' && <B disabled={!docs} onClick={() => go('zip', docs, a.title)}>ZIP</B>}
          <B disabled={!docs} onClick={() => emit('preview', { items: docs, index: 0 })}>Προβολή</B>
        </div>
      </Card>
    )
  }
  if (a.type === 'ledger') {
    const rows = docs || []
    const unpaid = rows.filter(e => !e.bankTagDate && e.paymentMethod !== 'Μετρητά')
    return (
      <Card title={`Καρτέλα: ${a.vendor}`}>
        <p className="text-sm text-gray-700 mb-2">{rows.length} τιμολόγια · {eur(rows.reduce((s, e) => s + (Number(e.total) || 0), 0))}{unpaid.length ? ` · ${unpaid.length} χωρίς πληρωμή (${eur(unpaid.reduce((s, e) => s + (Number(e.total) || 0), 0))})` : ''}</p>
        <div className="flex flex-wrap gap-1.5">
          <B primary disabled={!docs} onClick={() => printHtml(ledgerHtml(a.vendor, rows, { from: a.from, to: a.to }), `Καρτέλα ${a.vendor}`)}>🖨 Εκτύπωση καρτέλας</B>
          <B disabled={!docs} onClick={() => go('pdf', rows, `${a.vendor} τιμολόγια`)}>PDF τιμολογίων</B>
          <B disabled={!docs} onClick={() => go('excel', rows, `${a.vendor} καρτέλα`)}>Excel</B>
          <B disabled={!docs} onClick={() => emit('preview', { items: rows, index: 0 })}>Προβολή</B>
        </div>
      </Card>
    )
  }
  if (a.type === 'bank') return (
    <Card title={a.title}>
      <div className="max-h-56 overflow-auto text-xs">
        <table className="w-full"><tbody>
          {a.rows.map(r => <tr key={r.id} className="border-t border-gray-100"><td className="py-1 pr-2 whitespace-nowrap text-gray-500">{fmtDate(r.date)}</td><td className="py-1 pr-2 text-gray-800">{r.description}</td><td className={`py-1 text-right whitespace-nowrap tabular-nums ${r.amount > 0 ? 'text-emerald-800' : ''}`}>{eur(r.amount)}</td></tr>)}
        </tbody></table>
      </div>
    </Card>
  )
  if (a.type === 'confirm') {
    const human = Object.entries(a.set).map(([k, v]) => `${k} → ${v === '=total' ? 'σύνολο' : String(v)}`).join(' · ')
    return (
      <Card title={a.state === 'done' ? '✓ Αλλαγή εφαρμόστηκε' : a.state === 'rejected' ? 'Αλλαγή ακυρώθηκε' : 'Επιβεβαίωση αλλαγής'}>
        <p className="text-sm text-gray-800">{a.ids.length} παραστατικά · <span className="text-gray-600">{human}</span></p>
        {a.reason && <p className="text-xs text-gray-500 mt-1">Λόγος: {a.reason}</p>}
        {a.save_rule && <p className="text-xs text-emerald-900 mt-1">Θα αποθηκευτεί ως κανόνας για «{a.save_rule.vendor_match}» (ισχύει και για τα επόμενα).</p>}
        {docs && <p className="text-xs text-gray-500 mt-1 truncate">{docs.slice(0, 4).map(e => `${e.vendor} ${e.invoiceNumber || ''}`).join(' · ')}{docs.length > 4 ? ` · +${docs.length - 4}` : ''}</p>}
        {a.state === 'pending' && <p className="text-xs text-gray-600 mt-1">Αν συμφωνείς, πάτα «Ναι, κάν' το». Τίποτα δεν αλλάζει πριν το πατήσεις.</p>}
        {a.state === 'pending' && <div className="flex gap-1.5 mt-2"><B primary disabled={busy} onClick={() => onConfirm(idx)}>✓ Ναι, κάν' το</B><B disabled={busy} onClick={() => onReject(idx)}>Όχι, άσ' το</B>{docs && <B onClick={() => emit('preview', { items: docs, index: 0 })}>Δες τα</B>}</div>}
        {a.state === 'done' && <p className="text-xs text-emerald-900 mt-1">Ενημερώθηκαν {a.done} παραστατικά. Γράφτηκε στο ιστορικό αλλαγών.</p>}
      </Card>
    )
  }
  if (a.type === 'note') return <Card title="Αίτημα προς τον Θεράπωνα"><p className="text-sm text-gray-800">{a.text}</p><p className="text-xs text-gray-500 mt-1">Θα το δει στα «Σημειώσεις & αιτήματα» του Print Shop.</p></Card>
  return null
}
