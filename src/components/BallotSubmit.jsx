import { useState, useMemo, useRef, useEffect } from 'react'
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
  { key: 'lefka',      label: 'Λευκά' },
  { key: 'akyra',      label: 'Άκυρα' },
]

const EMPTY_VOTES = Object.fromEntries(CANDIDATES.map(c => [c.key, '']))

export default function BallotSubmit() {
  const [name,         setName]         = useState('')
  const [surname,      setSurname]      = useState('')
  const [phone,        setPhone]        = useState('')
  const [centerAA,     setCenterAA]     = useState('')
  const [centerSearch, setCenterSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [pollNum,      setPollNum]      = useState('')
  const [votes,        setVotes]        = useState(EMPTY_VOTES)
  const [comments,     setComments]     = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [error,        setError]        = useState(null)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedCenter = useMemo(
    () => ALL_CENTERS.find(c => c.aa === centerAA) || null,
    [centerAA]
  )
  const polls = useMemo(
    () => (centerAA ? POLL_LOOKUP[centerAA] || [] : []),
    [centerAA]
  )

  const filteredCenters = useMemo(() => {
    const q = centerSearch.toLowerCase().trim()
    if (!q) return ALL_CENTERS
    return ALL_CENTERS.filter(c =>
      c.name.toLowerCase().includes(q) || c.area.toLowerCase().includes(q)
    )
  }, [centerSearch])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleCenterSelect(aa, name, area) {
    setCenterAA(aa)
    setCenterSearch(`${name} (${area})`)
    setShowDropdown(false)
    setPollNum('')
  }

  function handleCenterSearchChange(val) {
    setCenterSearch(val)
    setCenterAA('')   // clear selection when typing
    setPollNum('')
    setShowDropdown(true)
  }

  function handleVote(key, val) {
    if (val !== '' && !/^\d+$/.test(val)) return
    setVotes(prev => {
      const next = { ...prev, [key]: val }
      // Auto-calculate synolo from all candidate + lefka + akyra fields
      if (key !== 'synolo') {
        const candidateKeys = ['nikoletta', 'pazaros', 'koupparis', 'karseras', 'giorgos', 'lefka', 'akyra']
        const sum = candidateKeys.reduce((s, k) => s + (next[k] !== '' ? Number(next[k]) : 0), 0)
        next.synolo = sum > 0 ? String(sum) : ''
      }
      return next
    })
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
    setName(''); setSurname(''); setCenterAA(''); setCenterSearch('')
    setPollNum(''); setVotes(EMPTY_VOTES); setComments('')
    setSubmitted(false); setError(null)
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

          <div style={{ marginBottom: 12, position: 'relative' }} ref={dropdownRef}>
            <label style={labelStyle}>Εκλογικό Κέντρο *</label>
            <div style={{ position: 'relative' }}>
              <input
                ref={searchRef}
                style={{
                  ...inputStyle,
                  paddingRight: 32,
                  borderColor: showDropdown ? '#1a3a6b' : '#ccc',
                  borderRadius: showDropdown && filteredCenters.length > 0 ? '6px 6px 0 0' : 6,
                }}
                value={centerSearch}
                onChange={e => handleCenterSearchChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="Αναζήτηση κέντρου ή περιοχής…"
                autoComplete="off"
              />
              {/* Clear / caret icon */}
              <span
                onClick={() => { setCenterSearch(''); setCenterAA(''); setPollNum(''); searchRef.current?.focus(); setShowDropdown(true) }}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  cursor: 'pointer', color: '#aaa', fontSize: 14, userSelect: 'none' }}
              >
                {centerSearch ? '✕' : '▾'}
              </span>
            </div>

            {/* Dropdown list */}
            {showDropdown && (
              <div style={{
                position: 'absolute', zIndex: 100, left: 0, right: 0,
                background: 'white', border: '1px solid #1a3a6b', borderTop: 'none',
                borderRadius: '0 0 6px 6px',
                maxHeight: 220, overflowY: 'auto',
                boxShadow: '0 6px 20px rgba(0,0,0,.12)',
              }}>
                {filteredCenters.length === 0 ? (
                  <div style={{ padding: '10px 12px', color: '#aaa', fontSize: 13 }}>
                    Δεν βρέθηκαν αποτελέσματα
                  </div>
                ) : filteredCenters.map(c => (
                  <div
                    key={c.aa}
                    onMouseDown={() => handleCenterSelect(c.aa, c.name, c.area)}
                    style={{
                      padding: '9px 12px', cursor: 'pointer', fontSize: 13,
                      background: c.aa === centerAA ? '#eef2fb' : 'white',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f7ff'}
                    onMouseLeave={e => e.currentTarget.style.background = c.aa === centerAA ? '#eef2fb' : 'white'}
                  >
                    <div style={{ fontWeight: c.aa === centerAA ? 'bold' : 'normal', color: '#1a3a6b' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{c.area}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden required input for form validation */}
            <input type="text" required value={centerAA} readOnly style={{ opacity: 0, height: 0, position: 'absolute' }} tabIndex={-1} />
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
            {CANDIDATES.map((cand, i) => {
              const isSynolo = cand.key === 'synolo'
              return (
                <div
                  key={cand.key}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px',
                    background: isSynolo ? '#f0f4fb' : '#fafafa',
                    borderRadius: 8,
                    border: isSynolo ? '1px solid #c0cfea' : '1px solid #eee',
                  }}
                >
                  <label style={{
                    flex: 1, fontSize: 14,
                    fontWeight: isSynolo ? 'bold' : 'normal',
                    color: isSynolo ? '#1a3a6b' : '#333',
                  }}>
                    {cand.label}
                    {isSynolo && <span style={{ fontSize: 10, fontWeight: 'normal', color: '#888', marginLeft: 6 }}>αυτόματο</span>}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    value={votes[cand.key]}
                    onChange={e => handleVote(cand.key, e.target.value)}
                    placeholder="0"
                    readOnly={isSynolo}
                    style={{
                      width: 80, padding: '7px 10px', borderRadius: 6,
                      fontSize: 16, fontWeight: 'bold', textAlign: 'center',
                      fontFamily: 'Arial, sans-serif',
                      border: isSynolo ? '1px solid #a0b4d6' : '1px solid #ccc',
                      background: isSynolo ? '#dce8f8' : 'white',
                      color: isSynolo ? '#1a3a6b' : '#222',
                      cursor: isSynolo ? 'default' : 'text',
                    }}
                  />
                </div>
              )
            })}
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
