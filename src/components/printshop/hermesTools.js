// Εργαλεία του Ερμογένη — εκτελούνται στον browser πάνω στα δεδομένα που έχει ήδη φορτώσει η σελίδα.
// Κάθε εργαλείο επιστρέφει { result } για το μοντέλο και, όπου χρειάζεται, { attach } για να μπει κάρτα στο chat.
import { loadExpenses, loadBank, accountOf, accountLabel, txKind, KIND_LABEL, linkedIds, fold, matchExpense, matchTx,
  addNote, loadNotes, updateExpense, saveRule, bookOf, IEPE_ACCOUNT } from './booksData'
import { vatSummary } from './printViews'
import { emit } from './bridge'
import { auth } from '../../firebase/config'
const WORKER = import.meta.env.VITE_WORKER_URL || ''
import { logChange } from '../bookkeeping/changeLog'
import { CATEGORIES, LOCATIONS, PAYMENT_METHODS } from '../bookkeeping/ExpenseModal'

const n = v => Number(v) || 0
const r2 = v => Math.round(n(v) * 100) / 100
const paidOf = e => e.bankTagDate ? `${e.bankTagBank || 'τράπεζα'} ${e.bankTagDate}` : e.paymentMethod === 'Μετρητά' ? 'μετρητά' : 'όχι'
export const compactDoc = e => ({ id: e.id, date: e.date, vendor: e.vendor, invoice: e.invoiceNumber || '', total: r2(e.total), net: r2(e.net), vat: r2(e.vat),
  vatRate: e.vatRate ?? null, currency: e.currency || 'EUR', category: e.category || '', location: e.location || '', paid: paidOf(e), file: !!e.fileUrl,
  reverseCharge: !!e.reverseCharge, notes: (e.notes || '').slice(0, 120) })

// Βιβλία: προεπιλογή DermLux — η Ιατρική ΙΕΠΕ (books:'IEPE') μόνο όταν ζητηθεί ρητά (company 'IEPE' ή 'all')
const inCompany = (e, company) => company === 'all' || bookOf(e) === (company || 'DERMLUX')
const txInCompany = (t, company) => company === 'all' || (company === 'IEPE') === (t.account === IEPE_ACCOUNT)

export function filterExpenses(list, f = {}) {
  return list.filter(e => {
    if (!inCompany(e, f.company)) return false
    if (f.from && e.date < f.from) return false
    if (f.to && e.date > f.to) return false
    if (f.vendor && !fold(e.vendor).includes(fold(f.vendor))) return false
    if (f.query && !matchExpense(e, f.query)) return false
    if (f.category && !fold(e.category).includes(fold(f.category))) return false
    if (f.location && !fold(e.location).includes(fold(f.location))) return false
    if (f.min_total != null && n(e.total) < f.min_total) return false
    if (f.max_total != null && n(e.total) > f.max_total) return false
    if (f.missing_file && e.fileUrl) return false
    if (f.unpaid && (e.bankTagDate || e.paymentMethod === 'Μετρητά')) return false
    return true
  })
}

async function rowsFrom(input) {
  const all = await loadExpenses()
  if (Array.isArray(input.ids) && input.ids.length) { const set = new Set(input.ids); return all.filter(e => set.has(e.id)) }
  if (input.filter && Object.keys(input.filter).length) return filterExpenses(all, input.filter)
  return []
}

