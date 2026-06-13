import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, auth } from '../firebase/config'

/* Lightweight, fire-and-forget audit trail of sensitive admin actions.
   Never blocks the UI and never throws — a security record only. */
export function logAudit(action, detail = {}) {
  try {
    addDoc(collection(db, 'audit_log'), {
      action,
      detail,
      byEmail: auth.currentUser?.email || '',
      byUid:   auth.currentUser?.uid || '',
      at:      serverTimestamp(),
      ua:      (navigator.userAgent || '').slice(0, 180),
    }).catch(() => {})
  } catch { /* never disrupt the app */ }
}
