/**
 * Writes the invoices Claude read locally back into Firestore.
 * Backs up the current state of every touched doc first.
 * Run with --execute to actually write; default is a dry run.
 */
import admin from 'firebase-admin'
import { readFileSync, writeFileSync, readdirSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXEC = process.argv.includes('--execute')

const DIR = 'C:/Users/User/unread_invoices'
const manifest = JSON.parse(readFileSync(`${DIR}/manifest.json`, 'utf8'))
const byFile = Object.fromEntries(manifest.map(m => [m.file, m]))

// picks up ANY extracted*.json in the folder (extracted.json, extracted_2.json, extracted_batch7.json, ...)
// so a big backlog can be split across as many batches/agents as needed without editing this script.
const extractedFiles = readdirSync(DIR).filter(f => /^extracted.*\.json$/i.test(f)).sort()
if (!extractedFiles.length) { console.error('!! no extracted*.json files found in', DIR); process.exit(1) }
console.log('reading:', extractedFiles.join(', '))
const ex = extractedFiles.flatMap(f => JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')))

// map partial file keys (extracted_2 uses shortened names) back to real files
const resolve = f => {
  if (byFile[f]) return byFile[f]
  const head = f.split('_')[0]
  const hit = manifest.find(m => m.file.startsWith(head + '_'))
  return hit || null
}

const backup = [], plan = []
for (const r of ex) {
  const m = resolve(r.file)
  if (!m) { console.log('!! no manifest match:', r.file); continue }
  const snap = await db.collection('expenses').doc(m.id).get()
  if (!snap.exists) { console.log('!! doc gone:', m.id); continue }
  const cur = snap.data()
  backup.push({ id: m.id, before: cur })

  const patch = {
    lineItems: JSON.stringify(r.lineItems),
    lineItemsCount: r.lineItems.length,
    detailStatus: 'claude_read',
    readBy: 'claude-code-local',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }
  // only fill header fields that are missing or clearly empty
  const fill = (k, v) => { if (v != null && v !== '' && (cur[k] == null || cur[k] === '' || cur[k] === 0)) patch[k] = v }
  fill('vendor', r.vendor); fill('vatNumber', r.vatNumber); fill('invoiceNumber', r.invoiceNumber)
  fill('date', r.date); fill('net', r.net); fill('vat', r.vat); fill('vatRate', r.vatRate); fill('total', r.total)
  if (r.category) fill('category', r.category)
  const notes = [cur.notes, r.note, r.flag].filter(Boolean).join(' · ')
  if (notes && notes !== cur.notes) patch.notes = notes

  plan.push({ id: m.id, file: m.file, vendor: patch.vendor ?? cur.vendor, total: patch.total ?? cur.total, items: r.lineItems.length, patchKeys: Object.keys(patch) })
  if (EXEC) await db.collection('expenses').doc(m.id).update(patch)
}

const backupFile = `C:/Users/User/dermlux-waitlist/backups/expenses_before_claude_read_${Date.now()}.json`
writeFileSync(backupFile, JSON.stringify(backup, null, 1))
console.log(`${EXEC ? 'ΓΡΑΦΤΗΚΑΝ' : 'DRY RUN'}: ${plan.length} εγγραφές`)
for (const p of plan) console.log(`  ${(p.vendor || '—').slice(0, 32).padEnd(32)} €${String(p.total).padStart(9)}  ${p.items} γραμμές  [${p.patchKeys.filter(k => !['updatedAt', 'readBy', 'detailStatus'].includes(k)).join(',')}]`)
console.log(`backup: ${backupFile} (${backup.length} docs)`)
process.exit(0)
