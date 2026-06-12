import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────
   Interactive laser hair-removal demo.
   Real photo of a leg + procedurally drawn hairs on a canvas.
   The cursor is a laser handpiece: hairs it touches flash and
   vanish with a wisp of smoke, then regrow ~1 minute later.
   ───────────────────────────────────────────────────────────── */

// Shin area of the photo, in normalized coords (x→right, y→down)
const LEG_POLY = [
  [0.03, 0.32], [0.10, 0.27], [0.22, 0.28], [0.38, 0.28], [0.55, 0.25],
  [0.70, 0.235], [0.82, 0.235], [0.84, 0.30], [0.70, 0.36], [0.55, 0.41],
  [0.40, 0.47], [0.25, 0.53], [0.12, 0.58], [0.04, 0.58],
]

const HAIR_COUNT = 750
const ZAP_MS = 300          // burn-away animation
const REGROW_AFTER_MS = 60000 // 1 minute
const REGROW_MS = 2200      // growth animation

function pointInPoly(x, y, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

function makeHairs() {
  const hairs = []
  let guard = 0
  while (hairs.length < HAIR_COUNT && guard++ < 60000) {
    const x = Math.random(), y = Math.random()
    if (!pointInPoly(x, y, LEG_POLY)) continue
    const light = Math.random() < 0.22
    hairs.push({
      x, y,
      angle: Math.PI * 0.75 + (Math.random() - 0.5) * 0.55, // mostly down-left, like real shin hair
      len: 0.55 + Math.random() * 0.9,                      // scaled later
      bend: (Math.random() - 0.5) * 0.8,
      w: light ? 0.7 + Math.random() * 0.3 : 0.9 + Math.random() * 0.55,
      alpha: light ? 0.3 + Math.random() * 0.2 : 0.45 + Math.random() * 0.3,
      tone: light ? '94,72,50' : '46,32,22',
      state: 'growing',                                     // grown | zapping | gone | growing
      t: 0,                                                 // growth progress 0..1
      born: Math.random() * 1400,                           // stagger initial grow-in
      zapAt: 0, regrowAt: 0,
    })
  }
  return hairs
}

export default function LaserLegDemo() {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const cursorRef = useRef(null)
  const hintRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    const cursor = cursorRef.current
    if (!stage || !canvas) return

    const ctx = canvas.getContext('2d')
    const hairs = makeHairs()
    const particles = []
    let W = 0, H = 0, dpr = 1
    let raf = 0
    let startT = 0          // set when section scrolls into view
    let zapCount = 0
    let animating = true

    const resize = () => {
      const r = stage.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = r.width; H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      animating = true
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    const hairPath = (h, portion) => {
      const x0 = h.x * W, y0 = h.y * H
      const L = h.len * W * 0.013
      const dx = Math.cos(h.angle), dy = Math.sin(h.angle)
      // perpendicular for the bend
      const px = -dy, py = dx
      const cx = x0 + dx * L * 0.5 + px * h.bend * L * 0.45
      const cy = y0 + dy * L * 0.5 + py * h.bend * L * 0.45
      const x1 = x0 + dx * L + px * h.bend * L * 0.2
      const y1 = y0 + dy * L + py * h.bend * L * 0.2
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      if (portion >= 1) {
        ctx.quadraticCurveTo(cx, cy, x1, y1)
      } else {
        // de Casteljau partial quadratic (draw root→portion)
        const p = portion
        const ax = x0 + (cx - x0) * p, ay = y0 + (cy - y0) * p
        const bx = cx + (x1 - cx) * p, by = cy + (y1 - cy) * p
        const ex = ax + (bx - ax) * p, ey = ay + (by - ay) * p
        ctx.quadraticCurveTo(ax, ay, ex, ey)
      }
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, W, H)
      const sw = Math.max(W * 0.00085, 0.7)
      for (const h of hairs) {
        if (h.state === 'gone') continue
        if (h.state === 'zapping') {
          const k = Math.min((now - h.zapAt) / ZAP_MS, 1)
          // hair burns away tip-first while flashing amber
          ctx.strokeStyle = `rgba(255,${170 - k * 80},${80 - k * 50},${0.9 * (1 - k)})`
          ctx.lineWidth = h.w * sw * (1 + k * 0.6)
          ctx.lineCap = 'round'
          hairPath(h, 1 - k)
          ctx.stroke()
          // tiny glow at the root
          const gx = h.x * W, gy = h.y * H
          const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 9 * (1 - k) + 2)
          g.addColorStop(0, `rgba(255,190,110,${0.5 * (1 - k)})`)
          g.addColorStop(1, 'rgba(255,190,110,0)')
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(gx, gy, 11, 0, 7); ctx.fill()
          continue
        }
        const t = h.state === 'grown' ? 1 : h.t
        if (t <= 0.02) continue
        ctx.strokeStyle = `rgba(${h.tone},${h.alpha * t})`
        ctx.lineWidth = h.w * sw
        ctx.lineCap = 'round'
        hairPath(h, t)
        ctx.stroke()
      }
      // smoke wisps
      for (const p of particles) {
        const k = p.life / p.maxLife
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        g.addColorStop(0, `rgba(200,195,185,${0.22 * (1 - k)})`)
        g.addColorStop(1, 'rgba(200,195,185,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill()
      }
    }

    let prev = performance.now()
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = now - prev; prev = now
      let busy = particles.length > 0

      for (const h of hairs) {
        switch (h.state) {
          case 'growing':
            if (startT && now - startT > h.born) {
              h.t += dt / (h.zapAt ? REGROW_MS : 1100)
              if (h.t >= 1) { h.t = 1; h.state = 'grown' }
              busy = true
            } else if (startT) busy = true
            break
          case 'zapping':
            if (now - h.zapAt >= ZAP_MS) {
              h.state = 'gone'
              h.regrowAt = now + REGROW_AFTER_MS + Math.random() * 9000
            }
            busy = true
            break
          case 'gone':
            if (now >= h.regrowAt) { h.state = 'growing'; h.t = 0; h.born = 0; startT = startT || now }
            break
          default: break
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += dt
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue }
        p.x += p.vx * dt / 1000
        p.y += p.vy * dt / 1000
        p.r += dt * 0.012
        p.vy -= dt * 0.01
      }

      if (busy || animating) { draw(now); animating = busy }
    }
    raf = requestAnimationFrame(tick)

    // start the grow-in only when the demo scrolls into view
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { startT = performance.now(); animating = true; io.disconnect() }
    }, { threshold: 0.25 })
    io.observe(stage)

    const zapAt = (clientX, clientY) => {
      const r = stage.getBoundingClientRect()
      const x = clientX - r.left, y = clientY - r.top
      if (cursor) {
        cursor.style.opacity = '1'
        cursor.style.transform = `translate(${x}px, ${y}px)`
      }
      const radius = Math.max(W * 0.032, 26)
      let hit = false
      for (const h of hairs) {
        if (h.state !== 'grown' && !(h.state === 'growing' && h.t > 0.5)) continue
        const dx = h.x * W - x, dy = h.y * H - y
        if (dx * dx + dy * dy > radius * radius) continue
        h.state = 'zapping'
        h.zapAt = performance.now()
        hit = true
        zapCount++
        if (particles.length < 30 && Math.random() < 0.4) {
          particles.push({
            x: h.x * W, y: h.y * H - 2,
            vx: (Math.random() - 0.5) * 14, vy: -22 - Math.random() * 18,
            r: 2.5 + Math.random() * 2, life: 0, maxLife: 650 + Math.random() * 350,
          })
        }
      }
      if (hit) {
        animating = true
        cursor?.classList.add('dlx-zapping')
        clearTimeout(zapAt._t)
        zapAt._t = setTimeout(() => cursor?.classList.remove('dlx-zapping'), 160)
        if (zapCount > 25 && hintRef.current) hintRef.current.classList.add('dlx-hint-off')
      }
    }

    const onMove = (e) => zapAt(e.clientX, e.clientY)
    const onTouch = (e) => { const t = e.touches[0]; if (t) zapAt(t.clientX, t.clientY) }
    const onLeave = () => { if (cursor) cursor.style.opacity = '0' }

    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('touchmove', onTouch, { passive: true })
    stage.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('touchmove', onTouch)
      stage.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="dlx-laser-section">
      <div className="dlx-laser-copy dlx-reveal">
        <div className="dlx-tools-label">Laser Hair Removal</div>
        <h2 className="dlx-tools-title">Δοκίμασέ το εδώ.</h2>
        <p className="dlx-laser-text">
          Σύρε τον κέρσορα πάνω από το πόδι και δες το laser στη δράση —
          όπως δουλεύει το Motus στις κλινικές μας.
        </p>
        <p className="dlx-laser-note">Οι τρίχες ξαναβγαίνουν σε ένα λεπτό. Στις κλινικές μας… όχι.</p>
      </div>

      <div className="dlx-laser-stage dlx-reveal" ref={stageRef} style={{ '--i': 1 }}>
        <img
          src={`${import.meta.env.BASE_URL}brand/laser-legs.jpg`}
          alt="Laser hair removal"
          className="dlx-laser-photo"
          draggable="false"
        />
        <canvas ref={canvasRef} className="dlx-laser-canvas" />
        <div ref={cursorRef} className="dlx-laser-cursor" aria-hidden="true">
          <span className="dlx-laser-dot" />
        </div>
        <div ref={hintRef} className="dlx-laser-hint">✦ Σύρε τον κέρσορα πάνω στο πόδι</div>
      </div>
    </section>
  )
}
