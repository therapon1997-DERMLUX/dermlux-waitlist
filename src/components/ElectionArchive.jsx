import { useState } from 'react'
import VoteContacts from './VoteContacts'
import EklogikáKentra from './ekloges/EklogikáKentra'
import BallotResults from './BallotResults'

const ARCHIVE_PASSWORD = '2321'

const TABS = [
  { key: 'epafes',       label: 'Βάση Επαφών', icon: '📋' },
  { key: 'ekloges',      label: 'Εκλογές',      icon: '🗳️' },
  { key: 'psifofori',    label: 'Ψηφοφόροι',    icon: '👥' },
  { key: 'apotelesmata', label: 'Αποτελέσματα', icon: '📊' },
]

export default function ElectionArchive() {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [activeTab, setActiveTab] = useState('epafes')

  function handleSubmit(e) {
    e.preventDefault()
    if (input === ARCHIVE_PASSWORD) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🗳️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Εκλογές 2026</h2>
          <p className="text-gray-500 text-sm mb-6">Εισάγετε τον κωδικό πρόσβασης.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              inputMode="numeric"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              placeholder="••••"
              className={`border-2 rounded-xl px-4 py-4 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 ${
                error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">Λάθος κωδικός. Προσπαθήστε ξανά.</p>}
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
            >
              Είσοδος
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* ── Desktop top tab bar (hidden on mobile) ── */}
      <div className="hidden md:block bg-white border-b shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pt-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-blue-700 text-blue-700 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        {activeTab === 'ekloges'      && <EklogikáKentra />}
        {activeTab === 'psifofori'    && <VoteContacts />}
        {activeTab === 'apotelesmata' && <BallotResults />}
        {activeTab === 'epafes'       && (
          <iframe
            src="/dermlux-waitlist/epafes.html?v=3"
            title="Βάση Επαφών 2026"
            className="w-full border-0"
            style={{ height: '100%', minHeight: 'calc(100vh - 56px - 64px)' }}
          />
        )}
      </div>

      {/* ── Mobile bottom tab bar (hidden on desktop) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="leading-tight text-center px-1" style={{ fontSize: '10px' }}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}
