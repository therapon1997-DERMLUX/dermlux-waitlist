/**
 * Import email contacts from OmniLux CSV → Firestore email_contacts collection.
 * Skips rows without email. Skips duplicates (existing doc IDs).
 *
 * Run: node scripts/importEmailContacts.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICE_ACCOUNT_PATH = resolve(__dirname, '../serviceAccountKey.json')
const CSV_PATH = 'C:/Users/User/Downloads/OmniLux-05-06-2026.csv'

initializeApp({ credential: cert(SERVICE_ACCOUNT_PATH) })
const db = getFirestore()

// Same ID function as the app uses
function contactDocId(email) {
  return email.toLowerCase().trim().replace(/[^a-z0-9._-]/g, '_')
}

function normalizeEmail(email) {
  return (email || '').toLowerCase().trim()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Read CSV
const raw = readFileSync(CSV_PATH, 'utf-8')
const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true })

// Filter to rows with a valid email, deduplicate within CSV
const seen = new Set()
const withEmail = rows.filter(r => {
  const email = normalizeEmail(r['Email'])
  if (!email || !isValidEmail(email)) return false
  if (seen.has(email)) return false
  seen.add(email)
  return true
})

console.log(`Total rows: ${rows.length}`)
console.log(`With valid email (after CSV dedup): ${withEmail.length}`)
console.log(`Importing new contacts (existing ones will be skipped)...`)

let count = 0
let skipped = 0

// Use create() which fails silently if doc already exists — no duplicate overwrites
for (const r of withEmail) {
  const email = normalizeEmail(r['Email'])
  const id = contactDocId(email)
  const ref = db.collection('email_contacts').doc(id)

  try {
    await ref.create({
      email,
      name:           (r['Full Name'] || '').trim(),
      phone:          (r['Phone'] || '').trim(),
      tags:           [],
      source:         'csv_import',
      status:         'active',
      sendCount:      0,
      lastSentAt:     null,
      unsubscribedAt: null,
      bouncedAt:      null,
      importedAt:     Timestamp.now(),
      updatedAt:      Timestamp.now(),
    })
    count++
    if (count % 50 === 0) console.log(`  ${count} imported so far...`)
  } catch (e) {
    if (e.code === 6) { // ALREADY_EXISTS
      skipped++
    } else {
      throw e
    }
  }
}

console.log(`\nDone!`)
console.log(`  New contacts imported: ${count}`)
console.log(`  Duplicates skipped:    ${skipped}`)
