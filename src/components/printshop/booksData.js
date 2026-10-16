// Κοινά δεδομένα Λογιστικών για Print Shop + Ερμογένη. Φορτώνονται ΜΙΑ φορά ανά συνεδρία
// (Firestore Spark: 50k αναγνώσεις/μέρα) και μοιράζονται από όλες τις οθόνες.
import { collection, getDocs, query, orderBy, where, limit as qlimit, doc, updateDoc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const ACCOUNTS = [
  { key: '357041157122', bank: 'Bank of Cyprus', label: 'BoC κύριος ···1157122' },
  { key: '357542264638', bank: 'Bank of Cyprus', label: 'BoC ταμείο ···2264638' },
  { key: '589-01-H59895-01', bank: 'Eurobank', label: 'Eurobank ···H59895' },
  { key: 'revolut', bank: 'Revolut', label: 'Revolut Business' },
  { key: '357046275557', bank: 'Bank of Cyprus', label: 'Ιατρική ΙΕΠΕ (άλλη εταιρεία)' },
]
export const accountOf = t => t.bank === 'Revolut' ? 'revolut' : (t.account || '')
// Σε ποιας εταιρείας τα βιβλία ανήκει ένα παραστατικό (16/10/2026): ό,τι πληρώθηκε από τον λογαριασμό της
// Ιατρικής ΙΕΠΕ έχει books:'IEPE' — ξεχωριστή εταιρεία, ΕΚΤΟΣ συνόλων DermLux (όπως και στις Τράπεζες)
export const COMPANIES = [{ key: 'DERMLUX', label: 'DermLux' }, { key: 'IEPE', label: '⚕️ Ιατρική ΙΕΠΕ' }]
export const IEPE_ACCOUNT = '357046275557'
export const bookOf = e => e.books || 'DERMLUX'
export const accountLabel = key => ACCOUNTS.find(a => a.key === key)?.label || key

let expPromise = null
const bankCache = new Map()
const listeners = new Set()
export function onBooksChange(fn) { listeners.add(fn); return () => listeners.delete(fn) }
const emit = () => listeners.forEach(fn => { try { fn() } catch {} })

export function loadExpenses(force = false) {
  if (!expPromise || force) {
    expPromise = getDocs(query(collection(db, 'expenses'), orderBy('date', 'desc')))
      .then(s => s.docs.map(d => ({ id: d.id, ...d.data() }))
        .filter(e => e.docType !== 'deposit_slip' && e.status !== 'superseded' && e.docType !== 'superseded'))
      .catch(e => { expPromise = null; throw e })
  }
  return expPromise
}

// Κινήσεις τράπεζας για περίοδο (cache ανά εύρος· ένα ευρύτερο εύρος καλύπτει και τα στενότερα)
export function loadBank(from, to) {
  for (const [k, p] of bankCache) {
    const [f, t] = k.split('|')
    if (f <= from && t >= to) return p.then(rows => rows.filter(r => r.date >= from && r.date <= to))
  }
  const key = `${from}|${to}`
  const p = getDocs(query(collection(db, 'bank_transactions'), where('date', '>=', from), where('date', '<=', to), orderBy('date', 'desc')))
    .then(s => s.docs.map(d => ({ id: d.id, ...d.data() })))
    .catch(e => { bankCache.delete(key); throw e })
  bankCache.set(key, p)
  return p
}

// Τοπική ενημέρωση cache μετά από αλλαγή (χωρίς νέα ανάγνωση)
export async function patchExpense(id, fields) {
  if (!expPromise) return
  const list = await expPromise
  const i = list.findIndex(e => e.id === id)
  if (i >= 0) list[i] = { ...list[i], ...fields }
  emit()
}
export async function updateExpense(id, fields) {
  await updateDoc(doc(db, 'expenses', id), { ...fields, updatedAt: serverTimestamp() })
  await patchExpense(id, fields)
}

// Όπως στις Τράπεζες: matchedExpenseIds (JSON) ΚΑΙ/Ή matchedExpenseId — πολλές κινήσεις έχουν μόνο το δεύτερο
export const linkedIds = t => {
  let a = []
  if (Array.isArray(t.matchedExpenseIds)) a = [...t.matchedExpenseIds]
  else if (t.matchedExpenseIds) { try { const p = JSON.parse(t.matchedExpenseIds); if (Array.isArray(p)) a = p } catch { /* noop */ } }
  if (t.matchedExpenseId && !a.includes(t.matchedExpenseId)) a.push(t.matchedExpenseId)
  return a
}

// Τι δικαιολογεί την κίνηση (όπως το bk_recon)
export function txKind(t, expById) {
  const ids = linkedIds(t)
  if (ids.some(i => expById.has(i))) return 'doc'
  if (t.tag === 'Μισθοί' || t.tag === 'Εισφορές') return 'payroll'
  if (t.tag === 'Ενοίκιο' || t.rentLabel) return 'rent'
  if (t.standingLabel) return 'standing'
  if (t.flow === 'internal') return 'internal'
  if (Number(t.credit) > 0) return 'in'
  if (/MAINT\. FEES|Commission|Transfer Fees|CardTxnAdmin|Interest|^FEE /i.test(t.description || '') || /Commission|statement/i.test(t.type || '')) return 'fee'
  return 'missing'
}
export const KIND_LABEL = { doc: 'Με παραστατικό', payroll: 'Μισθοί / Κ.Α.', rent: 'Ενοίκιο', standing: 'Πάγια εντολή', internal: 'Εσωτερική', in: 'Είσπραξη', fee: 'Χρέωση τράπεζας', missing: 'Χωρίς παραστατικό' }

// ---------- σημειώσεις / αιτήματα (bk_notes) ----------
export async function loadNotes() {
  const s = await getDocs(query(collection(db, 'bk_notes'), orderBy('at', 'desc'), qlimit(300)))
  return s.docs.map(d => ({ id: d.id, ...d.data() }))
}
export async function addNote({ who, type = 'note', text, targetType = '', targetId = '', targetLabel = '' }) {
  return addDoc(collection(db, 'bk_notes'), {
    type, text, status: 'open', targetType, targetId, targetLabel,
    uid: who?.uid || '', name: who?.name || '', email: who?.email || '', role: who?.role || '',
    at: serverTimestamp(), atIso: new Date().toISOString(),
  })
}
export async function setNoteStatus(id, status, reply = '') {
  return updateDoc(doc(db, 'bk_notes', id), { status, reply, doneAt: new Date().toISOString() })
}
export async function loadChanges(max = 300) {
  const s = await getDocs(query(collection(db, 'bk_changes'), orderBy('at', 'desc'), qlimit(max)))
  return s.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ---------- κανόνες λογιστή (bk_rules) — π.χ. «TikTok ads: χωρίς ΦΠΑ, αντίστροφη χρέωση» ----------
// Αποθηκεύονται ώστε να εφαρμόζονται και στα επόμενα τιμολόγια· γράφουμε και hint στο extraction_corrections
// για να τα διαβάζει σωστά το AI του ανεβάσματος.
export async function saveRule({ who, vendorMatch, set, reason }) {
  const id = fold(vendorMatch).replace(/[^a-z0-9α-ω]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'rule'
  await setDoc(doc(db, 'bk_rules', id), { vendorMatch, set, reason, by: who?.name || who?.email || '', role: who?.role || '', atIso: new Date().toISOString() }, { merge: true })
  const hint = `Κανόνας λογιστή: ${reason}. Για τιμολόγια «${vendorMatch}» ορίζεται: ${Object.entries(set).map(([k, v]) => `${k}=${v}`).join(', ')}.`
  await setDoc(doc(db, 'extraction_corrections', id), { vendor: vendorMatch, hint, updatedAt: serverTimestamp() }, { merge: true })
  return id
}
export async function loadRules() {
  const s = await getDocs(collection(db, 'bk_rules'))
  return s.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ---------- περίοδοι ----------
const pad = n => String(n).padStart(2, '0')
export function periodRange(kind, year, n) {
  if (kind === 'month') { const last = new Date(year, n, 0).getDate(); return [`${year}-${pad(n)}-01`, `${year}-${pad(n)}-${pad(last)}`] }
  if (kind === 'quarter') { const m1 = (n - 1) * 3 + 1, m3 = m1 + 2; const last = new Date(year, m3, 0).getDate(); return [`${year}-${pad(m1)}-01`, `${year}-${pad(m3)}-${pad(last)}`] }
  return [`${year}-01-01`, `${year}-12-31`]
}
export const MONTHS = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']

// ---------- αναζήτηση (χωρίς τόνους, πολλές λέξεις, και ποσά με κόμμα ή τελεία) ----------
export const fold = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const amtForms = v => { const n = Number(v); if (!isFinite(n) || !n) return ''; return `${n} ${n.toFixed(2)} ${n.toFixed(2).replace('.', ',')}` }
export function matchExpense(e, q) {
  if (!q) return true
  const hay = fold([e.vendor, e.invoiceNumber, e.vatNumber, e.category, e.location, e.notes, e.paymentMethod, e.date, e.fileName, amtForms(e.total)].join(' '))
  return fold(q).split(/\s+/).filter(Boolean).every(t => hay.includes(t))
}
export function matchTx(t, q) {
  if (!q) return true
  const hay = fold([t.description, t.date, t.rentLabel, t.standingLabel, t.tag, t.type, amtForms(t.debit), amtForms(t.credit)].join(' '))
  return fold(q).split(/\s+/).filter(Boolean).every(x => hay.includes(x))
}
