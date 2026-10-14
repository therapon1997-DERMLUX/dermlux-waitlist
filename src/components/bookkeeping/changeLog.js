// Ιστορικό αλλαγών στα Λογιστικά (εντολή Θεράπωνα 14/10/2026: ο λογιστής μπορεί να διορθώνει,
// αλλά κάθε αλλαγή αποθηκεύεται για να γίνεται brief). Συλλογή `bk_changes`, μία εγγραφή ανά αποθήκευση.
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const EXPENSE_FIELDS = ['vendor', 'vatNumber', 'invoiceNumber', 'date', 'net', 'vat', 'vatRate', 'total',
  'currency', 'category', 'location', 'paymentMethod', 'notes']

export const FIELD_LABELS = {
  vendor: 'Προμηθευτής', vatNumber: 'ΑΦΜ', invoiceNumber: 'Αρ. τιμολογίου', date: 'Ημερομηνία', net: 'Καθαρό',
  vat: 'ΦΠΑ', vatRate: 'ΦΠΑ %', total: 'Σύνολο', currency: 'Νόμισμα', category: 'Κατηγορία', location: 'Κατάστημα',
  paymentMethod: 'Πληρωμή', notes: 'Σημειώσεις', fileUrl: 'Αρχείο',
}

const norm = v => (v === undefined || v === null) ? '' : (typeof v === 'number' ? String(+v.toFixed(2)) : String(v).trim())

// [{ field, before, after }] για τα πεδία που άλλαξαν
export function diffFields(before = {}, after = {}, fields = EXPENSE_FIELDS) {
  const out = []
  for (const f of fields) {
    if (!(f in after)) continue
    const b = norm(before[f]), a = norm(after[f])
    if (b !== a) out.push({ field: f, before: before[f] ?? null, after: after[f] ?? null })
  }
  return out
}

// who = { uid, email, name, role }
export async function logChange({ who, kind, coll, docId, label, changes, note }) {
  if (!changes?.length && !note) return
  try {
    await addDoc(collection(db, 'bk_changes'), {
      at: serverTimestamp(), atIso: new Date().toISOString(),
      uid: who?.uid || '', email: who?.email || '', name: who?.name || '', role: who?.role || '',
      kind: kind || 'update', coll: coll || 'expenses', docId: docId || '', label: label || '',
      changes: (changes || []).map(c => ({ field: c.field, before: c.before ?? null, after: c.after ?? null })),
      note: note || '',
    })
  } catch (e) { console.error('bk_changes log failed', e) }
}

export function whoFrom(currentUser, userProfile) {
  return { uid: currentUser?.uid || '', email: currentUser?.email || '', name: userProfile?.displayName || '', role: userProfile?.role || '' }
}
