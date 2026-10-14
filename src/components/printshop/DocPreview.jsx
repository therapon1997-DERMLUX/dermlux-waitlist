// Προβολή παραστατικού (κοινή για Print Shop, Λογιστικά και Ερμογένη): μεγάλη προβολή αρχείου,
// στοιχεία, πληρωμή, και ενέργειες Λήψη / Εκτύπωση / Διόρθωση / Σημείωση / Καλάθι. Πλοήγηση με ← →.
import { useEffect, useState, useCallback, lazy, Suspense } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import DocViewer from './DocViewer'
import { downloadExpense, printExpense } from './files'
import { on, addToBasket, getBasket, removeFromBasket } from './bridge'
import { addNote, patchExpense } from './booksData'
import { whoFrom } from '../bookkeeping/changeLog'
import { eur, fmtDate } from '../bookkeeping/ExportPrint'

const ExpenseModal = lazy(() => import('../bookkeeping/ExpenseModal'))

function Btn({ children, onClick, primary, disabled, title }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${primary
        ? 'bg-emerald-700 text-white hover:bg-emerald-800' : 'border border-gray-200 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-800'}`}>
      {children}
    </button>
  )
}

export function DocPreview({ items, index = 0, onClose }) {
  const { currentUser, userProfile, isAccountant } = useAuth()
  const [i, setI] = useState(index)
  const [list, setList] = useState(items)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [inBasket, setInBasket] = useState(false)
  const e = list[i]

  useEffect(() => { setInBasket(e ? getBasket().includes(e.id) : false); setMsg(''); setNoteOpen(false) }, [e?.id])
  const go = useCallback(d => setI(x => Math.min(list.length - 1, Math.max(0, x + d))), [list.length])
  useEffect(() => {
    const k = ev => {
      if (editing || noteOpen) return
      if (ev.key === 'Escape') onClose()
      if (ev.key === 'ArrowRight') go(1)
      if (ev.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', k)
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = prev }
  }, [go, onClose, editing, noteOpen])

  if (!e) return null
  const run = async (label, fn) => { setBusy(label); setMsg(''); try { await fn() } catch (err) { setMsg(err.message || 'Κάτι πήγε στραβά') } finally { setBusy('') } }

  async function afterEdit() {
    setEditing(false)
    const snap = await getDoc(doc(db, 'expenses', e.id))
    if (snap.exists()) {
      const fresh = { id: e.id, ...snap.data() }
      await patchExpense(e.id, fresh)
      setList(l => l.map(x => x.id === e.id ? fresh : x))
    }
  }

  const paid = e.bankTagDate ? `${e.bankTagBank || 'Τράπεζα'} · ${fmtDate(e.bankTagDate)}${e.bankTagAmount != null ? ' · ' + eur(e.bankTagAmount) : ''}`
    : e.paymentMethod === 'Μετρητά' ? 'Μετρητά (ταμείο)' : 'Χωρίς συνδεδεμένη πληρωμή'

  return (
    <div className="fixed inset-0 z-[70] bg-gray-900/70 backdrop-blur-[2px] flex items-stretch justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-6xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={ev => ev.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-gray-100">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate">{e.vendor || 'Χωρίς προμηθευτή'} {e.invoiceNumber && <span className="text-gray-400 font-normal">· {e.invoiceNumber}</span>}</p>
            <p className="text-xs text-gray-500">{fmtDate(e.date)} · {eur(e.total)}{e.currency && e.currency !== 'EUR' ? ` ${e.currency}` : ''} · {e.category || 'χωρίς κατηγορία'}</p>
          </div>
          {list.length > 1 && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-30" disabled={i === 0} onClick={() => go(-1)} aria-label="Προηγούμενο">←</button>
              <span className="tabular-nums">{i + 1}/{list.length}</span>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-30" disabled={i === list.length - 1} onClick={() => go(1)} aria-label="Επόμενο">→</button>
            </div>
          )}
          <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-gray-100 text-2xl leading-none text-gray-400" aria-label="Κλείσιμο">×</button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
          <div className="flex-1 min-w-0 p-3 sm:p-4 bg-gray-50 overflow-auto">
            <DocViewer key={e.id} fileUrl={e.fileUrl} fileName={e.fileName} height={Math.max(420, Math.round(window.innerHeight * 0.72))} className="bg-white" />
          </div>
          <aside className="lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 p-4 space-y-4 overflow-auto">
            <div className="grid grid-cols-2 gap-2">
              <Btn primary disabled={!e.fileUrl || !!busy} onClick={() => run('dl', () => downloadExpense(e))}>{busy === 'dl' ? 'Λήψη…' : '⬇ Λήψη'}</Btn>
              <Btn disabled={!e.fileUrl || !!busy} onClick={() => run('pr', () => printExpense(e))}>{busy === 'pr' ? '…' : '🖨 Εκτύπωση'}</Btn>
              <Btn onClick={() => setEditing(true)}>✏️ Διόρθωση</Btn>
              <Btn onClick={() => { inBasket ? removeFromBasket([e.id]) : addToBasket([e.id]); setInBasket(!inBasket) }}>{inBasket ? '✓ Στο καλάθι' : '🧺 Στο καλάθι'}</Btn>
            </div>
            {msg && <p className="text-sm text-red-600">{msg}</p>}
            <dl className="text-sm space-y-1.5">
              {[['Προμηθευτής', e.vendor], ['ΑΦΜ', e.vatNumber], ['Αρ. τιμολογίου', e.invoiceNumber], ['Ημερομηνία', fmtDate(e.date)],
                ['Καθαρό', eur(e.net)], ['ΦΠΑ', `${eur(e.vat)}${e.vatRate != null ? ` (${e.vatRate}%)` : ''}${e.reverseCharge ? ' · αντίστροφη χρέωση' : ''}`],
                ['Σύνολο', `${eur(e.total)}${e.currency && e.currency !== 'EUR' ? ' ' + e.currency : ''}`], ['Κατηγορία', e.category], ['Κατάστημα', e.location], ['Πληρωμή', paid]]
                .map(([k, v]) => (
                  <div key={k} className="flex gap-3"><dt className="w-28 shrink-0 text-gray-500">{k}</dt><dd className="min-w-0 break-words text-gray-900">{v || '—'}</dd></div>
                ))}
            </dl>
            {e.notes && <div className="text-sm bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-amber-900 whitespace-pre-wrap">{e.notes}</div>}
            {e.bankPaymentNote && <p className="text-xs text-gray-500">{e.bankPaymentNote}</p>}
            {!noteOpen ? (
              <button onClick={() => setNoteOpen(true)} className="text-sm text-emerald-800 hover:underline">💬 Σημείωση ή ερώτηση για αυτό το παραστατικό</button>
            ) : (
              <div className="space-y-2">
                <textarea id="pv-note" value={note} onChange={ev => setNote(ev.target.value)} rows={3} autoFocus placeholder="π.χ. Λείπει η 2η σελίδα / Το ΦΠΑ δεν βγαίνει"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600" />
                <div className="flex gap-2">
                  <Btn primary disabled={!note.trim() || !!busy} onClick={() => run('note', async () => {
                    await addNote({ who: whoFrom(currentUser, userProfile), type: 'request', text: note.trim(), targetType: 'expense', targetId: e.id, targetLabel: `${e.vendor} ${e.invoiceNumber || ''} ${fmtDate(e.date)}` })
                    setNote(''); setNoteOpen(false); setMsg('')
                  })}>Αποστολή</Btn>
                  <Btn onClick={() => setNoteOpen(false)}>Άκυρο</Btn>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      {editing && (
        <Suspense fallback={null}>
          <ExpenseModal existing={e} canDelete={!isAccountant} onClose={afterEdit} />
        </Suspense>
      )}
    </div>
  )
}

// Ένα «host» στο App: οποιοδήποτε σημείο καλεί emit('preview', { items, index })
export default function PreviewHost() {
  const [state, setState] = useState(null)
  useEffect(() => on('preview', p => setState({ items: p.items, index: p.index || 0, key: Date.now() })), [])
  if (!state) return null
  return <DocPreview key={state.key} items={state.items} index={state.index} onClose={() => setState(null)} />
}
