import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import { db } from '../../firebase/config'

function pct(a, b) {
  if (!b || !a) return 0
  return Math.round((a / b) * 100)
}

export default function MetricsTab() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'email_campaigns'), where('status', '==', 'sent'), orderBy('sentAt', 'desc')),
      snap => { setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) }
    )
    return unsub
  }, [])

  const totals = useMemo(() => {
    const t = { sent: 0, opened: 0, clicked: 0, unsubscribed: 0, bounced: 0, failed: 0 }
    campaigns.forEach(c => {
      if (!c.stats) return
      t.sent         += c.stats.sent         || 0
      t.opened       += c.stats.opened       || 0
      t.clicked      += c.stats.clicked      || 0
      t.unsubscribed += c.stats.unsubscribed || 0
      t.bounced      += c.stats.bounced      || 0
      t.failed       += c.stats.failed       || 0
    })
    return t
  }, [campaigns])

  if (loading) return <div className="text-center py-20 text-gray-400">Φόρτωση…</div>

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-4xl mb-3">📊</div>
        <div>Δεν υπάρχουν δεδομένα ακόμα — στείλε πρώτα μια καμπάνια</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigMetric label="Συνολικές Αποστολές" value={totals.sent.toLocaleString()} icon="📧" color="blue" />
        <BigMetric label="Μέσο Open Rate"
          value={pct(totals.opened, totals.sent) + '%'} icon="👁" color="green"
          sub={`${totals.opened.toLocaleString()} ανοίγματα`} />
        <BigMetric label="Μέσο Click Rate"
          value={pct(totals.clicked, totals.sent) + '%'} icon="🖱️" color="indigo"
          sub={`${totals.clicked.toLocaleString()} κλικ`} />
        <BigMetric label="Opt-outs" value={totals.unsubscribed.toLocaleString()} icon="🚫" color="orange"
          sub={pct(totals.unsubscribed, totals.sent) + '% rate'} />
      </div>

      {/* Per-campaign breakdown */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">Ανάλυση ανά Καμπάνια</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-xs text-gray-500 font-medium">
                <th className="text-left px-4 py-3">Καμπάνια</th>
                <th className="text-right px-4 py-3">Στάλθηκαν</th>
                <th className="text-right px-4 py-3">Opens</th>
                <th className="text-right px-4 py-3">Open %</th>
                <th className="text-right px-4 py-3">Clicks</th>
                <th className="text-right px-4 py-3">Click %</th>
                <th className="text-right px-4 py-3">Opt-out</th>
                <th className="text-right px-4 py-3">Bounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.map(c => {
                const s = c.stats || {}
                const openPct  = pct(s.opened, s.sent)
                const clickPct = pct(s.clicked, s.sent)
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 truncate max-w-48">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.subject}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{(s.sent || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{(s.opened || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${openPct >= 20 ? 'text-green-600' : openPct >= 10 ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {openPct}%
                      </span>
                      <MiniBar pct={openPct} color="green" />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{(s.clicked || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${clickPct >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
                        {clickPct}%
                      </span>
                      <MiniBar pct={clickPct * 5} color="blue" />
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{s.unsubscribed || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{s.bounced || 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Open rate bar chart */}
      <div className="card p-5 space-y-3">
        <h3 className="font-semibold text-gray-700">Open Rate ανά Καμπάνια</h3>
        <div className="space-y-2.5">
          {campaigns.slice(0, 10).map(c => {
            const s = c.stats || {}
            const p = pct(s.opened, s.sent)
            return (
              <div key={c.id} className="flex items-center gap-3">
                <div className="text-xs text-gray-500 w-36 truncate shrink-0" title={c.name}>{c.name}</div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.min(p, 100)}%` }} />
                </div>
                <div className="text-xs font-semibold text-gray-700 w-10 text-right">{p}%</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BigMetric({ label, value, icon, color, sub }) {
  const cls = {
    blue:   'bg-blue-50 border-blue-100 text-blue-700',
    green:  'bg-green-50 border-green-100 text-green-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  }
  return (
    <div className={`card p-4 border ${cls[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs opacity-75">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
    </div>
  )
}

function MiniBar({ pct, color }) {
  const cls = { green: 'bg-green-300', blue: 'bg-blue-300' }
  return (
    <div className="h-1 bg-gray-100 rounded-full mt-1 w-16 ml-auto overflow-hidden">
      <div className={`h-full rounded-full ${cls[color]}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  )
}
