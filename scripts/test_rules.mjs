// Authoritative rules test via Firebase Rules Test API (no real users needed).
import { readFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/dermlux-waitlist/serviceAccountKey.json','utf8'))
const project = sa.project_id
const rules = readFileSync('C:/Users/User/dermlux-waitlist/firestore.rules','utf8')
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
const now = Math.floor(Date.now()/1000)
const header = b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))
const claims = b64url(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}))
const sig = b64url(crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key))
const tok = await (await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${header}.${claims}.${sig}`})).json()
const H = { Authorization:`Bearer ${tok.access_token}`, 'Content-Type':'application/json' }

const DOC = '/databases/(default)/documents'
// mock roleOf() get()+exists() on the user doc
function mocks(uid, role) {
  if (!uid) return []
  const p = `${DOC}/users/${uid}`
  return [
    { function:'exists', args:[{exactValue:p}], result:{ value: role!=null } },
    { function:'get',    args:[{exactValue:p}], result:{ value: { data: role!=null ? { role } : {} } } },
  ]
}
function tc(label, uid, role, coll, method, expectation) {
  return { __label:label, expectation,
    request: { auth: uid?{uid,token:{}}:null, method, path:`${DOC}/${coll}/doc1` },
    functionMocks: mocks(uid, role) }
}

const cases = [
  // existing roles — must be UNCHANGED
  tc('admin → email_contacts',   'u_admin','admin', 'email_contacts','get','ALLOW'),
  tc('admin → expenses',         'u_admin','admin', 'expenses','get','ALLOW'),
  tc('admin → patients',         'u_admin','admin', 'patients','get','ALLOW'),
  tc('agent → clients',          'u_agent','agent', 'clients','get','ALLOW'),
  tc('agent → patients',         'u_agent','agent', 'patients','get','ALLOW'),
  tc('ekloges → eklogika_kentra','u_ek','ekloges',  'eklogika_kentra','get','ALLOW'),
  // NEW marketer — must be CONTAINED to email_* only
  tc('marketer → email_contacts','u_mk','marketer', 'email_contacts','get','ALLOW'),
  tc('marketer → email_campaigns','u_mk','marketer','email_campaigns','create','ALLOW'),
  tc('marketer → email_templates','u_mk','marketer','email_templates','create','ALLOW'),
  tc('marketer → expenses',      'u_mk','marketer', 'expenses','get','DENY'),
  tc('marketer → patients',      'u_mk','marketer', 'patients','get','DENY'),
  tc('marketer → voteContacts',  'u_mk','marketer', 'voteContacts','get','DENY'),
  tc('marketer → ballot_results','u_mk','marketer', 'ballot_results','get','DENY'),
  tc('marketer → clients',       'u_mk','marketer', 'clients','get','DENY'),
  // unauth
  tc('unauth → email_contacts',  null,null,         'email_contacts','get','DENY'),
  // regression probes (reveal pre-existing catch-all behaviour)
  tc('agent → email_contacts',   'u_agent','agent', 'email_contacts','get','ALLOW'),
  tc('agent → expenses',         'u_agent','agent', 'expenses','get','ALLOW'),
]

const body = {
  source: { files: [{ name:'firestore.rules', content: rules }] },
  testSuite: { testCases: cases.map(({__label,...c})=>c) }
}
const res = await fetch(`https://firebaserules.googleapis.com/v1/projects/${project}:test`, { method:'POST', headers:H, body:JSON.stringify(body) })
const out = await res.json()
if (!out.testResults) { console.error('Test API error:', JSON.stringify(out,null,2)); process.exit(1) }
let pass=0, fail=0
out.testResults.forEach((r,i)=>{
  const want = cases[i].expectation, got = r.state // SUCCESS = matched expectation
  const ok = r.state==='SUCCESS'
  if (ok) pass++; else fail++
  console.log(`${ok?'✓':'✗'}  ${cases[i].__label.padEnd(30)} expect ${want.padEnd(5)} → ${ok?'OK':'GOT MISMATCH ('+(r.debugMessages?.[0]||'').slice(0,60)+')'}`)
})
console.log(`\n${pass}/${cases.length} passed${fail?`, ${fail} MISMATCH`:''}`)
