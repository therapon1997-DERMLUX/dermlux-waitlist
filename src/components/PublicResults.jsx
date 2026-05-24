import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import confetti from 'canvas-confetti'
import { POLL_LOOKUP, ALL_CENTERS } from '../data/electionData'

// ── Brand palette ──────────────────────────────────────────────────────────────
const NAVY    = '#1B4080'
const TEAL    = '#45C0AC'
const LAVENDER= '#A99DC8'
const GREEN   = '#22c55e'
const RED     = '#ef4444'

const CANDIDATES = [
  { key: 'nikoletta', label: 'Νικολέττα',  color: TEAL,      glow: TEAL },
  { key: 'pazaros',   label: 'Χ.Πάζαρος', color: '#5B8CCC',  glow: '#5B8CCC' },
  { key: 'koupparis', label: 'Κούππαρης',  color: '#56B87A',  glow: '#56B87A' },
  { key: 'karseras',  label: 'Καρσεράς',   color: '#E8965A',  glow: '#E8965A' },
  { key: 'giorgos',   label: 'Γιώργος',    color: LAVENDER,   glow: LAVENDER },
]

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4ος', '5ος']

// ── Build flat list of all 122 polls + voters map from electionData ───────────
const CENTER_MAP = Object.fromEntries(
  ALL_CENTERS.map(c => [c.aa, { name: c.name, area: c.area, voters: c.voters, boxes: c.boxes }])
)

const ALL_POLLS = []
// pollNum → estimated voters (center.voters / center.boxes)
const POLL_VOTERS_MAP = {}

for (const [aa, polls] of Object.entries(POLL_LOOKUP)) {
  const center = CENTER_MAP[aa]
  if (!center) continue
  const votersPerPoll = Math.round(center.voters / (center.boxes || polls.length))
  for (const poll of polls) {
    ALL_POLLS.push({ pollNum: poll.num, pollName: poll.name, centerName: center.name, centerArea: center.area })
    POLL_VOTERS_MAP[poll.num] = votersPerPoll
  }
}
ALL_POLLS.sort((a, b) => a.pollNum - b.pollNum)

