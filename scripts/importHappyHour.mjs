/**
 * Import script for Happy Hour clients.
 * Reads "HAPPY HOUR APPOINTMENTS.xlsx" and writes to the 'happyhour' Firestore collection.
 *
 * Usage:
 *   node scripts/importHappyHour.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { read, utils } from 'xlsx'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SERVICE_ACCOUNT_PATH = resolve(__dirname, '../serviceAccountKey.json')
const EXCEL_PATH = 'C:/Users/User/Downloads/HAPPY HOUR APPOINTMENTS.xlsx'

initializeApp({ credential: cert(SERVICE_ACCOUNT_PATH) })
const db = getFirestore()

// ── Helpers ──────────────────────────────────────────────────────────────────

function mapStatus(raw) {
  if (!raw) return 'Waiting'
  const v = String(raw).toLowerCase().trim()
  if (v.includes('αναμον')) return 'Waiting'
  if (v.includes('ολοκληρ'))  return 'Scheduled'
  if (v.includes('μην ξανα') || v.includes('δεν ενδιαφ')) return 'Not Interested'
  return 'Waiting'
}

function mapCity(raw) {
  if (!raw) return ''
  const v = String(raw).trim()
  if (v === 'Λευκωσία') return 'Nicosia'
  if (v === 'Λεμεσός')  return 'Limassol'
  if (v === 'Λάρνακα')  return 'Larnaca'
  if (v === 'Πάφος')    return 'Paphos'
  // multi-city — keep primary (first one)
  if (v.startsWith('Πάφος'))   return 'Paphos'
  if (v.startsWith('Λευκωσία')) return 'Nicosia'
  if (v.startsWith('Λεμεσός'))  return 'Limassol'
  if (v.startsWith('Λάρνακα'))  return 'Larnaca'
  return v
}

function mapService(raw) {
  if (!raw) return 'Laser'   // default for this list
  const v = String(raw).toLowerCase().trim()
  if (v.includes('facial'))    return 'Facial'
  if (v.includes('laser'))     return 'Laser'
  if (v.includes('inject') || v.includes('botox') || v.includes('prp')) return 'Injectable'
  if (v.includes('body'))      return 'Body'
  return 'Laser'
}

function str(val) {
  if (val === null || val === undefined) return ''
  return String(val).trim()
}

// ── Read Excel ────────────────────────────────────────────────────────────────
const workbook = read(readFileSync(EXCEL_PATH), { type: 'buffer', cellDates: true })
const sheet    = workbook.Sheets['Φύλλο3']
const rows     = utils.sheet_to_json(sheet, { header: 1, defval: null })

// Row 0 is the header — data starts at row 1
const dataRows = rows.slice(1).filter(row => row.some(c => c !== null))

console.log(`Found ${dataRows.length} rows. Importing…`)

// ── Batch write ───────────────────────────────────────────────────────────────
const STATUSES = ['σε αναμονή', 'σε αναμονη', 'ολοκληρώθηκε', 'να μην ξανα', 'να μην ξαναa']

let count   = 0
let skipped = 0
const batchRef = db.batch()

for (const row of dataRows) {
  // Detect column shift:
  // Normal:  col0=status, col1=name, col2=phone, col3=service, col4=duration, col5=wantedDate, col6=city, col7=availability, col8=agent, col9=comments, col10=extraComments
  // Shift-1: col0=status, col1=status-repeated OR name-is-col2, col2=name OR phone...
  // Detection: if col1 looks like a status string or col2 is a number → shift by 1

  let statusRaw, name, phone, serviceRaw, duration, wantedDate, cityRaw, availability, agent, comments, extraComments

  const col1IsStatus = col => col !== null && STATUSES.includes(String(col).toLowerCase().trim())
  const col2IsName   = col => col !== null && typeof col === 'string' && isNaN(col)

  if (col1IsStatus(row[1])) {
    // Shifted row: status is in col0 AND col1, real data shifted +1
    statusRaw    = row[0]
    name         = str(row[2])
    phone        = str(row[3])
    serviceRaw   = row[4]
    duration     = str(row[4])  // same col as service? No: service=col4 but also duration?
    wantedDate   = str(row[5])
    cityRaw      = row[7]       // city is one further right
    availability = str(row[8])
    agent        = str(row[9])
    comments     = str(row[10])
    extraComments = str(row[11])
    serviceRaw   = row[4]
    duration     = ''
  } else if (row[2] === null && row[3] !== null && typeof row[3] === 'number' && row[3] > 90000000) {
    // Phone is in col3 instead of col2 — everything shifted +1 from col2 onward
    statusRaw    = row[0]
    name         = str(row[1])
    phone        = str(row[3])
    serviceRaw   = row[4]
    duration     = str(row[4])
    wantedDate   = str(row[5])
    cityRaw      = row[7]
    availability = str(row[8])
    agent        = str(row[9])
    comments     = str(row[10])
    extraComments = str(row[11])
    serviceRaw   = row[4]
    duration     = ''
  } else {
    // Normal layout
    statusRaw    = row[0]
    name         = str(row[1])
    phone        = str(row[2])
    serviceRaw   = row[3]
    duration     = str(row[4])
    wantedDate   = str(row[5])
    cityRaw      = row[6]
    availability = str(row[7])
    agent        = str(row[8])
    comments     = str(row[9])
    extraComments = str(row[10])
  }

  // Skip rows with no name
  if (!name) { skipped++; continue }

  // Normalize phone: remove trailing .0 from numbers
  if (phone && !isNaN(phone)) {
    phone = String(Math.round(Number(phone)))
  }

  const status  = mapStatus(statusRaw)
  const city    = mapCity(cityRaw)
  const service = mapService(serviceRaw)

  // Combine comments + extra comments
  const fullComments = [comments, extraComments].filter(Boolean).join(' | ')

  // wantedDate goes into whyWaiting / comments since it's a freeform text range
  const whyWaiting = wantedDate ? `Επιθυμητή ημερομηνία: ${wantedDate}` : ''

  const ref = db.collection('happyhour').doc()
  batchRef.set(ref, {
    name,
    phone,
    email: '',
    city,
    service,
    salesPerson:         agent,
    appointmentDuration: duration,
    availability,
    whyWaiting,
    comments: fullComments,

    // No preferred dates — HH clients are called for last-minute slots
    dateRangeStart:  null,
    dateRangeEnd:    null,
    preferredDate1:  null,
    preferredDate2:  null,
    preferredDate3:  null,
    preferredTime:   '',
    originalPrice:   null,
    discountedPrice: null,

    status,
    contactHistory: [],
    calledBy:       null,

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })

  count++

  if (count % 400 === 0) {
    await batchRef.commit()
    console.log(`  ${count} records committed…`)
  }
}

await batchRef.commit()
console.log(`Done! Imported ${count} Happy Hour clients. Skipped ${skipped} empty rows.`)
