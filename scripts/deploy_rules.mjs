// Deploy firestore.rules to production via Firebase Rules REST API (service account).
// Usage: node scripts/deploy_rules.mjs
import { readFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/dermlux-waitlist/serviceAccountKey.json', 'utf8'))
const rules = readFileSync('C:/Users/User/dermlux-waitlist/firestore.rules', 'utf8')
const project = sa.project_id

const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const now = Math.floor(Date.now() / 1000)
const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
const claims = b64url(JSON.stringify({
  iss: sa.client_email,
  scope: 'https://www.googleapis.com/auth/cloud-platform',
  aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
}))
const sig = b64url(crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key))
const tok = await (await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claims}.${sig}`,
})).json()
if (!tok.access_token) { console.error('Token error:', tok); process.exit(1) }
const H = { Authorization: `Bearer ${tok.access_token}`, 'Content-Type': 'application/json' }

// 1) Create a ruleset
const rsRes = await fetch(`https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ source: { files: [{ name: 'firestore.rules', content: rules }] } }),
})
const rs = await rsRes.json()
if (!rs.name) { console.error('Ruleset error:', rs); process.exit(1) }
console.log('Created ruleset:', rs.name)

// 2) Point the cloud.firestore release at the new ruleset
const relName = `projects/${project}/releases/cloud.firestore`
const relRes = await fetch(`https://firebaserules.googleapis.com/v1/${relName}`, {
  method: 'PATCH', headers: H,
  body: JSON.stringify({ release: { name: relName, rulesetName: rs.name } }),
})
const rel = await relRes.json()
if (relRes.ok) console.log('RELEASED ✓ firestore rules now live (ruleset', rs.name.split('/').pop() + ')')
else console.error('Release error:', rel)
