/**
 * Dermlux Email Worker — Cloudflare Worker
 *
 * Endpoints:
 *   POST /send-campaign  — send campaign emails via Resend batch API
 *   POST /unsubscribe    — mark contact as unsubscribed in Firestore
 *   POST /webhook        — receive Resend events (open, click, bounce, complained)
 *
 * Required Worker secrets (set via: wrangler secret put <NAME>):
 *   RESEND_API_KEY        — from resend.com dashboard
 *   FIREBASE_PROJECT_ID   — e.g. dermlux-waitlist
 *   FIREBASE_CLIENT_EMAIL — service account email
 *   FIREBASE_PRIVATE_KEY  — service account private key (with literal \n)
 *   RESEND_WEBHOOK_SECRET — from Resend dashboard → Webhooks → signing secret
 *   ANTHROPIC_API_KEY     — from console.anthropic.com (for /extract-invoice OCR)
 *
 * Extra endpoint:
 *   POST /extract-invoice — read an uploaded expense invoice (image/PDF base64) with Claude, return JSON fields
 */

const APP_URL          = 'https://therapon1997-dermlux.github.io/dermlux-waitlist'
const ALLOWED_ORIGIN   = 'https://therapon1997-dermlux.github.io'
const WORKER_URL       = 'https://empty-hall-968f.therapon1997.workers.dev'
const BATCH_SIZE       = 100
const AUTO_INTERVAL_MS = 2 * 60 * 60 * 1000  // 2 hours

// ─── District mapping (mirrors src/utils/contactTags.js) ─────────────────────
const CITY_TO_DISTRICT = {
  'Nicosia':'Λευκωσία','nicosia':'Λευκωσία','NICOSIA':'Λευκωσία',
  'nicosia cyprus':'Λευκωσία','center nicosia':'Λευκωσία','DermLux Nicosia':'Λευκωσία',
  'Λευκωσία':'Λευκωσία','λευκωσια':'Λευκωσία',
  'Strovolos':'Λευκωσία','Agios Dometios':'Λευκωσία','Dali':'Λευκωσία',
  'Lythrodontas':'Λευκωσία','pendacomo':'Λευκωσία',
  'Limassol':'Λεμεσός','limassol':'Λεμεσός','Gold':'Λεμεσός',
  'DermLux Limassol Gold':'Λεμεσός','DermLux Limassol Laser':'Λεμεσός',
  'Limassol Gold':'Λεμεσός','Limassol Laser':'Λεμεσός','Lemselo':'Λεμεσός',
  'Λεμεσός':'Λεμεσός','Λεμεσος':'Λεμεσός',
  'Kato Polemidhia':'Λεμεσός','Kato Polemidya':'Λεμεσός','Polemidia':'Λεμεσός',
  'pyrgos limassol':'Λεμεσός','Paramytha':'Λεμεσός','Pissouri':'Λεμεσός',
  'Ipsonas':'Λεμεσός','Akrotiri':'Λεμεσός','Ayus Tychones':'Λεμεσός','Μέσα Γειτονιά':'Λεμεσός',
  'Larnaca':'Λάρνακα','larnaca':'Λάρνακα','Larnaka':'Λάρνακα',
  'Λαρνακα':'Λάρνακα','Λάρνακα':'Λάρνακα','DermLux Larnaca':'Λάρνακα',
  'Aradippou':'Λάρνακα','Xylophaghou':'Λάρνακα','Μενεου':'Λάρνακα',
  'Πυλα':'Λάρνακα','Pyla':'Λάρνακα','Κορνος':'Λάρνακα',
  'Paphos':'Πάφος','Páfos':'Πάφος','Pafos':'Πάφος','Paphos, Cyprus':'Πάφος',
  'Πάφος':'Πάφος','Παφος':'Πάφος','DermLux Paphos':'Πάφος',
  'Kissonerga':'Πάφος','Kouklia':'Πάφος','Polis':'Πάφος','Pegeia':'Πάφος',
  'Peyia':'Πάφος','Mesa Chorio':'Πάφος','Tala':'Πάφος','Empa':'Πάφος',
  'Χλωρακας':'Πάφος','Lyso':'Πάφος',
  'Paralimni':'Αμμόχωστος','Αμμωχοστος':'Αμμόχωστος',
  'Lefkosa':'Κατεχόμενα','Lefkoşa':'Κατεχόμενα','Gönyeli':'Κατεχόμενα',
  'Hamitköy':'Κατεχόμενα','Kyrenia':'Κατεχόμενα','Lapithos':'Κατεχόμενα',
  'Akanthou':'Κατεχόμενα','Omorfo':'Κατεχόμενα','Lefke':'Κατεχόμενα',
  'Famagusta':'Κατεχόμενα','Famagusta Walled City':'Κατεχόμενα',
  'Gazimagusa':'Κατεχόμενα','Kibris':'Κατεχόμενα',
}
function workerGetDistrict(city) {
  if (!city || !city.trim()) return 'Άλλο'
  return CITY_TO_DISTRICT[city.trim()] || 'Άλλο'
}

// ─── Audience segment matching (mirrors CampaignSendModal filter logic) ───────
function matchesSegment(contact, seg) {
  if (!seg) return true
  const district = workerGetDistrict(contact.city)
  const status   = (contact.omniluxStatus || '').trim()
  const source   = (contact.omniluxSource || '').trim()
  const lang     = (contact.language      || '').trim()
  const spend    = parseFloat(contact.totalSpend)       || 0
  const appts    = parseInt(contact.appointmentCount)   || 0
  const cats     = Array.isArray(contact.treatmentCategories) ? contact.treatmentCategories : []

  if (seg.districts?.length       && !seg.districts.includes(district))       return false
  if (seg.excludeDistricts?.length && seg.excludeDistricts.includes(district)) return false

  if (seg.spendTiers?.length) {
    const ok = seg.spendTiers.some(id =>
      id === 'spend_lt500'    ? (spend > 0 && spend < 500)   :
      id === 'spend_500_1000' ? (spend >= 500 && spend <= 1000) :
      id === 'spend_gt1000'   ? spend > 1000 : false
    )
    if (!ok) return false
  }
  if (seg.apptTiers?.length) {
    const ok = seg.apptTiers.some(id =>
      id === 'appt_1'    ? appts === 1 :
      id === 'appt_2_6'  ? (appts >= 2  && appts <= 6)  :
      id === 'appt_gt6'  ? (appts >= 7  && appts <= 10) :
      id === 'appt_gt10' ? (appts >= 11 && appts <= 20) :
      id === 'appt_gt20' ? appts > 20 : false
    )
    if (!ok) return false
  }

  if (seg.statuses?.length        && !seg.statuses.includes(status))          return false
  if (seg.excludeStatuses?.length  && seg.excludeStatuses.includes(status))    return false
  if (seg.sources?.length          && !seg.sources.includes(source))           return false
  if (seg.languages?.length        && !seg.languages.includes(lang))           return false

  if (seg.treatmentCategories?.length) {
    if (!seg.treatmentCategories.some(c => cats.includes(c))) return false
  }
  if (seg.excludeTreatmentCategories?.length) {
    if (seg.excludeTreatmentCategories.some(c => cats.includes(c))) return false
  }
  if (seg.keyword) {
    const kw = seg.keyword.toLowerCase().trim()
    if (!`${contact.treatments || ''} ${contact.categories || ''}`.toLowerCase().includes(kw)) return false
  }
  return true
}

