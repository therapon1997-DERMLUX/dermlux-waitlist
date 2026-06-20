// End-to-end rules test: temp user, switch role, probe real Firestore reads, cleanup.
import { readFileSync, unlinkSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/dermlux-waitlist/serviceAccountKey.json','utf8'))
const project = sa.project_id
const API_KEY = readFileSync('C:/Users/User/dermlux-waitlist/scripts/.apikey.tmp','utf8').trim()

// service-account token (to create/delete the role doc; bypasses rules)
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
const now = Math.floor(Date.now()/1000)
const hd = b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))
const cl = b64url(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}))
const sg = b64url(crypto.createSign('RSA-SHA256').update(`${hd}.${cl}`).sign(sa.private_key))
const saTok = (await (await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${hd}.${cl}.${sg}`})).json()).access_token
const SAH = { Authorization:`Bearer ${saTok}`, 'Content-Type':'application/json' }
const FS = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`

const email = `rules-test-${Date.now()}@dermlux-test.local`
const password = 'Test!' + crypto.randomBytes(6).toString('hex')

// 1) signUp temp user
const su = await (await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})})).json()
if (!su.idToken) { console.error('signUp failed:', su); process.exit(1) }
const uid = su.localId, idToken = su.idToken
console.log('temp user:', uid)

async function setRole(role) {
  await fetch(`${FS}/users/${uid}?updateMask.fieldPaths=role`,{method:'PATCH',headers:SAH,body:JSON.stringify({fields:{role:{stringValue:role}}})})
}
async function probe(coll) {
  const r = await fetch(`${FS}/${coll}?pageSize=1`,{headers:{Authorization:`Bearer ${idToken}`}})
  return r.status // 200 allow, 403 deny
}
const A=s=>s===200?'ALLOW':s===403?'DENY ':`HTTP${s}`

const exp = {} // collection: expected per current role (set before each block)
async function check(coll, want) {
  const s = await probe(coll); const got = A(s).trim()
  const ok = got === want
  console.log(`  ${ok?'✓':'✗ MISMATCH'}  ${got.padEnd(5)} ${coll}  (expect ${want})`)
  return ok
}
let fails = 0
try {
  // ===== as MARKETER — must reach ONLY email_* =====
  await setRole('marketer')
  console.log('\n=== ROLE: marketer (email-only) ===')
  for (const c of ['email_contacts','email_campaigns','email_templates','email_sends']) if(!await check(c,'ALLOW')) fails++
  for (const c of ['expenses','patients','clients','voteContacts','ballot_results','eklogika_staff']) if(!await check(c,'DENY')) fails++

  // ===== as AGENT — clinical only; NO financials/email (was the hole) =====
  await setRole('agent')
  console.log('\n=== ROLE: agent (clinical staff) ===')
  for (const c of ['clients','patients']) if(!await check(c,'ALLOW')) fails++
  for (const c of ['email_contacts','expenses','voteContacts']) if(!await check(c,'DENY')) fails++ // FIXED: was ALLOW

  // ===== as EKLOGES — elections only; NO financials/email/clinical =====
  await setRole('ekloges')
  console.log('\n=== ROLE: ekloges (elections) ===')
  for (const c of ['ballot_results','eklogika_staff','eklogika_matches']) if(!await check(c,'ALLOW')) fails++
  for (const c of ['expenses','email_contacts','patients']) if(!await check(c,'DENY')) fails++ // bonus tightening
} finally {
  // cleanup: delete role doc + auth user + tmp key
  await fetch(`${FS}/users/${uid}`,{method:'DELETE',headers:SAH})
  await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})})
  try { unlinkSync('C:/Users/User/dermlux-waitlist/scripts/.apikey.tmp') } catch {}
  console.log('\ncleanup ✓ (temp user + role doc deleted)')
  console.log(fails===0 ? 'ALL CHECKS PASSED ✓' : `${fails} MISMATCH(ES) ✗`)
}
