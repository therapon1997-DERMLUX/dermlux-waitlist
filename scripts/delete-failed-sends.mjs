/**
 * Deletes all failed email_sends so they can be retried.
 * Run: node scripts/delete-failed-sends.mjs
 */

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
initializeApp({ credential: cert(resolve(__dirname, '../serviceAccountKey.json')) })
const db = getFirestore()

// Campaign ID from the debug output
const CAMPAIGN_ID = 'h3rKpVB2hwh8JmVaE3s9'

// Get all active contacts to build the doc IDs directly (avoids querying email_sends)
const contactsSnap = await db.collection('email_contacts')
  .where('status', '==', 'active')
  .get()

const emails = contactsSnap.docs.map(d => d.data().email).filter(Boolean)
console.log(`Βρέθηκαν ${emails.length} επαφές. Σβήνω τα email_sends…`)

let total = 0
const CHUNK = 500
for (let i = 0; i < emails.length; i += CHUNK) {
  const chunk  = emails.slice(i, i + CHUNK)
  const batch  = db.batch()
  chunk.forEach(email => {
    const docId = `${CAMPAIGN_ID}||${email}`
    batch.delete(db.collection('email_sends').doc(docId))
  })
  await batch.commit()
  total += chunk.length
  console.log(`Επεξεργάστηκαν ${total} / ${emails.length}…`)
}

// Reset campaign stats + status to draft
await db.collection('email_campaigns').doc(CAMPAIGN_ID).update({
  status:        'draft',
  autoSend:      false,
  'stats.sent':  0,
  'stats.failed': 0,
})

console.log(`\nΟλοκληρώθηκε. Η καμπάνια επαναφέρθηκε σε Draft, έτοιμη να ξαναστείλεις.`)
process.exit(0)
