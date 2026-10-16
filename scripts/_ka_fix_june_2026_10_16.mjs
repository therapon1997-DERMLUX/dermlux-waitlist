// 3 αποδεικτικά Κ.Α. Ιουνίου 2026 (manager upload 14/07): λάθος κατάστημα «Πάφος» και ημερομηνία πληρωμής αντί μήνα εισφορών.
// → ίδια μορφή με τα ka_* (16/10/2026): ημερομηνία 30/06, σωστό κατάστημα, PDF Βεβαίωση+Κατάσταση ως κύριο, το παλιό στα extraFiles.
// Τα δεσίματα με την τράπεζα μένουν ως έχουν. Dry run εκτός --execute.
import admin from 'firebase-admin'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execFileSync } from 'child_process'
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))) })
const db = admin.firestore(); const EXECUTE = process.argv.includes('--execute')
const WORKER = 'C:/Users/User/dermlux-waitlist/worker', BASE = 'https://empty-hall-968f.therapon1997.workers.dev/invoices/'
const UP = 'C:/Users/User/bookkeeping-ka/upload/'
const FIX = [
  { id: 'reN5mDUU7XYs7oENWHqd', ame: '3360710/1/9602', city: 'Λευκωσία', file: 'KA_336071019602_2026-06_Nicosia.pdf', no: '17541398' },
  { id: 'bYvVhjvbWJpbzDkLflLx', ame: '3360710/4/9602', city: 'Λάρνακα', file: 'KA_336071049602_2026-06_Larnaca.pdf', no: '17541390' },
  { id: 'DbTNUvwpfnxpNo8ShgC8', ame: '3360710/5/9602', city: 'Λεμεσός', file: 'KA_336071059602_2026-06_Limassol.pdf', no: '17541383' },
]
const snaps = await db.getAll(...FIX.map(f => db.collection('expenses').doc(f.id)))
for (const [i, f] of FIX.entries()) {
  const e = snaps[i].data()
  if (!existsSync(UP + f.file)) throw new Error('λείπει ' + f.file)
  if (e.invoiceNumber !== f.no) throw new Error(`${f.id}: αρ. ${e.invoiceNumber} ≠ ${f.no}`)
  console.log(f.id, e.date, e.location, '→ 2026-06-30', f.city, '·', e.total, '· αρχείο', e.fileName, '→', f.file)
}
if (!EXECUTE) { console.log('DRY RUN'); process.exit(0) }
writeFileSync('C:/Users/User/backups/bk_ka_fix_june_2026-10-16_' + Date.now() + '.json', JSON.stringify(Object.fromEntries(snaps.map(s => [s.id, s.data()])), null, 1))
for (const f of FIX) execFileSync('npx', ['wrangler', 'r2', 'object', 'put', `dermlux-invoices/expenses/${f.file}`, '--file', `"${UP + f.file}"`, '--content-type', 'application/pdf', '--remote'], { cwd: WORKER, stdio: 'pipe', shell: true })
const b = db.batch()
for (const [i, f] of FIX.entries()) {
  const e = snaps[i].data()
  b.update(db.collection('expenses').doc(f.id), {
    date: '2026-06-30', location: f.city, vendor: 'Υπηρεσίες Κοινωνικών Ασφαλίσεων', category: '8136 · ΑΛΛΑ ΕΞΟΔΑ ΠΡΟΣΩΠΙΚΟΥ', docType: 'payment_receipt',
    vat: 0, vatRate: 0, net: e.total, status: 'confirmed',
    kaMonth: '2026-06', kaAme: f.ame, kaCompany: 'DERMLUX', kaPaymentNumber: f.no,
    fileUrl: BASE + encodeURIComponent('expenses/' + f.file), fileName: f.file,
    extraFiles: [...(e.extraFiles || []), { fileUrl: e.fileUrl, fileName: e.fileName || 'αρχικό upload 14/07/2026' }],
    notes: `Κοινωνικές Ασφαλίσεις (Κ.Α.) — εισφορές Ιουνίου 2026 · DermLux ${f.city} · ΑΜΕ ${f.ame}. Βεβαίωση πληρωμής αρ. ${f.no}. Το PDF περιέχει: Βεβαίωση + Κατάσταση αποδοχών και εισφορών (portal Κ.Α.)· το αρχικό upload της 14/07 στα επιπλέον αρχεία. Περιλαμβάνει εισφορές εργοδότη ΚΑΙ εργαζομένων — εκτός ΦΠΑ. Ημερομηνία εγγραφής = τέλος του μήνα εισφορών. (Διόρθωση 16/10/2026: ήταν «Πάφος» / 14/07.)`,
  })
}
await b.commit(); console.log('✅ διορθώθηκαν', FIX.length); process.exit(0)