export default {
  async fetch(request, env) {
    const url    = new URL(request.url)
    const origin = request.headers.get('Origin') || ''

    const cors = {
      'Access-Control-Allow-Origin':  origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // Authorization is required for the invoice-image GET + upload/extract POSTs;
      // without it the browser preflight blocks those cross-origin requests.
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
      // Lightweight hardening headers — no effect on functionality/connectivity
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })

    try {
      if (url.pathname === '/send-campaign' && request.method === 'POST') {
        return await sendCampaign(request, env, json)
      }
      if (url.pathname === '/unsubscribe' && request.method === 'POST') {
        return await unsubscribeContact(request, env, json)
      }
      // One-click + List-Unsubscribe header target (GET = browser, POST = RFC 8058 one-click).
      // Public, no #fragment, processed server-side so the opt-out is always recorded.
      if (url.pathname === '/u') {
        return await handleUnsubscribeLink(request, env)
      }
      if ((url.pathname === '/webhook' || url.pathname === '/resend-webhook') && request.method === 'POST') {
        return await handleWebhook(request, env, json)
      }
      // Manual trigger endpoint — lets the UI force-run auto-send immediately
      if (url.pathname === '/trigger-auto' && request.method === 'POST') {
        if (origin !== ALLOWED_ORIGIN) return json({ error: 'Forbidden' }, 403)
        const body = await request.json().catch(() => ({}))
        console.log('Manual trigger-auto called from', origin, body.campaignId || '(all)')
        const report = await runAutoSend(env, body.campaignId || null)
        return json({ ok: true, report })
      }
      // Rebuild campaign stats from email_sends docs
      if (url.pathname === '/rebuild-stats' && request.method === 'POST') {
        if (origin !== ALLOWED_ORIGIN) return json({ error: 'Forbidden' }, 403)
        return await rebuildStats(request, env, json)
      }
      // Sync bounced/complained email_sends → email_contacts
      if (url.pathname === '/sync-bounces' && request.method === 'POST') {
        if (origin !== ALLOWED_ORIGIN) return json({ error: 'Forbidden' }, 403)
        return await syncBounces(env, json)
      }
      // Bookkeeping: read an expense invoice with Claude
      if (url.pathname === '/extract-invoice' && request.method === 'POST') {
        const internalKey = request.headers.get('X-Internal-Key') || ''
        const allowedInternal = env.IMPORT_SECRET && internalKey === env.IMPORT_SECRET
        if (origin !== ALLOWED_ORIGIN && !allowedInternal) return json({ error: 'Forbidden' }, 403)
        return await extractInvoice(request, env, json)
      }
      // Temporary bulk import (protected by IMPORT_SECRET)
      if (url.pathname === '/bulk-import-expenses' && request.method === 'POST') {
        return await bulkImportExpenses(request, env, json)
      }
      // Upload invoice image to R2 and link to Firestore record (import script)
      if (url.pathname === '/link-invoice-image' && request.method === 'POST') {
        return await linkInvoiceImage(request, env, json)
      }
      // Upload invoice file from the expense modal (authenticated user)
      if (url.pathname === '/archive-voiso-recording' && request.method === 'POST') {
        return await archiveVoisoRecording(request, env, json)
      }

      if (url.pathname.startsWith('/voiso-audio/')) {
        return await serveVoisoAudio(request, env, url)
      }

      if (url.pathname === '/upload-invoice-file' && request.method === 'POST') {
        return await uploadInvoiceFile(request, env, json)
      }
      // Serve invoice image from R2 (authenticated user)
      if (url.pathname.startsWith('/invoices/') && request.method === 'GET') {
        return await serveInvoiceImage(request, env, url, origin)
      }
      // Admin: set/reset a user's REAL Firebase Auth password (+ store the note)
      if (url.pathname === '/set-user-password' && request.method === 'POST') {
        return await setUserPassword(request, env, json)
      }
      // Admin: fully delete a user (Firebase Auth account + Firestore profile)
      if (url.pathname === '/delete-user' && request.method === 'POST') {
        return await deleteUserAccount(request, env, json)
      }
      return json({ error: 'Not found' }, 404)
    } catch (e) {
      console.error('Worker error:', e)
      return json({ error: e.message }, 500)
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runAutoSend(env))
    ctx.waitUntil(triggerVoisoScoring(env))
  },
}

// Κάθε 15': ζητά από το Base44 να σκοράρει τις νέες αρχειοθετημένες κλήσεις
// (Game Tape). Η function κάνει ΕΝΑ βήμα ανά κάλεσμα (transcribe Ή score) για να
// μένουν σύντομα τα requests — εδώ τη φωνάζουμε επαναληπτικά μέχρι να αδειάσει.
async function triggerVoisoScoring(env) {
  if (!env.VOISO_ARCHIVE_SECRET) return
  const url = `https://dermluxclinics.com/functions/scoreVoisoCalls?secret=${env.VOISO_ARCHIVE_SECRET.trim()}`
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json().catch(() => ({}))
      console.log('voiso scoring step:', JSON.stringify(data).slice(0, 200))
      if (!data.action || data.action === 'idle' || data.action === 'error') break
      if (data.remaining === 0 && data.action !== 'transcribed') break
    } catch (e) {
      console.log('voiso scoring trigger failed:', e.message)
      break
    }
  }
}

