/**
 * Import script — reads the Excel export and writes all clients to Firestore.
 *
 * Usage:
 *   1. Place your Firebase serviceAccountKey.json in the project root (it is git-ignored).
 *   2. Update EXCEL_PATH below to point to your downloaded file.
 *   3. Run:  node scripts/importExcel.js
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { read, utils } from 'xlsx'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── Config ─────────────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = resolve(__dirname, '../serviceAccountKey.json')
const EXCEL_PATH = resolve('C:/Users/User/Downloads/export_1777996253.xlsx')
// ───────────────────────────────────────────────────────────────────────────

initializeApp({ credential: cert(SERVICE_ACCOUNT_PATH) })
const db = getFirestore()

// ── Mapping helpers ─────────────────────────────────────────────────────────
function mapService(raw) {
  if (!raw) return 'Other'
  const v = raw.toLowerCase().trim()
  if (v.includes('facial'))                          return 'Facial'
  if (v.includes('laser') || v.includes('hair removal') || v.includes('αποτρίχωση')) return 'Laser'
  if (v.includes('botox') || v.includes('prp') || v.includes('inject'))              return 'Injectable'
  if (v.includes('body') || v.includes('σώμα'))      return 'Body'
  return 'Other'
}

function mapStatus(raw) {
  if (!raw) return 'Waiting'
  const v = raw.toLowerCase().trim()
  if (v === 'αναμονές') return 'Waiting'
  if (v === 'booked' || v.includes('ραντεβου'))   return 'Scheduled'
  if (v === 'λάθος στοιχεία')                      return 'Not Interested'
  return 'Waiting'
}

function mapCity(raw) {
  if (!raw) return ''
  const v = raw.trim().split(',')[0].trim()
  const lower = v.toLowerCase()
  if (lower === 'paphos')   return 'Paphos'
  if (lower === 'nicosia')  return 'Nicosia'
  if (lower === 'limassol') return 'Limassol'
  if (lower === 'larnaca')  return 'Larnaca'
  return v
}

function toTimestamp(val) {
  if (!val) return null
  if (val instanceof Date) return Timestamp.fromDate(val)
  if (typeof val === 'number') {
    // Excel serial date
    const date = new Date(Math.round((val - 25569) * 86400 * 1000))
    return Timestamp.fromDate(date)
  }
  return null
}

function toNumber(val) {
  if (val === null || val === undefined || val === '') return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

// ── Read Excel ───────────────────────────────────────────────────────────────
const workbook = read(readFileSync(EXCEL_PATH), { type: 'buffer', cellDates: true })
const sheet    = workbook.Sheets[workbook.SheetNames[0]]
const rows     = utils.sheet_to_json(sheet, { header: 1, defval: null })

// Row 0 = title, Row 1 = "New Name", Row 2 = actual headers, Row 3+ = data
const dataRows = rows.slice(3).filter(row => {
  const name = row[0]
  return name && typeof name === 'string' && name.trim() !== '' && name !== 'Name'
})

console.log(`Found ${dataRows.length} client rows. Importing…`)

// ── Write to Firestore ───────────────────────────────────────────────────────
const batch = db.batch()
let count = 0

for (const row of dataRows) {
  const [
    name,           // 0
    _subitems,      // 1
    email,          // 2
    phone,          // 3
    salesPerson,    // 4
    _leadStatus,    // 5
    statusRaw,      // 6
    cityRaw,        // 7
    reschedAttempts,// 8
    _whenBooked,    // 9
    serviceRaw,     // 10
    dateRangeStart, // 11
    dateRangeEnd,   // 12
    preferredDate1, // 13
    preferredDate2, // 14
    preferredDate3, // 15
    preferredTime,  // 16
    originalPrice,  // 17
    discountedPrice,// 18
    whyWaiting,     // 19
    appointmentDuration, // 20
    comments,       // 21
    campaignName,   // 22
    adName,         // 23
    adCity,         // 24
    leadCaptureDate,// 25
    importedId,     // 26
  ] = row

  const ref = db.collection('clients').doc()
  batch.set(ref, {
    name:        String(name || '').trim(),
    email:       String(email || '').trim(),
    phone:       String(phone || '').trim(),
    city:        mapCity(cityRaw),
    service:     mapService(serviceRaw),
    salesPerson: String(salesPerson || '').trim(),
    status:      mapStatus(statusRaw),

    dateRangeStart:  toTimestamp(dateRangeStart),
    dateRangeEnd:    toTimestamp(dateRangeEnd),
    preferredDate1:  toTimestamp(preferredDate1),
    preferredDate2:  toTimestamp(preferredDate2),
    preferredDate3:  toTimestamp(preferredDate3),
    preferredTime:   String(preferredTime || '').trim(),

    appointmentDuration: String(appointmentDuration || '').trim(),
    originalPrice:       toNumber(originalPrice),
    discountedPrice:     toNumber(discountedPrice),

    whyWaiting:  String(whyWaiting  || '').trim(),
    comments:    String(comments    || '').trim(),
    campaignName:String(campaignName|| '').trim(),
    adName:      String(adName      || '').trim(),

    contactHistory: [],
    calledBy:       null,

    leadCaptureDate: toTimestamp(leadCaptureDate),
    createdAt:       Timestamp.now(),
    updatedAt:       Timestamp.now(),
    importedId:      String(importedId || '').trim(),
  })

  count++

  // Firestore batches max 500 — flush every 400
  if (count % 400 === 0) {
    await batch.commit()
    console.log(`  ${count} records committed…`)
  }
}

await batch.commit()
console.log(`Done! Imported ${count} clients.`)
