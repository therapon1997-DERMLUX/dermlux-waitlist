import admin from 'firebase-admin'
import { readFileSync, writeFileSync } from 'fs'
const key = JSON.parse(readFileSync('C:/Users/User/Downloads/serviceaccountkey.json', 'utf8'))
admin.initializeApp({ credential: admin.credential.cert(key) })
const db = admin.firestore()
const EXEC = process.argv.includes('--execute')

const FIXES = [
  { id: 'PIpI33tqWbXcjCg5qUPp', stmt: 'STMT-1798', was: 569.80,
    note: 'ΔΙΟΡΘΩΣΗ 24/08: Statement οφειλών Νο.1798 (06/08/2026, Total Due €569,80) — ΟΧΙ τιμολόγιο. Μηδενίστηκε για να μη μετρά διπλά· τα τιμολόγια που περιλαμβάνει (240603152/153 κ.ά.) είναι καταχωρημένα ξεχωριστά.' },
  { id: 'XTqbdx3KxACiZTkC9ey3', stmt: 'STMT-1799', was: 770.91,
    note: 'ΔΙΟΡΘΩΣΗ 24/08: Statement οφειλών Νο.1799 (07/08/2026, Total Due €770,91) — ΟΧΙ τιμολόγιο. Μηδενίστηκε· τα τιμολόγια 240603152/153/156 είναι καταχωρημένα ξεχωριστά. Υπάρχει και 2ο αντίγραφο του ίδιου statement.' },
  { id: 'gZxuucydcouAQhYaZ3Cn', stmt: 'STMT-1799', was: 770.91,
    note: 'ΔΙΟΡΘΩΣΗ 24/08: Δεύτερο αντίγραφο του Statement Νο.1799 (07/08/2026) — ΟΧΙ τιμολόγιο, μηδενίστηκε.' },
]

const backup = []
for (const f of FIXES) {
  const ref = db.collection('expenses').doc(f.id)
  const snap = await ref.get()
  if (!snap.exists) { console.log('!! λείπει:', f.id); continue }
  const cur = snap.data()
  backup.push({ id: f.id, before: cur })
  console.log(`${EXEC ? 'FIX' : 'DRY'} ${f.id}: ${cur.vendor} | total ${cur.total} → 0 | inv ${cur.invoiceNumber} → ${f.stmt}`)
  if (EXEC) await ref.update({
    net: 0, vat: 0, total: 0,
    invoiceNumber: f.stmt,
    docType: 'statement',
    notes: [cur.notes, f.note].filter(Boolean).join(' · '),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
}
const bf = `C:/Users/User/dermlux-waitlist/backups/acd_statements_fix_${Date.now()}.json`
writeFileSync(bf, JSON.stringify(backup, null, 1))
console.log('backup:', bf)
process.exit(0)