// ─── /send-campaign ───────────────────────────────────────────────────────────
async function sendCampaign(request, env, json) {
  const { campaignId, campaign, contacts } = await request.json()

  // Build email objects for Resend batch API (max 100 per call — caller already chunks)
  // Strip placeholder emails that would fail Resend validation AND collapse any
  // duplicate email addresses so the same person never receives the campaign twice.
  const seenEmails = new Set()
  const validContacts = contacts.filter(c => {
    if (!fsValidEmail(c.email)) return false
    const key = c.email.trim().toLowerCase()
    if (seenEmails.has(key)) return false
    seenEmails.add(key)
    return true
  })
  const emails = validContacts.map(contact => {
    const unsub = `${APP_URL}/#/unsubscribe?c=${encodeURIComponent(contact.id)}&cid=${encodeURIComponent(campaignId)}&cn=${encodeURIComponent(campaign.name || '')}&e=${encodeURIComponent(contact.email)}`
    // Header target: a real server endpoint (no #fragment) so Gmail/Apple one-click
    // POST actually reaches the worker and records the opt-out.
    const unsubHeader = `${WORKER_URL}/u?c=${encodeURIComponent(contact.id)}&cid=${encodeURIComponent(campaignId)}&cn=${encodeURIComponent(campaign.name || '')}&e=${encodeURIComponent(contact.email)}`
    const html = (campaign.htmlBody || '')
      .replaceAll('{{name}}', contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)
      .replaceAll('*|UNSUB|*', unsub)
      .replaceAll('*|UPDATE_PROFILE|*', unsub)
      .replaceAll('*|ARCHIVE|*', '#')

    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email.trim()],
      subject: campaign.subject,
      html,
      headers: {
        'List-Unsubscribe':      `<${unsubHeader}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'campaign_id', value: String(campaignId).slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '_') },
        { name: 'contact_id',  value: String(contact.id).slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '_') },
      ],
    }
  })

  // Resend batch API allows max 100 per call — chunk if needed
  const RESEND_MAX = 100
  const results = []

  for (let i = 0; i < emails.length; i += RESEND_MAX) {
    const chunk      = emails.slice(i, i + RESEND_MAX)
    const chunkConts = validContacts.slice(i, i + RESEND_MAX)

    const res = await fetch('https://api.resend.com/emails/batch', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    })

    const resData = await res.json()

    if (res.ok && Array.isArray(resData.data)) {
      resData.data.forEach((item, j) => {
        results.push({
          email:    chunkConts[j].email,
          status:   item.id ? 'sent' : 'failed',
          resendId: item.id || null,
          error:    item.id ? null : JSON.stringify(item),
        })
      })
    } else {
      // Entire chunk failed
      chunkConts.forEach(c => results.push({
        email:    c.email,
        status:   'failed',
        resendId: null,
        error:    resData.message || JSON.stringify(resData),
      }))
    }
  }

  return json({ results })
}

// ─── unsubscribe core (shared by JSON endpoint + one-click link) ──────────────
async function markContactUnsubscribed(env, { contactId, campaignId, campaignName }) {
  if (!contactId) return { ok: false, status: 400, error: 'Missing contactId' }

  // Test sends use a fake contactId — acknowledge without touching Firestore
  if (contactId.startsWith('test_')) return { ok: true, test: true }

  const token   = await getFirebaseToken(env)
  const now     = new Date().toISOString()
  const project = env.FIREBASE_PROJECT_ID

  const fields = {
    status:               { stringValue: 'unsubscribed' },
    unsubscribedAt:       { timestampValue: now },
    updatedAt:            { timestampValue: now },
    lastEvent:            { stringValue: 'unsubscribed' },
    optOutCampaignId:     campaignId   ? { stringValue: campaignId }   : { nullValue: null },
    optOutCampaignName:   campaignName ? { stringValue: campaignName } : { nullValue: null },
    optOutSource:         { stringValue: campaignId ? 'email_link' : 'manual' },
  }

  const mask = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&')

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}?${mask}`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    console.error('Unsubscribe failed:', err)
    return { ok: false, status: 500, error: err }
  }

  // Also increment campaign unsubscribed stat
  if (campaignId) {
    try {
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:commit`,
        {
          method:  'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            writes: [{
              transform: {
                document: `projects/${project}/databases/(default)/documents/email_campaigns/${campaignId}`,
                fieldTransforms: [
                  { fieldPath: 'stats.unsubscribed', increment: { integerValue: '1' } },
                ],
              },
            }],
          }),
        }
      )
    } catch (e) {
      console.error('Failed to increment unsubscribed stat:', e)
    }
  }

  return { ok: true }
}

// ─── POST /unsubscribe (called by the in-app confirmation page) ───────────────
async function unsubscribeContact(request, env, json) {
  const body   = await request.json().catch(() => ({}))
  const result = await markContactUnsubscribed(env, body)
  if (!result.ok) return json({ error: result.error }, result.status || 500)
  return json({ success: true, ...(result.test ? { test: true } : {}) })
}

// ─── GET|POST /u — header / one-click unsubscribe, processed server-side ───────
//   GET  = recipient clicks the link → friendly confirmation page
//   POST = Gmail/Apple RFC 8058 one-click (body "List-Unsubscribe=One-Click")
async function handleUnsubscribeLink(request, env) {
  const p = new URL(request.url).searchParams
  const result = await markContactUnsubscribed(env, {
    contactId:    p.get('c'),
    campaignId:   p.get('cid') || null,
    campaignName: p.get('cn')  || null,
  })

  // One-click clients ignore the body — just need a 2xx
  if (request.method === 'POST') {
    return new Response(result.ok ? 'OK' : (result.error || 'Error'), {
      status:  result.ok ? 200 : (result.status || 500),
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // Browser GET → branded confirmation page
  const ok        = result.ok
  const email     = String(p.get('e') || '').replace(/[<>&"]/g, '')
  const heading   = ok ? 'Διαγραφήκατε' : 'Σφάλμα'
  const message   = ok
    ? `Η διεύθυνση ${email ? `<b>${email}</b> ` : ''}αφαιρέθηκε από τη λίστα μας. Δεν θα λαμβάνετε πλέον ενημερωτικά emails από τη Dermlux.`
    : 'Κάτι πήγε στραβά. Δοκιμάστε ξανά αργότερα ή απαντήστε σε αυτό το email.'
  const html = `<!doctype html><html lang="el"><head><meta charset="utf-8">`
    + `<meta name="viewport" content="width=device-width,initial-scale=1">`
    + `<title>Dermlux — ${heading}</title></head>`
    + `<body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f5f5f5;display:flex;min-height:100vh;align-items:center;justify-content:center">`
    + `<div style="background:#fff;max-width:420px;width:90%;padding:40px;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-align:center">`
    + `<div style="font-size:24px;font-weight:700;color:#161616;letter-spacing:.5px">Dermlux</div>`
    + `<div style="font-size:44px;margin:18px 0">${ok ? '✅' : '⚠️'}</div>`
    + `<h1 style="font-size:20px;color:${ok ? '#15803d' : '#dc2626'};margin:0 0 10px">${heading}</h1>`
    + `<p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0">${message}</p>`
    + `</div></body></html>`
  return new Response(html, {
    status:  ok ? 200 : 500,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// ─── /webhook (Resend events) ─────────────────────────────────────────────────
// Status hierarchy: sent < delivered < opened < clicked (bounced/complained override all)
const STATUS_RANK = { sent: 0, delivered: 1, opened: 2, clicked: 3 }

async function handleWebhook(request, env, json) {
  const body = await request.text()

  // Verify Resend webhook signature (svix)
  if (env.RESEND_WEBHOOK_SECRET) {
    const svixId        = request.headers.get('svix-id')
    const svixTimestamp = request.headers.get('svix-timestamp')
    const svixSignature = request.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Webhook missing svix headers')
      return json({ error: 'Missing signature headers' }, 400)
    }

    const toSign   = `${svixId}.${svixTimestamp}.${body}`
    const secret   = env.RESEND_WEBHOOK_SECRET.replace(/^whsec_/, '')
    const rawKey   = Uint8Array.from(atob(secret), c => c.charCodeAt(0))
    const msgBytes = new TextEncoder().encode(toSign)
    const cryptoKey = await crypto.subtle.importKey('raw', rawKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, msgBytes)
    const computedSig = 'v1,' + btoa(String.fromCharCode(...new Uint8Array(sig)))

    const valid = svixSignature.split(' ').some(s => s === computedSig)
    if (!valid) {
      console.error('Webhook signature mismatch')
      return json({ error: 'Invalid signature' }, 401)
    }
  }

  let event
  try { event = JSON.parse(body) } catch { return json({ ok: true }) }

  const { type, data } = event
  if (!data?.email_id) return json({ ok: true })

  // Supported event types
  const EVENTS = {
    'email.delivered':  'delivered',
    'email.opened':     'opened',
    'email.clicked':    'clicked',
    'email.bounced':    'bounced',
    'email.complained': 'complained',
  }
  const eventName = EVENTS[type]
  if (!eventName) return json({ ok: true })

  // Extract recipient email
  const toField = data.to
  const email   = ((Array.isArray(toField) ? toField[0] : toField) || '').toLowerCase().trim()
  if (!email || !fsValidEmail(email)) {
    console.warn(`Webhook ${type}: invalid/missing email`, data.to)
    return json({ ok: true })
  }

  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const base    = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`
  const now     = new Date().toISOString()

  // ── Deterministic IDs from email (zero Firestore reads) ──
  const contactId = fsContactDocId(email)
  const recordId  = emailToRecordId(email)

  // ── Campaign info from Resend tags (replaces expensive runQuery!) ──
  const rawTags = data.tags
  let tags = {}
  if (Array.isArray(rawTags)) {
    for (const t of rawTags) tags[t.name] = t.value
  } else if (rawTags && typeof rawTags === 'object') {
    tags = rawTags
  }
  const campaignId = tags.campaign_id || null
  const isCampaign = !!campaignId

  // ── Build contact enrichment fields (always set recordId + engagement) ──
  const contactUpdate = {
    recordId:    { integerValue: String(recordId) },
    updatedAt:   { timestampValue: now },
    lastEvent:   { stringValue: eventName },
    lastEventAt: { timestampValue: now },
  }

  switch (eventName) {
    case 'delivered':
      contactUpdate.lastDeliveredAt = { timestampValue: now }
      break
    case 'opened':
      contactUpdate.lastOpenedAt  = { timestampValue: now }
      contactUpdate.lastEngagedAt = { timestampValue: now }
      break
    case 'clicked':
      contactUpdate.lastClickedAt = { timestampValue: now }
      contactUpdate.lastEngagedAt = { timestampValue: now }
      if (data.click?.link) contactUpdate.lastClickedUrl = { stringValue: data.click.link.slice(0, 500) }
      break
    case 'bounced':
      contactUpdate.status    = { stringValue: 'bounced' }
      contactUpdate.bouncedAt = { timestampValue: now }
      if (typeof data.bounce === 'object') {
        const reason = data.bounce.message || data.bounce.description || ''
        if (reason) contactUpdate.bounceReason = { stringValue: reason.slice(0, 500) }
      }
      break
    case 'complained':
      contactUpdate.status       = { stringValue: 'complained' }
      contactUpdate.complainedAt = { timestampValue: now }
      break
  }

  // ── 1. Enrich contact record (campaign AND transactional) ──
  const contactUrl  = `${base}/email_contacts/${contactId}`
  const contactMask = Object.keys(contactUpdate).map(k => `updateMask.fieldPaths=${k}`).join('&')

  if (eventName === 'bounced' || eventName === 'complained') {
    // Bounce/complaint: must create contact if missing (to block future sends)
    const getRes = await fetch(contactUrl, { headers: { Authorization: `Bearer ${token}` } })
    if (getRes.ok) {
      await fetch(`${contactUrl}?${contactMask}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: contactUpdate }),
      })
    } else if (getRes.status === 404) {
      await fetch(contactUrl, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            ...contactUpdate,
            email:     { stringValue: email },
            source:    { stringValue: isCampaign ? 'campaign_webhook' : 'transactional_webhook' },
            createdAt: { timestampValue: now },
          },
        }),
      })
    }
    console.log(`Webhook ${type}: ${email} — contact ${getRes.ok ? 'updated' : 'created'} as ${eventName}`)
  } else {
    // Delivered/opened/clicked: just patch, ignore 404 (no create for engagement-only)
    await fetch(`${contactUrl}?${contactMask}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: contactUpdate }),
    })
  }

  // ── 2. Campaign-specific: update email_sends + stats ──
  if (isCampaign) {
    const sendDocId = encodeURIComponent(`${campaignId}||${email}`)

    // Build email_sends update
    const sendUpdate = {}
    switch (eventName) {
      case 'delivered':
        sendUpdate.deliveredAt = { timestampValue: now }
        break
      case 'opened':
        sendUpdate.openedAt = { timestampValue: now }
        break
      case 'clicked':
        sendUpdate.clickedAt = { timestampValue: now }
        if (data.click?.link) sendUpdate.clickedUrl = { stringValue: data.click.link.slice(0, 500) }
        break
      case 'bounced':
        sendUpdate.bouncedAt = { timestampValue: now }
        break
      case 'complained':
        sendUpdate.complainedAt = { timestampValue: now }
        break
    }

    // Read current send doc for status dedup (1 read)
    let currentStatus = null
    const sendGetRes = await fetch(`${base}/email_sends/${sendDocId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (sendGetRes.ok) {
      const sendDoc = await sendGetRes.json()
      currentStatus = sendDoc.fields?.status?.stringValue || 'sent'
    } else {
      // email_sends doc not found — might be a very old email or tag mismatch
      console.warn(`Webhook ${type}: email_sends doc not found for ${campaignId}||${email}`)
    }

    // Only upgrade status (never downgrade clicked→opened, etc.)
    const curRank = STATUS_RANK[currentStatus] ?? -1
    const newRank = STATUS_RANK[eventName] ?? 99
    if (eventName === 'bounced' || eventName === 'complained' || newRank > curRank) {
      sendUpdate.status = { stringValue: eventName }
    }

    // Patch email_sends doc
    if (Object.keys(sendUpdate).length > 0 && currentStatus !== null) {
      const sendMask = Object.keys(sendUpdate).map(k => `updateMask.fieldPaths=${k}`).join('&')
      await fetch(`${base}/email_sends/${sendDocId}?${sendMask}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: sendUpdate }),
      })
    }

    // Determine stat to increment (dedup: only count first occurrence)
    let statField = null
    switch (eventName) {
      case 'opened':
        if (curRank < STATUS_RANK.opened) statField = 'opened'
        break
      case 'clicked':
        if (curRank < STATUS_RANK.clicked) statField = 'clicked'
        break
      case 'bounced':
        if (currentStatus !== 'bounced') statField = 'bounced'
        break
      case 'complained':
        statField = 'unsubscribed'
        break
    }

    if (statField) {
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            writes: [{
              transform: {
                document: `projects/${project}/databases/(default)/documents/email_campaigns/${campaignId}`,
                fieldTransforms: [{
                  fieldPath: `stats.${statField}`,
                  increment: { integerValue: '1' },
                }],
              },
            }],
          }),
        }
      )
    }
  }

  console.log(`Webhook ${type}: ${email} (${isCampaign ? 'campaign ' + campaignId : 'transactional'})`)
  return json({ ok: true })
}

// ─── Auto-send (cron) ─────────────────────────────────────────────────────────

async function runAutoSend(env, forceCampaignId = null) {
  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const now     = new Date()
  const report  = []

  let campaigns
  if (forceCampaignId) {
    // Direct lookup by ID — no query, no race condition
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_campaigns/${forceCampaignId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!res.ok) {
      report.push({ id: forceCampaignId, action: 'error', error: `Campaign not found (${res.status})` })
      return report
    }
    const doc = await res.json()
    campaigns = [{ id: forceCampaignId, ...fsParseFields(doc.fields) }]
  } else {
    // Cron path — find all campaigns with autoSend: true
    campaigns = await fsQuery(token, project, {
      from:  [{ collectionId: 'email_campaigns' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'autoSend' },
          op:    'EQUAL',
          value: { booleanValue: true },
        },
      },
    })
  }

  console.log(`runAutoSend: found ${campaigns.length} auto-send campaign(s)`)

  for (const campaign of campaigns) {
    if (campaign.status === 'sent') {
      report.push({ id: campaign.id, action: 'skipped', reason: 'already sent' })
      continue
    }

    // Only enforce the schedule when running via cron (not forced by UI)
    if (!forceCampaignId) {
      const nextAt = campaign.nextBatchAt ? new Date(campaign.nextBatchAt) : new Date(0)
      if (nextAt > now) {
        const waitMins = Math.round((nextAt - now) / 60000)
        console.log(`Campaign ${campaign.id}: next batch at ${nextAt.toISOString()}, waiting ${waitMins}m`)
        report.push({ id: campaign.id, action: 'waiting', nextBatchAt: nextAt.toISOString(), waitMins })
        continue
      }
    }

    console.log(`Campaign ${campaign.id}: running auto batch`)
    try {
      const batchReport = await sendAutoBatch(campaign, token, project, env, now)
      report.push({ id: campaign.id, action: 'sent', ...batchReport })
    } catch (e) {
      console.error(`Campaign ${campaign.id}: auto batch failed:`, e)
      await fsPatch(token, project, 'email_campaigns', campaign.id, {
        autoSendError: { stringValue: e.message },
      }).catch(() => {})
      report.push({ id: campaign.id, action: 'error', error: e.message })
    }
  }

  return report
}

async function sendAutoBatch(campaign, token, project, env, now) {
  const base   = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`
  const seg    = campaign.audienceSegment ? JSON.parse(campaign.audienceSegment) : null
  const rawCursor = campaign.lastContactCursor || null
  // Handle legacy cursor format (email) — convert to doc ID
  const cursor = rawCursor && rawCursor.includes('@') ? fsContactDocId(rawCursor) : rawCursor
  const LOAD   = BATCH_SIZE * 3  // load 3× to survive segment + already-sent filtering

  // ── 1. Load a SLICE of active contacts after the cursor (ordered by doc ID) ──
  //    Uses __name__ ordering so Firestore's auto single-field index on status suffices
  //    (no composite index required).
  const cursorRef = cursor
    ? `projects/${project}/databases/(default)/documents/email_contacts/${cursor}`
    : null
  const slice = await fsQuery(token, project, {
    from:    [{ collectionId: 'email_contacts' }],
    where:   { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'active' } } },
    orderBy: [{ field: { fieldPath: '__name__' }, direction: 'ASCENDING' }],
    limit:   LOAD,
    ...(cursorRef ? { startAt: { values: [{ referenceValue: cursorRef }], before: false } } : {}),
  })

  // ── 2. Apply audience segment filter + collapse duplicate emails ─────────────
  //    (two contact records sharing one address must never both be mailed)
  const seenBatchEmails = new Set()
  const eligible = slice.filter(c => {
    if (!fsValidEmail(c.email) || !matchesSegment(c, seg)) return false
    const key = c.email.trim().toLowerCase()
    if (seenBatchEmails.has(key)) return false
    seenBatchEmails.add(key)
    return true
  })

  // ── 3. Check sent status via batchGet — 1 subrequest instead of N ─
  //    Cloudflare free plan allows only 50 subrequests per invocation.
  const sentDocPaths = eligible.map(c =>
    `projects/${project}/databases/(default)/documents/email_sends/${campaign.id}||${c.email}`
  )
  const sentMap = new Map()  // email → status
  if (sentDocPaths.length > 0) {
    const bgRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchGet`,
      {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ documents: sentDocPaths }),
      }
    )
    if (bgRes.ok) {
      const bgData = await bgRes.json()
      for (const entry of bgData) {
        if (entry.found) {
          const email = entry.found.fields?.email?.stringValue
          const st    = entry.found.fields?.status?.stringValue
          if (email && st && st !== 'failed') sentMap.set(email, true)
        }
      }
    }
  }

  const unsent    = eligible.filter(c => !sentMap.has(c.email))
  const batch     = unsent.slice(0, BATCH_SIZE)
  const newCursor = eligible.length > 0 ? eligible[eligible.length - 1].id : cursor
  const reachedEnd = slice.length < LOAD  // Firestore returned fewer than requested → end of list

  if (batch.length === 0) {
    if (reachedEnd && !cursor) {
      // Full pass from start found nothing — campaign is truly done
      await fsPatch(token, project, 'email_campaigns', campaign.id, {
        status:            { stringValue: 'sent' },
        autoSend:          { booleanValue: false },
        lastContactCursor: { nullValue: null },
        autoSendError:     { nullValue: null },
      })
      return { sent: 0, failed: 0, remaining: 0 }
    }
    if (reachedEnd) {
      // Reached end but cursor was mid-list — reset to start for next run
      await fsPatch(token, project, 'email_campaigns', campaign.id, {
        lastContactCursor: { nullValue: null },
        nextBatchAt:       { timestampValue: new Date(now.getTime() + AUTO_INTERVAL_MS).toISOString() },
      })
      return { sent: 0, failed: 0, remaining: -1 }
    }
    // Window was all already-sent — advance cursor and try again next run
    await fsPatch(token, project, 'email_campaigns', campaign.id, {
      lastContactCursor: { stringValue: newCursor },
      nextBatchAt:       { timestampValue: new Date(now.getTime() + AUTO_INTERVAL_MS).toISOString() },
    })
    return { sent: 0, failed: 0, remaining: -1 }
  }

  const afterThis = reachedEnd
    ? Math.max(0, unsent.length - batch.length)   // within this window
    : -1  // unknown — more windows remain

  if (batch.length === 0) {
    await fsPatch(token, project, 'email_campaigns', campaign.id, {
      status: { stringValue: 'sent' }, autoSend: { booleanValue: false },
    })
    return
  }

  // 4. Send via Resend batch API
  const emails = batch.map(contact => {
    const unsub = `${APP_URL}/#/unsubscribe?c=${encodeURIComponent(contact.id)}&cid=${encodeURIComponent(campaign.id)}&cn=${encodeURIComponent(campaign.name || '')}&e=${encodeURIComponent(contact.email)}`
    const unsubHeader = `${WORKER_URL}/u?c=${encodeURIComponent(contact.id)}&cid=${encodeURIComponent(campaign.id)}&cn=${encodeURIComponent(campaign.name || '')}&e=${encodeURIComponent(contact.email)}`
    const html  = (campaign.htmlBody || '')
      .replaceAll('{{name}}',           contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)
      .replaceAll('*|UNSUB|*', unsub)
      .replaceAll('*|UPDATE_PROFILE|*', unsub)
      .replaceAll('*|ARCHIVE|*', '#')
    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email.trim()],
      subject: campaign.subject,
      html,
      headers: {
        'List-Unsubscribe':      `<${unsubHeader}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
      tags: [
        { name: 'campaign_id', value: String(campaign.id).slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '_') },
        { name: 'contact_id',  value: String(contact.id).slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '_') },
      ],
    }
  })

  const resRes = await fetch('https://api.resend.com/emails/batch', {
    method:  'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(emails),
  })
  if (!resRes.ok) {
    const errText = await resRes.text()
    throw new Error(`Resend API error ${resRes.status}: ${errText}`)
  }
  const resData = await resRes.json()

  const results = []
  if (Array.isArray(resData.data)) {
    resData.data.forEach((item, i) => {
      results.push({
        email:    batch[i].email,
        status:   item.id ? 'sent' : 'failed',
        resendId: item.id || null,
        error:    item.id ? null : JSON.stringify(item),
      })
    })
  } else {
    batch.forEach(c => results.push({ email: c.email, status: 'failed', resendId: null, error: resData.message || 'Unknown' }))
  }

  const sentCount   = results.filter(r => r.status === 'sent').length
  const failedCount = results.filter(r => r.status === 'failed').length
  const nowIso      = now.toISOString()
  const nextBatchAt = new Date(now.getTime() + AUTO_INTERVAL_MS).toISOString()

  // 5. Write email_sends docs to Firestore (chunks of 500)
  const CHUNK = 500
  for (let i = 0; i < results.length; i += CHUNK) {
    const chunk  = results.slice(i, i + CHUNK)
    const writes = chunk.map(r => ({
      update: {
        name:   `projects/${project}/databases/(default)/documents/email_sends/${campaign.id}||${r.email}`,
        fields: {
          campaignId:   { stringValue: campaign.id },
          contactId:    { stringValue: fsContactDocId(r.email) },
          email:        { stringValue: r.email },
          resendId:     r.resendId ? { stringValue: r.resendId } : { nullValue: null },
          status:       { stringValue: r.status },
          sentAt:       { timestampValue: nowIso },
          failedReason: r.error ? { stringValue: r.error } : { nullValue: null },
          deliveredAt:  { nullValue: null },
          openedAt:     { nullValue: null },
          clickedAt:    { nullValue: null },
          bouncedAt:    { nullValue: null },
          complainedAt: { nullValue: null },
          createdAt:    { timestampValue: nowIso },
        },
      },
    }))
    const bwRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
      {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ writes }),
      }
    )
    if (!bwRes.ok) {
      console.error('email_sends batchWrite failed:', await bwRes.text())
    }
  }

  // 6. FIX: Two SEPARATE calls — Firestore batchWrite does not allow
  //    transform + update on the same document in a single batch.
  //    Call 1: atomically increment stats counters
  const statsRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        writes: [{
          transform: {
            document: `projects/${project}/databases/(default)/documents/email_campaigns/${campaign.id}`,
            fieldTransforms: [
              { fieldPath: 'stats.sent',   increment: { integerValue: String(sentCount) } },
              { fieldPath: 'stats.failed', increment: { integerValue: String(failedCount) } },
            ],
          },
        }],
      }),
    }
  )
  if (!statsRes.ok) {
    console.error('Stats increment failed:', await statsRes.text())
  }

  // Call 2: update status, cursor, nextBatchAt, clear any previous error
  const isDone = reachedEnd && unsent.length <= BATCH_SIZE
  await fsPatch(token, project, 'email_campaigns', campaign.id, {
    status:            { stringValue: isDone ? 'sent' : 'auto' },
    autoSend:          { booleanValue: !isDone },
    nextBatchAt:       { timestampValue: nextBatchAt },
    lastContactCursor: isDone ? { nullValue: null } : { stringValue: newCursor },
    autoSendError:     { nullValue: null },
  })

  return { sent: sentCount, failed: failedCount, remaining: isDone ? 0 : -1, nextBatchAt }
}

// ─── Sync bounces / complaints → email_contacts ───────────────────────────────
async function syncBouncesToContacts(env) {
  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const now     = new Date().toISOString()

  // Fetch all email_sends with status bounced or complained (non-test)
  const sends = await fsQuery(token, project, {
    from:  [{ collectionId: 'email_sends' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'status' },
        op:    'IN',
        value: {
          arrayValue: {
            values: [{ stringValue: 'bounced' }, { stringValue: 'complained' }],
          },
        },
      },
    },
  })

  // Build map contactId → worst status (complained beats bounced)
  const updates = {}
  for (const s of sends) {
    if (s.isTest) continue
    const cid = s.contactId
    if (!cid) continue
    const existing = updates[cid]
    if (!existing || (s.status === 'complained' && existing.status !== 'complained')) {
      updates[cid] = {
        status:       s.status,
        bouncedAt:    s.bouncedAt    || (s.status === 'bounced'    ? s.sentAt : null) || now,
        complainedAt: s.complainedAt || (s.status === 'complained' ? s.sentAt : null) || now,
      }
    }
  }

  let updated = 0
  for (const [contactId, data] of Object.entries(updates)) {
    const fields = data.status === 'bounced'
      ? { status: { stringValue: 'bounced'    }, bouncedAt:    { timestampValue: data.bouncedAt    }, lastEvent: { stringValue: 'bounced'    }, updatedAt: { timestampValue: now } }
      : { status: { stringValue: 'complained' }, complainedAt: { timestampValue: data.complainedAt }, lastEvent: { stringValue: 'complained' }, updatedAt: { timestampValue: now } }

    const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${k}`).join('&')
    const res  = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}?${mask}`,
      {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ fields }),
      }
    )
    if (res.ok) updated++
  }

  console.log(`syncBouncesToContacts: ${updated}/${Object.keys(updates).length} contacts updated`)
  return { updated, total: Object.keys(updates).length }
}

async function syncBounces(env, json) {
  const result = await syncBouncesToContacts(env)
  return json({ ok: true, ...result })
}

// ─── /extract-invoice (Claude OCR for bookkeeping) ────────────────────────────
async function extractInvoice(request, env, json) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'AI not configured' }, 503)

  const { base64, mediaType, fileName } = await request.json().catch(() => ({}))
  if (!base64) return json({ error: 'Missing file data' }, 400)

  const isPdf = (mediaType || '').includes('pdf') || (fileName || '').toLowerCase().endsWith('.pdf')
  const docBlock = isPdf
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
    : { type: 'image',    source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: base64 } }

  // Learning loop: vendor-specific hints saved in Firestore whenever the user
  // corrects a misread field (collection extraction_corrections). Injected into
  // the prompt so the same mistake is not repeated. Non-fatal if unavailable.
  let hints = ''
  try {
    const token   = await getFirebaseToken(env)
    const project = env.FIREBASE_PROJECT_ID
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/extraction_corrections?pageSize=50`,
      { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) {
      const { documents = [] } = await res.json()
      const lines = documents.map(d => {
        const f = d.fields || {}
        const parts = []
        for (const [k, v] of Object.entries(f)) {
          if (v.stringValue && k !== 'type') parts.push(`${k}: ${v.stringValue}`)
        }
        return parts.length ? '- ' + parts.join(' | ') : null
      }).filter(Boolean)
      if (lines.length) hints = `\nKnown vendor-specific corrections from past mistakes (apply when relevant):\n${lines.join('\n')}\n`
    }
  } catch { /* hints are best-effort */ }

  const prompt = `You are reading a single expense invoice/receipt for a beauty clinic in Cyprus. ` +
    `Return ONLY a JSON object (no markdown, no commentary) with exactly these keys: ` +
    `{"vendor": string|null, "vat_number": string|null, "invoice_number": string|null, ` +
    `"date": "YYYY-MM-DD"|null, "net": number|null, "vat": number|null, "vat_rate": number|null, ` +
    `"total": number|null, "currency": string|null, ` +
    `"line_items": [{"description": string, "quantity": number|null, "unit_price": number|null, "amount": number|null}], ` +
    `"category": one of ["6201 · ΑΓΟΡΕΣ","8103 · ΕΝΟΙΚΙΑ","8105 · ΠΛΗΡΩΜΕΣ ΕΙΣ ΤΡΙΤΟΥΣ","8106 · ΤΗΛΕΦΩΝΙΚΑ","8108 · ΗΛΕΚΤΡΙΣΜΟΣ","8109 · ΝΕΡΟ","8110 · ΚΑΘΑΡΙΟΤΗΤΑ","8111 · ΓΡΑΦΙΚΗ ΥΛΗ","8112 · ΣΥΝΤΗΡΙΣΗ ΜΗΧΑΝΗΜΑΤΩΝ","8115 · ΕΛΕΓΚΤΙΚΑ","8116 · ΑΣΦΑΛΙΣΤΡΑ","8117 · ΔΙΚΗΓΟΡΙΚΑ","8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ","8120 · ΦΟΡΟΙ & ΑΔΕΙΕΣ","8122 · ΕΙΣΦΟΡΕΣ - ΣΥΝΔΡΟΜΕΣ","8133 · ΣΥΝΤΗΡΙΣΗ ΚΤΙΡΙΩΝ","8136 · ΑΛΛΑ ΕΞΟΔΑ ΠΡΟΣΩΠΙΚΟΥ","8138 · ΕΦΟΔΙΑ & ΣΥΝΤΗΡΙΣΗ Η/Υ","8144 · ΕΚΤΕΛΩΝΙΣΤΙΚΑ","8151 · ΑΝΑΛΥΣΕΙΣ ΧΗΜΕΙΟΥ","8201 · ΠΡΟΜΗΘΕΙΑ - BONUS","8202 · ΠΕΡΙΠΟΙΗΣΗ ΠΕΛΑΤΩΝ","8203 · ΔΙΑΦΗΜΙΣΕΙΣ","8204 · ΜΕΤΑΦΟΡΙΚΑ","8205 · ΕΞΟΔΑ ΟΧΗΜΑΤΩΝ","8400 · ΤΟΚΟΙ & ΕΞΟΔΑ ΤΡΕΧΟΥΜΕΝΟΥ"]}. ` +
    `Rules: use null when a field is not present. Numbers are plain (no symbols, dot decimals). ` +
    `CRITICAL — statements vs invoices: if the document shows an account summary (Balance Forward, ` +
    `Other invoices, Total Amount Due, Balance Due), then "total" is THIS invoice's own total ` +
    `(the "new charges" / SUBTOTAL+TAX of the itemised lines) — NEVER the account balance due. ` +
    `CRITICAL — dates: Cyprus invoices use DD/MM/YYYY. "date" is the invoice ISSUE date, never the DUE date. ` +
    `line_items: transcribe EVERY product/service line on the invoice exactly as written (keep the original language, e.g. Greek). ` +
    `description = the item text; quantity = units; unit_price = price per unit before line discounts; amount = the line total. ` +
    `If the receipt shows no itemised lines (e.g. a bank/ad/utility summary), return line_items as []. Do not invent lines. ` +
    `vat_rate is a percent number (Cyprus is usually 19, sometimes 9/5/0). currency is an ISO code like "EUR". ` +
    `Pick the best-fitting category from the vendor name and line items. Examples: rent invoice → 8103, electricity/water bill → 8108/8109, Facebook/Google ads → 8203, product supplies for treatments → 6201, phone bill → 8106, accountant fee → 8115, lawyer → 8117, insurance → 8116. ` +
    `Also include a "confidence" key: "high" if the document is clearly printed and all key fields are legible, ` +
    `"low" if it is handwritten, blurry, partially cut off, or you had to guess vendor/total.` + hints

  async function callModel(model) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'x-api-key':         env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 3072,
        messages: [{ role: 'user', content: [docBlock, { type: 'text', text: prompt }] }],
      }),
    })
    if (!res.ok) {
      console.error('Anthropic error:', res.status, await res.text())
      return null
    }
    const data = await res.json()
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
    try {
      const m = text.match(/\{[\s\S]*\}/)
      return { fields: JSON.parse(m ? m[0] : text), usage: data.usage }
    } catch { return null }
  }

  let out = await callModel('claude-haiku-4-5')
  let model = 'claude-haiku-4-5'
  // Escalate to Sonnet for hard documents (handwritten/blurry) or unusable reads
  const weak = !out || out.fields.confidence === 'low' || (!out.fields.vendor && out.fields.total == null)
  if (weak) {
    const better = await callModel('claude-sonnet-4-6')
    if (better) { out = better; model = 'claude-sonnet-4-6' }
  }
  if (!out) return json({ error: 'AI request failed' }, 502)
  return json({ ok: true, fields: out.fields, usage: out.usage, model })
}

