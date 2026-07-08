import { useEffect, useMemo, useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { ZO_PRODUCTS } from '../../data/zoProducts'
import { QUIZ_STEPS, buildRegimen } from '../../data/zoQuiz'

// ─── ZO® visual language: white, royal blue, serif display, letterspaced caps ──
const BLUE = '#1B3FC4'
const BLUE_DARK = '#14309B'
const PALE = '#EEF1FB'
const INK = '#101014'
const GRAY = '#5A5F6A'

const CATEGORIES = [
  ['ALL', 'All Products'],
  ['GETTING SKIN READY', 'Getting Skin Ready®'],
  ['PREVENT + CORRECT', 'Prevent + Correct'],
  ['PROTECT', 'Protect'],
  ['SUPPLEMENTARY', 'Supplementary'],
  ['PROGRAMS + KITS', 'Programs + Kits'],
]

const STEP_LABEL = {
  'GETTING SKIN READY': 'Getting Skin Ready®',
  'PREVENT + CORRECT': 'Prevent + Correct',
  PROTECT: 'Protect',
  SUPPLEMENTARY: 'Supplementary',
  'PROGRAMS + KITS': 'Programs + Kits',
}

const CLINICS = [
  'DermLux Paphos',
  'DermLux Limassol — Laser',
  'DermLux Limassol — Gold',
  'DermLux Nicosia',
  'DermLux Larnaca',
]

const CART_KEY = 'dermlux_zo_cart_v1'
const fmt = (n) => `€${Number(n).toFixed(2)}`
const imgUrl = (p) => (p.image ? `${import.meta.env.BASE_URL}zo/${p.image}` : null)
const isTravel = (p) => p.category === 'PROGRAMS + KITS' && !/program|kit/i.test(p.name)

function useZoFonts() {
  useEffect(() => {
    const l = document.createElement('link')
    l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600;700&display=swap'
    document.head.appendChild(l)
    return () => document.head.removeChild(l)
  }, [])
}

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" }
const sans = { fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }

function ZoButton({ children, onClick, disabled, outline, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 text-[11px] font-semibold uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{
        ...sans,
        letterSpacing: '0.14em',
        background: outline ? '#fff' : BLUE,
        color: outline ? BLUE : '#fff',
        border: `1px solid ${BLUE}`,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = outline ? PALE : BLUE_DARK }}
      onMouseLeave={(e) => { e.currentTarget.style.background = outline ? '#fff' : BLUE }}
    >
      {children}
    </button>
  )
}

function ProductImage({ p, className }) {
  const url = imgUrl(p)
  if (url) return <img src={url} alt={p.name} loading="lazy" className={`object-contain ${className}`} />
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ background: PALE }}>
      <span style={{ ...serif, color: BLUE }} className="text-3xl">ZO<sup className="text-sm">®</sup></span>
    </div>
  )
}

