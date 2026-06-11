// List campaigns; with --flag <id> sets excludeFromMetrics=true on that campaign
import { readFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const now = Math.floor(Date.now() / 1000)
const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
const claims = b64url(JSON.stringify({
  iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
}))
const sig = crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key)
const tok = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claims}.${b64url(sig)}`,
})).json()
const H = { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' }
const base = `https://firestore.googleapis.com/v1/projects/${sa.project_id}/databases/(default)/documents`

const flagId = process.argv.includes('--flag') ? process.argv[process.argv.indexOf('--flag') + 1] : null

if (flagId) {
  const res = await fetch(`${base}/email_campaigns/${flagId}?updateMask.fieldPaths=excludeFromMetrics`, {
    method: 'PATCH', headers: H,
    body: JSON.stringify({ fields: { excludeFromMetrics: { booleanValue: true } } }),
  })
  console.log(res.ok ? `FLAGGED ${flagId} excludeFromMetrics=true` : `ERROR: ${await res.text()}`)
} else {
  const r = await (await fetch(`${base}/email_campaigns`, { headers: H })).json()
  for (const d of r.documents || []) {
    const f = d.fields || {}
    const id = d.name.split('/').pop()
    const g = k => f[k]?.stringValue ?? f[k]?.integerValue ?? f[k]?.booleanValue ?? f[k]?.timestampValue ?? ''
    console.log([
      `id=${id}`,
      `name="${g('name')}"`,
      `status=${g('status')}`,
      `sentCount=${f.stats?.mapValue?.fields?.sent?.integerValue || g('sentCount') || '?'}`,
      `created=${g('createdAt')}`,
      `exclude=${g('excludeFromMetrics') || 'no'}`,
    ].join('  '))
  }
}
