import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/AuthContext'

const CONSENT_TEXT = {
  en: {
    title: 'AESTHETIC TREATMENT CONSENT FORM — DERMLUX CLINIC',
    body: [
      {
        heading: '1. MEDICAL HISTORY',
        text: 'I confirm that I have accurately disclosed all relevant medical conditions, current medications, allergies, previous aesthetic treatments, and known contraindications. I understand that withholding such information may affect the safety and outcomes of my treatment.',
      },
      {
        heading: '2. TREATMENT CONSENT',
        text: 'I consent to receive the aesthetic treatment(s) discussed with my practitioner. I understand that while every effort will be made to achieve the desired outcome, results may vary and no specific result is guaranteed.',
      },
      {
        heading: '3. RISKS & SIDE EFFECTS',
        text: 'I have been informed of the potential risks and side effects, which may include (but are not limited to): temporary redness, swelling, bruising, discomfort, skin sensitivity, and in rare cases allergic reactions or other complications. I agree to follow all pre- and post-treatment instructions provided.',
      },
      {
        heading: '4. BEFORE & AFTER PHOTOGRAPHY',
        text: 'I consent to the taking of clinical photographs before and after treatment for the purpose of medical documentation and treatment planning. These images will be stored securely and will not be shared publicly without my explicit written consent.',
      },
      {
        heading: '5. RIGHT TO WITHDRAW',
        text: 'I understand that I may withdraw my consent at any time before treatment begins.',
      },
    ],
    footer: 'By signing below, I confirm that I have read, understood, and agree to the above.',
  },
  el: {
    title: 'ΕΝΤΥΠΟ ΣΥΓΚΑΤΑΘΕΣΗΣ ΓΙΑ ΑΙΣΘΗΤΙΚΕΣ ΘΕΡΑΠΕΙΕΣ — DERMLUX CLINIC',
    body: [
      {
        heading: '1. ΙΑΤΡΙΚΟ ΙΣΤΟΡΙΚΟ',
        text: 'Επιβεβαιώνω ότι έχω γνωστοποιήσει με ακρίβεια όλες τις σχετικές ιατρικές παθήσεις, τα φάρμακα που λαμβάνω, αλλεργίες, προηγούμενες αισθητικές θεραπείες και γνωστές αντενδείξεις. Κατανοώ ότι η παρακράτηση τέτοιων πληροφοριών ενδέχεται να επηρεάσει την ασφάλεια και τα αποτελέσματα της θεραπείας.',
      },
      {
        heading: '2. ΣΥΝΑΙΝΕΣΗ ΣΕ ΘΕΡΑΠΕΙΑ',
        text: 'Συναινώ στη λήψη της/των αισθητικής/ών θεραπείας/ών που συζητήθηκαν με τον/την θεραπευτή/τριά μου. Κατανοώ ότι τα αποτελέσματα ενδέχεται να διαφέρουν και δεν εγγυάται κανένα συγκεκριμένο αποτέλεσμα.',
      },
      {
        heading: '3. ΚΙΝΔΥΝΟΙ & ΠΑΡΕΝΕΡΓΕΙΕΣ',
        text: 'Έχω ενημερωθεί για τους πιθανούς κινδύνους και παρενέργειες, οι οποίες ενδέχεται να περιλαμβάνουν (μεταξύ άλλων): προσωρινή ερυθρότητα, οίδημα, μώλωπες, δυσφορία, ευαισθησία δέρματος και, σε σπάνιες περιπτώσεις, αλλεργικές αντιδράσεις ή άλλες επιπλοκές. Συμφωνώ να ακολουθώ όλες τις οδηγίες πριν και μετά τη θεραπεία.',
      },
      {
        heading: '4. ΦΩΤΟΓΡΑΦΙΑ ΠΡΙΝ & ΜΕΤΑ',
        text: 'Συναινώ στη λήψη κλινικών φωτογραφιών πριν και μετά τη θεραπεία για σκοπούς ιατρικής τεκμηρίωσης. Αυτές οι εικόνες θα αποθηκευτούν με ασφάλεια και δεν θα κοινοποιηθούν δημόσια χωρίς τη ρητή γραπτή συγκατάθεσή μου.',
      },
      {
        heading: '5. ΔΙΚΑΙΩΜΑ ΑΝΑΚΛΗΣΗΣ',
        text: 'Κατανοώ ότι μπορώ να ανακαλέσω τη συγκατάθεσή μου ανά πάσα στιγμή πριν ξεκινήσει η θεραπεία.',
      },
    ],
    footer: 'Με την υπογραφή μου παρακάτω, επιβεβαιώνω ότι έχω διαβάσει, κατανοήσει και συμφωνώ με τα παραπάνω.',
  },
}

