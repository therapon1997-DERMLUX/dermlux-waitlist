// Αυτόματη συγχώνευση ΣΙΓΟΥΡΩΝ διπλών παραστατικών (κανόνας Θεράπωνα 10/07/2026):
// ίδιος προμηθευτής + ίδιος αρ. τιμολογίου + ίδιο ποσό → ΕΝΑ record, χωρίς ερώτηση.
// Κρατάμε το καλύτερο αρχείο ως κύριο (PDF > φωτογραφία), τα υπόλοιπα ως extraFiles,
// και τα στοιχεία πληρωμής από όποιο upload τα έχει (π.χ. manager=παραλαβή, owner=πληρωμή).
// Αμφίβολες περιπτώσεις (ίδιο ποσό χωρίς ίδιο αρ., ή ίδιος αρ. με άλλο ποσό) ΔΕΝ
// συγχωνεύονται εδώ — εμφανίζονται στο panel «πιθανά διπλά» για απόφαση του χρήστη.
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const normVendor = v => (v || '').toLowerCase().trim()
  .replace(/[.,]/g, '')
  .replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g, '')
  .replace(/\s+/g, ' ').trim()

const normInv = v => (v || '').trim().toUpperCase()
const isPdf = f => /\.pdf$/i.test(f?.fileName || '') || /\.pdf(\?|$)/i.test(f?.fileUrl || '')
const REAL_PAY = ['Μετρητά', 'Κάρτα', 'Τραπεζική', 'Κατάθεση']

export const exactKey = e =>
  normVendor(e.vendor) + '|' + normInv(e.invoiceNumber) + '|' + Number(e.total).toFixed(2)

// Ομάδες σίγουρων διπλών μέσα σε μια λίστα expenses
export function findExactDupGroups(expenses) {
  const map = {}
  for (const e of expenses) {
    if (!normVendor(e.vendor) || !normInv(e.invoiceNumber) || e.total == null) continue
    const k = exactKey(e)
    if (!map[k]) map[k] = []
    map[k].push(e)
  }
  return Object.values(map).filter(g => g.length > 1)
}

// Συγχωνεύει μια ομάδα σίγουρων διπλών σε ένα record.
export async function mergeGroup(group) {
  // κρατάμε το confirmed αν υπάρχει, αλλιώς το παλαιότερο
  // (serverTimestamp που δεν έχει γραφτεί ακόμα → Infinity → ποτέ "παλαιότερο")
  const sorted = [...group].sort((a, b) =>
    (a.createdAt?.seconds ?? Infinity) - (b.createdAt?.seconds ?? Infinity))
  const keep = sorted.find(e => e.status === 'confirmed') || sorted[0]
  const rest = sorted.filter(e => e.id !== keep.id)
  const upd = {}

  // κύριο αρχείο: PDF κερδίζει φωτογραφία· ό,τι περισσεύει πάει στα extraFiles
  let primary = { fileUrl: keep.fileUrl || '', fileName: keep.fileName || '' }
  const extras = [...(keep.extraFiles || [])]
  for (const d of rest) {
    if (!d.fileUrl || d.fileUrl === primary.fileUrl) continue
    if (!primary.fileUrl || (isPdf(d) && !isPdf(primary))) {
      if (primary.fileUrl) extras.push(primary)
      primary = { fileUrl: d.fileUrl, fileName: d.fileName || '' }
    } else {
      extras.push({ fileUrl: d.fileUrl, fileName: d.fileName || '' })
    }
  }
  if (primary.fileUrl !== (keep.fileUrl || '')) { upd.fileUrl = primary.fileUrl; upd.fileName = primary.fileName }
  if (extras.length) upd.extraFiles = extras

  // κενά πεδία του keep συμπληρώνονται από τα διπλά
  for (const f of ['vatNumber', 'date', 'net', 'vat', 'vatRate', 'category', 'location']) {
    if (keep[f] == null || keep[f] === '') {
      const src = rest.find(d => d[f] != null && d[f] !== '')
      if (src) upd[f] = src[f]
    }
  }
  const keepItems = Array.isArray(keep.items) ? keep.items.length : 0
  const richer = rest.find(d => Array.isArray(d.items) && d.items.length > keepItems)
  if (richer) upd.items = richer.items

  // πληρωμή: αν το keep δεν έχει πραγματική μέθοδο (π.χ. «Επί πιστώσει» από παραλαβή),
  // παίρνει την πληρωμή του άλλου upload
  if (!REAL_PAY.includes(keep.paymentMethod)) {
    const paid = rest.find(d => REAL_PAY.includes(d.paymentMethod))
    if (paid) {
      upd.paymentMethod = paid.paymentMethod
      if (paid.paymentSource) upd.paymentSource = paid.paymentSource
      if (paid.paymentDetail) upd.paymentDetail = paid.paymentDetail
    }
  }

  const trail = rest.map(d => `${d.createdBy || d.source || '?'}${d.date ? ' ' + d.date : ''}`).join(', ')
  upd.notes = ((keep.notes || '') + ` · Auto-merge διπλού ${new Date().toISOString().slice(0, 10)} (2ο upload: ${trail})`).trim()
  upd.updatedAt = serverTimestamp()

  await updateDoc(doc(db, 'expenses', keep.id), upd)
  for (const d of rest) await deleteDoc(doc(db, 'expenses', d.id))
  return { keptId: keep.id, removed: rest.length }
}
