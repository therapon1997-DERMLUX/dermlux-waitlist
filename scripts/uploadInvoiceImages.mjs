// One-time script: upload invoice images to R2 and link to Firestore records
// Passes docId directly — no Firestore reads needed.
// Run: node scripts/uploadInvoiceImages.mjs

import { readFileSync } from 'fs'

const WORKER_URL = 'https://empty-hall-968f.therapon1997.workers.dev'
const SECRET     = 'dermlux-import-2026-secret'
const IMG_DIR    = 'C:/Users/User/Downloads/invoice_pages'

const invoices = [
  { file: 'inv01_stavros_kokkinos_9016767.png',   docId: 'inv_9016767',             invoiceNumber: '9016767',        vendor: 'Stavros Kokkinos Ltd' },
  { file: 'inv02_stavros_kokkinos_9017109.png',   docId: 'inv_9017109',             invoiceNumber: '9017109',        vendor: 'Stavros Kokkinos Ltd' },
  { file: 'inv03_eac_paphos_oct2025.png',         docId: 'inv_19101266G',           invoiceNumber: '19101266G',      vendor: 'Electricity Authority of Cyprus' },
  { file: 'inv04_stavros_kokkinos_99088825.png',  docId: 'inv_99088825',            invoiceNumber: '99088825',       vendor: 'Stavros Kokkinos Ltd' },
  { file: 'inv05_stavros_kokkinos_9017320.png',   docId: 'inv_9017320',             invoiceNumber: '9017320',        vendor: 'Stavros Kokkinos Ltd' },
  { file: 'inv06_eac_limassol_nov2025.png',       docId: 'inv_eac_limassol_nov2025',invoiceNumber: '685 371 5427 7', vendor: 'Electricity Authority of Cyprus' },
  { file: 'inv07_eac_paphos_dec2025.png',         docId: 'inv_19101266G_dec',       invoiceNumber: '19101266G-2',    vendor: 'Electricity Authority of Cyprus' },
  { file: 'inv08_pambos_tsokkos_29114.png',       docId: 'inv_29114',               invoiceNumber: '29114',          vendor: 'Πάμπος Δ. Τσόκκος' },
  { file: 'inv09_stavros_kokkinos_9017458.png',   docId: 'inv_9017458',             invoiceNumber: '9017458',        vendor: 'Stavros Kokkinos Ltd' },
  { file: 'inv10_og_healthpro_dec2025.png',       docId: 'inv_og_healthpro_dec2025',invoiceNumber: '',               vendor: 'OG Healthpro' },
]

async function upload(inv) {
  const imgBytes   = readFileSync(`${IMG_DIR}/${inv.file}`)
  const imageBase64 = imgBytes.toString('base64')

  const res = await fetch(`${WORKER_URL}/link-invoice-image`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      secret: SECRET,
      docId:         inv.docId,
      invoiceNumber: inv.invoiceNumber,
      vendor:        inv.vendor,
      imageBase64,
      mediaType: 'image/png',
      fileName:  inv.file,
    }),
  })
  return res.json()
}

async function run() {
  for (const inv of invoices) {
    process.stdout.write(`Uploading ${inv.file} ... `)
    try {
      const result = await upload(inv)
      if (result.ok) {
        console.log(`✓  ${result.fileUrl}`)
      } else {
        console.log(`✗ ${result.error}`)
      }
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }
  }
  console.log('\nDone.')
}

run()