// ─── Bulk import expenses (temporary, IMPORT_SECRET protected) ───────────────
async function bulkImportExpenses(request, env, json) {
  const body = await request.json()
  if (!env.IMPORT_SECRET || body.secret !== env.IMPORT_SECRET.trim())
    return json({ error: 'Forbidden' }, 403)
  const { expenses } = body
  if (!Array.isArray(expenses) || expenses.length === 0)
    return json({ error: 'expenses array required' }, 400)

  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const apiBase = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`
  const docBase = `projects/${project}/databases/(default)/documents`
  const now     = new Date().toISOString()

  function fsVal(v) {
    if (v === null || v === undefined) return { nullValue: null }
    if (typeof v === 'boolean') return { booleanValue: v }
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
    return { stringValue: String(v) }
  }

  const writes = expenses.map(exp => {
    const { _docId, ...rest } = exp
    const docId = _docId || crypto.randomUUID()
    const fields = {}
    for (const [k, v] of Object.entries(rest)) fields[k] = fsVal(v)
    fields.createdAt = { timestampValue: now }
    return {
      update: {
        name: `${docBase}/expenses/${docId}`,
        fields,
      }
    }
  })

  // Firestore batchWrite limit = 500
  const chunks = []
  for (let i = 0; i < writes.length; i += 400) chunks.push(writes.slice(i, i + 400))

  let total = 0
  for (const chunk of chunks) {
    const res = await fetch(`${apiBase}:batchWrite`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ writes: chunk }),
    })
    if (!res.ok) {
      const err = await res.text()
      return json({ error: `Firestore batchWrite failed: ${err}` }, 500)
    }
    total += chunk.length
  }
  return json({ ok: true, imported: total })
}

// ─── Link invoice image: upload to R2 + update Firestore record ──────────────
async function linkInvoiceImage(request, env, json) {
  const body = await request.json()
  if (!env.IMPORT_SECRET || body.secret !== env.IMPORT_SECRET.trim())
    return json({ error: 'Forbidden' }, 403)

  const { invoiceNumber, vendor, imageBase64, mediaType, fileName } = body
  if (!imageBase64 || !fileName) return json({ error: 'imageBase64 and fileName required' }, 400)

  // 1. Upload to R2
  const ts      = Date.now()
  const safe    = fileName.replace(/[^\w.\-]/g, '_')
  const key     = `expenses/${ts}_${safe}`
  const bytes   = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0))
  await env.INVOICES.put(key, bytes, { httpMetadata: { contentType: mediaType || 'image/png' } })
  const fileUrl = `${WORKER_URL}/invoices/${encodeURIComponent(key)}`

  // 2. Link to Firestore: use docId directly if provided, otherwise query
  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const fsBase  = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`
  let docName

  if (body.docId) {
    docName = `projects/${project}/databases/(default)/documents/expenses/${body.docId}`
  } else {
    const query = {
      structuredQuery: {
        from:  [{ collectionId: 'expenses' }],
        where: invoiceNumber
          ? { fieldFilter: { field: { fieldPath: 'invoiceNumber' }, op: 'EQUAL', value: { stringValue: invoiceNumber } } }
          : { compositeFilter: { op: 'AND', filters: [
              { fieldFilter: { field: { fieldPath: 'vendor' }, op: 'EQUAL', value: { stringValue: vendor } } },
              { fieldFilter: { field: { fieldPath: 'source' }, op: 'EQUAL', value: { stringValue: 'invoice_import' } } },
            ]}},
        limit: 1,
      },
    }
    const qRes = await fetch(`${fsBase}:runQuery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    })
    if (!qRes.ok) {
      const err = await qRes.text()
      return json({ error: `Firestore query failed (${qRes.status}): ${err}` }, 500)
    }
    const qData = await qRes.json()
    docName = qData.find?.(d => d.document)?.document?.name
    if (!docName) return json({ error: `No expense found for invoiceNumber=${invoiceNumber} vendor=${vendor}` }, 404)
  }

  const mask = 'updateMask.fieldPaths=fileUrl&updateMask.fieldPaths=fileName'
  await fetch(`https://firestore.googleapis.com/v1/${docName}?${mask}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: {
      fileUrl:  { stringValue: fileUrl },
      fileName: { stringValue: fileName },
    }}),
  })

  return json({ ok: true, fileUrl, docName: docName.split('/').pop() })
}

