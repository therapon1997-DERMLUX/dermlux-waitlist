import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  doc, getDoc, updateDoc, collection, query, where,
  orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage'
import { db, storage } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'
import VisitModal from './VisitModal'
import ConsentFormModal from './ConsentFormModal'

const TABS = [
  { id: 'history',  label: 'Ιατρικό Ιστορικό' },
  { id: 'visits',   label: 'Επισκέψεις' },
  { id: 'consent',  label: 'Συγκατάθεση' },
  { id: 'photos',   label: 'Φωτογραφίες' },
]

export default function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  const [patient, setPatient] = useState(null)
  const [activeTab, setActiveTab] = useState('history')
  const [loading, setLoading] = useState(true)

  // Visits
  const [visits, setVisits] = useState([])
  const [showVisitModal, setShowVisitModal] = useState(false)

  // Consent
  const [consents, setConsents] = useState([])
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [viewingConsent, setViewingConsent] = useState(null)

  // Photos
  const [photos, setPhotos] = useState([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoType, setPhotoType] = useState('before')
  const photoInputRef = useRef(null)

  // Medical history edit
  const [editing, setEditing] = useState(false)
  const [historyForm, setHistoryForm] = useState({})
  const [savingHistory, setSavingHistory] = useState(false)

  // Load patient
  useEffect(() => {
    getDoc(doc(db, 'patients', id)).then(snap => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() }
        setPatient(data)
        setHistoryForm({
          allergies: data.allergies || '',
          medications: data.medications || '',
          conditions: data.conditions || '',
          contraindications: data.contraindications || '',
          notes: data.notes || '',
        })
      }
      setLoading(false)
    })
  }, [id])

  // Load visits
  useEffect(() => {
    const q = query(
      collection(db, 'visits'),
      where('patientId', '==', id),
      orderBy('date', 'desc')
    )
    return onSnapshot(q, snap => {
      setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [id])

  // Load consents
  useEffect(() => {
    const q = query(
      collection(db, 'consent_forms'),
      where('patientId', '==', id),
      orderBy('signedAt', 'desc')
    )
    return onSnapshot(q, snap => {
      setConsents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [id])

  // Load photos
  useEffect(() => {
    const q = query(
      collection(db, 'patient_photos'),
      where('patientId', '==', id),
      orderBy('uploadedAt', 'desc')
    )
    return onSnapshot(q, snap => {
      setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [id])

  async function saveHistory() {
    setSavingHistory(true)
    try {
      await updateDoc(doc(db, 'patients', id), { ...historyForm })
      setPatient(p => ({ ...p, ...historyForm }))
      setEditing(false)
    } finally {
      setSavingHistory(false)
    }
  }

  async function uploadPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const filename = `${Date.now()}_${photoType}`
      const storageRef = ref(storage, `medical_photos/${id}/${filename}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      const { addDoc } = await import('firebase/firestore')
      await addDoc(collection(db, 'patient_photos'), {
        patientId: id,
        patientName: patient.name,
        type: photoType,
        url,
        storagePath: `medical_photos/${id}/${filename}`,
        uploadedAt: serverTimestamp(),
        uploadedBy: userProfile?.displayName || '',
      })
    } finally {
      setUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  async function deletePhoto(photo) {
    if (!confirm('Διαγραφή φωτογραφίας;')) return
    try {
      const { deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'patient_photos', photo.id))
      if (photo.storagePath) {
        await deleteObject(ref(storage, photo.storagePath))
      }
    } catch (err) {
      console.error('Delete photo error:', err)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64 text-blue-600">Φόρτωση...</div>
  )
  if (!patient) return (
    <div className="flex items-center justify-center min-h-64 text-gray-500">Ο ασθενής δεν βρέθηκε.</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back + Patient Header */}
      <button
        onClick={() => navigate('/medical')}
        className="text-sm text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-1"
      >
        ‹ Λίστα Ασθενών
      </button>

      <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
            {patient.phone && <span>{patient.phone}</span>}
            {patient.dob && <span>DOB: {patient.dob}</span>}
            {patient.city && <span className="text-blue-600">{patient.city}</span>}
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div>{visits.length} επισκέψεις</div>
          <div>{consents.length} φόρμες</div>
          <div>{photos.length} φωτογραφίες</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-white border border-b-white border-gray-200 text-blue-700 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Medical History */}
      {activeTab === 'history' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ιατρικό Ιστορικό</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-lg"
              >
                Επεξεργασία
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditing(false); setHistoryForm({ allergies: patient.allergies || '', medications: patient.medications || '', conditions: patient.conditions || '', contraindications: patient.contraindications || '', notes: patient.notes || '' }) }}
                  className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg"
                >
                  Ακύρωση
                </button>
                <button
                  onClick={saveHistory}
                  disabled={savingHistory}
                  className="text-sm text-white bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-lg disabled:opacity-50"
                >
                  {savingHistory ? 'Αποθήκευση...' : 'Αποθήκευση'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { key: 'allergies',       label: 'Αλλεργίες / Allergies',              placeholder: 'π.χ. Πενικιλίνη, Λάτεξ...' },
              { key: 'medications',     label: 'Φάρμακα / Medications',              placeholder: 'π.χ. Ασπιρίνη 100mg...' },
              { key: 'conditions',      label: 'Παθήσεις / Medical Conditions',      placeholder: 'π.χ. Διαβήτης, Υπέρταση...' },
              { key: 'contraindications', label: 'Αντενδείξεις / Contraindications', placeholder: 'π.χ. Εγκυμοσύνη, Αντιπηκτικά...' },
              { key: 'notes',           label: 'Σημειώσεις / Notes',                 placeholder: 'Επιπλέον πληροφορίες...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                {editing ? (
                  <textarea
                    value={historyForm[key]}
                    onChange={e => setHistoryForm(f => ({ ...f, [key]: e.target.value }))}
                    rows={2}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className={`text-sm rounded-lg px-3 py-2 ${patient[key] ? 'bg-gray-50 text-gray-800' : 'text-gray-400 italic'}`}>
                    {patient[key] || 'Δεν έχει καταχωρηθεί'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Visits */}
      {activeTab === 'visits' && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowVisitModal(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              + Νέα Επίσκεψη
            </button>
          </div>
          {visits.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Δεν υπάρχουν επισκέψεις ακόμα</div>
          ) : (
            <div className="space-y-3">
              {visits.map(v => (
                <div key={v.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{v.treatment}</span>
                        <span className="text-xs text-gray-400">{v.date}</span>
                      </div>
                      {v.products && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Προϊόντα:</span> {v.products}
                          {v.units && <span className="ml-2 text-gray-500">({v.units})</span>}
                        </p>
                      )}
                      {v.staff && (
                        <p className="text-sm text-gray-500">Θεραπευτής: {v.staff}</p>
                      )}
                      {v.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">{v.notes}</p>
                      )}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{v.treatment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Consent */}
      {activeTab === 'consent' && (
        <div>
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setShowConsentModal(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              + Νέα Φόρμα Συγκατάθεσης
            </button>
          </div>
          {consents.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Δεν υπάρχουν φόρμες συγκατάθεσης ακόμα</div>
          ) : (
            <div className="space-y-3">
              {consents.map(c => (
                <div key={c.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">Consent Form</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Υπογεγραμμένη</span>
                        <span className="text-xs text-gray-400">{c.language === 'el' ? 'Ελληνικά' : 'English'}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {c.signedAt?.toDate
                          ? c.signedAt.toDate().toLocaleDateString('el-GR')
                          : ''}
                        {c.signedBy && ` · ${c.signedBy}`}
                      </p>
                    </div>
                    <button
                      onClick={() => setViewingConsent(c)}
                      className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-lg"
                    >
                      Προβολή
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Photos */}
      {activeTab === 'photos' && (
        <div>
          <div className="flex items-center gap-3 mb-4 justify-end">
            <select
              value={photoType}
              onChange={e => setPhotoType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
            <button
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {uploadingPhoto ? 'Μεταφόρτωση...' : '+ Προσθήκη Φωτογραφίας'}
            </button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={uploadPhoto}
            />
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Δεν υπάρχουν φωτογραφίες ακόμα</div>
          ) : (
            <div>
              {/* Side by side view if both before and after exist */}
              {photos.some(p => p.type === 'before') && photos.some(p => p.type === 'after') && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-3 text-center">Σύγκριση / Comparison</p>
                  <div className="grid grid-cols-2 gap-4">
                    {['before', 'after'].map(type => {
                      const latest = photos.find(p => p.type === type)
                      return latest ? (
                        <div key={type} className="text-center">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{type}</p>
                          <img src={latest.url} alt={type} className="rounded-lg w-full object-cover aspect-square" />
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Full grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
                    <img src={photo.url} alt={photo.type} className="w-full aspect-square object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        photo.type === 'before' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {photo.type}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => deletePhoto(photo)}
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg"
                      >
                        Διαγραφή
                      </button>
                    </div>
                    <div className="px-2 py-1 bg-white text-xs text-gray-400">
                      {photo.uploadedAt?.toDate
                        ? photo.uploadedAt.toDate().toLocaleDateString('el-GR')
                        : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visit Modal */}
      {showVisitModal && (
        <VisitModal patient={patient} onClose={() => setShowVisitModal(false)} />
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <ConsentFormModal patient={patient} onClose={() => setShowConsentModal(false)} />
      )}

      {/* View Consent Signature Modal */}
      {viewingConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Υπογραφή Ασθενούς</h3>
              <button onClick={() => setViewingConsent(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              {viewingConsent.signedAt?.toDate
                ? viewingConsent.signedAt.toDate().toLocaleDateString('el-GR')
                : ''}
              {' · '}
              {viewingConsent.language === 'el' ? 'Ελληνικά' : 'English'}
            </p>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={viewingConsent.signatureDataUrl}
                alt="Signature"
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Υπογράφθηκε από: {viewingConsent.signedBy || '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
