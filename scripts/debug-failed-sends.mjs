/**
 * Reads failed email_sends from Firestore and shows the failedReason.
 * Run: node scripts/debug-failed-sends.mjs
 */

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SERVICE_ACCOUNT_PATH = resolve(__dirname, '../serviceAccountKey.json')

initializeApp({ credential: cert(SERVICE_ACCOUNT_PATH) })
const db = getFirestore()

const snap = await db.collection('email_sends')
  .where('status', '==', 'failed')
  .limit(5)
  .get()

if (snap.empty) {
  console.log('Δεν βρέθηκαν failed sends.')
} else {
  console.log(`\nΒρέθηκαν ${snap.size} failed sends (πρώτα 5):\n`)
  snap.docs.forEach(d => {
    const data = d.data()
    console.log('────────────────────────────────')
    console.log('Email:         ', data.email)
    console.log('Campaign:      ', data.campaignId)
    console.log('failedReason:  ', data.failedReason)
    console.log('sentAt:        ', data.sentAt?.toDate?.() ?? data.sentAt)
  })
}

process.exit(0)
