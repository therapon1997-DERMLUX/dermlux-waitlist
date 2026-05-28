import { useState } from 'react'
import VoteContacts from './VoteContacts'
import EklogikáKentra from './ekloges/EklogikáKentra'
import BallotResults from './BallotResults'

const ARCHIVE_PASSWORD = '2321'

const TABS = [
  { key: 'ekloges',      label: '🗳️ Εκλογές' },
  { key: 'psifofori',    label: '👥 Ψηφοφόροι' },
  { key: 'apotelesmata', label: '📊 Αποτελέσματα' },
  { key: 'epafes',       label: '📋 Βάση Επαφών' },
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🗳️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Εκλογές 2026</h2>
          <p className="text-gray-500 text-sm mb-6">Εισάγετε τον κωδικό πρόσβασης.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false) }}
              placeholder="Κωδικός"
              className={`border rounded-lg px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 ${
                error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">Λάθος κωδικός. Προσπαθήστε ξανά.</p>}
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Είσοδος
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab bar */}
      <div className="bg-white border-b shadow-sm">
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'ekloges'      && <EklogikáKentra />}
        {activeTab === 'psifofori'    && <VoteContacts />}
        {activeTab === 'apotelesmata' && <BallotResults />}
        {activeTab === 'epafes'       && (
          <iframe
            src="/dermlux-waitlist/epafes.html?v=2"
            title="Βάση Επαφών 2026"
            className="w-full border-0"
            style={{ height: 'calc(100vh - 105px)' }}
          />
        )}
      </div>
    </div>
  )
}
