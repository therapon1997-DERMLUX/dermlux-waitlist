// Re-run AI extraction for manager uploads that were saved with empty fields
// (the old Anthropic key had no balance). Downloads each file from the worker
// with an admin idToken, calls /extract-invoice, and fills ONLY the read fields —
// the uploader's choices (location, paymentSource, paymentMethod) are kept.
// Run: node scripts/rerun_extraction.mjs [--execute]
import { readFileSync } from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const EXECUTE = process.argv.includes('--execute')
const WORKER = 'https://empty-hall-968f.therapon1997.workers.dev'
const ORIGIN = 'https://therapon1997-dermlux.github.io'
const ADMIN_UID = 'TMgFlpv8ZcNGcgk7XKIxjDktf802'
const FIREBASE_KEY = 'AIzaSyBbGPFl3jKJX8n8wKl5qPC_qESqVvJc5Hs'

const sa = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
initializeApp({ credential: cert(sa) })
const db = getFirestore()

const ct = await getAuth().createCustomToken(ADMIN_UID)
const ex = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_KEY}`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ token: ct, returnSecureToken: true }),
}).then(r => r.json())
const idToken = ex.idToken

const snap = await db.collection('expenses').where('source', '==', 'manager_upload').get()
const targets = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(r => !r.vendor && r.total == null && r.fileUrl)

console.log(`Αδιάβαστα uploads: ${targets.length}`)

for (const r of targets) {
  const fileRes = await fetch(r.fileUrl, { headers: { Authorization: `Bearer ${idToken}` } })
  if (!fileRes.ok) { console.log(`SKIP ${r.id} — δεν κατέβηκε το αρχείο (${fileRes.status})`); continue }
  const buf = Buffer.from(await fileRes.arrayBuffer())
  const isPdf = /\.pdf$/i.test(r.fileName || '') || buf.subarray(0, 4).toString() === '%PDF'
  const mediaType = isPdf ? 'application/pdf' : 'image/jpeg'

  const res = await fetch(`${WORKER}/extract-invoice`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${idToken}`, Origin: ORIGIN },
    body: JSON.stringify({ base64: buf.toString('base64'), mediaType, fileName: r.fileName || 'receipt' }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.fields) { console.log(`FAIL ${r.id} — extraction ${res.status}: ${JSON.stringify(data).slice(0, 120)}`); continue }
  const f = data.fields
  console.log(`READ ${r.id} [${r.location} · ${r.paymentSource}] → ${f.vendor} · inv ${f.invoice_number} · ${f.date} · €${f.total} (${data.model}, conf ${f.confidence})`)
  ;(f.line_items || []).forEach(it => console.log(`     - ${it.description}${it.quantity != null ? ' ×' + it.quantity : ''}${it.amount != null ? ' €' + it.amount : ''}`))

  if (!EXECUTE) continue
  await db.collection('expenses').doc(r.id).update({
    vendor:        f.vendor         || '',
    vatNumber:     f.vat_number     || '',
    invoiceNumber: f.invoice_number || '',
    date:          f.date           || r.date,
    net:   f.net   ?? null,
    vat:   f.vat   ?? null,
    vatRate: f.vat_rate ?? null,
    total: f.total ?? null,
    currency: f.currency || 'EUR',
    category: f.category || '',
    items: Array.isArray(f.line_items) ? f.line_items : [],
    notes: ((r.notes || '') + ' · Επανα-ανάγνωση 10/07 (το αρχικό key δεν είχε υπόλοιπο)').trim(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  console.log(`     ✓ ενημερώθηκε`)
}
console.log(EXECUTE ? 'DONE' : 'Dry run — τρέξε ξανά με --execute για εφαρμογή')
process.exit(0)
