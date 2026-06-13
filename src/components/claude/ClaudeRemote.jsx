import { useState, useEffect, useRef, useMemo } from 'react'
import {
  collection, doc, onSnapshot, addDoc, updateDoc, query, orderBy, serverTimestamp, setDoc,
} from 'firebase/firestore'
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import { logAudit } from '../../utils/audit'
import MessageContent from './MessageContent'

/* Mobile-first remote control for Claude Code on the laptop.
   Portal ⇄ Firestore ⇄ laptop bridge. You see only prompts, short approval
   asks (yes/no), final answers (rich: markdown/tables/charts) and brief
   mirror-notes of what runs in the terminal here. */

const STATE_DOC = doc(db, 'claude_remote_state', 'state')
const MSGS      = collection(db, 'claude_remote_messages')

const MODELS = [
  { id: 'opus',   label: 'Opus 4.8' },
  { id: 'sonnet', label: 'Sonnet 4.6' },
  { id: 'haiku',  label: 'Haiku 4.5' },
  { id: 'fable',  label: 'Fable 5' },
]

function fmtTime(ts) {
  const d = ts?.toDate ? ts.toDate() : (ts ? new Date(ts) : null)
  return d ? d.toLocaleString('el-GR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''
}
function fmtClock(ms) {
  if (ms <= 0) return 'τώρα'
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000)
  return h > 0 ? `${h}ω ${m}λ` : `${m}λ`
}

