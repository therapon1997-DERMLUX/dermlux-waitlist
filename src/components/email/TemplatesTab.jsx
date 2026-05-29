import { useState } from 'react'
import templateHtml from '../../../email-templates/dermlux-skin-hair-aesthetics.html?raw'
import CreateCampaignModal from './CreateCampaignModal'

const TEMPLATES = [
  {
    id: 'dermlux-main',
    name: 'DermLux — Skin, Hair & Aesthetics',
    description: 'Κύριο newsletter με facials, laser, injectables, promo banner και CTA.',
    tags: ['Γενικό', 'Υπηρεσίες', 'Promo'],
    html: templateHtml,
    thumb: 'https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/hero-gradient.jpeg',
  },
]

export default function TemplatesTab() {
  const [preview, setPreview]   = useState(null)   // template being previewed
  const [useTpl,  setUseTpl]    = useState(null)   // template to use → opens CreateCampaignModal

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{TEMPLATES.length} template{TEMPLATES.length !== 1 ? 's' : ''}</p>

      <div className="grid gap-4">
        {TEMPLATES.map(t => (
          <div key={t.id} className="card p-5 flex gap-5 items-start">
            {/* Thumbnail */}
            <img
              src={t.thumb}
              alt={t.name}
              className="w-28 h-20 object-cover rounded-lg shrink-0 border border-gray-200"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">{t.name}</div>
              <div className="text-sm text-gray-500 mt-1">{t.description}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.tags.map(tag => (
                  <span key={tag} className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button className="btn-primary text-xs" onClick={() => setUseTpl(t)}>
                + Χρήση σε Καμπάνια
              </button>
              <button className="btn-secondary text-xs" onClick={() => setPreview(t)}>
                👁 Προεπισκόπηση
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Preview modal ── */}
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
              srcDoc={preview.html}
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* ── Create campaign modal with template pre-filled ── */}
      {useTpl && (
        <CreateCampaignModal
          campaign={{ htmlBody: useTpl.html, subject: '', fromName: 'DermLux', fromEmail: 'hello@dermluxclinics.com' }}
          onClose={() => setUseTpl(null)}
        />
      )}
    </div>
  )
}
