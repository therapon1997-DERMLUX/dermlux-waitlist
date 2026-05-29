import { useState, useEffect } from 'react'

const WORKER_URL = import.meta.env.VITE_WORKER_URL

export default function UnsubscribePage() {
  const [phase, setPhase]     = useState('loading') // loading | confirm | done | error
  const [contactId, setContactId] = useState(null)
  const [errorMsg, setErrorMsg]   = useState('')

  useEffect(() => {
    // Hash-based routing: /#/unsubscribe?c=...
    const hash   = window.location.hash // e.g. #/unsubscribe?c=abc123
    const qStart = hash.indexOf('?')
    const params = new URLSearchParams(qStart >= 0 ? hash.slice(qStart + 1) : '')
    const c = params.get('c')

    if (!c) {
      setErrorMsg('Μη έγκυρος σύνδεσμος διαγραφής.')
      setPhase('error')
      return
    }
    setContactId(c)
    setPhase('confirm')
  }, [])

  async function handleUnsubscribe() {
    setPhase('loading')
    try {
      if (!WORKER_URL || WORKER_URL.includes('YOUR-SUBDOMAIN')) {
        throw new Error('Το σύστημα email δεν έχει ρυθμιστεί ακόμα.')
      }
      const res = await fetch(`${WORKER_URL}/unsubscribe`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ contactId }),
      })
      if (!res.ok) throw new Error(await res.text())
      setPhase('done')
    } catch (e) {
      setErrorMsg(e.message)
      setPhase('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8 text-center space-y-5">

        {/* Logo / brand */}
        <div className="text-2xl font-bold text-gray-800 tracking-tight">Dermlux</div>

        {phase === 'loading' && (
          <div className="py-8 space-y-3">
            <div className="text-3xl animate-pulse">⏳</div>
            <div className="text-gray-500 text-sm">Επεξεργασία…</div>
          </div>
        )}

        {phase === 'confirm' && (
          <div className="space-y-5">
            <div className="text-4xl">📧</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Διαγραφή από τη λίστα</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Εάν επιβεβαιώσετε, δεν θα λαμβάνετε πλέον
                ενημερωτικά emails από τη Dermlux.
              </p>
            </div>
            <button
              onClick={handleUnsubscribe}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors">
              Επιβεβαίωση Διαγραφής
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Ακύρωση
            </button>
          </div>
        )}

        {phase === 'done' && (
          <div className="space-y-4 py-4">
            <div className="text-5xl">✅</div>
            <h1 className="text-xl font-semibold text-green-700">Έγινε!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Έχετε αφαιρεθεί επιτυχώς από τη λίστα αλληλογραφίας μας.
              Δεν θα λαμβάνετε πλέον emails από τη Dermlux.
            </p>
          </div>
        )}

        {phase === 'error' && (
          <div className="space-y-4 py-4">
            <div className="text-4xl">❌</div>
            <h1 className="text-xl font-semibold text-red-600">Σφάλμα</h1>
            <p className="text-gray-500 text-sm">{errorMsg || 'Κάτι πήγε στραβά. Δοκιμάστε αργότερα.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
