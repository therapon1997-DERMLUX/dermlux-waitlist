// Attach the OnlineJobs.ph invoice PDF to its expense record (R2 via the Worker).
import { readFileSync } from 'fs'

const WORKER_URL = 'https://empty-hall-968f.therapon1997.workers.dev'
const SECRET = 'dermlux-import-2026-secret'
const FILE = 'C:/Users/User/Desktop/OnlineJobsPH_Invoice_898247_2026-08-31.pdf'

const res = await fetch(`${WORKER_URL}/link-invoice-image`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: SECRET,
    docId: 'inv_onlinejobsph_898247',
    invoiceNumber: '898247',
    vendor: 'OnlineJobs.ph',
    imageBase64: readFileSync(FILE).toString('base64'),
    mediaType: 'application/pdf',
    fileName: 'OnlineJobsPH_Invoice_898247_2026-08-31.pdf',
  }),
})
console.log(res.status, JSON.stringify(await res.json()).slice(0, 400))