// ─── Upload invoice file from expense modal (Firebase token auth) ─────────────
async function uploadInvoiceFile(request, env, json) {
  const authHeader = request.headers.get('Authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) return json({ error: 'Unauthorized' }, 401)
  try {
    await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID)
  } catch (e) {
    return json({ error: 'Unauthorized: ' + e.message }, 401)
  }

  const { base64, mediaType, fileName } = await request.json().catch(() => ({}))
  if (!base64 || !fileName) return json({ error: 'base64 and fileName required' }, 400)

  const safe    = fileName.replace(/[^\w.\-]/g, '_')
  const key     = `expenses/${Date.now()}_${safe}`
  const bytes   = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  await env.INVOICES.put(key, bytes, { httpMetadata: { contentType: mediaType || 'image/jpeg' } })
  const fileUrl = `${WORKER_URL}/invoices/${encodeURIComponent(key)}`
  return json({ ok: true, fileUrl, fileName: safe })
}

// ─── Voiso recordings: τα signed S3 links του Voiso λήγουν σε 24h, οπότε το
// voisoWebhook (Base44) μας στέλνει εδώ κάθε νέο ηχητικό για μόνιμη αρχειοθέτηση
// στο R2 (voiso/{uuid}.mp3). Το serve προστατεύεται με τον κωδικό του Recordings tab.
async function archiveVoisoRecording(request, env, json) {
  const { secret, uuid, url: mediaUrl } = await request.json().catch(() => ({}))
  if (!env.VOISO_ARCHIVE_SECRET || secret !== env.VOISO_ARCHIVE_SECRET.trim())
    return json({ error: 'Forbidden' }, 403)
  if (!uuid || !mediaUrl) return json({ error: 'uuid and url required' }, 400)
  if (!/^https:\/\/[\w.\-]+\.(voiso\.com|amazonaws\.com)\//.test(mediaUrl))
    return json({ error: 'URL not allowed' }, 400)

  const res = await fetch(mediaUrl)
  if (!res.ok) return json({ error: `download failed ${res.status}` }, 502)
  const buf = await res.arrayBuffer()
  const safe = String(uuid).replace(/[^\w\-]/g, '')
  await env.INVOICES.put(`voiso/${safe}.mp3`, buf, { httpMetadata: { contentType: 'audio/mpeg' } })
  return json({ ok: true, bytes: buf.byteLength, url: `${WORKER_URL}/voiso-audio/${safe}.mp3` })
}

async function serveVoisoAudio(request, env, url) {
  const code = url.searchParams.get('code') || ''
  if (!env.VOISO_AUDIO_CODE || code !== env.VOISO_AUDIO_CODE.trim())
    return new Response('Forbidden', { status: 403 })
  const name = url.pathname.slice('/voiso-audio/'.length).replace(/[^\w.\-]/g, '')
  if (!name) return new Response('Missing file', { status: 400 })
  const obj = await env.INVOICES.get(`voiso/${name}`)
  if (!obj) return new Response('Not found', { status: 404 })
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'private, max-age=3600')
  headers.set('Accept-Ranges', 'bytes')
  return new Response(obj.body, { headers })
}

