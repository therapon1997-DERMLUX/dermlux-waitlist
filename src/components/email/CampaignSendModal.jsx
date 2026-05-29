import { useState, useEffect } from 'react'
import {
  collection, getDocs, query, where,
  doc, updateDoc, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { contactDocId, isActiveContact } from '../../utils/emailValidation'

const WORKER_URL = import.meta.env.VITE_WORKER_URL
const BATCH_SIZE = 100 // Resend batch limit

/**
 * Flow: preview → confirm → sending → done
 */
export default function CampaignSendModal({ campaign, onClose }) {
  const [contacts, setContacts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [step, setStep]           = useState('preview') // preview | confirm | sending | done
  const [progress, setProgress]   = useState(0)
  const [sentCount, setSentCount] = useState(0)
  const [failCount, setFailCount] = useState(0)
  const [error, setError]         = useState('')

  // Load active contacts once on mount
  useEffect(() => {
    getDocs(query(collection(db, 'email_contacts'), where('status', '==', 'active')))
      .then(snap => {
        const active = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => isActiveContact(c.status))
        setContacts(active)
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  // Rendered sample for the preview (safe placeholders)
  const sampleHtml = (campaign.htmlBody || '')
    .replaceAll('{{name}}', 'Αγαπητέ Πελάτη')
    .replaceAll('{{unsubscribe_url}}', '#')

  async function handleSend() {
    if (!WORKER_URL || WORKER_URL.includes('YOUR-SUBDOMAIN')) {
      setError('Το VITE_WORKER_URL δεν έχει οριστεί. Ακολούθησε τις οδηγίες για το Cloudflare Worker.')
      return
    }

    setStep('sending')
    setError('')

    await updateDoc(doc(db, 'email_campaigns', campaign.id), {
      status:        'sending',
      sentAt:        serverTimestamp(),
      'stats.total': contacts.length,
      'stats.sent':  0,
    })

    let totalSent   = 0
    let totalFailed = 0
    const allResults = []

    try {
      for (let offset = 0; offset < contacts.length; offset += BATCH_SIZE) {
        const chunk = contacts.slice(offset, offset + BATCH_SIZE)

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
            contacts: chunk.map(c => ({ id: c.id, email: c.email, name: c.name || '' })),
          }),
        })

        if (!res.ok) throw new Error(`Worker error: ${await res.text()}`)

        const { results } = await res.json()
        allResults.push(...results)

        const batchSent   = results.filter(r => r.status === 'sent').length
        const batchFailed = results.filter(r => r.status === 'failed').length
        totalSent   += batchSent
        totalFailed += batchFailed

        setSentCount(totalSent)
        setFailCount(totalFailed)
        setProgress(Math.round(((offset + chunk.length) / contacts.length) * 100))
      }

      // Write email_sends docs (batched Firestore writes, max 500 per batch)
      const FSWRITE = 500
      for (let i = 0; i < allResults.length; i += FSWRITE) {
        const chunk = allResults.slice(i, i + FSWRITE)
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

      await updateDoc(doc(db, 'email_campaigns', campaign.id), {
        status:         'sent',
        'stats.sent':   totalSent,
        'stats.failed': totalFailed,
      })

      setStep('done')
    } catch (e) {
      setError(e.message)
      await updateDoc(doc(db, 'email_campaigns', campaign.id), { status: 'draft' }).catch(() => {})
      setStep('confirm') // return to confirm so they can retry
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

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <ModalShell onClose={onClose} title="Αποστολή Ολοκληρώθηκε">
        <div className="text-center py-8 space-y-3">
          <div className="text-5xl">✅</div>
          <div className="text-lg font-semibold text-green-700">Η καμπάνια στάλθηκε!</div>
          <div className="text-sm text-gray-500">
            <span className="text-green-600 font-medium">{sentCount} επιτυχή</span>
            {failCount > 0 && (
              <span className="text-red-500 font-medium ml-2">{failCount} αποτυχίες</span>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Τα metrics ενημερώνονται αυτόματα από το Resend (open/click/bounce).
          </p>
          <button className="btn-primary mt-2" onClick={onClose}>Κλείσιμο</button>
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
              <span className="text-blue-700">Αποστολή emails…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{sentCount}</div>
              <div className="text-xs text-gray-500">Στάλθηκαν</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{failCount}</div>
              <div className="text-xs text-gray-500">Αποτυχίες</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-500">
                {contacts.length - sentCount - failCount}
              </div>
              <div className="text-xs text-gray-500">Εναπομένουν</div>
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

  // ── Preview + Confirm (wide modal) ────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mt-4 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Αποστολή Καμπάνιας</h2>
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

          {/* ── PREVIEW step ── */}
          {step === 'preview' && (
            <>
              {/* Quick meta */}
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

              {/* Email preview iframe */}
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

              {/* Recipient count + next */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-sm text-gray-500">
                  Παραλήπτες:{' '}
                  <span className="font-bold text-blue-700">{contacts.length} ενεργές επαφές</span>
                </div>
                <button className="btn-primary" onClick={() => setStep('confirm')}>
                  Συνέχεια →
                </button>
              </div>
            </>
          )}

          {/* ── CONFIRM step ── */}
          {step === 'confirm' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
                <div><span className="font-medium text-gray-700">Καμπάνια:</span> {campaign.name}</div>
                <div><span className="font-medium text-gray-700">Θέμα:</span> {campaign.subject}</div>
                <div>
                  <span className="font-medium text-gray-700">Από:</span>{' '}
                  {campaign.fromName} &lt;{campaign.fromEmail}&gt;
                </div>
                <div>
                  <span className="font-medium text-gray-700">Παραλήπτες:</span>{' '}
                  <span className="font-bold text-blue-700">{contacts.length} ενεργές επαφές</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                ⚠️ Θα σταλεί σε <strong>{contacts.length}</strong> επαφές. Αυτή η ενέργεια δεν αναιρείται.
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
                  📤 Αποστολή σε {contacts.length} επαφές
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
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
