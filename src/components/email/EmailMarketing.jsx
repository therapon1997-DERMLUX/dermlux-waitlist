import { useState } from 'react'
import ContactsTab from './ContactsTab'
import CampaignsTab from './CampaignsTab'
import MetricsTab from './MetricsTab'
import TemplatesTab from './TemplatesTab'

const TABS = [
  { id: 'contacts',  label: '👥 Επαφές' },
  { id: 'campaigns', label: '📧 Καμπάνιες' },
  { id: 'templates', label: '🎨 Templates' },
  { id: 'metrics',   label: '📊 Μετρικά' },
]

export default function EmailMarketing() {
  const [tab, setTab] = useState('contacts')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">📧</span>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-sm text-gray-500">Διαχείριση επαφών, αποστολή καμπανιών, μετρικά</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'contacts'  && <ContactsTab />}
      {tab === 'campaigns' && <CampaignsTab />}
      {tab === 'templates' && <TemplatesTab />}
      {tab === 'metrics'   && <MetricsTab />}
    </div>
  )
}
