import { useState, useEffect } from 'react'
import {
  collection, getDocs, query, where,
  doc, updateDoc, writeBatch, serverTimestamp, increment
} from 'firebase/firestore'
import { db } from '../../firebase/config'
import { contactDocId } from '../../utils/emailValidation'

const WORKER_URL = import.meta.env.VITE_WORKER_URL
const BATCH_SIZE = 100 // Resend batch limit

export default function CampaignSendModal({ campaign, onClose }) {
  const [contacts, setContacts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [sending, setSending]     = useState(false)
  const [done, setDone]           = useState(false)
  const [progress, setProgress]   = useState(0)  // 0-100
  const [sentCount, setSentCount] = useState(0)
  const [failCount, setFailCount] = useState(0)
  const [error, setError]         = useState('')

  // Load active contacts on mount
  useEffect(() => {
    getDocs(query(collection(db, 'email_contacts'), where('status', '==', 'active')))
      .then(snap => {
        setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  async function handleSend() {
    if (!WORKER_URL) {
      setError('VITE_WORKER_URL δεν έχει οριστεί. Ολοκλήρωσε πρώτα το setup του Cloudflare Worker.')
      return
    }
    setSending(true)
    setError('')

    // Mark campaign as sending
    await updateDoc(doc(db, 'email_campaigns', campaign.id), {
      status:  'sending',
      sentAt:  serverTimestamp(),
      'stats.total': contacts.length,
      'stats.sent':  0,
    })

    let totalSent = 0
    let totalFailed = 0
    const allResults = []

    try {
      // Send in batches of BATCH_SIZE
      for (let offset = 0; offset < contacts.length; offset += BATCH_SIZE) {
        const chunk = contacts.slice(offset, offset + BATCH_SIZE)

        const res = await fetch(`${WORKER_URL}/send-campaign`, {
          method: 'POST',
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

        if (!res.ok) {
          const txt = await res.text()
          throw new Error(`Worker error: ${txt}`)
        }

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

      // Write email_sends docs to Firestore (batch write)
      const FSWRITE = 500
      for (let i = 0; i < allResults.length; i += FSWRITE) {
        const chunk = allResults.slice(i, i + FSWRITE)
        const batch = writeBatch(db)
        chunk.forEach(r => {
          const sendId = `${campaign.id}||${r.email}`
          batch.set(doc(db, 'email_sends', sendId), {
            campaignId:  campaign.id,
            contactId:   contactDocId(r.email),
            email:       r.email,
            resendId:    r.resendId || null,
            status:      r.status,
            sentAt:      serverTimestamp(),
            failedReason: r.error || null,
            openedAt:    null,
            clickedAt:   null,
            bouncedAt:   null,
            createdAt:   serverTimestamp(),
          })
        })
        await batch.commit()
      }

      // Update campaign to sent with final stats
      await updateDoc(doc(db, 'email_campaigns', campaign.id), {
        status:         'sent',
        'stats.sent':   totalSent,
        'stats.failed': totalFailed,
      })

      setDone(true)
    } catch (e) {
      setError(e.message)
      // Revert campaign status
      await updateDoc(doc(db, 'email_campaigns', campaign.id), {
        status: 'draft',
      }).catch(() => {})
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <ModalShell onClose={onClose} title="Αποστολή Καμπάνιας">
        <div className="text-center py-10 text-gray-400">Φόρτωση επαφών…</div>
      </ModalShell>
    )
  }

  if (done) {
    return (
      <ModalShell onClose={onClose} title="Αποστολή Ολοκληρώθηκε">
        <div className="text-center py-8 space-y-3">
          <div className="text-5xl">✅</div>
          <div className="text-lg font-semibold text-green-700">
            Η καμπάνια στάλθηκε!
          </div>
          <div className="text-sm text-gray-500">
            <span className="text-green-600 font-medium">{sentCount} επιτυχή</span>
            {failCount > 0 && <span className="text-red-500 font-medium ml-2">{failCount} αποτυχίες</span>}
          </div>
          <button className="btn-primary mt-2" onClick={onClose}>Κλείσιμο</button>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell onClose={!sending ? onClose : null} title="Αποστολή Καμπάνιας">
      <div className="space-y-5">
        {/* Campaign summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5 text-sm">
          <div><span className="font-medium text-gray-700">Καμπάνια:</span> {campaign.name}</div>
          <div><span className="font-medium text-gray-700">Θέμα:</span> {campaign.subject}</div>
          <div><span className="font-medium text-gray-700">Από:</span> {campaign.fromName} &lt;{campaign.fromEmail}&gt;</div>
          <div><span className="font-medium text-gray-700">Παραλήπτες:</span>
            <span className="ml-1 font-bold text-blue-700">{contacts.length} ενεργές επαφές</span>
          </div>
        </div>

        {!sending && !done && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            ⚠️ Θα σταλεί σε <strong>{contacts.length}</strong> επαφές. Αυτή η ενέργεια δεν αναιρείται.
          </div>
        )}

        {/* Progress bar (while sending) */}
        {sending && (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-blue-700">Αποστολή σε εξέλιξη…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex gap-6 text-sm text-center">
              <div>
                <div className="text-xl font-bold text-green-600">{sentCount}</div>
                <div className="text-xs text-gray-500">Στάλθηκαν</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">{failCount}</div>
                <div className="text-xs text-gray-500">Αποτυχίες</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-600">{contacts.length - sentCount - failCount}</div>
                <div className="text-xs text-gray-500">Εναπομένουν</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </div>
        )}

        {!sending && (
          <div className="flex gap-3">
            <button className="btn-secondary flex-1" onClick={onClose}>Ακύρωση</button>
            <button className="btn-primary flex-1" onClick={handleSend}>
              📤 Αποστολή σε {contacts.length} επαφές
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  )
}

function ModalShell({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          {onClose && <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>}
        </div>
        {children}
      </div>
    </div>
  )
}
