// One-time script: import first 10 invoices (extracted from Expensify full PDF)
// Run: node scripts/importInvoices.mjs
// Uses deterministic doc IDs so uploadInvoiceImages.mjs can link without a query.

const WORKER_URL = 'https://empty-hall-968f.therapon1997.workers.dev'
const SECRET     = 'dermlux-import-2026-secret'

const expenses = [
  // 1. Stavros Kokkinos — Vistabel Botox — Jul 2, 2025
  {
    _docId:        'inv_9016767',
    vendor:        'Stavros Kokkinos Ltd',
    vatNumber:     '10367882H',
    invoiceNumber: '9016767',
    date:          '2025-07-02',
    net:           804.12,
    vat:           40.21,
    vatRate:       5,
    total:         844.33,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'VISTABEL PWD SOL FOR INJ 100U x5 — Lot D0293C3, Exp 05/2027',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 2. Stavros Kokkinos — Vistabel Botox — Sep 29, 2025
  {
    _docId:        'inv_9017109',
    vendor:        'Stavros Kokkinos Ltd',
    vatNumber:     '10367882H',
    invoiceNumber: '9017109',
    date:          '2025-09-29',
    net:           804.12,
    vat:           40.21,
    vatRate:       5,
    total:         844.33,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'VISTABEL PWD SOL FOR INJ 100U x5',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 3. EAC Electricity — Paphos — Oct 6, 2025
  {
    _docId:        'inv_19101266G',
    vendor:        'Electricity Authority of Cyprus',
    vatNumber:     '',
    invoiceNumber: '19101266G',
    date:          '2025-10-06',
    net:           201.90,
    vat:           38.37,
    vatRate:       19,
    total:         240.27,
    currency:      'EUR',
    category:      'Λογαριασμοί',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'Electricity — period 15/08/2025–06/10/2025, account PAF31, meter 90000020C',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 4. Stavros Kokkinos — Vistabel Botox — Nov 6, 2025
  {
    _docId:        'inv_99088825',
    vendor:        'Stavros Kokkinos Ltd',
    vatNumber:     '10367882H',
    invoiceNumber: '99088825',
    date:          '2025-11-06',
    net:           804.12,
    vat:           40.21,
    vatRate:       5,
    total:         844.33,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'VISTABEL PWD SOL FOR INJ 100U x5',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 5. Stavros Kokkinos — Vistabel Botox — Nov 14, 2025
  {
    _docId:        'inv_9017320',
    vendor:        'Stavros Kokkinos Ltd',
    vatNumber:     '10367882H',
    invoiceNumber: '9017320',
    date:          '2025-11-14',
    net:           804.12,
    vat:           40.21,
    vatRate:       5,
    total:         844.33,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'VISTABEL PWD SOL FOR INJ 100U x5',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 6. EAC Electricity — Limassol (Polemidia) — Nov 17, 2025
  {
    _docId:        'inv_eac_limassol_nov2025',
    vendor:        'Electricity Authority of Cyprus',
    vatNumber:     '',
    invoiceNumber: '685 371 5427 7',
    date:          '2025-11-17',
    net:           173.26,
    vat:           32.56,
    vatRate:       19,
    total:         205.82,
    currency:      'EUR',
    category:      'Λογαριασμοί',
    location:      'Λεμεσός',
    paymentMethod: 'Τραπεζική',
    notes:         'Electricity — period 16/08/2025–17/11/2025, Παπάρχου Φωτίου 33Β, Πολεμίδια, meter KAT B',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 7. EAC Electricity — Paphos — Dec 2, 2025
  {
    _docId:        'inv_19101266G_dec',
    vendor:        'Electricity Authority of Cyprus',
    vatNumber:     '',
    invoiceNumber: '19101266G-2',
    date:          '2025-12-02',
    net:           319.88,
    vat:           60.77,
    vatRate:       19,
    total:         380.85,
    currency:      'EUR',
    category:      'Λογαριασμοί',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'Electricity — period 06/10/2025–02/12/2025, account PAF31, meter 90000020C',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 8. Πάμπος Δ. Τσόκκος — Printing — Dec 4, 2025
  {
    _docId:        'inv_29114',
    vendor:        'Πάμπος Δ. Τσόκκος',
    vatNumber:     '807255803U',
    invoiceNumber: '29114',
    date:          '2025-12-04',
    net:           50.00,
    vat:           9.50,
    vatRate:       19,
    total:         59.50,
    currency:      'EUR',
    category:      'Άλλο',
    location:      'Πάφος',
    paymentMethod: 'Κάρτα',
    notes:         'Gift voucher printing + Taxi — Τυπογραφείο. Πληρώθηκε Φεβράρη.',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 9. Stavros Kokkinos — Vistabel Botox — Dec 12, 2025
  {
    _docId:        'inv_9017458',
    vendor:        'Stavros Kokkinos Ltd',
    vatNumber:     '10367882H',
    invoiceNumber: '9017458',
    date:          '2025-12-12',
    net:           804.12,
    vat:           40.21,
    vatRate:       5,
    total:         844.33,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Πάφος',
    paymentMethod: 'Τραπεζική',
    notes:         'VISTABEL PWD SOL FOR INJ 100U x5',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
  // 10. OG Healthpro — Serums — Dec 15, 2025
  {
    _docId:        'inv_og_healthpro_dec2025',
    vendor:        'OG Healthpro',
    vatNumber:     '',
    invoiceNumber: '',
    date:          '2025-12-15',
    net:           176.46,
    vat:           33.52,
    vatRate:       19,
    total:         209.98,
    currency:      'EUR',
    category:      'Προμήθειες',
    location:      'Γενικά',
    paymentMethod: 'Κάρτα',
    notes:         'SERUM ALA-13 x2 + SERUM VITAMIN C x2 (25% discount applied)',
    fileUrl:       '',
    fileName:      '',
    status:        'confirmed',
    source:        'invoice_import',
  },
]

async function run() {
  // Strip _docId from the expense data, pass it as the document ID
  const payload = expenses.map(({ _docId, ...exp }) => ({ ...exp, _docId }))

  console.log(`Importing ${payload.length} invoices with deterministic IDs...`)
  const res = await fetch(`${WORKER_URL}/bulk-import-expenses`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ secret: SECRET, expenses: payload }),
  })
  const data = await res.json()
  if (data.ok) {
    console.log(`✓ Imported ${data.imported} records successfully.`)
    console.log('Doc IDs:', expenses.map(e => e._docId).join(', '))
  } else {
    console.error('✗ Error:', data.error)
    process.exit(1)
  }
}

run()