export default function ClaudeRemote() {
  const { userProfile, currentUser } = useAuth()
  const [state, setState]       = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)
  const [showManifesto, setShowManifesto] = useState(false)
  const [manifestoDraft, setManifestoDraft] = useState('')
  const [manifestoEditing, setManifestoEditing] = useState(false)
  const [savingM, setSavingM]   = useState(false)
  const [listening, setListening] = useState(false)
  const [image, setImage]       = useState(null)   // { url, path, name }
  const [uploading, setUploading] = useState(false)
  const [, tick] = useState(0)
  const endRef = useRef(null)
  const recRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => onSnapshot(STATE_DOC, s => setState(s.exists() ? s.data() : {})), [])
  useEffect(() => onSnapshot(query(MSGS, orderBy('createdAt', 'asc')), snap =>
    setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))) ), [])
  // tick every second while busy (live timer), else every 30s (reset countdown)
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), state?.busy ? 1000 : 30000); return () => clearInterval(t) }, [state?.busy])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const usage   = state?.sessionUsage || {}
  const pct     = Math.max(0, Math.min(100, Math.round(usage.usedPct ?? 0)))
  const resetIn = usage.resetAt ? (new Date(usage.resetAt).getTime() - Date.now()) : null
  const barColor= pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-green-500'
  const model   = state?.model || 'opus'
  const remoteOn = state?.remoteEnabled !== false
  const autoApprove = !!state?.autoApprove
  const bridgeOnline = state?.bridgeHeartbeat ? (Date.now() - new Date(state.bridgeHeartbeat).getTime() < 90000) : false
  const busyElapsed = state?.busy && state?.busyStartedAt ? Math.max(0, Math.round((Date.now() - new Date(state.busyStartedAt).getTime()) / 1000)) : 0

  const setFlag = (k, v) => setDoc(STATE_DOC, { [k]: v }, { merge: true })

  // paste a screenshot straight from the clipboard into the chat
  function onPaste(e) {
    const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'))
    if (item) { e.preventDefault(); pickImage(item.getAsFile()) }
  }

  async function pickImage(file) {
    if (!file) return
    setUploading(true)
    try {
      const path = `claude_uploads/${Date.now()}_${file.name.replace(/[^\w.\-]/g, '_')}`
      await uploadBytes(sRef(storage, path), file)
      const url = await getDownloadURL(sRef(storage, path))
      setImage({ url, path, name: file.name })
    } catch (e) { alert('Αποτυχία μεταφόρτωσης εικόνας: ' + e.message) }
    finally { setUploading(false) }
  }

  async function send() {
    const text = input.trim()
    if ((!text && !image) || sending) return
    setSending(true)
    try {
      await addDoc(MSGS, {
        role: 'user', kind: 'prompt', text: text || '(εικόνα)', status: 'pending',
        ...(image ? { imageUrl: image.url, imagePath: image.path } : {}),
        model, createdAt: serverTimestamp(), createdBy: userProfile?.displayName || '',
      })
      logAudit('claude_prompt', { model, hasImage: !!image, chars: text.length })
      setInput(''); setImage(null)
    } finally { setSending(false) }
  }

  function stopRun() { setFlag('cancelRequested', true) }

  async function decide(m, decision) {
    await updateDoc(doc(db, 'claude_remote_messages', m.id), { decision, status: 'answered', decidedAt: serverTimestamp() })
  }

  // voice → text (Greek first, falls back to English) via Web Speech API
  function toggleVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Η φωνητική πληκτρολόγηση δεν υποστηρίζεται σε αυτό το browser (δοκίμασε Chrome).'); return }
    if (listening) { recRef.current?.stop(); return }
    const r = new SR()
    r.lang = 'el-GR'; r.interimResults = true; r.continuous = true
    let base = input ? input + ' ' : ''
    r.onresult = e => {
      let t = ''
      for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript
      setInput(base + t)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recRef.current = r; r.start(); setListening(true)
  }

  function openManifesto() { setManifestoDraft(state?.manifesto || ''); setManifestoEditing(false); setShowManifesto(v => !v) }
  async function saveManifesto() {
    setSavingM(true)
    try { await setDoc(STATE_DOC, { manifesto: manifestoDraft, manifestoUpdatedAt: serverTimestamp() }, { merge: true }); setManifestoEditing(false) }
    finally { setSavingM(false) }
  }

  const visible = useMemo(() => messages.filter(m => ['prompt','answer','approval','note'].includes(m.kind)), [messages])

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pt-3 pb-2 flex flex-col overflow-hidden" style={{ height: 'calc(100dvh - 56px)' }}>
      {/* Header (frozen top) */}
      <div className="flex items-center justify-between mb-2 gap-2 shrink-0">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          💻 Claude
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${bridgeOnline ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
            {bridgeOnline ? '● online' : '○ offline'}
          </span>
        </h1>
        <button onClick={openManifesto} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${showManifesto ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>📜 Manifesto</button>
      </div>

      {/* Controls row — remote toggle + auto-approve + model chips */}
      <div className="flex flex-wrap items-center gap-2 mb-2 shrink-0">
        <button onClick={() => setFlag('remoteEnabled', !remoteOn)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-semibold border ${remoteOn ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
          {remoteOn ? '🟢 Remote ON' : '⚪ Remote OFF'}
        </button>
        <button onClick={() => setFlag('autoApprove', !autoApprove)}
          className={`px-2.5 py-1.5 rounded-full text-xs font-semibold border ${autoApprove ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
          {autoApprove ? '⚡ Auto-approve (read-only)' : 'Auto-approve: off'}
        </button>
        <div className="flex gap-1 ml-auto">
          {MODELS.map(mo => (
            <button key={mo.id} onClick={() => setFlag('model', mo.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${model === mo.id ? 'bg-gray-800 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-500'}`}>
              {mo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session limit bar */}
      <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 mb-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="font-semibold uppercase tracking-wide">Όριο session (εκτίμηση)</span>
          <span>{pct}%{resetIn != null && <> · ανανέωση σε <strong>{fmtClock(resetIn)}</strong></>}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} /></div>
      </div>

      {/* Manifesto */}
      {showManifesto && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-amber-800">📜 Manifesto</span>
            {!manifestoEditing
              ? <button onClick={() => setManifestoEditing(true)} className="text-xs text-amber-700">✏️ Επεξεργασία</button>
              : <div className="flex gap-2"><button onClick={saveManifesto} disabled={savingM} className="text-xs font-semibold text-green-700">{savingM ? '…' : '✓ Αποθήκευση'}</button><button onClick={() => { setManifestoEditing(false); setManifestoDraft(state?.manifesto || '') }} className="text-xs text-gray-500">Ακύρωση</button></div>}
          </div>
          {manifestoEditing
            ? <textarea value={manifestoDraft} onChange={e => setManifestoDraft(e.target.value)} rows={14} className="w-full text-xs font-mono border border-amber-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-400" />
            : <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-80 overflow-y-auto">{state?.manifesto || '—'}</pre>}
        </div>
      )}

      {/* hidden-until-scroll scrollbar, Messenger-style */}
      <style>{`
        .cc-scroll{scrollbar-width:thin;scrollbar-color:transparent transparent}
        .cc-scroll:hover,.cc-scroll:focus-within{scrollbar-color:#cbd5e1 transparent}
        .cc-scroll::-webkit-scrollbar{width:6px}
        .cc-scroll::-webkit-scrollbar-thumb{background:transparent;border-radius:3px}
        .cc-scroll:hover::-webkit-scrollbar-thumb,.cc-scroll:active::-webkit-scrollbar-thumb{background:#cbd5e1}
      `}</style>

      {/* Chat (only this scrolls) */}
      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
        <div className="cc-scroll flex-1 overflow-y-auto p-3 space-y-2.5" onPaste={onPaste}>
          {visible.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-10">Γράψε ή μίλα ένα prompt 👇<br/>Βλέπεις μόνο εγκρίσεις & αποτελέσματα.</div>
          )}
          {visible.map(m => <Bubble key={m.id} m={m} onDecide={decide} />)}
          {state?.busy && (
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
              <span className="text-gray-500 italic">{state.activity || 'σκέφτεται…'}</span>
              <span className="text-xs text-gray-400 font-mono tabular-nums">⏱ {busyElapsed}s</span>
              <button onClick={stopRun} className="ml-auto text-xs text-red-500 border border-red-200 rounded-full px-2 py-0.5">⏹ Στοπ</button>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 p-2">
          {image && (
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
              <img src={image.url} alt="" className="w-10 h-10 object-cover rounded" />
              <span className="truncate flex-1">{image.name}</span>
              <button onClick={() => setImage(null)} className="text-red-500">✕</button>
            </div>
          )}
          <div className="flex items-end gap-1.5">
            <button onClick={() => fileRef.current?.click()} disabled={uploading} title="Εικόνα"
              className="shrink-0 w-10 h-10 rounded-lg border border-gray-200 text-gray-500 text-lg">{uploading ? '…' : '📎'}</button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e => pickImage(e.target.files?.[0])} />
            <button onClick={toggleVoice} title="Φωνή"
              className={`shrink-0 w-10 h-10 rounded-lg border text-lg ${listening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'border-gray-200 text-gray-500'}`}>🎤</button>
            <textarea value={input} onChange={e => setInput(e.target.value)} onPaste={onPaste}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send() }}
              rows={1} placeholder={listening ? 'Μιλάω…' : 'Γράψε, μίλα ή επικόλλησε εικόνα…'}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none max-h-32" />
            <button onClick={send} disabled={sending || (!input.trim() && !image)}
              className="shrink-0 h-10 px-4 rounded-lg bg-gray-800 text-white text-sm font-semibold disabled:opacity-40">➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({ m, onDecide }) {
  if (m.kind === 'prompt') return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-gray-800 text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm">
        {m.imageUrl && <img src={m.imageUrl} alt="" className="rounded-lg mb-1 max-h-40" />}
        <div className="whitespace-pre-wrap">{m.text}</div>
      </div>
    </div>
  )
  if (m.kind === 'answer') return (
    <div className="flex justify-start">
      <div className="max-w-[92%] bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2">
        <MessageContent text={m.text || ''} />
        {m.thinkingMs > 0 && <div className="text-[10px] text-gray-400 mt-1">⏱ σκέφτηκε {Math.round(m.thinkingMs / 1000)}s</div>}
      </div>
    </div>
  )
  if (m.kind === 'note') return (
    <div className="text-center"><span className="text-[11px] text-gray-400 bg-gray-50 rounded-full px-2 py-0.5">🖥️ {m.text}</span></div>
  )
  return <ApprovalBubble m={m} onDecide={onDecide} />
}

