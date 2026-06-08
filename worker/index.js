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
 */

const APP_URL          = 'https://therapon1997-dermlux.github.io/dermlux-waitlist'
const ALLOWED_ORIGIN   = 'https://therapon1997-dermlux.github.io'
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
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
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
      return json({ error: 'Not found' }, 404)
    } catch (e) {
      console.error('Worker error:', e)
      return json({ error: e.message }, 500)
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(runAutoSend(env))
  },
}

// ─── /send-campaign ───────────────────────────────────────────────────────────
async function sendCampaign(request, env, json) {
  const { campaignId, campaign, contacts } = await request.json()

  // Build email objects for Resend batch API (max 100 per call — caller already chunks)
  const emails = contacts.map(contact => {
    const unsub = `${APP_URL}/#/unsubscribe?c=${encodeURIComponent(contact.id)}&cid=${encodeURIComponent(campaignId)}&cn=${encodeURIComponent(campaign.name || '')}&e=${encodeURIComponent(contact.email)}`
    const html = (campaign.htmlBody || '')
      .replaceAll('{{name}}', contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)
      .replaceAll('*|UNSUB|*', unsub)
      .replaceAll('*|UPDATE_PROFILE|*', unsub)
      .replaceAll('*|ARCHIVE|*', '#')

    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email],
      subject: campaign.subject,
      html,
      headers: {
        'List-Unsubscribe':      `<${unsub}>`,
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
    const chunkConts = contacts.slice(i, i + RESEND_MAX)

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

// ─── /unsubscribe ─────────────────────────────────────────────────────────────
async function unsubscribeContact(request, env, json) {
  const { contactId, campaignId, campaignName } = await request.json()
  if (!contactId) return json({ error: 'Missing contactId' }, 400)

  // Test sends use a fake contactId — acknowledge without touching Firestore
  if (contactId.startsWith('test_')) return json({ ok: true, test: true })

  const token = await getFirebaseToken(env)
  const now   = new Date().toISOString()
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
    return json({ error: err }, 500)
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

  return json({ success: true })
}

// ─── /webhook (Resend events) ─────────────────────────────────────────────────
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

    const toSign    = `${svixId}.${svixTimestamp}.${body}`
    const keyBytes  = new TextEncoder().encode(env.RESEND_WEBHOOK_SECRET.replace(/^whsec_/, ''))
    const msgBytes  = new TextEncoder().encode(toSign)

    // Decode base64 secret
    const rawKey = Uint8Array.from(atob(new TextDecoder().decode(keyBytes)), c => c.charCodeAt(0))
    const cryptoKey = await crypto.subtle.importKey('raw', rawKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, msgBytes)
    const computedSig = 'v1,' + btoa(String.fromCharCode(...new Uint8Array(sig)))

    const expectedSigs = svixSignature.split(' ')
    const valid = expectedSigs.some(s => s === computedSig)
    if (!valid) {
      console.error('Webhook signature mismatch')
      return json({ error: 'Invalid signature' }, 401)
    }
  }

  let event
  try { event = JSON.parse(body) } catch { return json({ ok: true }) }

  const { type, data } = event
  const resendId = data?.email_id
  if (!resendId) return json({ ok: true })

  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID

  // Find email_sends doc by resendId
  const qRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:runQuery`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        structuredQuery: {
          from:  [{ collectionId: 'email_sends' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'resendId' },
              op:    'EQUAL',
              value: { stringValue: resendId },
            },
          },
          limit: 1,
        },
      }),
    }
  )

  const qData   = await qRes.json()
  const matched = qData.filter(d => d.document)

  // ── Transactional email (not a campaign) ─────────────────────────────────────
  // No email_sends record found → this came from an appointment confirmation,
  // booking reminder, or other transactional send via Resend.
  // For bounce / spam-complaint events we still want to update email_contacts
  // so the address is excluded from all future campaigns.
  if (!matched.length) {
    if (type !== 'email.bounced' && type !== 'email.complained') return json({ ok: true })

    // Extract recipient address from the webhook payload
    const toField  = data.to
    const toEmail  = ((Array.isArray(toField) ? toField[0] : toField) || '').toLowerCase().trim()
    if (!toEmail || !fsValidEmail(toEmail)) return json({ ok: true })

    const now        = new Date().toISOString()
    const contactId  = fsContactDocId(toEmail)
    const contactUrl = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}`

    const isBounce    = type === 'email.bounced'
    const statusValue = isBounce ? 'bounced' : 'complained'

    // Fields to write regardless of whether the contact already exists
    const updateFields = isBounce
      ? { status: { stringValue: 'bounced'    }, bouncedAt:    { timestampValue: now }, lastEvent: { stringValue: 'bounced'    }, updatedAt: { timestampValue: now } }
      : { status: { stringValue: 'complained' }, complainedAt: { timestampValue: now }, lastEvent: { stringValue: 'complained' }, updatedAt: { timestampValue: now } }

    // Check whether the contact already exists
    const getRes = await fetch(contactUrl, { headers: { Authorization: `Bearer ${token}` } })

    if (getRes.ok) {
      // Contact exists — patch only the status fields (never overwrite name, city, etc.)
      const mask = Object.keys(updateFields).map(k => `updateMask.fieldPaths=${k}`).join('&')
      await fetch(`${contactUrl}?${mask}`, {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: updateFields }),
      })
      console.log(`Transactional ${type}: updated existing contact ${toEmail}`)
    } else if (getRes.status === 404) {
      // Contact doesn't exist — create a minimal record so the address is
      // flagged and never used in future campaigns
      const createFields = {
        ...updateFields,
        email:     { stringValue: toEmail },
        status:    { stringValue: statusValue },
        source:    { stringValue: 'transactional_webhook' },
        createdAt: { timestampValue: now },
      }
      await fetch(contactUrl, {
        method:  'PATCH',   // PATCH without updateMask = create-or-replace
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: createFields }),
      })
      console.log(`Transactional ${type}: created new contact ${toEmail} as ${statusValue}`)
    }

    return json({ ok: true })
  }

  // ── Campaign email ────────────────────────────────────────────────────────────
  const sendDoc    = matched[0].document
  const sendDocId  = sendDoc.name.split('/').pop()
  const fields     = sendDoc.fields || {}
  const campaignId = fields.campaignId?.stringValue
  const contactId  = fields.contactId?.stringValue

  const now = new Date().toISOString()
  // Current status of the email_sends doc — used to deduplicate events.
  // Resend can fire the same event multiple times; we only increment campaign
  // stats on the FIRST occurrence of each event type.
  const currentSendStatus = fields.status?.stringValue || 'sent'

  let sendUpdate    = {}
  let statField     = null   // null = don't increment
  let contactUpdate = null   // fields to patch on email_contacts

  switch (type) {
    case 'email.opened':
      sendUpdate = { status: { stringValue: 'opened' }, openedAt: { timestampValue: now } }
      // Only count first open (status was 'sent'); ignore repeat opens
      statField  = currentSendStatus === 'sent' ? 'opened' : null
      // Always update contact engagement (first open only)
      if (currentSendStatus === 'sent') {
        contactUpdate = {
          lastEngagedAt: { timestampValue: now },
          lastEvent:     { stringValue: 'opened' },
          updatedAt:     { timestampValue: now },
        }
      }
      break
    case 'email.clicked':
      sendUpdate = { status: { stringValue: 'clicked' }, clickedAt: { timestampValue: now } }
      // Count first click only
      statField  = currentSendStatus !== 'clicked' ? 'clicked' : null
      contactUpdate = {
        lastEngagedAt: { timestampValue: now },
        lastEvent:     { stringValue: 'clicked' },
        updatedAt:     { timestampValue: now },
      }
      break
    case 'email.bounced':
      sendUpdate = { status: { stringValue: 'bounced' }, bouncedAt: { timestampValue: now } }
      statField  = currentSendStatus !== 'bounced' ? 'bounced' : null
      contactUpdate = {
        status:    { stringValue: 'bounced' },
        bouncedAt: { timestampValue: now },
        lastEvent: { stringValue: 'bounced' },
        updatedAt: { timestampValue: now },
      }
      break
    case 'email.complained':
      sendUpdate = { status: { stringValue: 'complained' }, complainedAt: { timestampValue: now } }
      statField  = 'unsubscribed'   // count spam as unsubscribe for stats
      contactUpdate = {
        status:       { stringValue: 'complained' },
        complainedAt: { timestampValue: now },
        lastEvent:    { stringValue: 'complained' },
        updatedAt:    { timestampValue: now },
      }
      break
    default:
      return json({ ok: true })
  }

  // 1. Update email_sends doc
  const maskParams = Object.keys(sendUpdate)
    .map(k => `updateMask.fieldPaths=${k}`)
    .join('&')

  await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_sends/${sendDocId}?${maskParams}`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: sendUpdate }),
    }
  )

  // 2. Atomically increment campaign stat
  if (campaignId && statField) {
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
      {
        method:  'POST',
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

  // 3. Update contact document (engagement, bounce, complaint)
  if (contactId && contactUpdate) {
    const contactMask = Object.keys(contactUpdate)
      .map(k => `updateMask.fieldPaths=${k}`)
      .join('&')
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}?${contactMask}`,
      {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: contactUpdate }),
      }
    )
  }

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
  const cursor = campaign.lastContactCursor || null   // email of last contact examined
  const LOAD   = BATCH_SIZE * 3  // load 3× to survive segment + already-sent filtering

  // ── 1. Load a SLICE of active contacts after the cursor (ordered by email) ──
  //    This replaces loading ALL 14 000+ contacts — only reads LOAD docs per run.
  const slice = await fsQuery(token, project, {
    from:    [{ collectionId: 'email_contacts' }],
    where:   { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'active' } } },
    orderBy: [{ field: { fieldPath: 'email' }, direction: 'ASCENDING' }],
    limit:   LOAD,
    ...(cursor ? { startAt: { values: [{ stringValue: cursor }], before: false } } : {}),
  })

  // ── 2. Apply audience segment filter ────────────────────────────────────────
  const eligible = slice.filter(c => fsValidEmail(c.email) && matchesSegment(c, seg))

  // ── 3. Check sent status via direct doc GET — O(1) per contact, in parallel ─
  //    Much cheaper than loading the entire email_sends collection.
  const sentChecks = await Promise.all(
    eligible.map(async c => {
      const docId = encodeURIComponent(`${campaign.id}||${c.email}`)
      const r = await fetch(`${base}/email_sends/${docId}`, { headers: { Authorization: `Bearer ${token}` } })
      if (!r.ok) return { c, sent: false }  // 404 = not sent yet
      const doc = await r.json()
      const st  = doc.fields?.status?.stringValue
      return { c, sent: !!st && st !== 'failed' }  // failed = retry
    })
  )

  const unsent    = sentChecks.filter(x => !x.sent).map(x => x.c)
  const batch     = unsent.slice(0, BATCH_SIZE)
  const newCursor = eligible.length > 0 ? eligible[eligible.length - 1].email : cursor
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
    const html  = (campaign.htmlBody || '')
      .replaceAll('{{name}}',           contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)
      .replaceAll('*|UNSUB|*', unsub)
      .replaceAll('*|UPDATE_PROFILE|*', unsub)
      .replaceAll('*|ARCHIVE|*', '#')
    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email],
      subject: campaign.subject,
      html,
      headers: {
        'List-Unsubscribe':      `<${unsub}>`,
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
          openedAt:     { nullValue: null },
          clickedAt:    { nullValue: null },
          bouncedAt:    { nullValue: null },
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
      if (row.document) sends.push(row.document.fields || {})
    }
    pageToken = null // runQuery doesn't paginate the same way — all results in one call
  } while (pageToken)

  // Count stats from the actual email_sends docs
  const stats = { sent: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0, failed: 0 }
  for (const f of sends) {
    if (f.isTest?.booleanValue) continue  // skip test sends
    const status = f.status?.stringValue || ''
    if (status === 'failed') { stats.failed++; continue }
    stats.sent++
    if (f.openedAt  && !f.openedAt.nullValue)  stats.opened++
    if (f.clickedAt && !f.clickedAt.nullValue)  stats.clicked++
    if (f.bouncedAt && !f.bouncedAt.nullValue)  stats.bounced++
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
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email.trim())
}

// Mirror of frontend contactDocId — btoa is available in Cloudflare Workers
function fsContactDocId(email) {
  const normalized = (email || '').toLowerCase().trim()
  return btoa(normalized).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
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
    scope: 'https://www.googleapis.com/auth/datastore',
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
