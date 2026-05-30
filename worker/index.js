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
 */

const APP_URL   = 'https://therapon1997-dermlux.github.io/dermlux-waitlist'
const BATCH_SIZE = 100
const AUTO_INTERVAL_MS = 2 * 60 * 60 * 1000  // 2 hours

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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
      if (url.pathname === '/ping-resend') {
        const key = env.RESEND_API_KEY || ''
        const allKeys = Object.keys(env)
        return json({ allEnvKeys: allKeys, keyPresent: !!key, keyPrefix: key.slice(0, 6), keyLength: key.length })
      }
      return json({ error: 'Not found' }, 404)
    } catch (e) {
      console.error(e)
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
    const unsub = `${APP_URL}/#/unsubscribe?c=${encodeURIComponent(contact.id)}`
    const html = (campaign.htmlBody || '')
      .replaceAll('{{name}}', contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)

    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email],
      subject: campaign.subject,
      html,
      tags: [
        { name: 'campaign_id', value: String(campaignId).slice(0, 64) },
        { name: 'contact_id',  value: String(contact.id).slice(0, 64) },
      ],
    }
  })

  // Resend batch API
  const res = await fetch('https://api.resend.com/emails/batch', {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emails),
  })

  const resData = await res.json()

  const results = []
  if (res.ok && Array.isArray(resData.data)) {
    resData.data.forEach((item, i) => {
      results.push({
        email:    contacts[i].email,
        status:   item.id ? 'sent' : 'failed',
        resendId: item.id || null,
        error:    item.id ? null : JSON.stringify(item),
      })
    })
  } else {
    // Entire batch failed
    contacts.forEach(c => results.push({
      email:    c.email,
      status:   'failed',
      resendId: null,
      error:    resData.message || JSON.stringify(resData),
    }))
  }

  return json({ results })
}

// ─── /unsubscribe ─────────────────────────────────────────────────────────────
async function unsubscribeContact(request, env, json) {
  const { contactId } = await request.json()
  if (!contactId) return json({ error: 'Missing contactId' }, 400)

  const token = await getFirebaseToken(env)
  const now   = new Date().toISOString()
  const project = env.FIREBASE_PROJECT_ID

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}` +
    `?updateMask.fieldPaths=status&updateMask.fieldPaths=unsubscribedAt&updateMask.fieldPaths=updatedAt&updateMask.fieldPaths=lastEvent`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          status:         { stringValue: 'unsubscribed' },
          unsubscribedAt: { timestampValue: now },
          updatedAt:      { timestampValue: now },
          lastEvent:      { stringValue: 'unsubscribed' },
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return json({ error: err }, 500)
  }

  return json({ success: true })
}

// ─── /webhook (Resend events) ─────────────────────────────────────────────────
async function handleWebhook(request, env, json) {
  const body = await request.text()
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
  if (!matched.length) return json({ ok: true })

  const sendDoc    = matched[0].document
  const sendDocId  = sendDoc.name.split('/').pop()
  const fields     = sendDoc.fields || {}
  const campaignId = fields.campaignId?.stringValue
  const contactId  = fields.contactId?.stringValue

  const now = new Date().toISOString()
  let sendUpdate  = {}
  let statField   = null
  let contactStatus = null

  switch (type) {
    case 'email.opened':
      sendUpdate  = { status: { stringValue: 'opened' }, openedAt: { timestampValue: now } }
      statField   = 'opened'
      break
    case 'email.clicked':
      sendUpdate  = { status: { stringValue: 'clicked' }, clickedAt: { timestampValue: now } }
      statField   = 'clicked'
      break
    case 'email.bounced':
      sendUpdate  = { status: { stringValue: 'bounced' }, bouncedAt: { timestampValue: now } }
      statField   = 'bounced'
      contactStatus = 'bounced'
      break
    case 'email.complained':
      sendUpdate  = { status: { stringValue: 'complained' } }
      statField   = 'unsubscribed'
      contactStatus = 'complained'
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

  // 3. Update contact status for hard events (bounce / spam complaint)
  if (contactId && contactStatus) {
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/email_contacts/${contactId}` +
      `?updateMask.fieldPaths=status&updateMask.fieldPaths=updatedAt`,
      {
        method:  'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            status:    { stringValue: contactStatus },
            updatedAt: { timestampValue: now },
          },
        }),
      }
    )
  }

  return json({ ok: true })
}

// ─── Auto-send (cron) ─────────────────────────────────────────────────────────

