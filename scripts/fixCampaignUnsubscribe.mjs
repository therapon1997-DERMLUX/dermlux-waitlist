/**
 * Fixes existing campaigns in Firestore that still have Mailchimp placeholders
 * (*|UNSUB|*, *|UPDATE_PROFILE|*, *|ARCHIVE|*) instead of {{unsubscribe_url}}.
 *
 * Run: node scripts/fixCampaignUnsubscribe.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createSign } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SA      = JSON.parse(readFileSync(resolve(__dirname, '../serviceAccountKey.json'), 'utf-8'))
const PROJECT = SA.project_id
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

// ── Auth ──────────────────────────────────────────────────────────────────────
async function getToken() {
  const now = Math.floor(Date.now() / 1000)
  const hdr = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const pld = Buffer.from(JSON.stringify({
    iss: SA.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
  })).toString('base64url')
  const msg = `${hdr}.${pld}`
  const sig = (() => { const s = createSign('RSA-SHA256'); s.update(msg); return s.sign(SA.private_key, 'base64url') })()
  const jwt = `${msg}.${sig}`
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  const d = await r.json()
  if (!d.access_token) throw new Error('Token failed: ' + JSON.stringify(d))
  return d.access_token
}

// ── Fix HTML ──────────────────────────────────────────────────────────────────
function fixHtml(html) {
  // Replace broken Mailchimp unsubscribe placeholder with our placeholder
  let fixed = html.replace(/\*\|UNSUB\|\*/g, '{{unsubscribe_url}}')

  // Remove broken "Update preferences" and "View in browser" links (entire <a> tags)
  fixed = fixed.replace(
    /<span[^>]*>&nbsp;·&nbsp;<\/span>\s*<a[^>]*\*\|UPDATE_PROFILE\|\*[^>]*>Update preferences<\/a>/gi, ''
  )
  fixed = fixed.replace(
    /<span[^>]*>&nbsp;·&nbsp;<\/span>\s*<a[^>]*\*\|ARCHIVE\|\*[^>]*>View in browser<\/a>/gi, ''
  )
  // Also catch any remaining Mailchimp placeholders just in case
  fixed = fixed.replace(/\*\|UPDATE_PROFILE\|\*/g, '#')
  fixed = fixed.replace(/\*\|ARCHIVE\|\*/g, '#')

  return fixed
}

// ── Main ──────────────────────────────────────────────────────────────────────
const token = await getToken()

// List all campaigns
const listRes = await fetch(`${BASE_URL}/email_campaigns?pageSize=100`, {
  headers: { Authorization: `Bearer ${token}` },
})
const listData = await listRes.json()
const docs = listData.documents || []

console.log(`Found ${docs.length} campaigns. Checking for broken unsubscribe links…\n`)

let fixed = 0

for (const doc of docs) {
  const name      = doc.name  // full resource path
  const campaignName = doc.fields?.name?.stringValue || '(unnamed)'
  const htmlBody  = doc.fields?.htmlBody?.stringValue || ''

  if (!htmlBody.includes('*|UNSUB|*')) {
    console.log(`✓ OK        — ${campaignName}`)
    continue
  }

  const newHtml = fixHtml(htmlBody)
  console.log(`✗ FIXING    — ${campaignName}`)

  const patchRes = await fetch(
    `https://firestore.googleapis.com/v1/${name}?updateMask.fieldPaths=htmlBody`,
    {
      method:  'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { htmlBody: { stringValue: newHtml } } }),
    }
  )

  if (patchRes.ok) {
    console.log(`  → Fixed successfully`)
    fixed++
  } else {
    const err = await patchRes.text()
    console.log(`  → ERROR: ${err.slice(0, 200)}`)
  }
}

console.log(`\nDone. Fixed ${fixed} campaign(s).`)
