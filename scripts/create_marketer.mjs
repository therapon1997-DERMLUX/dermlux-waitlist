// Create the marketer Firebase login + users/{uid} role doc.
import { readFileSync } from 'fs'
import crypto from 'crypto'

const sa = JSON.parse(readFileSync('C:/Users/User/dermlux-waitlist/serviceAccountKey.json','utf8'))
const project = sa.project_id
const env = readFileSync('C:/Users/User/dermlux-waitlist/.env','utf8')
const API_KEY = (env.match(/VITE_FIREBASE_API_KEY\s*=\s*['"]?([^'"\r\n]+)/)||[])[1]

const EMAIL = 'stavrimetaxa2002@gmail.com'
const NAME  = 'Stavrina Metaxa'
// readable strong password
const PASSWORD = 'Dermlux-' + crypto.randomBytes(4).toString('hex') + '-26'

// service-account token for the role doc
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
const now = Math.floor(Date.now()/1000)
const hd = b64url(JSON.stringify({alg:'RS256',typ:'JWT'}))
const cl = b64url(JSON.stringify({iss:sa.client_email,scope:'https://www.googleapis.com/auth/datastore',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}))
const sg = b64url(crypto.createSign('RSA-SHA256').update(`${hd}.${cl}`).sign(sa.private_key))
const saTok = (await (await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${hd}.${cl}.${sg}`})).json()).access_token
const FS = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents`

// 1) create auth user
let uid
const su = await (await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:EMAIL,password:PASSWORD,returnSecureToken:true})})).json()
if (su.localId) { uid = su.localId; console.log('✓ auth user created') }
else if (su.error?.message === 'EMAIL_EXISTS') {
  console.log('• auth user already exists — will (re)set role only; password unchanged')
  // look up uid via service account Identity Toolkit admin
  const look = await (await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${project}/accounts:query`,{method:'POST',headers:{Authorization:`Bearer ${saTok}`,'Content-Type':'application/json'},body:JSON.stringify({expression:[{email:[EMAIL]}]})})).json()
  uid = look.userInfo?.[0]?.localId
}
if (!uid) { console.error('could not resolve uid', su); process.exit(1) }

// 2) role doc
const res = await fetch(`${FS}/users/${uid}`,{method:'PATCH',headers:{Authorization:`Bearer ${saTok}`,'Content-Type':'application/json'},body:JSON.stringify({fields:{
  email:{stringValue:EMAIL}, displayName:{stringValue:NAME}, role:{stringValue:'marketer'}, active:{booleanValue:true}, createdAt:{timestampValue:new Date().toISOString()},
}})})
console.log(res.ok ? '✓ role doc set: role=marketer' : '✗ role doc failed '+await res.text())
console.log('\n=== LOGIN CREDENTIALS (give to her) ===')
console.log('  email:    ' + EMAIL)
console.log('  password: ' + (su.localId ? PASSWORD : '(unchanged — existing account)'))
console.log('  uid:      ' + uid)