async function runAutoSend(env) {
  const token   = await getFirebaseToken(env)
  const project = env.FIREBASE_PROJECT_ID
  const now     = new Date()

  // Find all campaigns with autoSend: true
  const campaigns = await fsQuery(token, project, {
    from:  [{ collectionId: 'email_campaigns' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'autoSend' },
        op:    'EQUAL',
        value: { booleanValue: true },
      },
    },
  })

  for (const campaign of campaigns) {
    if (campaign.status === 'sent') continue

    // Only fire if nextBatchAt is in the past (or missing)
    const nextAt = campaign.nextBatchAt ? new Date(campaign.nextBatchAt) : new Date(0)
    if (nextAt > now) continue

    await sendAutoBatch(campaign, token, project, env, now)
  }
}

async function sendAutoBatch(campaign, token, project, env, now) {
  // 1. All active contacts
  const activeContacts = await fsQuery(token, project, {
    from:  [{ collectionId: 'email_contacts' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'status' },
        op:    'EQUAL',
        value: { stringValue: 'active' },
      },
    },
  })

  // 2. Who already received this campaign
  const sends      = await fsQuery(token, project, {
    from:  [{ collectionId: 'email_sends' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'campaignId' },
        op:    'EQUAL',
        value: { stringValue: campaign.id },
      },
    },
  })
  const sentEmails = new Set(sends.map(s => s.email))

  // 3. Remaining contacts not yet sent to
  const remaining = activeContacts.filter(c => c.email && !sentEmails.has(c.email))
  const batch     = remaining.slice(0, BATCH_SIZE)
  const afterThis = remaining.length - batch.length

  if (batch.length === 0) {
    await fsPatch(token, project, 'email_campaigns', campaign.id, {
      status:   { stringValue: 'sent' },
      autoSend: { booleanValue: false },
    })
    return
  }

  // 4. Send via Resend batch API
  const emails = batch.map(contact => {
    const unsub = `${APP_URL}/#/unsubscribe?c=${encodeURIComponent(contact.id)}`
    const html  = (campaign.htmlBody || '')
      .replaceAll('{{name}}',          contact.name || 'Πελάτη')
      .replaceAll('{{unsubscribe_url}}', unsub)
    return {
      from:    `${campaign.fromName} <${campaign.fromEmail}>`,
      to:      [contact.email],
      subject: campaign.subject,
      html,
      tags: [
        { name: 'campaign_id', value: String(campaign.id).slice(0, 64) },
        { name: 'contact_id',  value: String(contact.id).slice(0, 64) },
      ],
    }
  })

  const resRes  = await fetch('https://api.resend.com/emails/batch', {
    method:  'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(emails),
  })
  const resData = await resRes.json()

  const results = []
  if (resRes.ok && Array.isArray(resData.data)) {
    resData.data.forEach((item, i) => {
      results.push({
        email:    batch[i].email,
        id:       batch[i].id,
        status:   item.id ? 'sent' : 'failed',
        resendId: item.id || null,
        error:    item.id ? null : JSON.stringify(item),
      })
    })
  } else {
    batch.forEach(c => results.push({ email: c.email, id: c.id, status: 'failed', resendId: null, error: resData.message || 'Unknown' }))
  }

  const sentCount   = results.filter(r => r.status === 'sent').length
  const failedCount = results.filter(r => r.status === 'failed').length
  const nowIso      = now.toISOString()
  const nextBatchAt = new Date(now.getTime() + AUTO_INTERVAL_MS).toISOString()

  // 5. Write email_sends docs to Firestore (in chunks of 500)
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
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
      {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify({ writes }),
      }
    )
  }

  // 6. Update campaign: increment stats + set nextBatchAt + status
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents:batchWrite`,
    {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        writes: [
          {
            transform: {
              document: `projects/${project}/databases/(default)/documents/email_campaigns/${campaign.id}`,
              fieldTransforms: [
                { fieldPath: 'stats.sent',   increment: { integerValue: String(sentCount) } },
                { fieldPath: 'stats.failed', increment: { integerValue: String(failedCount) } },
              ],
            },
          },
          {
            update: {
              name:   `projects/${project}/databases/(default)/documents/email_campaigns/${campaign.id}`,
              fields: {
                status:       { stringValue: afterThis === 0 ? 'sent' : 'auto' },
                autoSend:     { booleanValue: afterThis > 0 },
                nextBatchAt:  { timestampValue: nextBatchAt },
              },
            },
            updateMask: { fieldPaths: ['status', 'autoSend', 'nextBatchAt'] },
          },
        ],
      }),
    }
  )
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
  const data = await res.json()
  return data
    .filter(d => d.document)
    .map(d => ({ id: d.document.name.split('/').pop(), ...fsParseFields(d.document.fields) }))
}

async function fsPatch(token, project, collection, id, fields) {
  const mask = Object.keys(fields).map(k => `updateMask.fieldPaths=${k}`).join('&')
  await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${collection}/${id}?${mask}`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ fields }),
    }
  )
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
  }
  return out
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
