import { useState } from 'react'
import PublicResults from './PublicResults'

const ARCHIVE_PASSWORD = '2321'

export default function ElectionArchive() {
  const [input, setInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)

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

  if (unlocked) return <PublicResults />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🗳️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Αρχείο Εκλογών 2026</h2>
        <p className="text-gray-500 text-sm mb-6">Εισάγετε τον κωδικό πρόσβασης για να δείτε τα αποτελέσματα.</p>
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
