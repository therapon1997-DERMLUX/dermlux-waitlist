import { useState, useMemo } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { ALL_CENTERS, POLL_LOOKUP } from '../data/electionData'

const CANDIDATES = [
  { key: 'synolo',     label: 'Σύνολο κάλπης' },
  { key: 'nikoletta',  label: 'Νικολέττα' },
  { key: 'pazaros',    label: 'Χ.Πάζαρος' },
  { key: 'koupparis',  label: 'Κούππαρης' },
  { key: 'karseras',   label: 'Καρσεράς' },
  { key: 'giorgos',    label: 'Γιώργος' },
]

const EMPTY_VOTES = Object.fromEntries(CANDIDATES.map(c => [c.key, '']))

export default function BallotSubmit() {
  const [name,       setName]       = useState('')
  const [surname,    setSurname]    = useState('')
  const [phone,      setPhone]      = useState('')
  const [centerAA,   setCenterAA]   = useState('')
  const [pollNum,    setPollNum]    = useState('')
  const [votes,      setVotes]      = useState(EMPTY_VOTES)
  const [comments,   setComments]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState(null)

  const selectedCenter = useMemo(
    () => ALL_CENTERS.find(c => c.aa === centerAA) || null,
    [centerAA]
  )
  const polls = useMemo(
    () => (centerAA ? POLL_LOOKUP[centerAA] || [] : []),
    [centerAA]
  )

  function handleCenterChange(aa) {
    setCenterAA(aa)
    setPollNum('')
  }

  function handleVote(key, val) {
    if (val !== '' && !/^\d+$/.test(val)) return
    setVotes(v => ({ ...v, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !surname.trim() || !centerAA || !pollNum || !phone.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const selectedPoll = polls.find(p => String(p.num) === String(pollNum))
      const voteNums = Object.fromEntries(
        CANDIDATES.map(c => [c.key, votes[c.key] === '' ? null : Number(votes[c.key])])
      )
      await addDoc(collection(db, 'ballot_results'), {
        reporterName: name.trim() + ' ' + surname.trim(),
        reporterPhone: phone.trim(),
        centerAA,
        centerName: selectedCenter?.name || '',
        centerArea: selectedCenter?.area || '',
        pollNum: Number(pollNum),
        pollName: selectedPoll?.name || '',
        ...voteNums,
        comments: comments.trim(),
        timestamp: serverTimestamp(),
        status: 'pending',
        seen: false,
      })
      setSubmitted(true)
    } catch (err) {
      setError('Σφάλμα αποστολής. Δοκιμάστε ξανά.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setName(''); setSurname(''); setCenterAA(''); setPollNum('')
    setVotes(EMPTY_VOTES); setComments(''); setSubmitted(false); setError(null)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 40, maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,.12)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1a3a6b', marginBottom: 8 }}>
            Καταχωρήθηκε!
          </h2>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 24 }}>
            Τα αποτελέσματα στάλθηκαν επιτυχώς.
          </p>
          <div style={{ background: '#f0f4f8', borderRadius: 10, padding: '14px 18px', textAlign: 'left', fontSize: 14, color: '#333', marginBottom: 24 }}>
            <div><strong>Εκλογικό Κέντρο:</strong> {selectedCenter?.name}</div>
            <div><strong>Τηλέφωνο:</strong> {phone}</div>
            <div><strong>Κάλπη:</strong> {polls.find(p => String(p.num) === String(pollNum))?.name} #{pollNum}</div>
            {Object.entries(votes).map(([key, val]) => {
              const cand = CANDIDATES.find(c => c.key === key)
              return val !== '' ? (
                <div key={key}><strong>{cand?.label}:</strong> {val}</div>
              ) : null
            })}
          </div>
          <button
            onClick={handleReset}
            style={{ padding: '10px 28px', background: '#1a3a6b', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}
          >
            Νέα Καταχώρηση
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #0e2450 0%, #1B4080 100%)', color: 'white', padding: '20px 16px', textAlign: 'center', borderBottom: '3px solid #45C0AC' }}>
        <img src="/dermlux-waitlist/nikoletta.png" alt="Νικολέττα"
          style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center', border: '2px solid #45C0AC', marginBottom: 10 }} />
        <h1 style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>🗳️ Αποτελέσματα Καταμέτρησης</h1>
        <p style={{ fontSize: 12, opacity: 0.75, marginTop: 5, marginBottom: 0 }}>Βουλευτικές Εκλογές 2026 · Επαρχία Πάφου</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 540, margin: '28px auto', padding: '0 16px 40px' }}>

        {/* Reporter */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <div style={{ fontWeight: 'bold', fontSize: 14, color: '#1a3a6b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            👤 Στοιχεία Αναφέροντος
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Όνομα *</label>
              <input
                style={inputStyle}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="π.χ. Γιώργος"
                required
                autoComplete="off"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Επίθετο *</label>
              <input
                style={inputStyle}
                value={surname}
                onChange={e => setSurname(e.target.value)}
                placeholder="π.χ. Παπαδόπουλος"
                required
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Τηλέφωνο *</label>
            <input
              style={inputStyle}
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="π.χ. 99 123456"
              required
              autoComplete="off"
            />
          </div>
        </div>

        {/* Location */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <div style={{ fontWeight: 'bold', fontSize: 14, color: '#1a3a6b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 Εκλογικό Κέντρο
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Εκλογικό Κέντρο *</label>
            <select
              style={inputStyle}
              value={centerAA}
              onChange={e => handleCenterChange(e.target.value)}
              required
            >
              <option value="">— Επιλέξτε κέντρο —</option>
              {ALL_CENTERS.map(c => (
                <option key={c.aa} value={c.aa}>
                  {c.name} ({c.area})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Κάλπη *</label>
            <select
              style={{ ...inputStyle, background: !centerAA ? '#f5f5f5' : 'white', color: !centerAA ? '#aaa' : '#222' }}
              value={pollNum}
              onChange={e => setPollNum(e.target.value)}
              required
              disabled={!centerAA}
            >
              <option value="">— Επιλέξτε κάλπη —</option>
              {polls.map(p => (
                <option key={p.num} value={p.num}>
                  {p.name} #{p.num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Votes */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <div style={{ fontWeight: 'bold', fontSize: 14, color: '#1a3a6b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            📊 Αριθμός Ψήφων
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CANDIDATES.map((cand, i) => (
              <div
                key={cand.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: i === 0 ? '#f0f4fb' : '#fafafa',
                  borderRadius: 8,
                  border: i === 0 ? '1px solid #c0cfea' : '1px solid #eee',
                }}
              >
                <label style={{
                  flex: 1, fontSize: 14,
                  fontWeight: i === 0 ? 'bold' : 'normal',
                  color: i === 0 ? '#1a3a6b' : '#333',
                }}>
                  {cand.label}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={votes[cand.key]}
                  onChange={e => handleVote(cand.key, e.target.value)}
                  placeholder="0"
                  style={{
                    width: 80, padding: '7px 10px', border: '1px solid #ccc', borderRadius: 6,
                    fontSize: 16, fontWeight: 'bold', textAlign: 'center',
                    fontFamily: 'Arial, sans-serif',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <div style={{ fontWeight: 'bold', fontSize: 14, color: '#1a3a6b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            💬 Σχόλια
          </div>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Προαιρετικά σχόλια…"
          />
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#b91c1c', fontSize: 14, marginBottom: 14 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !name.trim() || !surname.trim() || !centerAA || !pollNum}
          style={{
            width: '100%', padding: '14px', background: '#1a3a6b', color: 'white',
            border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 'bold',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: (submitting || !name.trim() || !surname.trim() || !phone.trim() || !centerAA || !pollNum) ? 0.55 : 1,
            transition: 'opacity .15s',
          }}
        >
          {submitting ? '⏳ Αποστολή…' : '✔ Υποβολή Αποτελεσμάτων'}
        </button>
      </form>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 5,
}

const inputStyle = {
  width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6,
  fontSize: 14, fontFamily: 'Arial, sans-serif', boxSizing: 'border-box',
}
