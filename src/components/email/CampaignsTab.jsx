import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import CreateCampaignModal from './CreateCampaignModal'
import CampaignSendModal from './CampaignSendModal'

const STATUS_STYLE = {
  draft:   'bg-gray-100 text-gray-600',
  sending: 'bg-blue-100 text-blue-700',
  partial: 'bg-orange-100 text-orange-700',
  sent:    'bg-green-100 text-green-700',
  failed:  'bg-red-100 text-red-600',
}
const STATUS_LABEL = {
  draft:   'Draft',
  sending: 'Αποστολή…',
  partial: 'Μερική Αποστολή',
  sent:    'Στάλθηκε',
  failed:  'Σφάλμα',
}

function pct(a, b) {
  if (!b) return '—'
  return Math.round((a / b) * 100) + '%'
}

export default function CampaignsTab() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editCampaign, setEditCampaign] = useState(null)
  const [sendCampaign, setSendCampaign] = useState(null)
  const [testSendModal, setTestSendModal] = useState(null) // campaign
  const [testResult, setTestResult]       = useState(null) // { status, msg }

  async function submitTestSend(campaign, name, email) {
    setTestSendModal(null)
    setTestResult({ status: 'sending', msg: `Αποστολή στο ${email}…` })
    try {
      const workerUrl = import.meta.env.VITE_WORKER_URL
      const res = await fetch(`${workerUrl}/send-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: `test_${campaign.id}`,
          campaign,
          contacts: [{ id: 'test', name: name || 'Test', email }],
        }),
      })
      const data = await res.json()
      const result = data.results?.[0]
      if (result?.status === 'sent') {
        setTestResult({ status: 'done', msg: `✅ Εστάλη στο ${email}` })
      } else {
        setTestResult({ status: 'error', msg: `❌ Σφάλμα: ${result?.error || JSON.stringify(data)}` })
      }
    } catch (e) {
      setTestResult({ status: 'error', msg: `❌ ${e.message}` })
    }
    setTimeout(() => setTestResult(null), 6000)
  }

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'email_campaigns'), orderBy('createdAt', 'desc')),
      snap => { setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) }
    )
    return unsub
  }, [])

  async function handleDelete(campaign) {
    if (!window.confirm(`Διαγραφή καμπάνιας "${campaign.name}";`)) return
    await deleteDoc(doc(db, 'email_campaigns', campaign.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{campaigns.length} καμπάνιες</p>
        <button className="btn-primary" onClick={() => { setEditCampaign(null); setShowCreate(true) }}>
          + Νέα Καμπάνια
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Φόρτωση…</div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📧</div>
          <div className="mb-4">Δεν υπάρχουν καμπάνιες ακόμα</div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Νέα Καμπάνια</button>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="card p-5 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{c.subject}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Από: {c.fromName} &lt;{c.fromEmail}&gt;
                  </div>
                </div>
                <span className={`badge text-xs shrink-0 ${STATUS_STYLE[c.status] || STATUS_STYLE.draft}`}>
                  {STATUS_LABEL[c.status] || c.status}
                </span>
              </div>

              {/* Stats (for sent and partial campaigns) */}
              {(c.status === 'sent' || c.status === 'partial') && c.stats && (
                <div className="grid grid-cols-4 gap-3 text-center border-t pt-3">
                  <StatBox label="Στάλθηκαν" value={c.stats.sent ?? c.stats.total ?? 0} />
                  <StatBox label="Ανοίχθηκαν" value={pct(c.stats.opened, c.stats.sent)} highlight />
                  <StatBox label="Κλικ" value={pct(c.stats.clicked, c.stats.sent)} />
                  <StatBox label="Opt-out" value={c.stats.unsubscribed ?? 0} />
                </div>
              )}

              {/* Sending progress */}
              {c.status === 'sending' && c.stats && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Αποστολή σε εξέλιξη…</span>
                    <span>{c.stats.sent ?? 0} / {c.stats.total ?? '?'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${c.stats.total ? Math.round(((c.stats.sent ?? 0) / c.stats.total) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t flex-wrap">
                {c.status === 'draft' && (
                  <>
                    <button className="btn-primary text-xs"
                      onClick={() => setSendCampaign(c)}>
                      📤 Αποστολή
                    </button>
                    <button className="btn-secondary text-xs"
                      onClick={() => { setEditCampaign(c); setShowCreate(true) }}>
                      ✏️ Επεξεργασία
                    </button>
                  </>
                )}
                {c.status === 'partial' && (
                  <>
                    <button className="btn-primary text-xs"
                      onClick={() => setSendCampaign(c)}>
                      ▶️ Συνέχεια Αποστολής
                    </button>
                    <div className="text-xs text-orange-600 self-center ml-1">
                      {(c.stats?.total ?? 0) - (c.stats?.sent ?? 0)} εναπομένουν
                    </div>
                  </>
                )}
                {c.status === 'sent' && (
                  <button className="btn-secondary text-xs"
                    onClick={() => { setEditCampaign({ ...c, name: c.name + ' (αντίγραφο)', status: 'draft' }); setShowCreate(true) }}>
                    📋 Αντιγραφή ως Draft
                  </button>
                )}
                <button className="btn-secondary text-xs"
                  onClick={() => setTestSendModal(c)}
                  disabled={testResult?.status === 'sending'}>
                  🧪 Test Send
                </button>
                {c.status === 'draft' && (
                  <button className="text-xs text-red-400 hover:text-red-600 ml-auto"
                    onClick={() => handleDelete(c)}>
                    Διαγραφή
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateCampaignModal
          campaign={editCampaign}
          onClose={() => { setShowCreate(false); setEditCampaign(null) }}
        />
      )}
      {sendCampaign && (
        <CampaignSendModal
          campaign={sendCampaign}
          onClose={() => setSendCampaign(null)}
        />
      )}

      {/* Test send modal */}
      {testSendModal && (
        <TestSendModal
          campaign={testSendModal}
          onClose={() => setTestSendModal(null)}
          onSend={(name, email) => submitTestSend(testSendModal, name, email)}
        />
      )}

      {/* Result toast */}
      {testResult && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm z-50 max-w-sm ${testResult.status === 'done' ? 'bg-green-600' : testResult.status === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {testResult.msg}
        </div>
      )}
    </div>
  )
}

function TestSendModal({ campaign, onClose, onSend }) {
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
        <div className="font-semibold text-gray-900">🧪 Test Send — {campaign.name}</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Όνομα (για {'{{name}}'})</label>
            <input className="input w-full" placeholder="π.χ. Μαρία" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email *</label>
            <input className="input w-full" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button className="btn-secondary flex-1" onClick={onClose}>Ακύρωση</button>
          <button className="btn-primary flex-1" disabled={!email.includes('@')}
            onClick={() => onSend(name, email)}>
            Αποστολή Test
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, highlight }) {
  return (
    <div>
      <div className={`text-lg font-bold ${highlight ? 'text-blue-600' : 'text-gray-800'}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}
