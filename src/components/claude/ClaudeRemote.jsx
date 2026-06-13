import { useState, useEffect, useRef, useMemo } from 'react'
import {
  collection, doc, onSnapshot, addDoc, updateDoc, query, orderBy, serverTimestamp, setDoc,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'

/* Remote control for Claude Code running on the laptop.
   Portal ⇄ Firestore ⇄ laptop bridge (scripts/claude-bridge.mjs).
   You only see: your prompts, approval requests (yes/no), and final answers —
   never the intermediate process. */

const STATE_DOC = doc(db, 'claude_remote_state', 'state')
const MSGS      = collection(db, 'claude_remote_messages')

function fmtTime(ts) {
  const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null)
  if (!d) return ''
  return d.toLocaleString('el-GR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function fmtClock(ms) {
  if (ms <= 0) return 'τώρα'
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}ω ${m}λ` : `${m}λ`
}

export default function ClaudeRemote() {
  const { userProfile } = useAuth()
  const [state, setState]       = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const [showManifesto, setShowManifesto] = useState(false)
  const [manifestoDraft, setManifestoDraft] = useState('')
  const [manifestoEditing, setManifestoEditing] = useState(false)
  const [savingM, setSavingM]   = useState(false)
  const [, tick] = useState(0)
  const endRef = useRef(null)

  // live state + messages
  useEffect(() => onSnapshot(STATE_DOC, s => setState(s.exists() ? s.data() : {})), [])
  useEffect(() => onSnapshot(query(MSGS, orderBy('createdAt', 'asc')), snap =>
    setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))), [])

  // re-render every 30s so the reset countdown stays live
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 30000); return () => clearInterval(t) }, [])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // session-limit estimate (from the bridge); falls back gracefully
  const usage = state?.sessionUsage || {}
  const pct   = Math.max(0, Math.min(100, Math.round(usage.usedPct ?? 0)))
  const resetIn = usage.resetAt ? (new Date(usage.resetAt).getTime() - Date.now()) : null
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'

  async function send() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    try {
      await addDoc(MSGS, { role: 'user', kind: 'prompt', text, status: 'pending', createdAt: serverTimestamp(),
        createdBy: userProfile?.displayName || '' })
      setInput('')
    } finally { setSending(false) }
  }

  async function decide(m, decision) {
    await updateDoc(doc(db, 'claude_remote_messages', m.id), {
      decision, status: 'answered', decidedAt: serverTimestamp(),
    })
  }

  function openManifesto() {
    setManifestoDraft(state?.manifesto || '')
    setManifestoEditing(false)
    setShowManifesto(v => !v)
  }
  async function saveManifesto() {
    setSavingM(true)
    try {
      await setDoc(STATE_DOC, { manifesto: manifestoDraft, manifestoUpdatedAt: serverTimestamp() }, { merge: true })
      setManifestoEditing(false)
    } finally { setSavingM(false) }
  }

  const visible = useMemo(() => messages.filter(m =>
    ['prompt', 'answer', 'approval', 'note'].includes(m.kind)), [messages])

  const bridgeOnline = state?.bridgeHeartbeat
    ? (Date.now() - new Date(state.bridgeHeartbeat).getTime() < 90000) : false

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header + session limits */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            💻 Claude Code
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${bridgeOnline ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
              {bridgeOnline ? '● online' : '○ offline'}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Απομακρυσμένος έλεγχος του Claude Code στο λάπτοπ</p>
        </div>
        <button onClick={openManifesto}
          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${showManifesto ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
          📜 Manifesto
        </button>
      </div>

      {/* Session limit progress bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-semibold uppercase tracking-wide">Όριο session (εκτίμηση)</span>
          <span>{pct}% {resetIn != null && <>· ανανέωση σε <strong>{fmtClock(resetIn)}</strong></>}</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        {usage.label && <p className="text-[11px] text-gray-400 mt-1">{usage.label}</p>}
      </div>

      {/* Manifesto (toggle + edit) */}
      {showManifesto && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-amber-800">📜 Το Manifesto μας</span>
            {!manifestoEditing
              ? <button onClick={() => setManifestoEditing(true)} className="text-xs text-amber-700 hover:underline">✏️ Επεξεργασία</button>
              : <div className="flex gap-2">
                  <button onClick={saveManifesto} disabled={savingM} className="text-xs font-semibold text-green-700 hover:underline">{savingM ? '…' : '✓ Αποθήκευση'}</button>
                  <button onClick={() => { setManifestoEditing(false); setManifestoDraft(state?.manifesto || '') }} className="text-xs text-gray-500 hover:underline">Ακύρωση</button>
                </div>}
          </div>
          {manifestoEditing
            ? <textarea value={manifestoDraft} onChange={e => setManifestoDraft(e.target.value)} rows={16}
                className="w-full text-xs font-mono border border-amber-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            : <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto">{state?.manifesto || '— (δεν έχει συγχρονιστεί ακόμα· θα γεμίσει από τη γέφυρα)'}</pre>}
          {state?.manifestoUpdatedAt && <p className="text-[11px] text-amber-600 mt-1">Ενημερώθηκε: {fmtTime(state.manifestoUpdatedAt)}</p>}
        </div>
      )}

      {/* Chat */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col" style={{ height: '60vh' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {visible.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-10">
              Γράψε ένα prompt παρακάτω — θα το τρέξει το Claude Code στο λάπτοπ.<br />
              Θα βλέπεις μόνο εγκρίσεις (yes/no) και τα τελικά αποτελέσματα.
            </div>
          )}
          {visible.map(m => <Bubble key={m.id} m={m} onDecide={decide} />)}
          {state?.busy && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {state.activity || 'Το Claude Code δουλεύει…'}
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t border-gray-100 p-3 flex gap-2">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
            rows={2} placeholder="Γράψε το prompt σου… (Ctrl+Enter για αποστολή)"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
          <button onClick={send} disabled={sending || !input.trim()}
            className="px-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold disabled:opacity-40">
            {sending ? '…' : 'Αποστολή'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Bubble({ m, onDecide }) {
  if (m.kind === 'prompt') return (
    <div className="flex justify-end">
      <div className="max-w-[80%] bg-gray-800 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm whitespace-pre-wrap">
        {m.text}
        <div className="text-[10px] text-gray-300 mt-1 text-right">{m.status === 'pending' ? 'σε αναμονή…' : ''}</div>
      </div>
    </div>
  )
  if (m.kind === 'answer') return (
    <div className="flex justify-start">
      <div className="max-w-[88%] bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 whitespace-pre-wrap">{m.text}</div>
    </div>
  )
  if (m.kind === 'note') return (
    <div className="text-center"><span className="text-[11px] text-gray-400">{m.text}</span></div>
  )
  // approval — manifesto rule #3: clear separate text + explicit yes/no
  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 text-sm">
        <div className="font-bold text-amber-800 uppercase text-xs tracking-wide mb-1">⚠️ Χρειάζεται έγκριση</div>
        <div className="text-amber-900 whitespace-pre-wrap">{m.text}</div>
        {m.status === 'pending' ? (
          <div className="flex gap-2 mt-3">
            <button onClick={() => onDecide(m, 'yes')} className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold">✓ ΝΑΙ</button>
            <button onClick={() => onDecide(m, 'no')} className="flex-1 py-2 rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 font-semibold">✕ ΟΧΙ</button>
          </div>
        ) : (
          <div className={`mt-2 text-xs font-semibold ${m.decision === 'yes' ? 'text-green-700' : 'text-red-600'}`}>
            Απάντησες: {m.decision === 'yes' ? 'ΝΑΙ ✓' : 'ΟΧΙ ✕'}
          </div>
        )}
      </div>
    </div>
  )
}