export default function ConsentFormModal({ patient, onClose }) {
  const { userProfile } = useAuth()
  const sigRef = useRef(null)
  const [lang, setLang] = useState('el')
  const [saving, setSaving] = useState(false)
  const [signed, setSigned] = useState(false)

  const content = CONSENT_TEXT[lang]

  async function handleSave() {
    if (sigRef.current?.isEmpty()) {
      alert(lang === 'el' ? 'Παρακαλώ υπογράψτε πριν αποθηκεύσετε.' : 'Please sign before saving.')
      return
    }
    setSaving(true)
    try {
      const signatureDataUrl = sigRef.current.getTrimmedCanvas().toDataURL('image/png')
      await addDoc(collection(db, 'consent_forms'), {
        patientId: patient.id,
        patientName: patient.name,
        language: lang,
        signatureDataUrl,
        signedAt: serverTimestamp(),
        signedBy: userProfile?.displayName || '',
        formVersion: '1.0',
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">Φόρμα Συγκατάθεσης / Consent Form</h2>
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300 text-sm">
              <button
                onClick={() => setLang('el')}
                className={`px-3 py-1.5 transition-colors ${lang === 'el' ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Ελληνικά
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 transition-colors ${lang === 'en' ? 'bg-blue-700 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                English
              </button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {/* Patient info */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 mb-4 text-sm">
            <span className="font-medium text-blue-800">Ασθενής / Patient: </span>
            <span className="text-blue-700">{patient.name}</span>
            {patient.dob && <span className="text-blue-600 ml-3">DOB: {patient.dob}</span>}
          </div>

          {/* Form title */}
          <h3 className="font-bold text-gray-900 text-sm text-center mb-4 leading-snug">
            {content.title}
          </h3>

          {/* Consent clauses */}
          <div className="space-y-3 text-sm text-gray-700">
            {content.body.map((clause, i) => (
              <div key={i}>
                <p className="font-semibold text-gray-900 mb-0.5">{clause.heading}</p>
                <p className="leading-relaxed">{clause.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-700 italic border-t pt-3">{content.footer}</p>

          {/* Date */}
          <p className="text-sm text-gray-500 mt-3">
            {lang === 'el' ? 'Ημερομηνία' : 'Date'}: {new Date().toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB')}
          </p>

          {/* Signature pad */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {lang === 'el' ? 'Υπογραφή Ασθενούς:' : 'Patient Signature:'}
            </p>
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                onEnd={() => setSigned(true)}
                canvasProps={{
                  className: 'w-full',
                  style: { width: '100%', height: '130px' },
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => { sigRef.current?.clear(); setSigned(false) }}
              className="text-xs text-gray-500 hover:text-gray-700 mt-1 underline"
            >
              {lang === 'el' ? 'Καθαρισμός υπογραφής' : 'Clear signature'}
            </button>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-6 py-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            {lang === 'el' ? 'Ακύρωση' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {saving
              ? (lang === 'el' ? 'Αποθήκευση...' : 'Saving...')
              : (lang === 'el' ? 'Αποθήκευση & Υπογραφή' : 'Save & Sign')}
          </button>
        </div>
      </div>
    </div>
  )
}