const TOTAL_VOTERS = Object.values(POLL_VOTERS_MAP).reduce((s, v) => s + v, 0)

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function PublicResults() {
  const [approved,   setApproved]   = useState([])
  const [submitted,  setSubmitted]  = useState([])
  const [countdown,  setCountdown]  = useState(null)
  const [newCard,    setNewCard]    = useState(null)
  const [loading,    setLoading]    = useState(true)
  const prevIdsRef   = useRef(new Set())
  const initialLoad  = useRef(true)
  const unsubApprRef = useRef(null)
  const unsubPendRef = useRef(null)

  // ── Subscribe helper ────────────────────────────────────────────────────
  const subscribe = useCallback(() => {
    // Approved
    if (unsubApprRef.current) unsubApprRef.current()
    unsubApprRef.current = onSnapshot(
      query(collection(db, 'ballot_results'), where('status', '==', 'approved')),
      snap => {
        setLoading(false)
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(d => !d.isOfficial)
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
      err => { console.error('approved listener:', err); setLoading(false) }
    )

    // Pending
    if (unsubPendRef.current) unsubPendRef.current()
    unsubPendRef.current = onSnapshot(
      query(collection(db, 'ballot_results'), where('status', '==', 'pending')),
      snap => setSubmitted(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      err => console.error('pending listener:', err)
    )
  }, [])

  // ── Initial subscription (real-time) ────────────────────────────────────
  useEffect(() => {
    subscribe()
    return () => {
      if (unsubApprRef.current) unsubApprRef.current()
      if (unsubPendRef.current) unsubPendRef.current()
    }
  }, [subscribe])

  // ── Polling fallback every 15s — εγγυάται ενημέρωση ακόμα κι αν κοπεί το WebSocket ──
  useEffect(() => {
    async function poll() {
      try {
        const snap = await getDocs(
          query(collection(db, 'ballot_results'), where('status', '==', 'approved'))
        )
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(d => !d.isOfficial)
          .sort((a, b) => (b.approvedAt?.seconds || 0) - (a.approvedAt?.seconds || 0))

        const prevIds = prevIdsRef.current
        const newIds  = docs.map(d => d.id).filter(id => !prevIds.has(id))
        prevIdsRef.current = new Set(docs.map(d => d.id))
        setApproved(docs)
        setLoading(false)
        if (!initialLoad.current && newIds.length > 0) {
          const newest = docs.find(d => d.id === newIds[0])
          if (newest) setCountdown({ result: newest, n: 3 })
        }
        initialLoad.current = false
      } catch (e) {
        console.warn('poll error:', e)
      }
    }

    const timer = setInterval(poll, 15000)
    return () => clearInterval(timer)
  }, [])

  // ── Re-subscribe on tab focus ────────────────────────────────────────────
  useEffect(() => {
    function onVisible() {
      if (!document.hidden) subscribe()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [subscribe])

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

  // ── Forecasting ──────────────────────────────────────────────────────────────
  const forecast = useMemo(() => {
    if (approved.length < 1) return null

    // pollNum may be stored as string in Firestore — handle both
    const reportedVoters = approved.reduce((s, r) => s + (POLL_VOTERS_MAP[Number(r.pollNum)] || POLL_VOTERS_MAP[r.pollNum] || 0), 0)
    if (totalSynolo === 0) return null
    // fallback: if pollNum lookup failed, estimate from average
    const effectiveReported = reportedVoters > 0
      ? reportedVoters
      : approved.length * Math.round(TOTAL_VOTERS / 122)

    const pctComplete   = (effectiveReported / TOTAL_VOTERS) * 100
    const turnout       = totalSynolo / effectiveReported
    const pendingVoters = Math.max(TOTAL_VOTERS - effectiveReported, 0)
    const expectedExtra = pendingVoters * turnout

    // Predicted final votes per candidate
    const predicted = {}
    let predictedTotal = 0
    CANDIDATES.forEach(c => {
      const share = totals[c.key] / totalSynolo
      predicted[c.key] = Math.round(totals[c.key] + share * expectedExtra)
      predictedTotal += predicted[c.key]
    })

    const rankedForecast = [...CANDIDATES]
      .map(c => ({ ...c, predicted: predicted[c.key], current: totals[c.key] }))
      .sort((a, b) => b.predicted - a.predicted)

    const confidence =
      pctComplete < 15 ? 'Πολύ Χαμηλή' :
      pctComplete < 35 ? 'Χαμηλή' :
      pctComplete < 55 ? 'Μέτρια' :
      pctComplete < 75 ? 'Καλή' : 'Υψηλή'

    const confidenceColor =
      pctComplete < 15 ? '#6b7280' :
      pctComplete < 35 ? '#f59e0b' :
      pctComplete < 55 ? '#eab308' :
      pctComplete < 75 ? '#84cc16' : GREEN

    return { rankedForecast, predictedTotal, pctComplete, turnout, confidence, confidenceColor, totalSynolo }
  }, [approved, totals, totalSynolo])

  const prevLeaderRef = useRef(null)
  useEffect(() => {
    if (nikolettaFirst && ranked[0]?.key !== prevLeaderRef.current) fireConfetti()
    prevLeaderRef.current = ranked[0]?.key
  }, [approved.length]) // eslint-disable-line

  // ── Build right column: all 122 polls minus approved ones ──
  const approvedPollNums   = useMemo(() => new Set(approved.map(r => r.pollNum)),   [approved])
  const submittedPollNums  = useMemo(() => new Set(submitted.map(r => r.pollNum)),  [submitted])

  const pendingPolls = useMemo(() =>
    ALL_POLLS.filter(p => !approvedPollNums.has(p.pollNum)),
  [approvedPollNums])

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: "'Arial', sans-serif", color: 'white' }}>

      <style>{`
        @keyframes popIn   { from { transform:scale(1.6); opacity:0 } to { transform:scale(1); opacity:1 } }
        @keyframes slideUp { from { transform:translateY(50px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes shimmer { 0% { background-position:-200% center } 100% { background-position:200% center } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse   { 0%,100% { opacity:1 } 50% { opacity:.4 } }
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
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
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
              <span style={{ background: 'rgba(69,192,172,.15)', border: `1px solid ${TEAL}`,
                borderRadius: 20, padding: '3px 12px', fontSize: 12, color: TEAL }}>
                {loading ? '⏳ Φόρτωση…' : '🔴 LIVE'}
              </span>
              <span style={{ background: 'rgba(34,197,94,.15)', borderRadius: 20, padding: '3px 12px', fontSize: 12, color: GREEN }}>
                ✅ {approved.length} / 122 ολοκληρωμένες
              </span>
              <span style={{ background: 'rgba(255,255,255,.08)', borderRadius: 20, padding: '3px 12px', fontSize: 12 }}>
                ⏳ {pendingPolls.length} εκκρεμείς
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

      {/* ── Forecast banner ── */}
      {forecast && <ForecastBanner forecast={forecast} />}

      {/* ── Leaderboard ── */}
      <div style={{ maxWidth: 1200, margin: '28px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ranked.map((c, i) => {
            const votes   = totals[c.key]
            const pct     = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
            const isFirst = i === 0 && votes > 0
            const isNiko  = c.key === 'nikoletta'
            return (
              <div key={c.key} style={{
                background: isFirst ? 'linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.06))' : 'rgba(255,255,255,.05)',
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
      <div style={{
        maxWidth: 1200, margin: '36px auto 60px', padding: '0 20px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
      }}>

        {/* ── LEFT: Ολοκληρωμένες ── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
            opacity: .5, marginBottom: 14 }}>
            ✅ Ολοκληρωμένες ({approved.length})
          </div>

          {approved.length === 0 ? (
            <div style={{ opacity: .2, fontSize: 14, textAlign: 'center', paddingTop: 60 }}>
              Αναμονή πρώτων αποτελεσμάτων…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {approved.map(r => <ApprovedRow key={r.id} result={r} />)}
            </div>
          )}
        </div>

        {/* ── RIGHT: Εκκρεμείς (all 122 - approved) ── */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 'bold', letterSpacing: 3, textTransform: 'uppercase',
            opacity: .5, marginBottom: 14 }}>
            ⏳ Εκκρεμείς ({pendingPolls.length} / 122)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {pendingPolls.map(p => (
              <PendingRow
                key={p.pollNum}
                poll={p}
                hasSubmission={submittedPollNums.has(p.pollNum)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Forecast banner — compact, percentages only ───────────────────────────────
function ForecastBanner({ forecast: f }) {
  const { rankedForecast, pctComplete, confidence, confidenceColor, totalSynolo } = f
  const nikoFirst = rankedForecast[0]?.key === 'nikoletta'

  return (
    <div style={{ maxWidth: 1200, margin: '16px auto 0', padding: '0 20px' }}>
      <div style={{
        background: 'rgba(255,255,255,.04)',
        border: `1px solid ${nikoFirst ? 'rgba(69,192,172,.25)' : 'rgba(239,68,68,.2)'}`,
        borderRadius: 12,
        padding: '12px 18px',
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, letterSpacing: 2, color: TEAL, fontWeight: 'bold', textTransform: 'uppercase' }}>
            🔮 Πρόβλεψη
          </span>
          <span style={{ fontSize: 10, opacity: .4 }}>
            {Math.round(pctComplete)}% σε · εμπιστοσύνη:
          </span>
          <span style={{ fontSize: 10, fontWeight: 'bold', color: confidenceColor }}>
            {confidence}
          </span>
          {/* Progress bar */}
          <div style={{ flex: 1, minWidth: 80, background: 'rgba(255,255,255,.08)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${Math.min(pctComplete, 100)}%`,
              background: `linear-gradient(90deg, ${TEAL}, ${confidenceColor})`,
              transition: 'width .7s ease',
            }} />
          </div>
        </div>

        {/* Candidates as horizontal pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {rankedForecast.map((c, i) => {
            const sharePct = totalSynolo > 0 ? Math.round((c.current / totalSynolo) * 100) : 0
            const isTop  = i === 0
            const isNiko = c.key === 'nikoletta'
            const barColor = isTop ? (isNiko ? GREEN : RED) : (isNiko && !isTop ? RED : c.color)
            return (
              <div key={c.key} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: isTop ? `${barColor}18` : 'rgba(255,255,255,.04)',
                border: `1px solid ${isTop ? barColor + '50' : 'rgba(255,255,255,.08)'}`,
                borderRadius: 20, padding: '4px 10px',
              }}>
                <span style={{ fontSize: 12, lineHeight: 1 }}>{['🥇','🥈','🥉','4ος','5ος'][i]}</span>
                {isNiko && (
                  <img src="/dermlux-waitlist/nikoletta.png" alt=""
                    style={{ width: 18, height: 18, borderRadius: '50%',
                      objectFit: 'cover', objectPosition: 'top center',
                      border: `1px solid ${TEAL}`, flexShrink: 0 }} />
                )}
                <span style={{ fontSize: isTop ? 12 : 11, fontWeight: isTop ? 'bold' : 'normal',
                  opacity: isTop ? 1 : .7 }}>
                  {c.label}
                </span>
                <span style={{ fontSize: isTop ? 15 : 13, fontWeight: 'bold', color: barColor }}>
                  {sharePct}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Approved row: green if Νικολέττα 1st, red if 2nd ─────────────────────────
function ApprovedRow({ result: r }) {
  const pos      = nikolettaPos(r)
  const isFirst  = pos === 0
  const isSecond = pos === 1

  const border = isFirst ? `${GREEN}50` : isSecond ? `${RED}50` : 'rgba(255,255,255,.08)'
  const bg     = isFirst ? 'rgba(34,197,94,.1)' : isSecond ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.04)'
  const badge  = isFirst ? '🟢 1η' : isSecond ? '🔴 2η' : '⚪'
  const nikoColor = isFirst ? GREEN : isSecond ? RED : TEAL

  return (
    <div style={{ background: bg, borderRadius: 10, border: `1px solid ${border}`,
      padding: '10px 14px', animation: 'fadeIn .4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 'bold' }}>{r.centerName}</span>
        <span style={{ fontSize: 11, opacity: .4 }}>{r.centerArea}</span>
        <span style={{ background: `${TEAL}20`, border: `1px solid ${TEAL}40`,
          color: TEAL, borderRadius: 10, padding: '1px 8px', fontSize: 10, fontWeight: 'bold' }}>
          {r.pollName} #{r.pollNum}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 'bold',
          color: isFirst ? GREEN : isSecond ? RED : '#888' }}>{badge}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {CANDIDATES.map(c => r[c.key] != null && (
          <div key={c.key} style={{ textAlign: 'center', minWidth: 40 }}>
            <div style={{ fontSize: 10, opacity: .4, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontWeight: 'bold', fontSize: 16,
              color: c.key === 'nikoletta' ? nikoColor : c.color }}>
              {r[c.key]}
            </div>
          </div>
        ))}
        {r.synolo != null && (
          <div style={{ textAlign: 'center', minWidth: 40, marginLeft: 'auto' }}>
            <div style={{ fontSize: 10, opacity: .4, marginBottom: 2 }}>Σύνολο</div>
            <div style={{ fontWeight: 'bold', fontSize: 16, opacity: .5 }}>{r.synolo}</div>
          </div>
        )}
      </div>
      {(r.lefka != null || r.akyra != null) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {r.lefka != null && (
            <div style={{ fontSize: 11, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '2px 8px', color: 'rgba(255,255,255,.45)' }}>
              Λευκά: <strong style={{ color: 'rgba(255,255,255,.7)' }}>{r.lefka}</strong>
            </div>
          )}
          {r.akyra != null && (
            <div style={{ fontSize: 11, background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '2px 8px', color: 'rgba(255,255,255,.45)' }}>
              Άκυρα: <strong style={{ color: 'rgba(255,255,255,.7)' }}>{r.akyra}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Pending row: compact, one line, orange dot if submitted to Firestore ───────
function PendingRow({ poll: p, hasSubmission }) {
  return (
    <div style={{
      background: hasSubmission ? 'rgba(251,191,36,.06)' : 'rgba(255,255,255,.03)',
      borderRadius: 8,
      border: hasSubmission ? '1px solid rgba(251,191,36,.3)' : '1px solid rgba(255,255,255,.06)',
      padding: '7px 12px',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {/* Status dot */}
      <span style={{
        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
        background: hasSubmission ? '#fbbf24' : 'rgba(255,255,255,.2)',
        animation: hasSubmission ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }} />
      {/* Poll number */}
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', minWidth: 20 }}>#{p.pollNum}</span>
      {/* Center name */}
      <span style={{ fontSize: 12, fontWeight: hasSubmission ? 'bold' : 'normal',
        color: hasSubmission ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.45)',
        flex: 1 }}>
        {p.centerName}
      </span>
      {/* Poll name */}
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', whiteSpace: 'nowrap' }}>
        {p.pollName}
      </span>
      {/* Submitted badge */}
      {hasSubmission && (
        <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
          παραλήφθηκε
        </span>
      )}
    </div>
  )
}