function ApprovalBubble({ m, onDecide }) {
  const [showDetail, setShowDetail] = useState(false)
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] w-full bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2.5 text-sm">
        <div className="font-bold text-amber-800 text-xs mb-1">⚠️ Έγκριση</div>
        <div className="text-amber-900">{m.text}</div>
        {m.detail && (
          <button onClick={() => setShowDetail(s => !s)} className="text-[11px] text-amber-600 underline mt-1">
            {showDetail ? 'απόκρυψη' : 'λεπτομέρειες'}
          </button>
        )}
        {showDetail && m.detail && <pre className="text-[11px] bg-white/60 rounded p-2 mt-1 overflow-x-auto whitespace-pre-wrap">{m.detail}</pre>}
        {m.status === 'pending' ? (
          <div className="flex gap-2 mt-2">
            <button onClick={() => onDecide(m, 'yes')} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold">✓ ΝΑΙ</button>
            <button onClick={() => onDecide(m, 'no')} className="flex-1 py-2 rounded-lg bg-white border border-red-300 text-red-600 font-semibold">✕ ΟΧΙ</button>
          </div>
        ) : <div className={`mt-1.5 text-xs font-semibold ${m.decision === 'yes' ? 'text-green-700' : 'text-red-600'}`}>{m.decision === 'yes' ? 'ΝΑΙ ✓' : 'ΟΧΙ ✕'}</div>}
      </div>
    </div>
  )
}
