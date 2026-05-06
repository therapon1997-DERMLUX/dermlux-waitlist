import { useState } from 'react'
import { doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'
import { fmt, fmtDateTime, isLockActive } from '../utils/dateHelpers'
import ContactResultModal from './ContactResultModal'

const SERVICE_COLORS = {
  Laser:      'bg-purple-100 text-purple-700',
  Facial:     'bg-pink-100 text-pink-700',
  Injectable: 'bg-blue-100 text-blue-700',
  Body:       'bg-green-100 text-green-700',
}

const CITY_COLORS = {
  Paphos:    'bg-orange-100 text-orange-700',
  Nicosia:   'bg-blue-100 text-blue-700',
  Limassol:  'bg-teal-100 text-teal-700',
  Larnaca:   'bg-rose-100 text-rose-700',
}

const STATUS_STYLES = {
  Waiting:        'bg-gray-100 text-gray-600',
  Scheduled:      'bg-green-100 text-green-700',
  'Not Interested': 'bg-red-100 text-red-600',
  Completed:      'bg-blue-100 text-blue-700',
}

const RESULT_LABELS = {
  Scheduled:        '✓ Ραντεβού',
  'Will Call Back': '↩ Θα ξανακαλέσουμε',
  'No Answer':      '✗ Δεν απάντησε',
  'Not Interested': '✗ Δεν ενδιαφέρεται',
  Other:            '— Άλλο',
}

export default function ClientCard({ client, collectionName = 'clients' }) {
  const { currentUser, userProfile } = useAuth()
  const [showResult, setShowResult]  = useState(false)
  const [calling, setCalling]        = useState(false)

  const lockActive = isLockActive(client.calledBy)
  const lockedByMe = lockActive && client.calledBy?.userId === currentUser.uid
  const lockedByOther = lockActive && !lockedByMe

  const lastContact = client.contactHistory?.slice(-1)[0]

  async function handleCall() {
    setCalling(true)
    try {
      await updateDoc(doc(db, collectionName, client.id), {
        calledBy: {
          userId:    currentUser.uid,
          userName:  userProfile?.displayName || currentUser.email,
          timestamp: Timestamp.now(),
        },
        updatedAt: serverTimestamp(),
      })
    } finally {
      setCalling(false)
    }
  }

  async function handleReleaseLock() {
    await updateDoc(doc(db, collectionName, client.id), {
      calledBy:  null,
      updatedAt: serverTimestamp(),
    })
  }

  return (
    <>
      <div className={`card p-4 space-y-3 ${lockedByOther ? 'opacity-70 ring-2 ring-yellow-300' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-gray-900">{client.name}</div>
            <div className="text-sm text-blue-600 font-medium">{client.phone}</div>
            {client.email && <div className="text-xs text-gray-400">{client.email}</div>}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge ${SERVICE_COLORS[client.service] || 'bg-gray-100 text-gray-600'}`}>
              {client.service}
            </span>
            <span className={`badge ${CITY_COLORS[client.city] || 'bg-gray-100 text-gray-600'}`}>
              {client.city}
            </span>
            <span className={`badge ${STATUS_STYLES[client.status] || 'bg-gray-100 text-gray-600'}`}>
              {client.status}
            </span>
          </div>
        </div>

        {/* Preferred dates */}
        <div className="text-xs text-gray-500 space-y-0.5">
          {client.preferredDate1 && <div>📅 Επιθ. 1: {fmt(client.preferredDate1)}</div>}
          {client.preferredDate2 && <div>📅 Επιθ. 2: {fmt(client.preferredDate2)}</div>}
          {client.preferredDate3 && <div>📅 Επιθ. 3: {fmt(client.preferredDate3)}</div>}
          {(client.dateRangeStart || client.dateRangeEnd) && (
            <div>📆 Εύρος: {fmt(client.dateRangeStart)} – {fmt(client.dateRangeEnd)}</div>
          )}
          {client.preferredTime && <div>⏰ Ώρα: {client.preferredTime}</div>}
          {client.appointmentDuration && <div>⏱ Διάρκεια: {client.appointmentDuration}</div>}
        </div>

        {/* Why waiting */}
        {client.whyWaiting && (
          <div className="text-xs bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-yellow-800">
            <span className="font-medium">Λόγος αναμονής: </span>{client.whyWaiting}
          </div>
        )}

        {/* Comments */}
        {client.comments && (
          <div className="text-xs text-gray-500 italic">💬 {client.comments}</div>
        )}

        {/* Pricing */}
        {(client.originalPrice || client.discountedPrice) && (
          <div className="text-xs text-gray-500">
            {client.originalPrice && <span>Τιμή: €{client.originalPrice} </span>}
            {client.discountedPrice && <span className="text-green-600 font-medium">→ €{client.discountedPrice}</span>}
          </div>
        )}

        {/* Contact history */}
        {client.contactHistory?.length > 0 && (
          <div className="border-t pt-2 space-y-1.5">
            {[...client.contactHistory].reverse().map((h, i) => (
              <div key={i} className="text-xs text-gray-500">
                <div className="flex flex-wrap items-center gap-x-1.5">
                  <span className="text-gray-400">{fmtDateTime(h.date)}</span>
                  <span className="font-medium text-gray-700">{RESULT_LABELS[h.result] || h.result}</span>
                  {h.userName && <span className="text-gray-400">({h.userName})</span>}
                </div>
                {h.notes && (
                  <div className="mt-0.5 ml-0 text-gray-500 italic">💬 {h.notes}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lock warning */}
        {lockedByOther && (
          <div className="text-xs bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 text-yellow-800 font-medium">
            📞 Σε κλήση από: {client.calledBy.userName}
          </div>
        )}

        {/* Action buttons */}
        {client.status === 'Waiting' && (
          <div className="flex gap-2 pt-1">
            {!lockedByOther && !lockedByMe && (
              <button
                className="btn-primary flex-1 text-xs"
                onClick={handleCall}
                disabled={calling}
              >
                📞 Κλήση
              </button>
            )}
            {lockedByMe && (
              <>
                <button className="btn-green flex-1 text-xs" onClick={() => setShowResult(true)}>
                  ✓ Καταχώρηση αποτελέσματος
                </button>
                <button className="btn-secondary text-xs" onClick={handleReleaseLock} title="Απελευθέρωση κλειδώματος">
                  ✕
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {showResult && (
        <ContactResultModal client={client} onClose={() => setShowResult(false)} collectionName={collectionName} />
      )}
    </>
  )
}
