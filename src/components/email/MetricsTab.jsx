import { useEffect, useState, useMemo } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
  RadialBarChart, RadialBar, Legend,
} from 'recharts'

const BENCHMARKS = { open: 21, click: 2.6 }  // email marketing industry averages %

function pct(a, b) {
  if (!b || !a) return 0
  return Math.round((a / b) * 100)
}
function fmt(n) { return (n || 0).toLocaleString('el-GR') }

// ─── Main component ────────────────────────────────────────────────────────────
export default function MetricsTab() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState(null)  // campaign id for drill-down

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'email_campaigns'),
        where('status', 'in', ['sent', 'auto', 'partial'])
      ),
      snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        docs.sort((a, b) => (b.sentAt?.seconds || 0) - (a.sentAt?.seconds || 0))
        setCampaigns(docs)
        setLoading(false)
      }
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

  const selectedCampaign = campaigns.find(c => c.id === selected)

  return (
    <div className="space-y-6">

      {/* ── Overview KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="📧" label="Συνολικές Αποστολές" value={fmt(totals.sent)} color="blue" />
        <KpiCard icon="👁" label="Μέσο Open Rate"
          value={pct(totals.opened, totals.sent) + '%'}
          sub={`${fmt(totals.opened)} ανοίγματα`}
          benchmark={BENCHMARKS.open}
          actual={pct(totals.opened, totals.sent)}
          color="green" />
        <KpiCard icon="🖱️" label="Μέσο Click Rate"
          value={pct(totals.clicked, totals.sent) + '%'}
          sub={`${fmt(totals.clicked)} κλικ`}
          benchmark={BENCHMARKS.click}
          actual={pct(totals.clicked, totals.sent)}
          color="indigo" />
        <KpiCard icon="🚫" label="Opt-outs"
          value={fmt(totals.unsubscribed)}
          sub={pct(totals.unsubscribed, totals.sent) + '% rate'}
          color="orange" />
      </div>

      {/* ── Campaign cards ── */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Καμπάνιες</h3>
        <div className="space-y-3">
          {campaigns.map(c => (
            <CampaignCard
              key={c.id}
              campaign={c}
              expanded={selected === c.id}
              onToggle={() => setSelected(selected === c.id ? null : c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Bar chart: open rate comparison ── */}
      {campaigns.length > 1 && (
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-700">Σύγκριση Καμπανιών</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={campaigns.map(c => ({
                name: c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
                'Open %':  pct(c.stats?.opened,  c.stats?.sent),
                'Click %': pct(c.stats?.clicked, c.stats?.sent),
              }))}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => v + '%'} />
              <Bar dataKey="Open %" fill="#4ade80" radius={[4,4,0,0]} />
              <Bar dataKey="Click %" fill="#818cf8" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-xs text-gray-500 justify-center">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400 inline-block"/>Open Rate</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-400 inline-block"/>Click Rate</span>
            <span className="flex items-center gap-1 text-gray-400">— Industry avg: Open {BENCHMARKS.open}% / Click {BENCHMARKS.click}%</span>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Campaign card with inline drill-down ─────────────────────────────────────
function CampaignCard({ campaign: c, expanded, onToggle }) {
  const s = c.stats || {}
  const openPct  = pct(s.opened,  s.sent)
  const clickPct = pct(s.clicked, s.sent)
  const bouncePct = pct(s.bounced, s.sent)

  const funnelData = [
    { name: 'Στάλθηκαν', value: s.sent    || 0, fill: '#60a5fa' },
    { name: 'Ανοίχθηκαν', value: s.opened  || 0, fill: '#4ade80' },
    { name: 'Κλικ',      value: s.clicked  || 0, fill: '#818cf8' },
  ].filter(d => d.value > 0)

  const sentAt = c.sentAt?.toDate ? c.sentAt.toDate() : null

  return (
    <div className="card overflow-hidden">
      {/* Header row — always visible */}
      <button
        className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">{c.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {sentAt ? sentAt.toLocaleDateString('el-GR', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
              {' · '}{c.subject}
            </div>
          </div>

          {/* Mini stats row */}
          <div className="flex items-center gap-6 shrink-0">
            <MiniStat label="Στάλθηκαν" value={fmt(s.sent)} />
            <MiniStat label="Open" value={openPct + '%'}
              color={openPct >= BENCHMARKS.open ? 'text-green-600' : 'text-gray-600'} />
            <MiniStat label="Click" value={clickPct + '%'}
              color={clickPct >= BENCHMARKS.click ? 'text-indigo-600' : 'text-gray-600'} />
            <MiniStat label="Bounce" value={bouncePct + '%'} color="text-gray-400" />
            <span className="text-gray-300 text-lg">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Progress bars — always visible */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <RateBar label="Open Rate" pct={openPct} benchmark={BENCHMARKS.open} color="bg-green-400" />
          <RateBar label="Click Rate" pct={clickPct} benchmark={BENCHMARKS.click} color="bg-indigo-400" />
          <RateBar label="Delivered" pct={pct((s.sent||0) - (s.bounced||0) - (s.failed||0), s.sent + (s.failed||0))} color="bg-blue-400" />
        </div>
      </button>

      {/* Drill-down — expanded */}
      {expanded && (
        <div className="border-t bg-gray-50 px-5 py-5 space-y-5">

          {/* Funnel + stat grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Funnel chart */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Funnel</div>
              {funnelData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <FunnelChart>
                    <Tooltip formatter={(v) => fmt(v)} />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                      <LabelList position="center" fill="#fff" fontSize={12} fontWeight={600}
                        formatter={(v) => fmt(v)} />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-gray-400 text-center py-8">Δεν υπάρχουν δεδομένα ανοίγματος ακόμα</div>
              )}
            </div>

            {/* Detailed stats grid */}
            <div className="grid grid-cols-2 gap-3 content-start">
              <StatBox icon="📧" label="Στάλθηκαν"    value={fmt(s.sent)}          color="blue" />
              <StatBox icon="👁" label="Ανοίχθηκαν"   value={fmt(s.opened)}
                sub={openPct + '%'} color={openPct >= BENCHMARKS.open ? 'green' : 'gray'} />
              <StatBox icon="🖱️" label="Κλικ"          value={fmt(s.clicked)}
                sub={clickPct + '%'} color={clickPct >= BENCHMARKS.click ? 'indigo' : 'gray'} />
              <StatBox icon="🚫" label="Opt-outs"      value={fmt(s.unsubscribed)} color="orange" />
              <StatBox icon="↩️" label="Bounces"       value={fmt(s.bounced)}
                sub={bouncePct + '%'} color={bouncePct > 2 ? 'red' : 'gray'} />
              <StatBox icon="❌" label="Αποτυχίες"     value={fmt(s.failed)}       color="red" />
            </div>
          </div>

          {/* Benchmark comparison */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Σύγκριση με Industry Average</div>
            <div className="space-y-3">
              <BenchmarkRow label="Open Rate" actual={openPct} benchmark={BENCHMARKS.open} color="green" />
              <BenchmarkRow label="Click Rate" actual={clickPct} benchmark={BENCHMARKS.click} color="indigo" />
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, color, benchmark, actual }) {
  const cls = {
    blue:   'bg-blue-50   border-blue-100   text-blue-700',
    green:  'bg-green-50  border-green-100  text-green-700',
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
  }
  const above = benchmark != null && actual >= benchmark
  return (
    <div className={`card p-4 border ${cls[color]}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{icon}</span>
          <span className="text-xs opacity-70">{label}</span>
        </div>
        {benchmark != null && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${above ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {above ? '↑ Avg' : '↓ Avg'}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-60 mt-0.5">{sub}</div>}
      {benchmark != null && (
        <div className="text-xs opacity-50 mt-1">Industry avg: {benchmark}%</div>
      )}
    </div>
  )
}

function MiniStat({ label, value, color = 'text-gray-700' }) {
  return (
    <div className="text-center">
      <div className={`text-sm font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

function RateBar({ label, pct: p, benchmark, color }) {
  const above = benchmark != null && p >= benchmark
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className={`font-semibold ${above ? 'text-green-600' : ''}`}>{p}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(p, 100)}%` }} />
        {benchmark != null && (
          <div className="absolute top-0 h-full w-px bg-gray-400 opacity-60"
            style={{ left: `${Math.min(benchmark, 100)}%` }} />
        )}
      </div>
    </div>
  )
}

function StatBox({ icon, label, value, sub, color }) {
  const cls = {
    blue:   'text-blue-600',
    green:  'text-green-600',
    indigo: 'text-indigo-600',
    orange: 'text-orange-500',
    red:    'text-red-500',
    gray:   'text-gray-700',
  }
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 space-y-0.5">
      <div className="text-xs text-gray-400 flex items-center gap-1">{icon} {label}</div>
      <div className={`text-xl font-bold ${cls[color] || cls.gray}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  )
}

function BenchmarkRow({ label, actual, benchmark, color }) {
  const above = actual >= benchmark
  const max   = Math.max(actual, benchmark, 1)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={above ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
          {actual}% {above ? '▲' : '▼'} vs {benchmark}% avg
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
          {/* Actual */}
          <div
            className={`h-full rounded-full ${color === 'green' ? 'bg-green-400' : 'bg-indigo-400'}`}
            style={{ width: `${Math.min((actual / max) * 100, 100)}%` }}
          />
        </div>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          {/* Benchmark */}
          <div
            className="h-full bg-gray-300 rounded-full"
            style={{ width: `${Math.min((benchmark / max) * 100, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Η καμπάνια σου</span>
        <span>Industry average</span>
      </div>
    </div>
  )
}