// ─── Serve invoice image from R2 (Firebase token auth) ───────────────────────
async function serveInvoiceImage(request, env, url, origin) {
  const authHeader = request.headers.get('Authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!token) return new Response('Unauthorized', { status: 401 })
  try {
    await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID)
  } catch (e) {
    return new Response('Unauthorized: ' + e.message, { status: 401 })
  }

  const key = decodeURIComponent(url.pathname.slice('/invoices/'.length))
  if (!key) return new Response('Missing key', { status: 400 })

  const obj = await env.INVOICES.get(key)
  if (!obj) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  if (origin === ALLOWED_ORIGIN) {
    headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    headers.set('Vary', 'Origin')
  }
  obj.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'private, max-age=3600')
  return new Response(obj.body, { headers })
}

// ─── Admin user management (Identity Toolkit admin via service account) ───────
const OWNER_EMAIL = 'therapon1997@gmail.com'  // the owner — can never be deleted

// Verify the CALLER is a signed-in admin; returns { uid, email, token, project }
async function requireAdminCaller(request, env) {
  const authHeader = request.headers.get('Authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
  if (!idToken) throw new Error('Unauthorized')
  const payload = await verifyFirebaseToken(idToken, env.FIREBASE_PROJECT_ID)
  const uid     = payload.user_id || payload.sub
  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/users/${uid}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!r.ok) throw new Error('Caller profile not found')
  const role = (await r.json()).fields?.role?.stringValue
  if (role !== 'admin') throw new Error('Forbidden: admin only')
  return { uid, email: payload.email, token, project }
}