const EDITABLE = ['vendor', 'invoiceNumber', 'date', 'net', 'vat', 'vatRate', 'total', 'currency', 'category', 'location', 'paymentMethod', 'reverseCharge', 'notes_append']
function normCategory(v) {
  if (CATEGORIES.includes(v)) return v
  const code = String(v).match(/\d{4}/)?.[0]
  const hit = code ? CATEGORIES.find(c => c.startsWith(code)) : CATEGORIES.find(c => fold(c).includes(fold(v)))
  if (!hit) throw new Error(`Άγνωστη κατηγορία «${v}». Διαθέσιμες: ${CATEGORIES.join(', ')}`)
  return hit
}
// Τι θα γίνει σε ένα παραστατικό με αυτό το set
export function planFor(e, set) {
  const out = {}
  for (const [k, v] of Object.entries(set)) {
    if (k === 'notes_append') { out.notes = [e.notes, String(v)].filter(Boolean).join(e.notes ? '\n' : ''); continue }
    if (k === 'category') { out.category = normCategory(v); continue }
    if (k === 'location') { if (!LOCATIONS.includes(v)) throw new Error(`Άγνωστο κατάστημα «${v}»`); out.location = v; continue }
    if (k === 'paymentMethod') { if (!PAYMENT_METHODS.includes(v)) throw new Error(`Άγνωστος τρόπος πληρωμής «${v}»`); out.paymentMethod = v; continue }
    if (k === 'reverseCharge') { out.reverseCharge = !!v; continue }
    if (['net', 'vat', 'vatRate', 'total'].includes(k)) { out[k] = v === '=total' ? r2(e.total) : v === '=net' ? r2(e.net) : r2(v); continue }
    out[k] = v
  }
  return out
}

