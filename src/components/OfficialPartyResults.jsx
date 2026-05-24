import { useEffect, useState } from 'react'
import { decode } from '@msgpack/msgpack'

// ── API config ────────────────────────────────────────────────────────────────
const API_BASE    = 'https://elections.goto.cy/api'
const ELECTION_ID = 190
const DISTRICT_ID = 6   // Παφός
const POLL_MS     = 3 * 60 * 1000
const PROXY       = url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`

// ── Hardcoded party list (from /api/elections/190/candidates/parties) ─────────
const PARTIES = {
  10527: { short: 'ΔΗΣΥ',      color: '#0b4596' },
  10520: { short: 'ΑΚΕΛ',      color: '#94172e' },
  10526: { short: 'ΔΗΚΟ',      color: '#e07c00' },
  10528: { short: 'ΕΔΕΚ',      color: '#107069' },
  10529: { short: 'ΕΛΑΜ',      color: '#1a6da9' },
  10531: { short: 'Οικολόγοι', color: '#02672b' },
  10524: { short: 'ΔΗ.ΠΑ.',    color: '#f5791f' },
  10537: { short: 'ΔΗΜΑΛ',     color: '#283891' },
  10535: { short: 'ΑΛΜΑ',      color: '#909e39' },
  10523: { short: 'Volt',      color: '#502379' },
  10525: { short: 'ΔΕΚ',       color: '#0b3d92' },
  10522: { short: 'ΑΜΕΣΗ ΔΗΜ', color: '#d9ad17' },
  10534: { short: 'Πράσινοι',  color: '#084507' },
  10542: { short: 'Λ.Α.Ε.',    color: '#888888' },
  10532: { short: 'ΠΑ.ΜΕ',    color: '#4169e1' },
  10533: { short: 'ΣΗΚΟΥΠΑΝΩ', color: '#ec7e23' },
  10536: { short: 'Α-Α.Α.Κ',  color: '#cc0000' },
  10530: { short: 'Ε.Π-Κ.Ε.Κ.Κ.', color: '#006953' },
  10519: { short: 'ΑΓΡΟΝΟΜΟ',  color: '#4a0819' },
}

// ── MessagePack schema indices (from /api/mappings) ───────────────────────────
// overviewResultsResponseDto
const OV_DISTRICT = 4

// nodeResultsResponseDto: [votesTargetId, results]
// resultResponseDto:      [partyResults(0), personResults(1), id(2), ...,
//                          validBallots(9), ..., completion(13), ...,
//                          ballotBoxesCounted(17), ballotBoxesTotal(18), ..., lastUpdate(21)]
// candidateResultResponseDto: [id(0), votes(1), votesPercent(2), ranking(3), ...]

async function fetchPaphosPartyResults() {
  const url = `${API_BASE}/elections/${ELECTION_ID}/results` +
    `?votesDistrictId=${DISTRICT_ID}&include-results-from=districts&include-results-for=parties`

  const res = await fetch(PROXY(url), { signal: AbortSignal.timeout(15000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const buffer = await res.arrayBuffer()
  const data   = decode(new Uint8Array(buffer))

  // Navigate to Paphos district results
  const districtResults = Array.isArray(data) ? data[OV_DISTRICT] : null
  if (!districtResults) throw new Error('No district results in response')

  const paphosNode = districtResults.find(n => Array.isArray(n) && n[0] === DISTRICT_ID)
  if (!paphosNode) throw new Error('Paphos district not found')

  const r = paphosNode[1]   // resultResponseDto
  const partyData = (r[0] || [])  // candidateResultResponseDto[]
    .map(p => ({
      id:    p[0],
      votes: p[1] ?? 0,
      pct:   typeof p[2] === 'number' ? +(p[2] * 100).toFixed(2) : 0,
    }))
    .filter(p => p.votes > 0)
    .sort((a, b) => b.votes - a.votes)

  return {
    parties:     partyData,
    validBallots: r[9]  ?? 0,
    blankBallots: r[5]  ?? 0,
    invalidBallots: r[7] ?? 0,
    completion:   typeof r[13] === 'number' ? +(r[13] * 100).toFixed(1) : 0,
    boxesCounted: r[17] ?? 0,
    boxesTotal:   r[18] ?? 0,
    lastUpdate:   r[21] ?? null,
    fetchedAt:    new Date(),
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function OfficialPartyResults() {
  const [data,      setData]      = useState(null)
  const [status,    setStatus]    = useState('loading')   // loading | ok | error | empty
  const [fetchedAt, setFetchedAt] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const result = await fetchPaphosPartyResults()
        if (cancelled) return
        if (result.parties.length === 0) {
          setStatus('empty')
        } else {
          setData(result)
          setStatus('ok')
        }
        setFetchedAt(new Date())
      } catch (e) {
        console.warn('OfficialPartyResults error:', e)
        if (!cancelled) setStatus('error')
      }
    }

    poll()
    const timer = setInterval(poll, POLL_MS)
    return () => { cancelled = true; clearInterval(timer) }
  }, [])

  const NAVY  = '#1B4080'
  const TEAL  = '#45C0AC'

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 8, marginBottom: 12,
  }

  // ── Loading / Error / Empty states ──
  if (status === 'loading') {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 20px' }}>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '16px 20px',
          border: '1px solid rgba(255,255,255,.08)', textAlign: 'center', color: 'rgba(255,255,255,.4)', fontSize: 13 }}>
          ⏳ Φόρτωση επίσημων αποτελεσμάτων Πάφου…
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 20px' }}>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 20px',
          border: '1px solid rgba(255,100,100,.2)', color: 'rgba(255,150,150,.6)', fontSize: 12 }}>
          ⚠️ Δεν ήταν δυνατή η σύνδεση με την επίσημη ιστοσελίδα αποτελεσμάτων
        </div>
      </div>
    )
  }

  if (status === 'empty' || !data) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 20px' }}>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 12, padding: '12px 20px',
          border: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.3)', fontSize: 12,
          display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🏛️</span>
          <span>Επίσημα αποτελέσματα Πάφου — Αναμονή καταμέτρησης…</span>
          {fetchedAt && (
            <span style={{ marginLeft: 'auto', opacity: .5, fontSize: 11 }}>
              {fetchedAt.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    )
  }

  const maxVotes = data.parties[0]?.votes || 1

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 20px' }}>
      <div style={{
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(69,192,172,.2)',
        borderRadius: 14,
        padding: '16px 20px',
      }}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: TEAL, fontWeight: 'bold',
              textTransform: 'uppercase', marginBottom: 3 }}>
              🏛️ Επίσημα Αποτελέσματα Πάφου — live.elections.moi.gov.cy
            </div>
            <div style={{ fontSize: 11, opacity: .4 }}>
              {data.boxesCounted} / {data.boxesTotal} κάλπες ({data.completion}%) ·
              {' '}{data.validBallots.toLocaleString('el-GR')} έγκυρες ψήφοι
              {data.blankBallots > 0 && ` · Λευκά: ${data.blankBallots}`}
              {data.invalidBallots > 0 && ` · Άκυρα: ${data.invalidBallots}`}
            </div>
          </div>
          <div style={{ fontSize: 10, opacity: .35 }}>
            ↻ {data.fetchedAt.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,.07)', borderRadius: 4, height: 4,
          overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ height: '100%', borderRadius: 4, background: TEAL,
            width: `${Math.min(data.completion, 100)}%`, transition: 'width .7s' }} />
        </div>

        {/* Party results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.parties.map((p, i) => {
            const party    = PARTIES[p.id]
            const name     = party?.short || `Κόμμα ${p.id}`
            const color    = party?.color || '#888'
            const barWidth = (p.votes / maxVotes) * 100

            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Rank */}
                <span style={{ fontSize: 11, opacity: .4, minWidth: 18, textAlign: 'right' }}>
                  {i + 1}
                </span>
                {/* Party name */}
                <span style={{ fontSize: 12, fontWeight: i < 3 ? 'bold' : 'normal',
                  minWidth: 90, opacity: i === 0 ? 1 : .8 }}>
                  {name}
                </span>
                {/* Bar */}
                <div style={{ flex: 1, background: 'rgba(255,255,255,.07)',
                  borderRadius: 3, height: i === 0 ? 10 : 7, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${barWidth}%`,
                    background: color,
                    opacity: i === 0 ? 1 : 0.75,
                    transition: 'width .7s',
                  }} />
                </div>
                {/* Percentage */}
                <span style={{ fontSize: i === 0 ? 14 : 12, fontWeight: i === 0 ? 'bold' : 'normal',
                  color: i === 0 ? color : 'rgba(255,255,255,.7)',
                  minWidth: 44, textAlign: 'right' }}>
                  {p.pct}%
                </span>
                {/* Votes */}
                <span style={{ fontSize: 11, opacity: .45, minWidth: 52, textAlign: 'right' }}>
                  {p.votes.toLocaleString('el-GR')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