// Resolve a Firebase Auth account (by uid or email) → { localId, email }
async function lookupAuthUser({ uid, email }, token, project) {
  const body = uid ? { localId: [uid] } : { email: [email] }
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${project}/accounts:lookup`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  )
  const u = (await r.json()).users?.[0]
  return u ? { localId: u.localId, email: (u.email || '').toLowerCase() } : null
}

async function setUserPassword(request, env, json) {
  let caller
  try { caller = await requireAdminCaller(request, env) }
  catch (e) { return json({ error: e.message }, e.message.includes('Forbidden') ? 403 : 401) }

  const { uid, email, password } = await request.json().catch(() => ({}))
  if (!password || String(password).length < 6) return json({ error: 'Password must be at least 6 characters' }, 400)

  const target = await lookupAuthUser({ uid, email }, caller.token, caller.project)
  if (!target) return json({ error: 'User not found' }, 404)

  // 1. Update the REAL Firebase Auth password
  const up = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${caller.project}/accounts:update`,
    { method: 'POST', headers: { Authorization: `Bearer ${caller.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ localId: target.localId, password: String(password) }) }
  )
  if (!up.ok) return json({ error: 'Auth update failed: ' + (await up.text()).slice(0, 200) }, 502)

  // 2. Keep the visible note in Firestore in sync
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${caller.project}/databases/(default)/documents/users/${target.localId}?updateMask.fieldPaths=password`,
    { method: 'PATCH', headers: { Authorization: `Bearer ${caller.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { password: { stringValue: String(password) } } }) }
  ).catch(() => {})

  return json({ ok: true })
}

async function deleteUserAccount(request, env, json) {
  let caller
  try { caller = await requireAdminCaller(request, env) }
  catch (e) { return json({ error: e.message }, e.message.includes('Forbidden') ? 403 : 401) }

  const { uid, email } = await request.json().catch(() => ({}))
  const target = await lookupAuthUser({ uid, email }, caller.token, caller.project)
  if (!target) return json({ error: 'User not found' }, 404)

  // Hard guard: the owner account can never be deleted
  if (target.email === OWNER_EMAIL) return json({ error: 'Ο λογαριασμός του ιδιοκτήτη δεν διαγράφεται.' }, 403)

  // 1. Delete the Firebase Auth account
  const del = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${caller.project}/accounts:delete`,
    { method: 'POST', headers: { Authorization: `Bearer ${caller.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ localId: target.localId }) }
  )
  if (!del.ok) return json({ error: 'Auth delete failed: ' + (await del.text()).slice(0, 200) }, 502)

  // 2. Delete the Firestore profile
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${caller.project}/databases/(default)/documents/users/${target.localId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${caller.token}` } }
  ).catch(() => {})

  return json({ ok: true })
}

// ─── Verify Firebase ID token (RS256 JWT from securetoken.google.com) ─────────
async function verifyFirebaseToken(token, projectId) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT')

  const decode = s => JSON.parse(new TextDecoder().decode(
    Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  ))
  const header  = decode(parts[0])
  const payload = decode(parts[1])

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp < now)  throw new Error('Token expired')
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('Invalid issuer')
  if (payload.aud !== projectId) throw new Error('Invalid audience')

  const keysRes = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
  if (!keysRes.ok) throw new Error('Could not fetch public keys')
  const { keys } = await keysRes.json()
  const jwk = keys.find(k => k.kid === header.kid)
  if (!jwk) throw new Error('Unknown key ID')

  const pubKey = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  )
  const sigInput = `${parts[0]}.${parts[1]}`
  const sigBytes = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  const valid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', pubKey, sigBytes, new TextEncoder().encode(sigInput)
  )
  if (!valid) throw new Error('Invalid signature')
  return payload
}

