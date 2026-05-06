import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { statusLabel, statusColor, INACTIVE_STATUSES } from '../../utils/emailValidation'
import ContactUploadModal from './ContactUploadModal'
import ContactDetailModal from './ContactDetailModal'

const SOURCE_META = {
  csv_import:       { label: 'CSV',          cls: 'bg-blue-100 text-blue-700' },
  'resend-webhook': { label: 'Resend',        cls: 'bg-purple-100 text-purple-700' },
  manual:           { label: 'Χειροκίνητα',  cls: 'bg-gray-100 text-gray-600' },
}
function SourceBadge({ source }) {
  const m = SOURCE_META[source] || { label: source || '—', cls: 'bg-gray-100 text-gray-400' }
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${m.cls}`}>{m.label}</span>
}

function fmtDate(val) {
  if (!val) return null
  const d = val?.toDate ? val.toDate() : new Date(val)
  if (isNaN(d)) return null
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const STATUS_FILTERS = ['all', 'active', 'unsubscribed', 'bounced', 'complained', 'failed', 'invalid']

const FILTER_LABEL = {
  all:          'Όλοι',
  active:       'Ενεργοί',
  unsubscribed: 'Opt-out',
  bounced:      'Bounce',
  complained:   'Spam',
  failed:       'Αποτυχία',
  invalid:      'Άκυρα',
}

// How the action button looks per status
function actionMeta(status) {
  if (status === 'active') return { label: 'Opt-out',     cls: 'border-red-200 text-red-500 hover:bg-red-50',     next: 'unsubscribed' }
  return                          { label: 'Επαναφορά',   cls: 'border-green-300 text-green-700 hover:bg-green-50', next: 'active' }
}

export default function ContactsTab() {
  const [contacts, setContacts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState('all')
  const [showUpload, setShowUpload]       = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'email_contacts')), snap => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    let base = contacts
    if (filter !== 'all') base = base.filter(c => c.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      base = base.filter(c =>
        c.email?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
      )
    }
    return base
  }, [contacts, filter, search])

  const counts = useMemo(() => {
    const m = { all: contacts.length }
    STATUS_FILTERS.forEach(s => { if (s !== 'all') m[s] = contacts.filter(c => c.status === s).length })
    return m
  }, [contacts])

  async function setContactStatus(contact, newStatus) {
    const update = { status: newStatus, updatedAt: serverTimestamp() }
    if (newStatus === 'unsubscribed') update.unsubscribedAt = serverTimestamp()
    if (newStatus === 'active') {
      update.unsubscribedAt = null
      update.bouncedAt      = null
      update.complainedAt   = null
      update.failedAt       = null
      update.lastEvent      = null
    }
    await updateDoc(doc(db, 'email_contacts', contact.id), update)
  }

  const inactiveTotal = counts.bounced + counts.complained + counts.failed + counts.unsubscribed

  return (
    <div className="space-y-4">

      {/* Inactive contacts warning banner */}
      {inactiveTotal > 0 && filter === 'all' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>
            <strong>{inactiveTotal}</strong> επαφές είναι ανενεργές (bounce / spam / αποτυχία / opt-out) και εξαιρούνται αυτόματα από κάθε αποστολή.
          </span>
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => {
            const cnt = counts[s] || 0
            if (s !== 'all' && s !== 'active' && cnt === 0) return null // hide empty inactive tabs
            return (
              <button key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  filter === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}>
                {FILTER_LABEL[s]}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === s ? 'bg-white/20' : INACTIVE_STATUSES.has(s) && cnt > 0 ? 'bg-red-100 text-red-600' : 'opacity-60'
                }`}>{cnt}</span>
              </button>
            )
          })}
        </div>
        <button className="btn-primary text-sm" onClick={() => setShowUpload(true)}>
          + Εισαγωγή CSV / Excel
        </button>
      </div>

      {/* Search */}
      <input
        className="input w-full max-w-sm"
        placeholder="Αναζήτηση ονόματος, email, τηλεφώνου…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Φόρτωση…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <div>Δεν βρέθηκαν επαφές</div>
          {contacts.length === 0 && (
            <button className="mt-4 btn-primary text-sm" onClick={() => setShowUpload(true)}>
              + Εισαγωγή CSV / Excel
            </button>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Όνομα</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Τηλέφωνο</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Πηγή</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Αποστολές</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => {
                  const { label, cls, next } = actionMeta(c.status)
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className={`hover:bg-blue-50 cursor-pointer transition-colors ${INACTIVE_STATUSES.has(c.status) ? 'opacity-70' : ''}`}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-1.5">
                          {c.name || <span className="text-gray-400 italic text-xs">Χωρίς όνομα</span>}
                          {c.lastEngagedAt && c.status === 'active' && (
                            <span title={`Τελευταία δραστηριότητα: ${c.lastEvent || 'engagement'}`}>🔥</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm hidden sm:table-cell">{c.phone || '—'}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <SourceBadge source={c.source} />
                          {(c.addedAt || c.importedAt) && (
                            <span className="text-xs text-gray-400">
                              {fmtDate(c.addedAt || c.importedAt)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${statusColor(c.status)}`}>
                          {statusLabel(c.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{c.sendCount || 0}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setContactStatus(c, next)}
                          className={`text-xs px-2 py-1 rounded-md border transition-colors ${cls}`}>
                          {label}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-400">
            Εμφανίζονται {filtered.length} από {contacts.length} επαφές
            {filter === 'active' && <span className="ml-2 text-green-600 font-medium">· {counts.active} θα λάβουν την επόμενη καμπάνια</span>}
          </div>
        </div>
      )}

      {showUpload && <ContactUploadModal onClose={() => setShowUpload(false)} existingContacts={contacts} />}

      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={updated => {
            setSelectedContact(updated)
          }}
        />
      )}
    </div>
  )
}
