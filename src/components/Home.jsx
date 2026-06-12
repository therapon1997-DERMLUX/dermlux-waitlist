import { useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  animate, createScope, createTimeline, createTimer,
  onScroll, stagger, svg, utils,
} from 'animejs'
import { useAuth } from '../contexts/AuthContext'
import LaserLegDemo from './LaserLegDemo'
import './Home.css'

/* Official DermLux monogram (from the brandbook), transparent PNG.
   Rendered as a stack of layers in Z so the spinning "coin" has real
   3D thickness when seen edge-on. */
const EMBLEM_LAYERS = 7
function emblemLayers() {
  return Array.from({ length: EMBLEM_LAYERS }, (_, i) => (
    <img
      key={i}
      className="dlx-emblem-layer"
      src={`${import.meta.env.BASE_URL}brand/emblem-motif.png`}
      style={{ transform: `translateZ(${(i - (EMBLEM_LAYERS - 1) / 2) * 1.15}px)` }}
      alt=""
      draggable="false"
    />
  ))
}

const CARDS = [
  {
    to: '/waitlist', title: 'Λίστα Αναμονής', desc: 'Πελάτες σε αναμονή, κλήσεις και ραντεβού ανά κλινική.',
    accent: '#9D845F', admin: false,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3.5 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    to: '/medical', title: 'Ασθενείς', desc: 'Ιατρικά αρχεία, επισκέψεις και έντυπα συγκατάθεσης.',
    accent: '#B392A4', admin: false,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h3l2-5 3 10 2.5-5h4.5M12 21C7 17 3 13.6 3 9.5A4.5 4.5 0 0112 6a4.5 4.5 0 019 3.5c0 4.1-4 7.5-9 11.5z" />,
  },
  {
    to: '/email', title: 'Email Marketing', desc: 'Καμπάνιες, επαφές, templates και στατιστικά αποστολών.',
    accent: '#9D845F', admin: true,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
  },
  {
    to: '/bookkeeping', title: 'Λογιστικά', desc: 'Έξοδα, τιμολόγια προμηθευτών και αναφορές ανά κατηγορία.',
    accent: '#4ade80', admin: true,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
  },
  {
    to: '/admin', title: 'Διαχείριση', desc: 'Χρήστες, ρόλοι και ρυθμίσεις του portal.',
    accent: '#7E88BC', admin: true,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 010 .255c-.008.378.137.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
  {
    to: '/election-archive', title: 'Εκλογές 2026', desc: 'Αρχείο εκλογών, επαφές και αποτελέσματα.',
    accent: '#9D845F', ekloges: true,
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
]

const STATS = [
  { n: 5,  label: 'Κλινικές' },
  { n: 14, label: 'Δωμάτια' },
  { n: 40, label: 'Άτομα ομάδα' },
]

export default function Home() {
  const { userProfile, isAdmin, isEkloges } = useAuth()
  const heroRef = useRef(null)
  const rafRef = useRef(0)
  const spinRef = useRef(null)
  const emblemZoneRef = useRef(null)
  const reducedRef = useRef(false)

  /* ════════════════════════════════════════════════════════════
     anime.js scope — every animation lives in here so it is
     reverted cleanly on unmount, and re-built automatically when
     the prefers-reduced-motion media query flips.
     ════════════════════════════════════════════════════════════ */
  useEffect(() => {
    /* shared coin-physics state: the anime timer (inside the scope)
       reads it; the pointer listeners (outside) write to it */
    const physics = { rot: 0, vel: 26, base: 26, dragging: false, lastX: 0, lastT: 0 }

    const scope = createScope({
      root: heroRef,
      mediaQueries: { reduceMotion: '(prefers-reduced-motion: reduce)' },
    }).add(self => {
      const reduced = !!self.matches.reduceMotion
      reducedRef.current = reduced
      const D = ms => (reduced ? 0 : ms)
      /* scroll-scrubbed autoplay — degrades to an instant set */
      const scrub = params => (reduced ? true : onScroll(params))
      physics.base = reduced ? 0 : 26
      physics.vel = physics.base

      /* ── 1 · Hero entrance — one orchestrated timeline ─────── */
      createTimeline({ defaults: { ease: 'outExpo', duration: D(1000) } })
        .add('.dlx-emblem-stage', { opacity: [0, 1], scale: [0.62, 1], rotateX: [-30, 0] })
        .add('.dlx-char', {
          opacity: [0, 1],
          translateY: [46, 0],
          translateZ: [-180, 0],
          rotateX: [-100, 0],
          duration: D(950),
          delay: stagger(D(48), { from: 'center' }),
        }, '-=720')
        .add('.dlx-subtitle', { opacity: [0, 1], letterSpacing: ['18px', '6px'] }, '-=650')
        .add('.dlx-divider span', { opacity: [0, 1], scaleX: [0, 1], duration: D(750) }, '-=560')
        .add('.dlx-tagline', { opacity: [0, 1], translateY: [18, 0], duration: D(700) }, '-=520')
        .add('.dlx-stat', {
          opacity: [0, 1], translateY: [24, 0], rotateX: [-45, 0],
          duration: D(750), delay: stagger(D(120)),
        }, '-=460')
        .add('.dlx-scroll-hint', { opacity: [0, 0.85], duration: D(600) }, '-=250')

      /* count-up numbers as the stats land */
      utils.$('.dlx-stat-num').forEach(el => {
        animate(el, {
          innerHTML: [0, +el.dataset.count],
          modifier: utils.round(0),
          duration: D(2100),
          delay: D(850),
          ease: 'outExpo',
        })
      })

      /* ── 2 · 3D coin cruise on an anime timer ──────────────── */
      const spin = spinRef.current
      if (spin) {
        createTimer({
          onUpdate: t => {
            const dt = Math.min(t.deltaTime / 1000, 0.05)
            if (!physics.dragging) {
              /* fling inertia decays back to cruise speed */
              physics.vel = physics.base + (physics.vel - physics.base) * Math.exp(-dt * 1.3)
              physics.rot += physics.vel * dt
              spin.style.transform = `rotateY(${physics.rot}deg)`
            }
          },
        })
      }

      /* ── 3 · Scroll-scrubbed depth — the page moves WITH you ── */

      /* hero recedes into 3D space as you scroll away, returns
         when you scroll back (sync: true = scrubbed to scroll) */
      animate('.dlx-hero-core', {
        scale: [1, 0.86],
        opacity: [1, 0.1],
        rotateX: [0, 16],
        translateY: [0, -90],
        ease: 'linear',
        autoplay: scrub({
          target: '.dlx-hero',
          enter: { container: 'start', target: 'start' },
          leave: { container: 'start', target: 'end' },
          sync: true,
        }),
      })

      /* laser demo drifts in parallax against the scroll */
      animate('.dlx-laser-stage', {
        translateY: [70, -70],
        ease: 'linear',
        autoplay: scrub({
          target: '.dlx-laser-section',
          enter: 'end start',
          leave: 'start end',
          sync: true,
        }),
      })

      /* section header scrubs in */
      animate('.dlx-tools-head > *', {
        opacity: [0, 1], translateY: [40, 0], rotateX: [-30, 0],
        duration: D(700), delay: stagger(D(140)), ease: 'out(3)',
        autoplay: scrub({
          target: '.dlx-tools-head',
          enter: 'end start',
          leave: 'center center',
          sync: 0.35,
        }),
      })

      /* ── 4 · Cards — fly in from 3D depth, scrubbed ────────── */
      const cards = utils.$('.dlx-card')
      if (cards.length) {
        /* give every card real internal depth: children float at
           different Z heights so the cursor tilt reveals parallax */
        utils.set('.dlx-card-icon',  { translateZ: 42 })
        utils.set('.dlx-card h3',    { translateZ: 26 })
        utils.set('.dlx-card p',     { translateZ: 14 })
        utils.set('.dlx-card-arrow', { translateZ: 32 })

        animate(cards, {
          opacity: [0, 1],
          translateY: [90, 0],
          translateZ: [-160, 0],
          rotateX: [-22, 0],
          duration: D(650), delay: stagger(D(100)), ease: 'out(3)',
          autoplay: scrub({
            target: '.dlx-grid',
            enter: 'end start',
            leave: 'center center',
            sync: 0.3,
          }),
        })

        /* the line icons draw themselves stroke-by-stroke */
        const drawables = svg.createDrawable('.dlx-card-icon path')
        if (drawables.length) {
          animate(drawables, {
            draw: ['0 0', '0 1'],
            duration: D(1500), delay: stagger(D(110), { start: D(220) }),
            ease: 'inOut(2)',
            autoplay: reduced ? true : onScroll({ target: '.dlx-grid' }),
          })
        }
      }

      animate('.dlx-footer', {
        opacity: [0, 1], duration: D(900), ease: 'outExpo',
        autoplay: reduced ? true : onScroll({ target: '.dlx-footer' }),
      })
    })

    /* coin drag/fling — listeners feed the shared physics state */
    const zone = emblemZoneRef.current
    const spin = spinRef.current
    let down, move, up
    if (zone && spin) {
      down = e => {
        physics.dragging = true
        physics.lastX = e.clientX
        physics.lastT = performance.now()
        zone.setPointerCapture?.(e.pointerId)
        zone.classList.add('dlx-grabbing')
      }
      move = e => {
        if (!physics.dragging) return
        const now = performance.now()
        const dx = e.clientX - physics.lastX
        physics.rot += dx * 0.55
        const ms = Math.max(now - physics.lastT, 1)
        physics.vel = Math.max(-900, Math.min(900, (dx * 0.55) / (ms / 1000)))
        physics.lastX = e.clientX
        physics.lastT = now
        spin.style.transform = `rotateY(${physics.rot}deg)`
      }
      up = () => { physics.dragging = false; zone.classList.remove('dlx-grabbing') }
      zone.addEventListener('pointerdown', down)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    }

    return () => {
      scope.revert()
      if (zone && down) {
        zone.removeEventListener('pointerdown', down)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
    }
  }, [])

  /* Cursor → CSS variables: spotlight position + 3D tilt of the emblem.
     One rAF per frame keeps it cheap. */
  const onMouseMove = useCallback((e) => {
    const el = heroRef.current
    if (!el) return
    const { clientX, clientY } = e
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect()
      const nx = (clientX - r.left) / r.width - 0.5   // -0.5 .. 0.5
      const ny = (clientY - r.top) / r.height - 0.5
      el.style.setProperty('--mx', `${clientX - r.left}px`)
      el.style.setProperty('--my', `${clientY - r.top}px`)
      el.style.setProperty('--ry', `${nx * 22}deg`)
      el.style.setProperty('--rx', `${-ny * 22}deg`)
      el.style.setProperty('--px', nx)
      el.style.setProperty('--py', ny)
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = heroRef.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }, [])

  /* ── Card 3D tilt: the card leans toward the cursor, and its
     children (icon, title, text) float at different Z depths ── */
  const onCardMove = useCallback((e) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    /* spotlight position */
    card.style.setProperty('--cx', `${e.clientX - r.left}px`)
    card.style.setProperty('--cy', `${e.clientY - r.top}px`)
    if (reducedRef.current) return
    /* 3D tilt toward cursor */
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    animate(card, {
      rotateY: nx * 16,
      rotateX: -ny * 14,
      duration: 200,
      ease: 'out(2)',
    })
  }, [])

  const onCardLeave = useCallback((e) => {
    if (reducedRef.current) return
    /* spring back flat with a satisfying elastic wobble */
    animate(e.currentTarget, {
      rotateX: 0, rotateY: 0,
      duration: 900, ease: 'outElastic(1, 0.55)',
    })
  }, [])

  const onCardEnter = useCallback((e) => {
    if (reducedRef.current) return
    /* the icon does a full 3D barrel roll */
    const icon = e.currentTarget.querySelector('.dlx-card-icon')
    if (icon) animate(icon, { rotateY: '+=360', duration: 800, ease: 'inOut(2)' })
  }, [])

  /* wordmark letters jump and twist when the cursor brushes them */
  const onCharEnter = useCallback((e) => {
    if (reducedRef.current) return
    animate(e.currentTarget, {
      translateY: [{ to: -20, duration: 170, ease: 'out(3)' }, { to: 0, duration: 850, ease: 'outElastic(1, 0.4)' }],
      rotateZ: [{ to: utils.random(-14, 14), duration: 170 }, { to: 0, duration: 850, ease: 'outElastic(1, 0.4)' }],
      scale: [{ to: 1.25, duration: 170 }, { to: 1, duration: 850, ease: 'outElastic(1, 0.4)' }],
    })
  }, [])

  const particles = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 1.5 + Math.random() * 2.5,
      duration: `${9 + Math.random() * 12}s`,
      delay: `${-Math.random() * 20}s`,
      opacity: 0.12 + Math.random() * 0.35,
    })), [])

  const visibleCards = CARDS.filter(c => {
    if (c.admin) return isAdmin
    if (c.ekloges) return isAdmin || isEkloges
    return userProfile?.role !== 'ekloges'
  })

  const firstName = userProfile?.displayName?.split(' ')[0]

  return (
    <div className="dlx-home" ref={heroRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {/* drifting aurora blobs */}
      <div className="dlx-aurora dlx-aurora-gold" />
      <div className="dlx-aurora dlx-aurora-mauve" />
      <div className="dlx-aurora dlx-aurora-cream" />
      {/* cursor spotlight */}
      <div className="dlx-spotlight" />
      {/* floating gold dust */}
      <div className="dlx-particles" aria-hidden="true">
        {particles.map(p => (
          <span key={p.id} style={{
            left: p.left, width: p.size, height: p.size,
            animationDuration: p.duration, animationDelay: p.delay, opacity: p.opacity,
          }} />
        ))}
      </div>

      <section className="dlx-hero">
        <div className="dlx-hero-core">
          <div className="dlx-emblem-stage" ref={emblemZoneRef}>
            <div className="dlx-emblem-glow" />
            <div className="dlx-ring dlx-ring-1" />
            <div className="dlx-ring dlx-ring-2" />
            <div className="dlx-orbit"><span className="dlx-orbit-dot" /></div>
            <div className="dlx-emblem-tilt">
              <div className="dlx-emblem-spin" ref={spinRef}>
                {emblemLayers()}
              </div>
            </div>
          </div>

          <h1 className="dlx-wordmark" aria-label="DermLux">
            {'DermLux'.split('').map((ch, i) => (
              <span key={i} className="dlx-char" aria-hidden="true" onPointerEnter={onCharEnter}>{ch}</span>
            ))}
          </h1>
          <div className="dlx-subtitle">Medical Aesthetics</div>
          <div className="dlx-divider"><span /></div>
          <p className="dlx-tagline">
            {firstName ? <>Καλώς ήρθες, <em>{firstName}</em>.</> : 'Καλώς ήρθες.'}
          </p>

          <div className="dlx-stats" aria-label="DermLux σε αριθμούς">
            {STATS.map(s => (
              <div key={s.label} className="dlx-stat">
                <span className="dlx-stat-num" data-count={s.n}>0</span>
                <span className="dlx-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dlx-scroll-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      <LaserLegDemo />

      <section className="dlx-tools">
        <div className="dlx-tools-head">
          <div className="dlx-tools-label">Portal</div>
          <h2 className="dlx-tools-title">Τα εργαλεία σου</h2>
        </div>
        <div className="dlx-grid">
          {visibleCards.map((c) => (
            <Link
              key={c.to} to={c.to} className="dlx-card"
              onMouseMove={onCardMove}
              onMouseEnter={onCardEnter}
              onMouseLeave={onCardLeave}
              style={{ '--accent': c.accent }}
            >
              <div className="dlx-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{c.icon}</svg>
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="dlx-card-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
        <footer className="dlx-footer">DermLux Portal — εσωτερικό εργαλείο</footer>
      </section>
    </div>
  )
}