// ─── Firestore REST helpers ───────────────────────────────────────────────────

async function fsQuery(token, project, structuredQuery) {
  const res  = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:runQuery`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ structuredQuery }),
    }
  )
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firestore query failed ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data
    .filter(d => d.document)
    .map(d => ({ id: d.document.name.split('/').pop(), ...fsParseFields(d.document.fields) }))
}

async function fsPatch(token, project, collection, id, fields) {
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${k}`).join('&')
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${collection}/${id}?${mask}`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ fields }),
    }
  )
  if (!res.ok) {
    console.error(`fsPatch ${collection}/${id} failed:`, await res.text())
  }
}

// ─── Rebuild campaign stats from email_sends ──────────────────────────────────
async function rebuildStats(request, env, json) {
  const { campaignId } = await request.json()
  if (!campaignId) return json({ error: 'campaignId required' }, 400)

  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID

  // Paginate through all email_sends for this campaign
  const sends = []
  let pageToken = null
  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:runQuery`)
    const body = {
      structuredQuery: {
        from:  [{ collectionId: 'email_sends' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'campaignId' },
            op:    'EQUAL',
            value: { stringValue: campaignId },
          },
        },
      },
    }
    const res = await fetch(url.toString(), {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const rows = await res.json()
    for (const row of rows) {
      if (row.document) sends.push({ fields: row.document.fields || {}, name: row.document.name })
    }
    pageToken = null // runQuery doesn't paginate the same way — all results in one call
  } while (pageToken)

  // Delete old failed email_sends docs so contacts can be retried by auto-send
  const failedNames = sends
    .filter(s => s.fields.status?.stringValue === 'failed' && !s.fields.isTest?.booleanValue)
    .map(s => s.name)
  if (failedNames.length > 0) {
    for (let i = 0; i < failedNames.length; i += 500) {
      const chunk = failedNames.slice(i, i + 500)
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
        {
          method:  'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ writes: chunk.map(name => ({ delete: name })) }),
        }
      )
    }
  }

  // Count stats from remaining (non-failed) email_sends docs
  const stats = { sent: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, failed: 0 }
  for (const { fields: f } of sends) {
    if (f.isTest?.booleanValue) continue  // skip test sends
    const status = f.status?.stringValue || ''
    if (status === 'failed') continue  // already deleted above
    stats.sent++
    if (f.openedAt?.timestampValue)  stats.opened++
    if (f.clickedAt?.timestampValue) stats.clicked++
    if (f.bouncedAt?.timestampValue) stats.bounced++
    if (status === 'unsubscribed') stats.unsubscribed++
  }

  // Write rebuilt stats to campaign doc
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_campaigns/${campaignId}` +
    `?updateMask.fieldPaths=stats.sent&updateMask.fieldPaths=stats.opened&updateMask.fieldPaths=stats.clicked` +
    `&updateMask.fieldPaths=stats.bounced&updateMask.fieldPaths=stats.unsubscribed&updateMask.fieldPaths=stats.failed`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          stats: {
            mapValue: {
              fields: {
                sent:         { integerValue: String(stats.sent) },
                opened:       { integerValue: String(stats.opened) },
                clicked:      { integerValue: String(stats.clicked) },
                bounced:      { integerValue: String(stats.bounced) },
                unsubscribed: { integerValue: String(stats.unsubscribed) },
                failed:       { integerValue: String(stats.failed) },
              },
            },
          },
        },
      }),
    }
  )

  return json({ ok: true, stats })
}

function fsParseFields(fields) {
  if (!fields) return {}
  const out = {}
  for (const [k, v] of Object.entries(fields)) {
    if (v.stringValue    !== undefined) out[k] = v.stringValue
    else if (v.booleanValue  !== undefined) out[k] = v.booleanValue
    else if (v.integerValue  !== undefined) out[k] = parseInt(v.integerValue)
    else if (v.doubleValue   !== undefined) out[k] = v.doubleValue
    else if (v.timestampValue !== undefined) out[k] = v.timestampValue
    else if (v.nullValue     !== undefined) out[k] = null
    else if (v.mapValue      !== undefined) out[k] = fsParseFields(v.mapValue.fields)
    else if (v.arrayValue    !== undefined) out[k] = (v.arrayValue.values || []).map(item =>
      item.stringValue  !== undefined ? item.stringValue  :
      item.integerValue !== undefined ? parseInt(item.integerValue) :
      item.booleanValue !== undefined ? item.booleanValue :
      item.doubleValue  !== undefined ? item.doubleValue  : null
    )
  }
  return out
}

function fsValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  const trimmed = email.trim()
  if (trimmed.toLowerCase().endsWith('.local')) return false
  const m = /^([a-zA-Z0-9._%+\-]+)@([a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})$/.exec(trimmed)
  if (!m) return false
  const [, local, domain] = m
  // Resend rejects these with a 422 that fails the WHOLE batch:
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  // every domain label must start/end alphanumeric (no 'asg-.com.cy', no empty labels)
  return domain.split('.').every(l => /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(l))
}

// Mirror of frontend contactDocId — btoa is available in Cloudflare Workers
function fsContactDocId(email) {
  const normalized = (email || '').toLowerCase().trim()
  return btoa(normalized).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Deterministic numeric record ID from email (FNV-1a 32-bit hash)
function emailToRecordId(email) {
  const s = (email || '').toLowerCase().trim()
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0)  // unsigned 32-bit
}

// ─── Firebase service-account JWT helper ──────────────────────────────────────
async function getFirebaseToken(env) {
  const now = Math.floor(Date.now() / 1000)

  const b64url = obj =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

  const header  = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss:   env.FIREBASE_CLIENT_EMAIL,
    sub:   env.FIREBASE_CLIENT_EMAIL,
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
    scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform',
  }

  const signingInput = `${b64url(header)}.${b64url(payload)}`

  const pkPem  = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  const pkBody = pkPem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const binaryDer = Uint8Array.from(atob(pkBody), c => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8', binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const jwt = `${signingInput}.${sigB64}`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const { access_token } = await tokenRes.json()
  return access_token
}
