import { useEffect, useState, useMemo } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const BENCHMARKS = { open: 21, click: 2.6 }
const WORKER_URL = import.meta.env.VITE_WORKER_URL

function pct(a, b) { return (!b || !a) ? 0 : Math.round((a / b) * 100) }
function fmt(n)    { return (n || 0).toLocaleString('el-GR') }

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MetricsTab() {
  const [campaigns,  setCampaigns]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selected,   setSelected]   = useState(null)

  async function load() {
    try {
      const snap = await getDocs(
        query(collection(db, 'email_campaigns'), where('status', 'in', ['sent', 'auto', 'partial']))
      )
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      docs.sort((a, b) =>
        (b.sentAt?.seconds || b.createdAt?.seconds || 0) -
        (a.sentAt?.seconds || a.createdAt?.seconds || 0)
      )
      setCampaigns(docs)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  function refresh() { setRefreshing(true); load() }

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

  if (loading) return <Skeleton />

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">📊</div>
        <div className="font-semibold text-gray-600 mb-1">Δεν υπάρχουν δεδομένα</div>
        <div className="text-sm text-gray-400">Στείλε πρώτα μια καμπάνια για να δεις τα αποτελέσματα</div>
      </div>
    )
  }

  const openPct  = pct(totals.opened,  totals.sent)
  const clickPct = pct(totals.clicked, totals.sent)
  const hasEngagement = totals.opened > 0 || totals.clicked > 0

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Επισκόπηση</span>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="text-xs text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
        >
          <span className={refreshing ? 'animate-spin inline-block' : ''}>↺</span>
          {refreshing ? 'Φόρτωση…' : 'Ανανέωση'}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon="📧" label="Αποστολές" value={fmt(totals.sent)}
          sub={`${campaigns.length} καμπάνιες`} color="sky"
        />
        <KpiCard
          icon="👁" label="Open Rate" value={openPct + '%'}
          sub={`${fmt(totals.opened)} ανοίγματα`}
          color={openPct >= BENCHMARKS.open ? 'emerald' : 'amber'}
          badge={openPct >= BENCHMARKS.open ? `↑ vs ${BENCHMARKS.open}%` : `↓ vs ${BENCHMARKS.open}%`}
          badgeGood={openPct >= BENCHMARKS.open}
        />
        <KpiCard
          icon="🖱️" label="Click Rate" value={clickPct + '%'}
          sub={`${fmt(totals.clicked)} κλικ`}
          color={clickPct >= BENCHMARKS.click ? 'indigo' : 'amber'}
          badge={clickPct >= BENCHMARKS.click ? `↑ vs ${BENCHMARKS.click}%` : `↓ vs ${BENCHMARKS.click}%`}
          badgeGood={clickPct >= BENCHMARKS.click}
        />
        <KpiCard
          icon="🚫" label="Opt-outs / Bounces"
          value={fmt(totals.unsubscribed + totals.bounced)}
          sub={pct(totals.unsubscribed + totals.bounced, totals.sent) + '% rate'}
          color="rose"
        />
      </div>

      {/* Webhook hint — shown when sent > 20 but 0 engagement */}
      {!hasEngagement && totals.sent >= 20 && (
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <span className="text-xl shrink-0">⚠️</span>
          <div className="text-sm">
            <div className="font-semibold text-amber-800 mb-0.5">Opens και Clicks εμφανίζονται μόνο μέσω Resend Webhooks</div>
            <div className="text-amber-700 text-xs leading-relaxed">
              Αν δεν έχεις ρυθμίσει webhook, τα αυτά θα παραμένουν 0. Πήγαινε στο{' '}
              <strong>Resend → Webhooks</strong> και πρόσθεσε:<br />
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">{WORKER_URL}/webhook</code>
              {' '}με events: <code className="bg-amber-100 px-1 py-0.5 rounded text-xs">email.opened, email.clicked, email.bounced, email.complained</code>
            </div>
          </div>
        </div>
      )}

      {/* Campaign rows */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Καμπάνιες</div>
        <div className="space-y-2">
          {campaigns.map(c => (
            <CampaignRow
              key={c.id}
              campaign={c}
              expanded={selected === c.id}
              onToggle={() => setSelected(selected === c.id ? null : c.id)}
            />
          ))}
        </div>
      </div>

      {/* Bar chart (only when multiple campaigns) */}
      {campaigns.length > 1 && (
        <div className="card p-5">
          <div className="text-sm font-semibold text-gray-700 mb-4">Σύγκριση Καμπανιών</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={campaigns.map(c => ({
                name:     c.name.length > 14 ? c.name.slice(0, 14) + '…' : c.name,
                'Open %': pct(c.stats?.opened,  c.stats?.sent),
                'Click %':pct(c.stats?.clicked, c.stats?.sent),
              }))}
              margin={{ top: 4, right: 8, left: -22, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => v + '%'}
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.12)' }}
              />
              <Bar dataKey="Open %" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Click %" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-400 shrink-0" />Open Rate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-indigo-400 shrink-0" />Click Rate
            </span>
            <span className="text-gray-400">
              Avg: Open {BENCHMARKS.open}% · Click {BENCHMARKS.click}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Campaign row ──────────────────────────────────────────────────────────────
function CampaignRow({ campaign: c, expanded, onToggle }) {
  const s         = c.stats || {}
  const openPct   = pct(s.opened,   s.sent)
  const clickPct  = pct(s.clicked,  s.sent)
  const bouncePct = pct(s.bounced,  s.sent)
  const failPct   = pct(s.failed,   (s.sent || 0) + (s.failed || 0))

  const sentAt = c.sentAt?.toDate?.() || null
  const dateStr = sentAt
    ? sentAt.toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  const STATUS_COLOR = {
    sent:    'bg-emerald-500',
    auto:    'bg-purple-500',
    partial: 'bg-orange-400',
  }
  const dotColor = STATUS_COLOR[c.status] || 'bg-gray-300'

  // Funnel data for expanded view (CSS-based, no recharts)
  const funnelSteps = [
    { label: 'Στάλθηκαν',  value: s.sent    || 0, max: s.sent || 1, color: 'bg-sky-400',     pctLabel: null },
    { label: 'Ανοίχθηκαν', value: s.opened  || 0, max: s.sent || 1, color: 'bg-emerald-400', pctLabel: openPct  + '%', benchmark: BENCHMARKS.open,  good: openPct  >= BENCHMARKS.open  },
    { label: 'Κλικ',       value: s.clicked || 0, max: s.sent || 1, color: 'bg-indigo-400',  pctLabel: clickPct + '%', benchmark: BENCHMARKS.click, good: clickPct >= BENCHMARKS.click },
  ]

  return (
    <div className="card overflow-hidden border border-gray-100">
      {/* Collapsed header — always visible */}
      <button
        className="w-full text-left px-5 py-4 hover:bg-gray-50/70 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate text-sm">{c.name}</div>
              <div className="text-xs text-gray-400 truncate mt-0.5">{c.subject}</div>
            </div>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <MiniStat label="Εστάλη"   value={fmt(s.sent)}       />
            <MiniStat label="Open"     value={openPct  + '%'}  color={openPct  >= BENCHMARKS.open  ? 'text-emerald-600' : 'text-gray-600'} />
            <MiniStat label="Click"    value={clickPct + '%'}  color={clickPct >= BENCHMARKS.click ? 'text-indigo-600'  : 'text-gray-600'} />
            <MiniStat label="Bounce"   value={bouncePct + '%'} color={bouncePct > 2 ? 'text-rose-500' : 'text-gray-400'} />
            <div className="text-gray-300 text-xs hidden sm:block">{dateStr}</div>
            <span className="text-gray-300">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* Inline rate bars */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <RateBar label="Open Rate"  p={openPct}   benchmark={BENCHMARKS.open}  color="bg-emerald-400" />
          <RateBar label="Click Rate" p={clickPct}  benchmark={BENCHMARKS.click} color="bg-indigo-400"  />
          <RateBar label="Deliver"    p={100 - failPct} color="bg-sky-400" />
        </div>
      </button>

      {/* Expanded drill-down */}
      {expanded && (
        <div className="border-t bg-gray-50/60 px-5 py-5 space-y-5">

          {/* CSS funnel */}
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Funnel</div>
            <div className="space-y-2">
              {funnelSteps.map(step => (
                <div key={step.label} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 font-medium">{step.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-bold">{fmt(step.value)}</span>
                      {step.pctLabel && (
                        <span className={`font-semibold ${step.good ? 'text-emerald-600' : 'text-gray-500'}`}>
                          {step.pctLabel}
                          {step.benchmark != null && (
                            <span className="font-normal text-gray-400"> vs {step.benchmark}%</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${step.color}`}
                      style={{ width: `${Math.min(100, step.max > 0 ? (step.value / step.max) * 100 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            <StatChip icon="📧" label="Εστάλη"    value={fmt(s.sent)}          color="sky"     />
            <StatChip icon="👁" label="Ανοίχθηκαν" value={fmt(s.opened)}        color="emerald" />
            <StatChip icon="🖱️" label="Κλικ"       value={fmt(s.clicked)}       color="indigo"  />
            <StatChip icon="🚫" label="Opt-out"    value={fmt(s.unsubscribed)}  color="orange"  />
            <StatChip icon="↩️" label="Bounce"     value={fmt(s.bounced)}       color={bouncePct > 2 ? 'rose' : 'gray'} />
            <StatChip icon="❌" label="Αποτυχίες"  value={fmt(s.failed)}        color={s.failed > 0 ? 'rose' : 'gray'} />
          </div>

          {/* Benchmark comparison */}
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 space-y-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Σύγκριση με Industry Avg</div>
            <BenchmarkRow label="Open Rate"  actual={openPct}  benchmark={BENCHMARKS.open}  colorGood="bg-emerald-400" />
            <BenchmarkRow label="Click Rate" actual={clickPct} benchmark={BENCHMARKS.click} colorGood="bg-indigo-400"  />
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded-full w-3/4" />
            <div className="h-7 bg-gray-200 rounded-full w-1/2" />
            <div className="h-2 bg-gray-100 rounded-full w-2/3" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded-full w-1/3" />
              <div className="flex gap-4">
                {[...Array(4)].map((_, j) => <div key={j} className="h-4 bg-gray-100 rounded-full w-12" />)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, j) => <div key={j} className="h-2 bg-gray-100 rounded-full" />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, sub, color, badge, badgeGood }) {
  const bg = {
    sky:     'bg-sky-50     border-sky-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    indigo:  'bg-indigo-50  border-indigo-100',
    amber:   'bg-amber-50   border-amber-100',
    rose:    'bg-rose-50    border-rose-100',
  }
  const text = {
    sky:     'text-sky-700',
    emerald: 'text-emerald-700',
    indigo:  'text-indigo-700',
    amber:   'text-amber-700',
    rose:    'text-rose-600',
  }
  return (
    <div className={`rounded-2xl border p-4 space-y-1.5 ${bg[color]}`}>
      <div className="flex items-center justify-between">
        <span className="text-base">{icon}</span>
        {badge && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${badgeGood ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {badge}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold ${text[color]}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  )
}

function MiniStat({ label, value, color = 'text-gray-700' }) {
  return (
    <div className="text-center">
      <div className={`text-sm font-bold leading-tight ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 leading-tight">{label}</div>
    </div>
  )
}

function RateBar({ label, p, benchmark, color }) {
  const above = benchmark != null && p >= benchmark
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span className={`font-semibold ${above ? 'text-emerald-600' : 'text-gray-500'}`}>{p}%</span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(p, 100)}%` }} />
        {benchmark != null && (
          <div
            className="absolute top-0 h-full w-px bg-gray-500 opacity-40"
            style={{ left: `${Math.min(benchmark, 100)}%` }}
          />
        )}
      </div>
    </div>
  )
}

function StatChip({ icon, label, value, color }) {
  const text = { sky: 'text-sky-600', emerald: 'text-emerald-600', indigo: 'text-indigo-600', orange: 'text-orange-500', rose: 'text-rose-500', gray: 'text-gray-600' }
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-3 py-2.5 text-center space-y-0.5">
      <div className="text-xs text-gray-400">{icon} {label}</div>
      <div className={`text-lg font-bold ${text[color] || text.gray}`}>{value}</div>
    </div>
  )
}

function BenchmarkRow({ label, actual, benchmark, colorGood }) {
  const above = actual >= benchmark
  const max   = Math.max(actual, benchmark, 1)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className={`font-semibold ${above ? 'text-emerald-600' : 'text-amber-600'}`}>
          {actual}% {above ? '▲' : '▼'} avg {benchmark}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="space-y-0.5">
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${colorGood}`} style={{ width: `${(actual / max) * 100}%` }} />
          </div>
          <div className="text-xs text-gray-400 text-center">Η καμπάνια σου</div>
        </div>
        <div className="space-y-0.5">
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gray-300" style={{ width: `${(benchmark / max) * 100}%` }} />
          </div>
          <div className="text-xs text-gray-400 text-center">Industry avg</div>
        </div>
      </div>
    </div>
  )
}
