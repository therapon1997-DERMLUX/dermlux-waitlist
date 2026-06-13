import { useState, useEffect, useRef } from 'react'

/* Extra PIN lock on the Claude Code remote section (on top of admin auth),
   because this page can run code on the laptop. The PIN is stored only as a
   hash; a correct entry unlocks for the current browser session. */
const EXPECTED = '26aec883'
const fnv = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) } return (h >>> 0).toString(16) }
const KEY = 'cc_pin_ok'

export default function ClaudePinGate({ children }) {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === '1')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => { if (!ok) inputRef.current?.focus() }, [ok])

  function submit(e) {
    e?.preventDefault()
    if (fnv(pin.trim()) === EXPECTED) { sessionStorage.setItem(KEY, '1'); setOk(true) }
    else { setErr(true); setPin(''); setTimeout(() => setErr(false), 1200) }
  }

  if (ok) return children

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(900px 600px at 50% -10%, #221e18 0%, transparent 60%), #100f0d' }}>
      <form onSubmit={submit} className="w-full max-w-xs text-center">
        <div className="text-5xl mb-3">🔒</div>
        <h1 style={{ fontFamily: "'Prata', Georgia, serif", color: '#EEECE0' }} className="text-2xl mb-1">Claude Code</h1>
        <p className="text-xs text-gray-400 mb-5">Κλειδωμένο — εισάγετε PIN</p>
        <input ref={inputRef} type="password" inputMode="numeric" autoComplete="off"
          value={pin} onChange={e => setPin(e.target.value)}
          className={`w-full text-center tracking-[0.5em] text-lg rounded-lg px-3 py-3 mb-3 focus:outline-none focus:ring-2 ${err ? 'ring-2 ring-red-500 animate-pulse' : 'focus:ring-amber-400'}`}
          style={{ background: 'rgba(238,236,224,0.07)', border: '1px solid rgba(238,236,224,0.18)', color: '#EEECE0' }}
          placeholder="••••" />
        {err && <p className="text-red-400 text-xs mb-2">Λάθος PIN</p>}
        <button type="submit" className="w-full py-2.5 rounded-lg text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #9D835E, #B392A4)', color: '#100f0d' }}>Ξεκλείδωμα</button>
      </form>
    </div>
  )
}
