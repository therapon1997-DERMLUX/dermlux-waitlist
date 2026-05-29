import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import templateHtml from '../../../email-templates/dermlux-skin-hair-aesthetics.html?raw'
import CreateCampaignModal from './CreateCampaignModal'
import FigImporter from './FigImporter'

const HERO_THUMB = 'https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/hero-gradient.jpeg'

// Built-in template (cannot be deleted)
const BUILTIN = {
  id: '__builtin__',
  name: 'DermLux — Skin, Hair & Aesthetics',
  description: 'Κύριο newsletter με facials, laser, injectables, promo banner και CTA.',
  htmlBody: templateHtml,
  thumbUrl: HERO_THUMB,
  builtin: true,
}

export default function TemplatesTab() {
  const [firestoreTpls, setFirestoreTpls] = useState([])
  const [preview,       setPreview]       = useState(null)
  const [useTpl,        setUseTpl]        = useState(null)
  const [showImport,    setShowImport]    = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // template to delete

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'email_templates'), orderBy('createdAt', 'desc')),
      snap => setFirestoreTpls(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return unsub
  }, [])

  const allTemplates = [BUILTIN, ...firestoreTpls]

  async function handleDelete(tpl) {
    await deleteDoc(doc(db, 'email_templates', tpl.id))
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{allTemplates.length} template{allTemplates.length !== 1 ? 's' : ''}</p>
        <button className="btn-primary" onClick={() => setShowImport(true)}>
          📁 Import .fig αρχείο
        </button>
      </div>

      {/* Template list */}
      <div className="grid gap-4">
        {allTemplates.map(t => (
          <div key={t.id} className="card p-5 flex gap-5 items-start">
            {/* Thumbnail */}
            <img
              src={t.thumbUrl || HERO_THUMB}
              alt={t.name}
              className="w-28 h-20 object-cover rounded-lg shrink-0 border border-gray-200"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900">{t.name}</div>
                {t.builtin && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Built-in</span>}
              </div>
              {t.description && <div className="text-sm text-gray-500 mt-1">{t.description}</div>}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button className="btn-primary text-xs" onClick={() => setUseTpl(t)}>
                + Χρήση σε Καμπάνια
              </button>
              <button className="btn-secondary text-xs" onClick={() => setPreview(t)}>
                👁 Προεπισκόπηση
              </button>
              {!t.builtin && (
                <button className="text-xs text-red-400 hover:text-red-600 text-center"
                  onClick={() => setConfirmDelete(t)}>
                  Διαγραφή
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl" style={{ height: '90vh' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="font-semibold text-gray-900">{preview.name}</div>
              <div className="flex gap-2">
                <button className="btn-primary text-xs" onClick={() => { setPreview(null); setUseTpl(preview) }}>
                  + Χρήση σε Καμπάνια
                </button>
                <button className="btn-secondary text-xs" onClick={() => setPreview(null)}>
                  Κλείσιμο
                </button>
              </div>
            </div>
            <iframe
              className="flex-1 w-full rounded-b-2xl"
              title="Email Preview"
              srcDoc={preview.htmlBody}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Use in campaign modal */}
      {useTpl && (
        <CreateCampaignModal
          campaign={{ htmlBody: useTpl.htmlBody, subject: '', fromName: 'DermLux', fromEmail: 'hello@dermluxclinics.com' }}
          onClose={() => setUseTpl(null)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <div className="font-semibold text-gray-900">Διαγραφή Template</div>
            <div className="text-sm text-gray-600">
              Είστε σίγουροι ότι θέλετε να διαγράψετε το template <strong>"{confirmDelete.name}"</strong>; Η ενέργεια δεν αναιρείται.
            </div>
            <div className="flex gap-2 pt-1">
              <button className="btn-secondary flex-1" onClick={() => setConfirmDelete(null)}>Ακύρωση</button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                onClick={() => handleDelete(confirmDelete)}>
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fig importer */}
      {showImport && (
        <FigImporter
          onClose={() => setShowImport(false)}
          onSaved={() => setShowImport(false)}
        />
      )}
    </div>
  )
}