export async function runTool(name, input = {}, ctx = {}) {
  switch (name) {
    case 'search_documents': {
      const all = await loadExpenses()
      const rows = filterExpenses(all, input)
      const limit = Math.min(Math.max(input.limit || 25, 1), 200)
      return { result: { count: rows.length, total_sum: r2(rows.reduce((a, e) => a + n(e.total), 0)), shown: rows.slice(0, limit).map(compactDoc), note: rows.length > limit ? `εμφανίζονται ${limit} από ${rows.length}` : undefined } }
    }
    case 'show_documents': {
      const rows = (await rowsFrom({ ids: input.ids })).slice(0, 30)
      const found = new Set(rows.map(e => e.id))
      return { result: { shown_in_chat: rows.length, not_found: (input.ids || []).filter(i => !found.has(i)) },
        attach: { type: 'docs', title: input.title || (rows.length === 1 ? 'Παραστατικό' : `${rows.length} παραστατικά`), ids: rows.map(e => e.id) } }
    }
    case 'prepare_bundle': {
      const rows = await rowsFrom(input)
      if (!rows.length) return { result: { error: 'Κανένα παραστατικό δεν ταιριάζει — δώσε ids ή filter.' } }
      return { result: { prepared: true, format: input.format, count: rows.length, total_sum: r2(rows.reduce((a, e) => a + n(e.total), 0)), without_file: rows.filter(e => !e.fileUrl).length },
        attach: { type: 'bundle', format: input.format, title: input.title || 'Πακέτο παραστατικών', ids: rows.map(e => e.id) } }
    }
    case 'search_bank': {
      const days = (new Date(input.to) - new Date(input.from)) / 864e5
      if (!(days >= 0)) return { result: { error: 'Λάθος from/to (YYYY-MM-DD)' } }
      if (days > 200) return { result: { error: 'Πολύ μεγάλο διάστημα — έως 6 μήνες ανά αναζήτηση.' } }
      const [all, txs] = await Promise.all([loadExpenses(), loadBank(input.from, input.to)])
      const byId = new Map(all.map(e => [e.id, e]))
      let rows = txs.filter(t => (!input.account || input.account === 'all' || accountOf(t) === input.account) && matchTx(t, input.query))
      if (input.direction === 'out') rows = rows.filter(t => n(t.debit) > 0)
      if (input.direction === 'in') rows = rows.filter(t => n(t.credit) > 0)
      if (input.only_missing) rows = rows.filter(t => txKind(t, byId) === 'missing')
      const compact = rows.map(t => {
        const docs = linkedIds(t).map(i => byId.get(i)).filter(Boolean)
        const k = txKind(t, byId)
        return { id: t.id, date: t.date, account: accountLabel(accountOf(t)), description: String(t.description || '').slice(0, 110), amount: n(t.credit) > 0 ? r2(t.credit) : -r2(t.debit),
          justification: docs.length ? docs.map(e => `${e.vendor} ${e.invoiceNumber || ''} [${e.id}]`).join('; ') : k === 'rent' ? (t.rentLabel || 'ενοίκιο') : k === 'standing' ? t.standingLabel : KIND_LABEL[k] }
      })
      const limit = Math.min(input.limit || 40, 150)
      return { result: { count: rows.length, debits: r2(rows.reduce((a, t) => a + n(t.debit), 0)), credits: r2(rows.reduce((a, t) => a + n(t.credit), 0)), shown: compact.slice(0, limit) },
        attach: input.show_in_chat ? { type: 'bank', title: `Κινήσεις ${input.from} – ${input.to}`, rows: compact.slice(0, 80) } : undefined }
    }
    case 'supplier_ledger': {
      const all = await loadExpenses()
      let rows = all.filter(e => inCompany(e, input.company) && fold(e.vendor).includes(fold(input.vendor)))
      if (input.from) rows = rows.filter(e => e.date >= input.from)
      if (input.to) rows = rows.filter(e => e.date <= input.to)
      if (!rows.length) return { result: { error: `Δεν βρέθηκε προμηθευτής «${input.vendor}»` } }
      const names = [...new Set(rows.map(e => e.vendor))]
      const unpaid = rows.filter(e => !e.bankTagDate && e.paymentMethod !== 'Μετρητά')
      return { result: { vendors: names, invoices: rows.length, total: r2(rows.reduce((a, e) => a + n(e.total), 0)), unpaid_count: unpaid.length,
        unpaid_total: r2(unpaid.reduce((a, e) => a + n(e.total), 0)), unpaid: unpaid.slice(0, 20).map(compactDoc), last: rows.map(e => e.date).sort().pop() },
        attach: { type: 'ledger', vendor: names.length === 1 ? names[0] : input.vendor, ids: rows.map(e => e.id), from: input.from || '', to: input.to || '' } }
    }
    case 'period_summary': {
      const all = await loadExpenses()
      const rows = all.filter(e => inCompany(e, input.company) && e.date >= input.from && e.date <= input.to)
      const { byRate, byCat } = vatSummary(rows)
      let bankMissing = null
      if ((new Date(input.to) - new Date(input.from)) / 864e5 <= 400) {
        const byId = new Map(all.map(e => [e.id, e]))
        const txs = await loadBank(input.from, input.to)
        const m = txs.filter(t => txInCompany(t, input.company) && txKind(t, byId) === 'missing')
        bankMissing = { count: m.length, total: r2(m.reduce((a, t) => a + n(t.debit), 0)) }
      }
      return { result: { documents: rows.length, total: r2(rows.reduce((a, e) => a + n(e.total), 0)), net: r2(rows.reduce((a, e) => a + n(e.net), 0)), vat: r2(rows.reduce((a, e) => a + n(e.vat), 0)),
        vat_by_rate: byRate.map(r => ({ rate: r.rate, claim: r.claim, docs: r.n, net: r2(r.net), vat: r2(r.vat), total: r2(r.total) })),
        by_category: byCat.slice(0, 15).map(r => ({ category: r.cat, docs: r.n, total: r2(r.total) })),
        without_file: rows.filter(e => !e.fileUrl).length, without_payment: rows.filter(e => !e.bankTagDate && e.paymentMethod !== 'Μετρητά').length,
        bank_payments_without_document: bankMissing } }
    }
    case 'update_documents': {
      const rows = (await rowsFrom(input)).slice(0, 300)
      if (!rows.length) return { result: { error: 'Κανένα παραστατικό δεν ταιριάζει.' } }
      const set = input.set || {}
      const bad = Object.keys(set).filter(k => !EDITABLE.includes(k))
      if (bad.length) return { result: { error: `Δεν αλλάζουν τα πεδία: ${bad.join(', ')}. Επιτρέπονται: ${EDITABLE.join(', ')}` } }
      let sample
      try { sample = rows.slice(0, 5).map(e => ({ doc: `${e.vendor} ${e.invoiceNumber || ''} ${e.date}`, after: planFor(e, set) })) }
      catch (err) { return { result: { error: err.message } } }
      return { result: { status: 'awaiting_confirmation', count: rows.length, sample, message: 'Εμφανίστηκε κάρτα επιβεβαίωσης στο chat. Η αλλαγή γίνεται μόνο αν ο χρήστης πατήσει «Επιβεβαίωση».' },
        attach: { type: 'confirm', ids: rows.map(e => e.id), set, reason: input.reason || '', save_rule: input.save_rule?.vendor_match ? input.save_rule : null, state: 'pending' } }
    }
    case 'create_request': {
      const all = input.document_id ? await loadExpenses() : []
      const e = all.find(x => x.id === input.document_id)
      await addNote({ who: ctx.who, type: 'request', text: input.text, targetType: e ? 'expense' : '', targetId: e?.id || '', targetLabel: e ? `${e.vendor} ${e.invoiceNumber || ''} ${e.date}` : '' })
      return { result: { created: true }, attach: { type: 'note', text: input.text } }
    }
    case 'ask_therapon': {
      const all = input.document_id ? await loadExpenses() : []
      const e = all.find(x => x.id === input.document_id)
      const label = e ? `${e.vendor} ${e.invoiceNumber || ''} ${e.date}` : ''
      const text = input.text + (label ? `
(Αφορά: ${label})` : '')
      // 1) καταγραφή στα αιτήματα (εδώ θα φανεί και η απάντηση) 2) ειδοποίηση SMS/email μέσω worker
      const ref = await addNote({ who: ctx.who, type: 'owner_ask', text, targetType: e ? 'expense' : '', targetId: e?.id || '', targetLabel: label })
      let sent = false, err = ''
      try {
        const token = await auth.currentUser.getIdToken()
        const r = await fetch(`${WORKER}/notify-owner`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ channel: input.channel, subject: input.subject || '', text: text + `

#${ref.id.slice(-6)}`, from: ctx.who?.name || ctx.who?.email || '' }) })
        const j = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(j.error || `Σφάλμα ${r.status}`)
        sent = true
      } catch (x) { err = x.message }
      return { result: sent ? { sent: true, channel: input.channel, note: 'Ο Θεράπων θα απαντήσει μέσω Claude Code· η απάντηση θα φανεί στα αιτήματα.' } : { sent: false, error: err, note: 'Το αίτημα γράφτηκε στα αιτήματα αλλά η ειδοποίηση απέτυχε.' },
        attach: { type: 'ask', channel: input.channel, text: input.text, sent, err } }
    }
    case 'list_requests': {
      const notes = await loadNotes()
      const st = input.status || 'open'
      return { result: { requests: notes.filter(x => st === 'all' || x.status === st).slice(0, 30).map(x => ({ type: x.type, status: x.status, text: x.text, by: x.name || x.email, at: x.atIso, about: x.targetLabel || '', reply: x.reply || '' })) } }
    }
    case 'open_print_shop': {
      ctx.navigate?.('/print-shop')
      setTimeout(() => emit('printshop:open', { tab: input.tab, query: input.query, from: input.from, to: input.to }), 350)
      return { result: { opened: true } }
    }
    default: return { result: { error: `Άγνωστο εργαλείο ${name}` } }
  }
}

// Εφαρμογή επιβεβαιωμένης αλλαγής (από την κάρτα επιβεβαίωσης)
export async function applyConfirmed(attach, who) {
  const all = await loadExpenses()
  const byId = new Map(all.map(e => [e.id, e]))
  let done = 0
  for (const id of attach.ids) {
    const e = byId.get(id); if (!e) continue
    const fields = planFor(e, attach.set)
    const changes = Object.entries(fields).filter(([k, v]) => String(e[k] ?? '') !== String(v ?? '')).map(([k, v]) => ({ field: k, before: e[k] ?? null, after: v }))
    if (!changes.length) continue
    await updateExpense(id, fields)
    await logChange({ who, kind: 'expense_update', coll: 'expenses', docId: id, label: `${e.vendor || ''} ${e.invoiceNumber || ''} (${e.date || ''})`.trim(), changes, note: `${attach.reason} (μέσω Ερμογένη)` })
    done++
  }
  if (attach.save_rule?.vendor_match) {
    const set = { ...attach.set }; delete set.notes_append
    await saveRule({ who, vendorMatch: attach.save_rule.vendor_match, set, reason: attach.reason })
  }
  return done
}
