import { useState, useEffect, useRef, useCallback } from 'react'

// Workspace monitor for employee Stavrina Metaxa (role: marketer, own Claude Code account).
// "Τι έκανε / πώς το έκανε" = her git history on the email repo (Claude Code commits + diffs).
// "Ζωντανό preview" = her actual app, same origin so it shares this Firebase login session.
const REPO = 'therapon1997-DERMLUX/dermlux-email'
const STAVRI_APP_URL = 'https://therapon1997-dermlux.github.io/dermlux-email/'
const STAVRI_REPO_URL = `https://github.com/${REPO}`
const STAVRI_LOGIN = 'stavrimetaxa2002@gmail.com'

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return 'μόλις τώρα'
  const m = Math.floor(s / 60)
  if (m < 60) return `πριν ${m}′`
  const h = Math.floor(m / 60)
  if (h < 24) return `πριν ${h}ω`
  const days = Math.floor(h / 24)
  if (days < 30) return `πριν ${days} μέρες`
  return d.toLocaleDateString('el-GR')
}

function ActivityFeed() {
  const [commits, setCommits] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://api.github.com/repos/${REPO}/commits?per_page=40`, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`GitHub ${res.status}`)
      const data = await res.json()
      setCommits(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || 'Σφάλμα φόρτωσης')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="p-8 text-center text-[#8B8378] text-sm animate-pulse">Φόρτωση δραστηριότητας…</div>
  if (error) return (
    <div className="p-8 text-center text-[#8B8378] text-sm">
      Δεν φορτώθηκε το ιστορικό ({error}).{' '}
      <button onClick={load} className="text-[#9D835E] hover:underline">Δοκίμασε ξανά</button> ή{' '}
      <a href={`${STAVRI_REPO_URL}/commits`} target="_blank" rel="noopener noreferrer" className="text-[#9D835E] hover:underline">δες στο GitHub</a>.
    </div>
  )
  if (!commits?.length) return <div className="p-8 text-center text-[#8B8378] text-sm">Καμία καταγεγραμμένη ενέργεια ακόμη.</div>

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#8B8378] text-xs">
          Κάθε γραμμή = μία ενέργεια (commit). Πάτησε <span className="text-[#cfc9bb]">«Δες αλλαγές»</span> για να δεις ακριβώς <span className="text-[#cfc9bb]">πώς</span> το έκανε.
        </p>
        <button onClick={load} className="text-[#cfc9bb] hover:text-[#EEECE0] text-xs">↻ Ανανέωση</button>
      </div>
      <ol className="relative border-l border-[#2a2620] ml-2">
        {commits.map((c) => {
          const msg = c.commit?.message || ''
          const [title, ...rest] = msg.split('\n')
          const body = rest.join('\n').trim()
          const author = c.author?.login || c.commit?.author?.name || '—'
          const date = c.commit?.author?.date
          return (
            <li key={c.sha} className="mb-4 ml-5">
              <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-[#9D835E] border-2 border-[#161616]" />
              <div className="card bg-[#1a1814] border-[#2a2620] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[#EEECE0] text-sm font-medium break-words">{title}</p>
                    {body && (
                      <p className="text-[#8B8378] text-xs mt-1 whitespace-pre-wrap break-words">{body}</p>
                    )}
                    <p className="text-[#6f6a60] text-[11px] mt-2">
                      {author} · {date ? timeAgo(date) : ''} · <span className="font-mono">{c.sha.slice(0, 7)}</span>
                    </p>
                  </div>
                  <a
                    href={c.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-2.5 py-1 rounded-md text-xs font-medium text-[#cfc9bb] bg-[#2a2620] hover:bg-[#9D835E] hover:text-[#161616] transition-colors"
                  >
                    Δες αλλαγές →
                  </a>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function LivePreview() {
  const [reloadKey, setReloadKey] = useState(0)
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 flex items-center justify-between bg-[#0e0d0b] border-b border-[#2a2620]">
        <p className="text-[#8B8378] text-xs">Ζωντανός χώρος εργασίας της Σταύρης — ίδια εφαρμογή & εργαλεία.</p>
        <button onClick={() => setReloadKey(k => k + 1)} className="text-[#cfc9bb] hover:text-[#EEECE0] text-xs">↻ Ανανέωση</button>
      </div>
      <div className="flex-1 relative bg-[#0e0d0b]">
        <iframe
          key={reloadKey}
          src={STAVRI_APP_URL}
          title="Σταύρη Μεταξά — Email Marketing workspace"
          className="absolute inset-0 w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  )
}

export default function StavriView() {
  const [tab, setTab] = useState('activity')

  const tabClass = (t) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      tab === t ? 'bg-[#9D835E] text-[#161616]' : 'text-[#cfc9bb] hover:bg-[#2a2620] hover:text-[#EEECE0]'
    }`

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Header */}
      <div className="bg-[#161616] border-b border-[#9D835E]/25 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#9D835E] text-[#161616] flex items-center justify-center font-serif text-lg font-semibold"
                 style={{ fontFamily: "'Prata', Georgia, serif" }}>
              ΣΜ
            </div>
            <div>
              <h1 className="text-[#EEECE0] font-serif text-lg leading-tight" style={{ fontFamily: "'Prata', Georgia, serif" }}>
                Σταύρη Μεταξά
              </h1>
              <p className="text-[#8B8378] text-xs">
                Email Marketing · Claude Code · ρόλος <span className="text-[#cfc9bb]">marketer</span> · {STAVRI_LOGIN}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setTab('activity')} className={tabClass('activity')}>🧾 Δραστηριότητα</button>
            <button onClick={() => setTab('preview')} className={tabClass('preview')}>🖥️ Ζωντανό Preview</button>
            <a href={STAVRI_APP_URL} target="_blank" rel="noopener noreferrer"
               className="hidden sm:inline-block px-3 py-1.5 rounded-md text-sm font-medium text-[#cfc9bb] hover:bg-[#2a2620] hover:text-[#EEECE0] transition-colors">
              ↗ Νέα καρτέλα
            </a>
            <a href={`${STAVRI_REPO_URL}/commits`} target="_blank" rel="noopener noreferrer"
               className="hidden sm:inline-block px-3 py-1.5 rounded-md text-sm font-medium text-[#cfc9bb] hover:bg-[#2a2620] hover:text-[#EEECE0] transition-colors">
              ⟨ ⟩ GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-[#0e0d0b]">
        {tab === 'activity' ? <ActivityFeed /> : <LivePreview />}
      </div>
    </div>
  )
}
