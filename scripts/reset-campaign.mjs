/**
 * Resets a campaign back to draft with zeroed stats.
 * Run: node scripts/reset-campaign.mjs
 */
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
initializeApp({ credential: cert(resolve(__dirname, '../serviceAccountKey.json')) })
const db = getFirestore()

const CAMPAIGN_ID = 'h3rKpVB2hwh8JmVaE3s9'

await db.collection('email_campaigns').doc(CAMPAIGN_ID).update({
  status:          'draft',
  autoSend:        false,
  'stats.sent':    0,
  'stats.failed':  0,
})

console.log(`Η καμπάνια ${CAMPAIGN_ID} επαναφέρθηκε σε Draft.`)
process.exit(0)
