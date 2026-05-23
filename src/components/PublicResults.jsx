import { useEffect, useState, useMemo, useRef } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import confetti from 'canvas-confetti'

const CANDIDATES = [
  { key: 'nikoletta', label: 'Νικολέττα',  color: '#c0392b', bg: '#fdf2f2' },
  { key: 'pazaros',   label: 'Χ.Πάζαρος', color: '#1565C0', bg: '#f0f4fb' },
  { key: 'koupparis', label: 'Κούππαρης',  color: '#2E7D32', bg: '#f0faf4' },
  { key: 'karseras',  label: 'Καρσεράς',   color: '#E65100', bg: '#fff7f0' },
  { key: 'giorgos',   label: 'Γιώργος',    color: '#6A1B9A', bg: '#f8f0fd' },
]

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4', '5']

function fireConfetti() {
  const end = Date.now() + 3000
  const colors = ['#c0392b', '#e74c3c', '#f39c12', '#f1c40f', '#ffffff'];
  (function frame() {
    confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export default function PublicResults() {
  const [results,   setResults]   = useState([])
  const [countdown, setCountdown] = useState(null)   // null | { result, n }
  const [newCard,   setNewCard]   = useState(null)   // result shown after countdown
  const prevIdsRef  = useRef(new Set())
  const initialLoad = useRef(true)

  // ── Real-time listener ────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'ballot_results'),
        where('status', '==', 'approved'),
        orderBy('approvedAt', 'desc')
      ),
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        const prevIds = prevIdsRef.current
        const newIds  = docs.map(d => d.id).filter(id => !prevIds.has(id))
        prevIdsRef.current = new Set(docs.map(d => d.id))
        setResults(docs)

        // Don't animate on first load
        if (initialLoad.current) { initialLoad.current = false; return }
        if (newIds.length > 0) {
          const newest = docs.find(d => d.id === newIds[0])
          if (newest) startCountdown(newest)
        }
      }
    )
    return unsub
  }, [])

  // ── Countdown ticker ──────────────────────────────────────────────────────
  function startCountdown(result) {
    setCountdown({ result, n: 3 })
  }

  useEffect(() => {
    if (!countdown) return
    if (countdown.n <= 0) {
      setNewCard(countdown.result)
      setCountdown(null)
      setTimeout(() => setNewCard(null), 4000)
      return
    }
    const t = setTimeout(() => setCountdown(c => c ? { ...c, n: c.n - 1 } : null), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  // ── Totals & ranking ──────────────────────────────────────────────────────
  const totals = useMemo(() => {
    const t = Object.fromEntries(CANDIDATES.map(c => [c.key, 0]))
    results.forEach(r => CANDIDATES.forEach(c => { if (r[c.key] != null) t[c.key] += r[c.key] }))
    return t
  }, [results])

  const ranked = useMemo(() =>
    [...CANDIDATES].sort((a, b) => totals[b.key] - totals[a.key]),
  [totals])

  const nikolettaFirst = ranked[0]?.key === 'nikoletta' && totals.nikoletta > 0
  const maxVotes = Math.max(...Object.values(totals), 1)
  const totalSynolo = results.reduce((s, r) => s + (r.synolo || 0), 0)

  // ── Confetti when Νικολέττα leads ─────────────────────────────────────────
  const prevLeaderRef = useRef(null)
  useEffect(() => {
    const leader = ranked[0]?.key
    if (leader !== prevLeaderRef.current) {
      prevLeaderRef.current = leader
      if (nikolettaFirst) fireConfetti()
    } else if (nikolettaFirst && results.length > 0) {
      // also fire on every new approved result while she leads
    }
  }, [results.length, nikolettaFirst])

  useEffect(() => {
    if (nikolettaFirst) fireConfetti()
  }, [results.length]) // eslint-disable-line

  return (
    <div style={{ minHeight: '100vh', background: '#0d1b3e', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* Countdown overlay */}
      {countdown && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,.85)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', opacity: .7, marginBottom: 16 }}>
            Νέα κάλπη έρχεται
          </div>
          <div style={{ fontSize: 14, opacity: .8, marginBottom: 24 }}>
            {countdown.result.centerName} · {countdown.result.pollName} #{countdown.result.pollNum}
          </div>
          <div key={countdown.n} style={{
            fontSize: 120, fontWeight: 'bold', lineHeight: 1,
            color: '#c0392b',
            animation: 'popIn .3s ease',
          }}>
            {countdown.n}
          </div>
          <style>{`@keyframes popIn { from { transform: scale(1.5); opacity:0 } to { transform: scale(1); opacity:1 } }`}</style>
        </div>
      )}

      {/* New card flash */}
      {newCard && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 998,
          background: 'white', color: '#111', borderRadius: 12, padding: '16px 20px',
          boxShadow: '0 8px 40px rgba(0,0,0,.4)',
          maxWidth: 340, animation: 'slideUp .4s ease',
          borderLeft: '5px solid #c0392b',
        }}>
          <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#c0392b', letterSpacing: 2, marginBottom: 6 }}>
            ✅ ΝΕΑ ΚΑΛΠΗ ΕΓΚΡΙΘΗΚΕ
          </div>
          <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>
            {newCard.centerName}
          </div>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>
            {newCard.pollName} #{newCard.pollNum}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CANDIDATES.map(c => newCard[c.key] != null && (
              <div key={c.key} style={{ textAlign: 'center', minWidth: 40 }}>
                <div style={{ fontSize: 11, color: '#888' }}>{c.label}</div>
                <div style={{ fontWeight: 'bold', fontSize: 16, color: c.color }}>{newCard[c.key]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ background: '#0a1428', borderBottom: '2px solid #c0392b', padding: '20px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 'bold', margin: 0, letterSpacing: 1 }}>
          🗳️ ΑΠΟΤΕΛΕΣΜΑΤΑ ΕΚΛΟΓΩΝ 2026
        </h1>
        <p style={{ fontSize: 13, opacity: .6, marginTop: 6, marginBottom: 0 }}>
          Βουλευτικές · Επαρχία Πάφου · LIVE
        </p>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 13 }}>
          <span style={{ background: 'rgba(255,255,255,.1)', borderRadius: 20, padding: '4px 14px' }}>
            📊 {results.length} κάλπ{results.length === 1 ? 'η' : 'ες'} καταμετρήθηκ{results.length === 1 ? 'ε' : 'αν'}
          </span>
          {totalSynolo > 0 && (
            <span style={{ background: 'rgba(255,255,255,.1)', borderRadius: 20, padding: '4px 14px' }}>
              🗳️ {totalSynolo.toLocaleString('el-GR')} ψήφοι
            </span>
          )}
        </div>
      </header>

      {/* Leaderboard */}
      <div style={{ maxWidth: 700, margin: '28px auto 0', padding: '0 16px' }}>
        {nikolettaFirst && (
          <div style={{
            textAlign: 'center', fontSize: 18, fontWeight: 'bold',
            color: '#f1c40f', marginBottom: 20, letterSpacing: 1,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            🎉 Η ΝΙΚΟΛΕΤΤΑ ΠΡΟΗΓΕΙΤΑΙ! 🎉
            <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.6 } }`}</style>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ranked.map((c, i) => {
            const votes   = totals[c.key]
            const pct     = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
            const isFirst = i === 0 && votes > 0
            return (
              <div key={c.key} style={{
                background: isFirst ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.05)',
                borderRadius: 10,
                border: isFirst ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,.08)',
                padding: '14px 18px',
                transition: 'all .3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: isFirst ? 28 : 18, minWidth: 32, textAlign: 'center' }}>
                    {RANK_MEDALS[i]}
                  </span>
                  <span style={{ flex: 1, fontWeight: 'bold', fontSize: isFirst ? 18 : 15 }}>
                    {c.label}
                  </span>
                  <span style={{
                    fontSize: isFirst ? 28 : 20, fontWeight: 'bold',
                    color: c.color,
                    minWidth: 60, textAlign: 'right',
                  }}>
                    {votes.toLocaleString('el-GR')}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 4, height: isFirst ? 10 : 6 }}>
                  <div style={{
                    background: c.color, width: `${pct}%`, height: '100%',
                    borderRadius: 4, transition: 'width .6s ease',
                    boxShadow: isFirst ? `0 0 8px ${c.color}` : 'none',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent ballots feed */}
      {results.length > 0 && (
        <div style={{ maxWidth: 700, margin: '32px auto 40px', padding: '0 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 'bold', opacity: .5, letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' }}>
            Αναλυτικά αποτελέσματα ανά κάλπη
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map(r => <BallotRow key={r.id} result={r} />)}
          </div>
        </div>
      )}

      {results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', opacity: .4, fontSize: 16 }}>
          Αναμονή αποτελεσμάτων…
        </div>
      )}
    </div>
  )
}

function BallotRow({ result: r }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.05)', borderRadius: 8,
      padding: '12px 16px', border: '1px solid rgba(255,255,255,.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 'bold', fontSize: 13 }}>{r.centerName}</span>
        <span style={{ fontSize: 11, opacity: .5 }}>{r.centerArea}</span>
        <span style={{
          background: 'rgba(255,255,255,.12)', borderRadius: 10,
          padding: '1px 8px', fontSize: 11,
        }}>{r.pollName} #{r.pollNum}</span>
        {r.synolo != null && (
          <span style={{ marginLeft: 'auto', fontSize: 12, opacity: .6 }}>
            Σύνολο: <strong>{r.synolo}</strong>
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {CANDIDATES.map(c => r[c.key] != null && (
          <div key={c.key} style={{ textAlign: 'center', minWidth: 48 }}>
            <div style={{ fontSize: 10, opacity: .6, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: 15, color: c.color }}>{r[c.key]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
