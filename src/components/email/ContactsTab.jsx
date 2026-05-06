import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { statusLabel, statusColor } from '../../utils/emailValidation'
import ContactUploadModal from './ContactUploadModal'

const STATUS_FILTERS = ['all', 'active', 'unsubscribed', 'bounced', 'invalid']

export default function ContactsTab() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [showUpload, setShowUpload] = useState(false)

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

  const counts = useMemo(() => ({
    all:          contacts.length,
    active:       contacts.filter(c => c.status === 'active').length,
    unsubscribed: contacts.filter(c => c.status === 'unsubscribed').length,
    bounced:      contacts.filter(c => c.status === 'bounced').length,
    invalid:      contacts.filter(c => c.status === 'invalid').length,
  }), [contacts])

  async function toggleUnsubscribe(contact) {
    const newStatus = contact.status === 'unsubscribed' ? 'active' : 'unsubscribed'
    await updateDoc(doc(db, 'email_contacts', contact.id), {
      status: newStatus,
      unsubscribedAt: newStatus === 'unsubscribed' ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    })
  }

  const filterLabel = { all: 'Όλοι', active: 'Ενεργοί', unsubscribed: 'Opt-out', bounced: 'Bounce', invalid: 'Άκυρα' }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                filter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}>
              {filterLabel[s]} <span className="ml-1 opacity-70">{counts[s]}</span>
            </button>
          ))}
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
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Tags</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Αποστολές</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.phone || '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {(c.tags || []).map(t => (
                          <span key={t} className="badge bg-blue-100 text-blue-700 text-xs">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge text-xs ${statusColor(c.status)}`}>
                        {statusLabel(c.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{c.sendCount || 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUnsubscribe(c)}
                        title={c.status === 'unsubscribed' ? 'Επαναφορά σε ενεργό' : 'Opt-out'}
                        className={`text-xs px-2 py-1 rounded-md border transition-colors ${
                          c.status === 'unsubscribed'
                            ? 'border-green-300 text-green-700 hover:bg-green-50'
                            : 'border-red-200 text-red-500 hover:bg-red-50'
                        }`}>
                        {c.status === 'unsubscribed' ? 'Επαναφορά' : 'Opt-out'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t bg-gray-50 text-xs text-gray-400">
            Εμφανίζονται {filtered.length} από {contacts.length} επαφές
          </div>
        </div>
      )}

      {showUpload && <ContactUploadModal onClose={() => setShowUpload(false)} existingContacts={contacts} />}
    </div>
  )
}
