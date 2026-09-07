// READ-ONLY. Proves the new parser reproduces the rows already stored, before importing anything.
import admin from 'firebase-admin'
import { readFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()

const SRC = 'C:/Users/User/AppData/Local/Temp/claude/C--Users-User/8988b951-ca25-4148-9682-9015c982a425/scratchpad/boc_parsed.json'
const parsed = JSON.parse(readFileSync(SRC, 'utf8'))

const docId = (t) => (t.account === '357542264638' ? 'boc_tam_' : 'boc_') + String(t.ref).replace(/\s+/g, '_')

// all parsed rows, de-duplicated by doc id (the two main-account files overlap each other)
const byId = new Map()
for (const f of Object.keys(parsed)) for (const t of parsed[f].txs) byId.set(docId(t), t)
console.log('parsed unique rows:', byId.size)

const snap = await db.collection('bank_transactions').get()
const existing = new Map(snap.docs.map(d => [d.id, d.data()]))
console.log('rows already in Firestore:', existing.size)

const eq = (a, b) => {
  if (a == null && b == null) return true
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 0.005
  return String(a ?? '') === String(b ?? '')
}
let overlap = 0, identical = 0, differing = 0, newRows = 0
const diffs = []
for (const [id, t] of byId) {
  const e = existing.get(id)
  if (!e) { newRows++; continue }
  overlap++
  const fields = ['date', 'description', 'debit', 'credit', 'balance', 'account']
  const bad = fields.filter(f => !eq(t[f], e[f]))
  if (bad.length === 0) identical++
  else { differing++; if (diffs.length < 12) diffs.push({ id, bad: bad.map(f => `${f}: parsed=${JSON.stringify(t[f])} stored=${JSON.stringify(e[f])}`) }) }
}
console.log(`\nOVERLAP (already stored): ${overlap}`)
console.log(`   identical : ${identical}`)
console.log(`   DIFFERING : ${differing}`)
console.log(`NEW rows to import      : ${newRows}`)
for (const d of diffs) console.log('   !', d.id, d.bad.join(' | '))

// what the new rows look like
const news = [...byId.entries()].filter(([id]) => !existing.has(id)).map(([id, t]) => ({ id, ...t }))
const byAcc = {}
for (const n of news) { (byAcc[n.account] ||= []).push(n) }
console.log('\nnew rows by account:')
for (const [acc, list] of Object.entries(byAcc)) {
  const ds = list.map(x => x.date).sort()
  console.log(`   ${acc}: ${list.length}   ${ds[0]} → ${ds[ds.length - 1]}   debits €${list.reduce((s, x) => s + (x.debit || 0), 0).toFixed(2)}  credits €${list.reduce((s, x) => s + (x.credit || 0), 0).toFixed(2)}`)
}
process.exit(0)
