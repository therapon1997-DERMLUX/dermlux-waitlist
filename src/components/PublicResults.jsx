import { useEffect, useState, useMemo, useRef } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import confetti from 'canvas-confetti'

const NAVY    = '#1B4080'
const TEAL    = '#45C0AC'
const LAVENDER= '#A99DC8'
const GREEN   = '#22c55e'
const RED     = '#ef4444'

const CANDIDATES = [
  { key: 'nikoletta', label: 'Νικολέττα',  color: TEAL,       glow: TEAL },
  { key: 'pazaros',   label: 'Χ.Πάζαρος', color: '#5B8CCC',  glow: '#5B8CCC' },
  { key: 'koupparis', label: 'Κούππαρης',  color: '#56B87A',  glow: '#56B87A' },
  { key: 'karseras',  label: 'Καρσεράς',   color: '#E8965A',  glow: '#E8965A' },
  { key: 'giorgos',   label: 'Γιώργος',    color: LAVENDER,   glow: LAVENDER },
]

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4ος', '5ος']

function nikolettaPos(r) {
  return [...CANDIDATES]
    .map(c => ({ key: c.key, v: r[c.key] ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .findIndex(c => c.key === 'nikoletta')
}

function fireConfetti() {
  const end = Date.now() + 4000
  const colors = [TEAL, NAVY, LAVENDER, '#ffffff', '#f1c40f'];
  (function frame() {
    confetti({ particleCount: 7, angle: 60,  spread: 60, origin: { x: 0 }, colors })
    confetti({ particleCount: 7, angle: 120, spread: 60, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export default function PublicResults() {
  const [approved, setApproved] = useState([])
  const [pending,  setPending]  = useState([])
  const [countdown, setCountdown] = useState(null)
  const [newCard,   setNewCard]   = useState(null)
  const prevIdsRef  = useRef(new Set())
  const initialLoad = useRef(true)

  // ── Approved listener ──
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), where('status', '==', 'approved')),
      snap => {
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.approvedAt?.seconds || 0) - (a.approvedAt?.seconds || 0))
        const prevIds = prevIdsRef.current
        const newIds  = docs.map(d => d.id).filter(id => !prevIds.has(id))
        prevIdsRef.current = new Set(docs.map(d => d.id))
        setApproved(docs)
        if (initialLoad.current) { initialLoad.current = false; return }
        if (newIds.length > 0) {
          const newest = docs.find(d => d.id === newIds[0])
          if (newest) setCountdown({ result: newest, n: 3 })
        }
      },
      err => console.error('approved listener:', err)
    )
    return unsub
  }, [])

  // ── Pending listener ──
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), where('status', '==', 'pending')),
      snap => setPending(
        snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
      ),
      err => console.error('pending listener:', err)
    )
    return unsub
  }, [])

  // ── Countdown tick ──
  useEffect(() => {
    if (!countdown) return
    if (countdown.n <= 0) {
      setNewCard(countdown.result)
      setCountdown(null)
      setTimeout(() => setNewCard(null), 5000)
      return
    }
    const t = setTimeout(() => setCountdown(c => c ? { ...c, n: c.n - 1 } : null), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // ── Leaderboard totals ──
  const totals = useMemo(() => {
    const t = Object.fromEntries(CANDIDATES.map(c => [c.key, 0]))
    approved.forEach(r => CANDIDATES.forEach(c => { if (r[c.key] != null) t[c.key] += r[c.key] }))
    return t
  }, [approved])

  const ranked = useMemo(() =>
    [...CANDIDATES].sort((a, b) => totals[b.key] - totals[a.key]),
  [totals])

  const nikolettaFirst = ranked[0]?.key === 'nikoletta' && totals.nikoletta > 0
  const maxVotes       = Math.max(...Object.values(totals), 1)
  const totalSynolo    = approved.reduce((s, r) => s + (r.synolo || 0), 0)

  const prevLeaderRef = useRef(null)
  useEffect(() => {
    if (nikolettaFirst && ranked[0]?.key !== prevLeaderRef.current) fireConfetti()
    prevLeaderRef.current = ranked[0]?.key
  }, [approved.length]) // eslint-disable-line

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Arial', sans-serif", color: 'white' }}>

      <style>{`
        @keyframes popIn   { from { transform:scale(1.6); opacity:0 } to { transform:scale(1); opacity:1 } }
        @keyframes slideUp { from { transform:translateY(50px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes shimmer { 0% { background-position:-200% center } 100% { background-position:200% center } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse   { 0%,100% { opacity:1 } 50% { opacity:.55 } }
      `}</style>

      {/* ── Countdown overlay ── */}
      {countdown && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(10,20,50,.94)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="/dermlux-waitlist/nikoletta.png" alt=""
            style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top',
              border: `3px solid ${TEAL}`, marginBottom: 20 }} />
          <div style={{ fontSize: 12, letterSpacing: 4, textTransform: 'uppercase', opacity: .6, marginBottom: 10 }}>
            Νέα κάλπη έρχεται
          </div>
          <div style={{ fontSize: 13, opacity: .7, marginBottom: 28, textAlign: 'center', maxWidth: 300 }}>
            {countdown.result.centerName}<br />
            <span style={{ opacity: .6 }}>{countdown.result.pollName} #{countdown.result.pollNum}</span>
          </div>
          <div key={countdown.n} style={{
            fontSize: 130, fontWeight: 'bold', lineHeight: 1,
            color: TEAL, animation: 'popIn .35s ease',
            textShadow: `0 0 40px ${TEAL}`,
          }}>
            {countdown.n}
          </div>
        </div>
      )}

      {/* ── New card toast ── */}
      {newCard && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 998,
          background: 'white', color: '#111', borderRadius: 14, padding: '16px 20px',
          boxShadow: '0 8px 40px rgba(0,0,0,.4)', maxWidth: 320,
          animation: 'slideUp .4s ease', borderLeft: `5px solid ${TEAL}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: TEAL, letterSpacing: 2, marginBottom: 6 }}>
            ✅ ΝΕΑ ΚΑΛΠΗ ΕΓΚΡΙΘΗΚΕ
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>{newCard.centerName}</div>
          <div style={{ fontSize: 11, color: '#777', marginBottom: 10 }}>
            {newCard.pollName} #{newCard.pollNum}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CANDIDATES.map(c => newCard[c.key] != null && (
              <div key={c.key} style={{ textAlign: 'center', minWidth: 44 }}>
                <div style={{ fontSize: 10, color: '#999' }}>{c.label}</div>
                <div style={{ fontWeight: 'bold', fontSize: 18, color: c.color }}>{newCard[c.key]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg, #0e2450 0%, ${NAVY} 60%, #163060 100%)`,
        borderBottom: `3px solid ${TEAL}`,
        padding: '24px 20px 20px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            <img src="/dermlux-waitlist/nikoletta.png" alt="Νικολέττα"
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center',
                border: `3px solid ${TEAL}`, boxShadow: `0 0 20px rgba(69,192,172,.4)` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: TEAL, textTransform: 'uppercase', marginBottom: 4 }}>
              Βουλευτικές Εκλογές 2026 · Επαρχία Πάφου
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, letterSpacing: .5 }}>
              ΑΠΟΤΕΛΕΣΜΑΤΑ ΕΚΛΟΓΩΝ
            </h1>
            <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(69,192,172,.15)', border: `1px solid ${TEAL}`, borderRadius: 20, padding: '3px 12px', fontSize: 12, color: TEAL }}>
                🔴 LIVE
              </span>
              <span style={{ background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>
                ✅ {approved.length} ολοκληρωμέν{approved.length === 1 ? 'η' : 'ες'}
              </span>
              <span style={{ background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>
                ⏳ {pending.length} αναμον{pending.length === 1 ? 'ή' : 'ή'}
              </span>
              {totalSynolo > 0 && (
                <span style={{ background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>
                  🗳️ {totalSynolo.toLocaleString('el-GR')} ψήφοι
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Nikoletta leading banner ── */}
      {nikolettaFirst && (
        <div style={{
          background: `linear-gradient(90deg, ${NAVY}, ${TEAL}, ${LAVENDER}, ${TEAL}, ${NAVY})`,
          backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite',
          textAlign: 'center', padding: '12px 20px',
          fontWeight: 'bold', fontSize: 16, letterSpacing: 1, color: 'white',
        }}>
          🎉 Η ΝΙΚΟΛΕΤΤΑ ΠΡΟΗΓΕΙΤΑΙ! 🎉
        </div>
      )}

      {/* ── Leaderboard ── */}
      <div style={{ maxWidth: 1100, margin: '28px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ranked.map((c, i) => {
            const votes   = totals[c.key]
            const pct     = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
            const isFirst = i === 0 && votes > 0
            const isNiko  = c.key === 'nikoletta'
            return (
              <div key={c.key} style={{
                background: isFirst
                  ? 'linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.06))'
                  : 'rgba(255,255,255,.05)',
                borderRadius: 12,
                border: isFirst ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,.08)',
                padding: isFirst ? '16px 20px' : '12px 16px',
                transition: 'all .4s',
                boxShadow: isFirst ? `0 0 20px rgba(69,192,172,.15)` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: isFirst ? 10 : 8 }}>
                  <span style={{ fontSize: isFirst ? 30 : 20, minWidth: 36, textAlign: 'center', lineHeight: 1 }}>
                    {RANK_MEDALS[i]}
                  </span>
                  {isNiko && (
                    <img src="/dermlux-waitlist/nikoletta.png" alt="Νικολέττα"
                      style={{ width: isFirst ? 44 : 32, height: isFirst ? 44 : 32,
                        borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center',
                        border: `2px solid ${TEAL}`, flexShrink: 0, transition: 'all .4s' }} />
                  )}
                  <span style={{ flex: 1, fontWeight: 'bold', fontSize: isFirst ? 20 : 15, transition: 'font-size .4s' }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: isFirst ? 32 : 22, fontWeight: 'bold', color: c.color,
                    minWidth: 64, textAlign: 'right',
                    textShadow: isFirst ? `0 0 12px ${c.glow}` : 'none', transition: 'all .4s' }}>
                    {votes.toLocaleString('el-GR')}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 6, height: isFirst ? 10 : 6, overflow: 'hidden' }}>
                  <div style={{
                    background: isFirst ? `linear-gradient(90deg, ${c.color}, ${c.color}cc)` : c.color,
                    width: `${pct}%`, height: '100%', borderRadius: 6,
                    transition: 'width .7s ease',
                    boxShadow: isFirst ? `0 0 10px ${c.glow}` : 'none',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Two-column ballot area ── */}
      <div style={{ maxWidth: 1100, margin: '36px auto 60px', padding: '0 20px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── LEFT: Ολοκληρωμένες ── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
            opacity: .5, marginBottom: 14 }}>
            ✅ Ολοκληρωμένες ({approved.length})
          </div>

          {approved.length === 0 ? (
            <div style={{ opacity: .25, fontSize: 14, textAlign: 'center', paddingTop: 40 }}>
              Καμία ακόμα…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {approved.map(r => <ApprovedBallotRow key={r.id} result={r} />)}
            </div>
          )}
        </div>

        {/* ── RIGHT: Pending ── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
            opacity: .5, marginBottom: 14 }}>
            ⏳ Εκκρεμείς ({pending.length})
          </div>

          {pending.length === 0 ? (
            <div style={{ opacity: .25, fontSize: 14, textAlign: 'center', paddingTop: 40 }}>
              Αναμονή νέων καλπών…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.map(r => <PendingBallotRow key={r.id} result={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Approved ballot row (green if Νικολέττα 1st, red if 2nd) ──────────────────
function ApprovedBallotRow({ result: r }) {
  const pos      = nikolettaPos(r)
  const isFirst  = pos === 0
  const isSecond = pos === 1

  const borderColor = isFirst  ? `${GREEN}60` : isSecond ? `${RED}60` : 'rgba(255,255,255,.08)'
  const bgColor     = isFirst  ? 'rgba(34,197,94,.1)' : isSecond ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.04)'
  const dotColor    = isFirst  ? GREEN : isSecond ? RED : '#888'
  const badge       = isFirst  ? '🟢 1η' : isSecond ? '🔴 2η' : '⚪'

  return (
    <div style={{
      background: bgColor, borderRadius: 10,
      border: `1px solid ${borderColor}`,
      padding: '10px 14px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 'bold' }}>{r.centerName}</span>
        <span style={{ fontSize: 11, opacity: .45 }}>{r.centerArea}</span>
        <span style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}40`,
          color: TEAL, borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 'bold' }}>
          {r.pollName} #{r.pollNum}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 'bold', color: dotColor }}>{badge}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {CANDIDATES.map(c => r[c.key] != null && (
          <div key={c.key} style={{ textAlign: 'center', minWidth: 40 }}>
            <div style={{ fontSize: 10, opacity: .45, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: 16,
              color: c.key === 'nikoletta' ? (isFirst ? GREEN : isSecond ? RED : c.color) : c.color }}>
              {r[c.key]}
            </div>
          </div>
        ))}
        {r.synolo != null && (
          <div style={{ textAlign: 'center', minWidth: 40, marginLeft: 'auto' }}>
            <div style={{ fontSize: 10, opacity: .45, marginBottom: 2 }}>Σύνολο</div>
            <div style={{ fontWeight: 'bold', fontSize: 16, opacity: .6 }}>{r.synolo}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Pending ballot row (no vote counts shown) ──────────────────────────────────
function PendingBallotRow({ result: r }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.04)', borderRadius: 10,
      border: '1px solid rgba(255,200,50,.2)',
      padding: '10px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b',
          flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: 13, fontWeight: 'bold' }}>{r.centerName}</span>
        <span style={{ fontSize: 11, opacity: .45 }}>{r.centerArea}</span>
        <span style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
          color: 'rgba(255,255,255,.6)', borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 'bold' }}>
          {r.pollName} #{r.pollNum}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#f59e0b', opacity: .7 }}>αναμονή…</span>
      </div>
    </div>
  )
}
