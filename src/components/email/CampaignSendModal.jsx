import { useState, useEffect } from 'react'
import {
  collection, getDocs, query, where,
  doc, updateDoc, writeBatch, serverTimestamp, increment,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { contactDocId, isActiveContact } from '../../utils/emailValidation'

const WORKER_URL = import.meta.env.VITE_WORKER_URL
const BATCH_SIZE = 100

/**
 * Flow: preview → confirm → sending → done (partial or complete)
 *
 * Smart batching: checks who already received this campaign and only
 * sends to the remaining contacts, 100 at a time.
 */
export default function CampaignSendModal({ campaign, onClose }) {
  const [loading, setLoading]       = useState(true)
  const [remaining, setRemaining]   = useState([])   // contacts who haven't received this campaign
  const [alreadySent, setAlreadySent] = useState(0)  // how many already sent in previous batches
  const [step, setStep]             = useState('preview')
  const [progress, setProgress]     = useState(0)
  const [sentCount, setSentCount]   = useState(0)
  const [failCount, setFailCount]   = useState(0)
  const [error, setError]           = useState('')

  useEffect(() => {
    async function load() {
      try {
        // 1. All active contacts
        const contactsSnap = await getDocs(
          query(collection(db, 'email_contacts'), where('status', '==', 'active'))
        )
        const active = contactsSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => isActiveContact(c.status))

        // 2. Who already received THIS campaign
        const sendsSnap = await getDocs(
          query(collection(db, 'email_sends'), where('campaignId', '==', campaign.id))
        )
        const sentEmails = new Set(sendsSnap.docs.map(d => d.data().email))

        // 3. Only contacts not yet sent to
        const rem = active.filter(c => !sentEmails.has(c.email))

        setAlreadySent(sentEmails.size)
        setRemaining(rem)
        setLoading(false)
      } catch (e) {
        setError(e.message)
        setLoading(false)
      }
    }
    load()
  }, [campaign.id])

  // The batch we'll actually send now (first 100 of remaining)
  const thisBatch = remaining.slice(0, BATCH_SIZE)
  const afterThis = remaining.length - thisBatch.length

  const sampleHtml = (campaign.htmlBody || '')
    .replaceAll('{{name}}', 'Αγαπητέ Πελάτη')
    .replaceAll('{{unsubscribe_url}}', '#')

  async function handleSend() {
    if (!WORKER_URL || WORKER_URL.includes('YOUR-SUBDOMAIN')) {
      setError('Το VITE_WORKER_URL δεν έχει οριστεί.')
      return
    }
    setStep('sending')
    setError('')

    const isFirstBatch = campaign.status === 'draft'

    // Mark as sending; on first batch set the total
    const campaignUpdate = {
      status:        'sending',
      'stats.total': isFirstBatch ? remaining.length : (campaign.stats?.total ?? remaining.length + alreadySent),
    }
    if (isFirstBatch) campaignUpdate.sentAt = serverTimestamp()
    await updateDoc(doc(db, 'email_campaigns', campaign.id), campaignUpdate)

    let totalSent   = 0
    let totalFailed = 0

    try {
      const res = await fetch(`${WORKER_URL}/send-campaign`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          campaign: {
            subject:   campaign.subject,
            fromName:  campaign.fromName,
            fromEmail: campaign.fromEmail,
            htmlBody:  campaign.htmlBody,
          },
          contacts: thisBatch.map(c => ({ id: c.id, email: c.email, name: c.name || '' })),
        }),
      })

      if (!res.ok) throw new Error(`Worker error: ${await res.text()}`)

      const { results } = await res.json()

      const batchSent   = results.filter(r => r.status === 'sent').length
      const batchFailed = results.filter(r => r.status === 'failed').length
      totalSent   = batchSent
      totalFailed = batchFailed
      setSentCount(batchSent)
      setFailCount(batchFailed)
      setProgress(100)

      // Write email_sends docs
      const FSWRITE = 500
      for (let i = 0; i < results.length; i += FSWRITE) {
        const chunk = results.slice(i, i + FSWRITE)
        const batch = writeBatch(db)
        chunk.forEach(r => {
          const sendId = `${campaign.id}||${r.email}`
          batch.set(doc(db, 'email_sends', sendId), {
            campaignId:   campaign.id,
            contactId:    contactDocId(r.email),
            email:        r.email,
            resendId:     r.resendId || null,
            status:       r.status,
            sentAt:       serverTimestamp(),
            failedReason: r.error || null,
            openedAt:     null,
            clickedAt:    null,
            bouncedAt:    null,
            createdAt:    serverTimestamp(),
          })
        })
        await batch.commit()
      }

      // Update campaign stats (always increment, never overwrite)
      const isDone = afterThis === 0
      await updateDoc(doc(db, 'email_campaigns', campaign.id), {
        status:         isDone ? 'sent' : 'partial',
        'stats.sent':   increment(totalSent),
        'stats.failed': increment(totalFailed),
      })

      setStep('done')
    } catch (e) {
      setError(e.message)
      // Revert to previous status
      await updateDoc(doc(db, 'email_campaigns', campaign.id), {
        status: alreadySent > 0 ? 'partial' : 'draft',
      }).catch(() => {})
      setStep('confirm')
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <ModalShell onClose={onClose} title="Αποστολή Καμπάνιας">
        <div className="text-center py-10 text-gray-400">Φόρτωση επαφών…</div>
      </ModalShell>
    )
  }

  // ── Nothing left to send ──────────────────────────────────────────────────────
  if (!loading && remaining.length === 0) {
    return (
      <ModalShell onClose={onClose} title="Αποστολή Ολοκληρώθηκε">
        <div className="text-center py-8 space-y-3">
          <div className="text-5xl">✅</div>
          <div className="text-lg font-semibold text-green-700">Όλες οι επαφές έχουν λάβει αυτή την καμπάνια!</div>
          <div className="text-sm text-gray-500">{alreadySent} επαφές έχουν ήδη λάβει αυτό το email.</div>
          <button className="btn-primary mt-2" onClick={onClose}>Κλείσιμο</button>
        </div>
      </ModalShell>
    )
  }

  // ── Done (batch finished) ─────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <ModalShell onClose={onClose} title={afterThis === 0 ? 'Αποστολή Ολοκληρώθηκε' : 'Batch Στάλθηκε'}>
        <div className="text-center py-6 space-y-4">
          <div className="text-5xl">{afterThis === 0 ? '✅' : '⏸️'}</div>
          <div className={`text-lg font-semibold ${afterThis === 0 ? 'text-green-700' : 'text-blue-700'}`}>
            {afterThis === 0 ? 'Η καμπάνια ολοκληρώθηκε!' : `${sentCount} emails στάλθηκαν`}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Στάλθηκαν τώρα</span>
              <span className="font-semibold text-green-600">{sentCount}</span>
            </div>
            {failCount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Αποτυχίες</span>
                <span className="font-semibold text-red-500">{failCount}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-1.5">
              <span className="text-gray-500">Εναπομένουν</span>
              <span className={`font-semibold ${afterThis > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                {afterThis}
              </span>
            </div>
          </div>

          {afterThis > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
              Επιστρέψτε αργότερα και πατήστε <strong>"Συνέχεια Αποστολής"</strong> για να στείλετε τα επόμενα {Math.min(afterThis, BATCH_SIZE)} emails.
            </div>
          )}

          <button className="btn-primary w-full" onClick={onClose}>Κλείσιμο</button>
        </div>
      </ModalShell>
    )
  }

  // ── Sending progress ──────────────────────────────────────────────────────────
  if (step === 'sending') {
    return (
      <ModalShell title="Αποστολή σε εξέλιξη…">
        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-blue-700">Αποστολή {thisBatch.length} emails…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{sentCount}</div>
              <div className="text-xs text-gray-500">Στάλθηκαν</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{failCount}</div>
              <div className="text-xs text-gray-500">Αποτυχίες</div>
            </div>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}
        </div>
      </ModalShell>
    )
  }

  // ── Preview + Confirm ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mt-4 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Αποστολή Καμπάνιας</h2>
            {alreadySent > 0 && (
              <div className="text-xs text-orange-600 mt-0.5">
                Συνέχεια — {alreadySent} έχουν ήδη λάβει αυτό το email
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Step tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-sm">
            <button
              onClick={() => setStep('preview')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                step === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>
              👁 Προεπισκόπηση
            </button>
            <button
              onClick={() => setStep('confirm')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                step === 'confirm' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}>
              📤 Αποστολή
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-4">

          {/* ── PREVIEW ── */}
          {step === 'preview' && (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="text-xs text-gray-400 mb-0.5">Θέμα</div>
                  <div className="font-medium text-gray-800 truncate">{campaign.subject}</div>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="text-xs text-gray-400 mb-0.5">Αποστολέας</div>
                  <div className="font-medium text-gray-800 truncate">{campaign.fromName}</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner"
                   style={{ height: '460px' }}>
                {sampleHtml.trim() ? (
                  <iframe
                    srcDoc={sampleHtml}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                    title="Email Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Δεν υπάρχει περιεχόμενο για προεπισκόπηση
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-sm text-gray-500">
                  Αυτό το batch:{' '}
                  <span className="font-bold text-blue-700">{thisBatch.length} επαφές</span>
                  {afterThis > 0 && (
                    <span className="text-gray-400 ml-1">({afterThis} για επόμενη φορά)</span>
                  )}
                </div>
                <button className="btn-primary" onClick={() => setStep('confirm')}>
                  Συνέχεια →
                </button>
              </div>
            </>
          )}

          {/* ── CONFIRM ── */}
          {step === 'confirm' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
                <div><span className="font-medium text-gray-700">Καμπάνια:</span> {campaign.name}</div>
                <div><span className="font-medium text-gray-700">Θέμα:</span> {campaign.subject}</div>
                <div>
                  <span className="font-medium text-gray-700">Από:</span>{' '}
                  {campaign.fromName} &lt;{campaign.fromEmail}&gt;
                </div>
                <div className="border-t border-blue-200 pt-2 grid grid-cols-3 text-center gap-2">
                  <div>
                    <div className="text-lg font-bold text-blue-700">{thisBatch.length}</div>
                    <div className="text-xs text-gray-500">Θα σταλούν τώρα</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-400">{alreadySent}</div>
                    <div className="text-xs text-gray-500">Ήδη στάλθηκαν</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-500">{afterThis}</div>
                    <div className="text-xs text-gray-500">Για επόμενο batch</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                ⚠️ Θα σταλεί σε <strong>{thisBatch.length}</strong> επαφές. Αυτή η ενέργεια δεν αναιρείται.
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button className="btn-secondary flex-1" onClick={() => setStep('preview')}>
                  ← Προεπισκόπηση
                </button>
                <button className="btn-primary flex-1" onClick={handleSend}>
                  📤 Αποστολή {thisBatch.length} emails
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

function ModalShell({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