export default function Eshop() {
  useZoFonts()
  const [cat, setCat] = useState('ALL')
  const [q, setQ] = useState('')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {} } catch { return {} }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [placed, setPlaced] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)) }, [cart])
  useEffect(() => { document.title = 'DermLux × ZO® Skin Health — Shop' }, [])

  const byId = useMemo(() => Object.fromEntries(ZO_PRODUCTS.map((p) => [p.item_no, p])), [])

  const products = useMemo(() => {
    let list = ZO_PRODUCTS
    if (cat !== 'ALL') list = list.filter((p) => p.category === cat)
    if (q.trim()) {
      const t = q.trim().toLowerCase()
      list = list.filter((p) => (p.name + ' ' + (p.description || '')).toLowerCase().includes(t))
    }
    return list
  }, [cat, q])

  const cartLines = useMemo(
    () => Object.entries(cart).filter(([, n]) => n > 0).map(([id, n]) => ({ p: byId[id], qty: n })).filter((l) => l.p),
    [cart, byId]
  )
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0)
  const cartTotal = cartLines.reduce((s, l) => s + l.qty * l.p.srp_incl_vat, 0)

  const addToCart = (id, n = 1) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + n) }))

  return (
    <div className="min-h-screen bg-white" style={{ ...sans, color: INK }}>
      {/* TEST MODE ribbon */}
      <div className="text-center text-[10px] uppercase py-1" style={{ background: '#FFF6DE', color: '#8a6d1a', letterSpacing: '0.2em' }}>
        Test preview — not a live store
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: '#E5E7ED' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => { setCat('ALL'); setQ('') }}>
            <span className="text-xl font-bold tracking-[0.18em]" style={{ color: BLUE }}>ZO<sup className="text-[9px]">®</sup> SKIN HEALTH</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.25em]" style={{ color: GRAY }}>by DermLux Clinics</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuizOpen(true)} className="hidden md:block text-[11px] uppercase font-semibold tracking-[0.14em] hover:underline" style={{ color: BLUE }}>
              Find Your Regimen
            </button>
            <button onClick={() => setCartOpen(true)} className="relative px-3 py-2 text-[11px] uppercase font-semibold tracking-[0.14em] border" style={{ color: BLUE, borderColor: BLUE }}>
              Bag
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center" style={{ background: BLUE }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: PALE }}>
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] mb-3" style={{ color: BLUE }}>Medical-grade skincare</p>
          <h1 className="text-4xl md:text-5xl mb-4" style={{ ...serif, color: INK }}>
            Healthy skin for life,<br />by Dr. Zein Obagi
          </h1>
          <p className="max-w-xl mx-auto text-sm mb-7" style={{ color: GRAY }}>
            The complete ZO® Skin Health range — available in Cyprus through DermLux clinics.
            Take our skin analysis and get a regimen built for your skin.
          </p>
          <div className="flex justify-center gap-3">
            <ZoButton onClick={() => setQuizOpen(true)}>Find Your Regimen</ZoButton>
            <ZoButton outline onClick={() => { setCat('ALL'); document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' }) }}>Shop All</ZoButton>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2" id="grid">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center mb-4">
          {CATEGORIES.map(([key, label]) => (
            <button key={key} onClick={() => setCat(key)}
              className="text-[11px] uppercase tracking-[0.14em] pb-1 border-b-2 transition-colors"
              style={{ color: cat === key ? BLUE : GRAY, borderColor: cat === key ? BLUE : 'transparent', fontWeight: cat === key ? 700 : 500 }}>
              {label}
            </button>
          ))}
        </div>
        <div className="max-w-xs mx-auto">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…"
            className="w-full border px-3 py-2 text-sm outline-none focus:border-blue-700" style={{ borderColor: '#D8DBE4' }} />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {products.map((p) => (
            <div key={p.item_no} className="flex flex-col group">
              <button onClick={() => setDetail(p)} className="block">
                <div className="aspect-square bg-white border flex items-center justify-center overflow-hidden mb-3" style={{ borderColor: '#EDEFF4' }}>
                  <ProductImage p={p} className="w-full h-full p-4 group-hover:scale-[1.03] transition-transform" />
                </div>
              </button>
              <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: GRAY }}>
                {STEP_LABEL[p.category]}{isTravel(p) ? ' · Travel size' : ''}
              </p>
              <button onClick={() => setDetail(p)} className="text-left">
                <h3 className="text-lg leading-snug mb-0.5" style={{ ...serif, color: BLUE, fontWeight: 600 }}>{p.name}</h3>
              </button>
              <p className="text-[11px] mb-2" style={{ color: GRAY }}>{p.size}</p>
              <div className="mt-auto">
                <p className="text-sm font-semibold mb-2">{fmt(p.srp_incl_vat)}</p>
                <ZoButton className="w-full" onClick={() => { addToCart(p.item_no); setCartOpen(true) }}>Add to bag</ZoButton>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && <p className="text-center py-16 text-sm" style={{ color: GRAY }}>No products found.</p>}
      </main>

      {/* Footer */}
      <footer className="border-t mt-8" style={{ borderColor: '#E5E7ED' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: BLUE }}>DermLux Laser & Aesthetics</p>
          <p className="text-[11px]" style={{ color: GRAY }}>Paphos · Limassol · Nicosia · Larnaca — Authorized ZO® Skin Health partner in Cyprus</p>
          <p className="text-[11px]" style={{ color: GRAY }}>All prices include VAT.</p>
        </div>
      </footer>

      {/* Product detail modal */}
      {detail && (
        <Modal onClose={() => setDetail(null)} wide>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square border flex items-center justify-center" style={{ borderColor: '#EDEFF4' }}>
              <ProductImage p={detail} className="w-full h-full p-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: GRAY }}>{STEP_LABEL[detail.category]}{isTravel(detail) ? ' · Travel size' : ''}</p>
              <h2 className="text-3xl mb-1" style={{ ...serif, color: BLUE, fontWeight: 600 }}>{detail.name}</h2>
              <p className="text-xs mb-4" style={{ color: GRAY }}>{detail.size}</p>
              {detail.description && <p className="text-sm mb-4 leading-relaxed">{detail.description}</p>}
              {detail.indication && (
                <p className="text-xs mb-4 px-3 py-2" style={{ background: PALE, color: GRAY }}>
                  <b style={{ color: INK }}>Indication: </b>{detail.indication}
                </p>
              )}
              <p className="text-xl font-semibold mb-4">{fmt(detail.srp_incl_vat)}</p>
              <ZoButton className="w-full" onClick={() => { addToCart(detail.item_no); setDetail(null); setCartOpen(true) }}>Add to bag</ZoButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5E7ED' }}>
              <h2 className="text-[12px] uppercase tracking-[0.2em] font-bold" style={{ color: BLUE }}>Your bag ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} className="text-2xl leading-none" style={{ color: GRAY }}>×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cartLines.length === 0 && <p className="text-sm text-center py-16" style={{ color: GRAY }}>Your bag is empty.</p>}
              {cartLines.map(({ p, qty }) => (
                <div key={p.item_no} className="flex gap-3 items-center">
                  <div className="w-16 h-16 border flex-shrink-0 flex items-center justify-center" style={{ borderColor: '#EDEFF4' }}>
                    <ProductImage p={p} className="w-full h-full p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ ...serif, color: BLUE, fontWeight: 600, fontSize: '15px' }}>{p.name}</p>
                    <p className="text-[11px]" style={{ color: GRAY }}>{fmt(p.srp_incl_vat)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => addToCart(p.item_no, -1)} className="w-6 h-6 border text-sm" style={{ borderColor: '#D8DBE4' }}>−</button>
                      <span className="text-sm w-5 text-center">{qty}</span>
                      <button onClick={() => addToCart(p.item_no, 1)} className="w-6 h-6 border text-sm" style={{ borderColor: '#D8DBE4' }}>+</button>
                      <button onClick={() => setCart((c) => ({ ...c, [p.item_no]: 0 }))} className="ml-2 text-[11px] underline" style={{ color: GRAY }}>Remove</button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{fmt(qty * p.srp_incl_vat)}</p>
                </div>
              ))}
            </div>
            {cartLines.length > 0 && (
              <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: '#E5E7ED' }}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total <span className="font-normal text-[11px]" style={{ color: GRAY }}>(incl. VAT)</span></span>
                  <span>{fmt(cartTotal)}</span>
                </div>
                <ZoButton className="w-full" onClick={() => { setCartOpen(false); setCheckout(true) }}>Checkout</ZoButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quiz */}
      {quizOpen && (
        <Quiz
          onClose={() => setQuizOpen(false)}
          byId={byId}
          onAddAll={(ids) => { setCart((c) => { const n = { ...c }; ids.forEach((id) => { n[id] = (n[id] || 0) + 1 }); return n }); setQuizOpen(false); setCartOpen(true) }}
          onAddOne={(id) => addToCart(id)}
        />
      )}

      {/* Checkout */}
      {checkout && (
        <Checkout
          lines={cartLines}
          total={cartTotal}
          onClose={() => setCheckout(false)}
          onPlaced={(order) => { setCheckout(false); setPlaced(order); setCart({}) }}
        />
      )}

      {/* Success */}
      {placed && (
        <Modal onClose={() => setPlaced(null)}>
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: PALE }}>
              <span style={{ color: BLUE }} className="text-2xl">✓</span>
            </div>
            <h2 className="text-3xl mb-2" style={{ ...serif, color: INK }}>Thank you, {placed.name.split(' ')[0]}</h2>
            <p className="text-sm mb-1" style={{ color: GRAY }}>Your order has been received.</p>
            <p className="text-sm mb-4" style={{ color: GRAY }}>
              {placed.fulfillment === 'pickup'
                ? <>Pick up at <b style={{ color: INK }}>{placed.clinic}</b> — we will contact you when it is ready.</>
                : <>We will contact you at <b style={{ color: INK }}>{placed.phone}</b> to arrange courier delivery.</>}
            </p>
            <p className="text-lg font-semibold mb-6">{fmt(placed.total)}</p>
            <ZoButton onClick={() => setPlaced(null)}>Continue shopping</ZoButton>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ children, onClose, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className={`relative bg-white w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl leading-none z-10" style={{ color: GRAY }}>×</button>
        {children}
      </div>
    </div>
  )
}

// ─── Skin analysis quiz ────────────────────────────────────────────────────────
function Quiz({ onClose, byId, onAddAll, onAddOne }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ concerns: [] })
  const [result, setResult] = useState(null)
  const s = QUIZ_STEPS[step]

  const pick = (value) => {
    if (s.single) {
      const next = { ...answers, [s.id]: value }
      setAnswers(next)
      if (step < QUIZ_STEPS.length - 1) setStep(step + 1)
      else setResult(buildRegimen(next))
    } else {
      const cur = answers[s.id] || []
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : cur.length < (s.max || 99) ? [...cur, value] : cur
      setAnswers({ ...answers, [s.id]: next })
    }
  }

  if (result) {
    const groups = {}
    result.recommendations.forEach((r) => { (groups[r.step] = groups[r.step] || []).push(r) })
    const ids = result.recommendations.map((r) => r.itemNo).filter((id) => byId[id])
    const total = ids.reduce((s2, id) => s2 + byId[id].srp_incl_vat, 0)
    const prog = byId[result.program.itemNo]
    return (
      <Modal onClose={onClose} wide>
        <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: BLUE }}>Your skin analysis</p>
        <h2 className="text-3xl mb-4" style={{ ...serif }}>Your personalised ZO® regimen</h2>
        <div className="space-y-5 mb-6">
          {Object.entries(groups).map(([g, recs]) => (
            <div key={g}>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: GRAY }}>{g}</p>
              {recs.map((r) => {
                const p = byId[r.itemNo]
                if (!p) return null
                return (
                  <div key={r.itemNo} className="flex gap-3 items-center py-2 border-b" style={{ borderColor: '#F0F2F7' }}>
                    <div className="w-14 h-14 border flex-shrink-0" style={{ borderColor: '#EDEFF4' }}><ProductImage p={p} className="w-full h-full p-1" /></div>
                    <div className="flex-1 min-w-0">
                      <p style={{ ...serif, color: BLUE, fontWeight: 600 }}>{p.name} <span className="text-xs font-normal" style={{ ...sans, color: INK }}>· {fmt(p.srp_incl_vat)}</span></p>
                      <p className="text-[11px]" style={{ color: GRAY }}>{r.reason}</p>
                    </div>
                    <button onClick={() => onAddOne(r.itemNo)} className="text-[10px] uppercase tracking-[0.12em] font-semibold border px-2 py-1.5" style={{ color: BLUE, borderColor: BLUE }}>Add</button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {prog && (
          <div className="p-4 mb-6" style={{ background: PALE }}>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: BLUE }}>Value alternative</p>
            <p style={{ ...serif, fontWeight: 600, color: BLUE }} className="text-lg">{prog.name} · <span style={{ ...sans, color: INK }} className="text-sm">{fmt(prog.srp_incl_vat)}</span></p>
            <p className="text-[11px] mb-2" style={{ color: GRAY }}>{result.program.reason}</p>
            <button onClick={() => onAddOne(prog.item_no)} className="text-[10px] uppercase tracking-[0.12em] font-semibold underline" style={{ color: BLUE }}>Add the kit instead</button>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">Full regimen: <b>{fmt(total)}</b></p>
          <ZoButton onClick={() => onAddAll(ids)}>Add regimen to bag</ZoButton>
        </div>
        <p className="text-[10px] mt-4" style={{ color: GRAY }}>
          This analysis is a guide, not a medical consultation. For prescription-strength options and personal advice, visit a DermLux clinic.
        </p>
      </Modal>
    )
  }

  const selected = answers[s.id]
  return (
    <Modal onClose={onClose}>
      <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: BLUE }}>Skin analysis · {step + 1}/{QUIZ_STEPS.length}</p>
      <h2 className="text-2xl mb-1" style={{ ...serif }}>{s.title}</h2>
      {s.subtitle && <p className="text-xs mb-3" style={{ color: GRAY }}>{s.subtitle}</p>}
      <div className="h-0.5 w-full mb-5" style={{ background: '#EDEFF4' }}>
        <div className="h-0.5 transition-all" style={{ background: BLUE, width: `${((step + 1) / QUIZ_STEPS.length) * 100}%` }} />
      </div>
      <div className="space-y-2 mb-5">
        {s.options.map((o) => {
          const on = s.single ? selected === o.value : (selected || []).includes(o.value)
          return (
            <button key={o.value} onClick={() => pick(o.value)}
              className="w-full text-left px-4 py-3 border transition-colors"
              style={{ borderColor: on ? BLUE : '#D8DBE4', background: on ? PALE : '#fff' }}>
              <span className="text-sm font-medium">{o.label}</span>
              {o.hint && <span className="block text-[11px]" style={{ color: GRAY }}>{o.hint}</span>}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between">
        <button onClick={() => (step > 0 ? setStep(step - 1) : onClose())} className="text-[11px] uppercase tracking-[0.14em] underline" style={{ color: GRAY }}>
          {step > 0 ? 'Back' : 'Cancel'}
        </button>
        {!s.single && (
          <ZoButton disabled={(selected || []).length === 0}
            onClick={() => (step < QUIZ_STEPS.length - 1 ? setStep(step + 1) : setResult(buildRegimen(answers)))}>
            Continue
          </ZoButton>
        )}
      </div>
    </Modal>
  )
}

// ─── Checkout ──────────────────────────────────────────────────────────────────
function Checkout({ lines, total, onClose, onPlaced }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', fulfillment: 'pickup', clinic: CLINICS[0], address: '', city: '', payment: 'at_pickup' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && f.phone.trim().length >= 8 &&
    (f.fulfillment === 'pickup' ? f.clinic : f.address.trim() && f.city.trim())

  const place = async () => {
    if (!valid || busy) return
    setBusy(true); setErr('')
    const order = {
      source: 'eshop_prototype',
      name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(),
      fulfillment: f.fulfillment,
      clinic: f.fulfillment === 'pickup' ? f.clinic : null,
      address: f.fulfillment === 'delivery' ? `${f.address.trim()}, ${f.city.trim()}` : null,
      payment: f.payment,
      items: lines.map(({ p, qty }) => ({ item_no: p.item_no, name: p.name, qty, price: p.srp_incl_vat })),
      total, status: 'new', createdAt: serverTimestamp(),
    }
    try {
      await addDoc(collection(db, 'eshop_orders'), order)
    } catch {
      // Prototype: unauthenticated visitors cannot write — the order still completes visually.
    }
    setBusy(false)
    onPlaced({ ...order, total })
  }

  const input = 'w-full border px-3 py-2.5 text-sm outline-none focus:border-blue-700'
  const bd = { borderColor: '#D8DBE4' }
  return (
    <Modal onClose={onClose}>
      <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: BLUE }}>Checkout</p>
      <h2 className="text-2xl mb-4" style={{ ...serif }}>Complete your order</h2>

      <div className="space-y-3 mb-5">
        <input className={input} style={bd} placeholder="Full name *" value={f.name} onChange={set('name')} />
        <div className="grid grid-cols-2 gap-3">
          <input className={input} style={bd} placeholder="Email *" type="email" value={f.email} onChange={set('email')} />
          <input className={input} style={bd} placeholder="Phone *" type="tel" value={f.phone} onChange={set('phone')} />
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: GRAY }}>Delivery</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[['pickup', 'Pick up at clinic', 'Free'], ['delivery', 'Courier delivery', 'Fee to be confirmed']].map(([v, l, h]) => (
          <button key={v} onClick={() => setF({ ...f, fulfillment: v })} className="border px-3 py-2.5 text-left"
            style={{ borderColor: f.fulfillment === v ? BLUE : '#D8DBE4', background: f.fulfillment === v ? PALE : '#fff' }}>
            <span className="text-sm font-medium block">{l}</span>
            <span className="text-[10px]" style={{ color: GRAY }}>{h}</span>
          </button>
        ))}
      </div>
      {f.fulfillment === 'pickup' ? (
        <select className={input + ' mb-5'} style={bd} value={f.clinic} onChange={set('clinic')}>
          {CLINICS.map((c) => <option key={c}>{c}</option>)}
        </select>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <input className={input + ' col-span-2'} style={bd} placeholder="Street address *" value={f.address} onChange={set('address')} />
          <input className={input} style={bd} placeholder="City *" value={f.city} onChange={set('city')} />
        </div>
      )}

      <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: GRAY }}>Payment</p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button onClick={() => setF({ ...f, payment: 'at_pickup' })} className="border px-3 py-2.5 text-left"
          style={{ borderColor: f.payment === 'at_pickup' ? BLUE : '#D8DBE4', background: f.payment === 'at_pickup' ? PALE : '#fff' }}>
          <span className="text-sm font-medium block">{f.fulfillment === 'pickup' ? 'Pay at the clinic' : 'Pay on delivery'}</span>
          <span className="text-[10px]" style={{ color: GRAY }}>Card or cash</span>
        </button>
        <button disabled className="border px-3 py-2.5 text-left opacity-45 cursor-not-allowed" style={{ borderColor: '#D8DBE4' }}>
          <span className="text-sm font-medium block">Pay online now</span>
          <span className="text-[10px]" style={{ color: GRAY }}>Coming soon</span>
        </button>
      </div>

      <div className="border-t pt-3 mb-4 space-y-1" style={{ borderColor: '#E5E7ED' }}>
        {lines.map(({ p, qty }) => (
          <div key={p.item_no} className="flex justify-between text-[12px]" style={{ color: GRAY }}>
            <span className="truncate pr-3">{qty} × {p.name}</span><span>{fmt(qty * p.srp_incl_vat)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-semibold pt-1" style={{ color: INK }}>
          <span>Total (incl. VAT)</span><span>{fmt(total)}</span>
        </div>
      </div>

      {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
      <ZoButton className="w-full" disabled={!valid || busy} onClick={place}>{busy ? 'Placing order…' : 'Place order'}</ZoButton>
      <p className="text-[10px] mt-3 text-center" style={{ color: GRAY }}>Test preview — no payment is taken and no real order is created.</p>
    </Modal>
  )
}
