// HTML για εκτύπωση / «Αποθήκευση ως PDF»: statement τράπεζας, λίστα παραστατικών, καρτέλα προμηθευτή, ΦΠΑ.
import { esc, eur, fmtDate } from '../bookkeeping/ExportPrint'
import { accountLabel, accountOf, txKind, KIND_LABEL, linkedIds } from './booksData'

const head = (title, sub) => `<h1>${esc(title)}</h1><p class="sub">${esc(sub)} · DERMLUX LASER & AESTHETICS LTD · εκτύπωση ${fmtDate(new Date().toISOString().slice(0, 10))}</p>`
const n = v => Number(v) || 0

export function expensesListHtml(rows, title, sub) {
  const tot = rows.reduce((a, e) => ({ net: a.net + n(e.net), vat: a.vat + n(e.vat), total: a.total + n(e.total) }), { net: 0, vat: 0, total: 0 })
  return head(title, sub) + `<table><thead><tr><th>Ημ/νία</th><th>Προμηθευτής</th><th>Αρ.</th><th>Κατηγορία</th><th class="n">Καθαρό</th><th class="n">ΦΠΑ</th><th class="n">Σύνολο</th><th>Πληρωμή</th><th>Αρχείο</th></tr></thead><tbody>`
    + rows.map(e => `<tr><td>${fmtDate(e.date)}</td><td>${esc(e.vendor)}</td><td>${esc(e.invoiceNumber || '')}</td><td>${esc(e.category || '')}</td><td class="n">${eur(e.net)}</td><td class="n">${eur(e.vat)}</td><td class="n">${eur(e.total)}${e.currency && e.currency !== 'EUR' ? ' ' + esc(e.currency) : ''}</td><td>${e.bankTagDate ? esc(e.bankTagBank || '') + ' ' + fmtDate(e.bankTagDate) : esc(e.paymentMethod || '')}</td><td>${e.fileUrl ? '✓' : '<span class="bad">—</span>'}</td></tr>`).join('')
    + `<tr class="tot"><td colspan="4">Σύνολο (${rows.length})</td><td class="n">${eur(tot.net)}</td><td class="n">${eur(tot.vat)}</td><td class="n">${eur(tot.total)}</td><td colspan="2"></td></tr></tbody></table>`
}

export function statementHtml(txs, expById, { from, to, account }) {
  const byAcc = {}
  for (const t of txs) { const k = accountOf(t); (byAcc[k] = byAcc[k] || []).push(t) }
  const keys = account && account !== 'all' ? [account] : Object.keys(byAcc)
  let html = head('Κινήσεις τράπεζας', `${fmtDate(from)} – ${fmtDate(to)}`)
  for (const k of keys) {
    const rows = (byAcc[k] || []).slice().sort((a, b) => a.date.localeCompare(b.date))
    if (!rows.length) continue
    const deb = rows.reduce((a, t) => a + n(t.debit), 0), cred = rows.reduce((a, t) => a + n(t.credit), 0)
    html += `<h2>${esc(accountLabel(k))}</h2><table><thead><tr><th>Ημ/νία</th><th>Περιγραφή</th><th class="n">Χρέωση</th><th class="n">Πίστωση</th><th class="n">Υπόλοιπο</th><th>Δικαιολογητικό</th></tr></thead><tbody>`
      + rows.map(t => {
        const kind = txKind(t, expById)
        const docs = linkedIds(t).map(i => expById.get(i)).filter(Boolean)
        const just = kind === 'doc' ? docs.map(e => `${esc(e.vendor)} ${esc(e.invoiceNumber || '')}`).join('; ')
          : kind === 'rent' ? esc(t.rentLabel || 'Ενοίκιο') : kind === 'standing' ? esc(t.standingLabel || '') : KIND_LABEL[kind]
        return `<tr><td>${fmtDate(t.date)}</td><td>${esc(t.description || '')}</td><td class="n">${t.debit ? eur(t.debit) : ''}</td><td class="n">${t.credit ? eur(t.credit) : ''}</td><td class="n">${t.balance != null ? eur(t.balance) : ''}</td><td class="${kind === 'missing' ? 'bad' : ''}">${just}</td></tr>`
      }).join('')
      + `<tr class="tot"><td colspan="2">Σύνολα (${rows.length} κινήσεις)</td><td class="n">${eur(deb)}</td><td class="n">${eur(cred)}</td><td colspan="2"></td></tr></tbody></table>`
  }
  return html
}

export function ledgerHtml(vendor, rows, { from, to }) {
  const inv = rows.reduce((a, e) => a + n(e.total), 0)
  const paid = rows.filter(e => e.bankTagDate || e.paymentMethod === 'Μετρητά').reduce((a, e) => a + n(e.total), 0)
  return head(`Καρτέλα προμηθευτή: ${vendor}`, from || to ? `${fmtDate(from || '')} – ${fmtDate(to || '')}` : 'Όλο το ιστορικό')
    + `<table><thead><tr><th>Ημ/νία</th><th>Αρ. τιμολογίου</th><th class="n">Ποσό</th><th>Πληρωμή</th><th class="n">Ποσό πληρωμής</th></tr></thead><tbody>`
    + rows.slice().sort((a, b) => a.date.localeCompare(b.date)).map(e => `<tr><td>${fmtDate(e.date)}</td><td>${esc(e.invoiceNumber || '—')}</td><td class="n">${eur(e.total)}</td><td>${e.bankTagDate ? esc(e.bankTagBank || '') + ' · ' + fmtDate(e.bankTagDate) : e.paymentMethod === 'Μετρητά' ? 'Μετρητά (ταμείο)' : '<span class="warn">χωρίς συνδεδεμένη πληρωμή</span>'}</td><td class="n">${e.bankTagAmount ? eur(e.bankTagAmount) : ''}</td></tr>`).join('')
    + `<tr class="tot"><td colspan="2">Σύνολο τιμολογίων (${rows.length})</td><td class="n">${eur(inv)}</td><td>Με πληρωμή: ${eur(paid)}</td><td></td></tr></tbody></table>`
    + (rows.some(e => e.bankPaymentNote) ? `<p class="muted">Δόσεις: ${rows.filter(e => e.bankPaymentNote).map(e => esc(`${e.invoiceNumber}: ${e.bankPaymentNote}`)).join(' · ')}</p>` : '')
}

export function vatSummary(rows) {
  const byRate = {}, byCat = {}
  for (const e of rows) {
    const rate = e.reverseCharge ? 'Αντίστροφη χρέωση' : (e.vatRate ?? '—')
    const claim = (e.category || '').startsWith('8202') ? 'ΜΗ εκπιπτόμενο (εστίαση/φιλοξενία)' : 'Εκπιπτόμενο'
    const k = `${rate}|${claim}`
    byRate[k] = byRate[k] || { rate, claim, n: 0, net: 0, vat: 0, total: 0 }
    Object.assign(byRate[k], { n: byRate[k].n + 1, net: byRate[k].net + n(e.net), vat: byRate[k].vat + n(e.vat), total: byRate[k].total + n(e.total) })
    const c = e.category || '—'
    byCat[c] = byCat[c] || { cat: c, n: 0, net: 0, vat: 0, total: 0 }
    Object.assign(byCat[c], { n: byCat[c].n + 1, net: byCat[c].net + n(e.net), vat: byCat[c].vat + n(e.vat), total: byCat[c].total + n(e.total) })
  }
  return { byRate: Object.values(byRate).sort((a, b) => b.total - a.total), byCat: Object.values(byCat).sort((a, b) => b.total - a.total) }
}

export function vatHtml(rows, { from, to }) {
  const { byRate, byCat } = vatSummary(rows)
  const tbl = (head1, list, keyFn) => `<table><thead><tr><th>${head1}</th><th class="n">Παραστατικά</th><th class="n">Καθαρό</th><th class="n">ΦΠΑ</th><th class="n">Σύνολο</th></tr></thead><tbody>`
    + list.map(r => `<tr><td>${esc(keyFn(r))}</td><td class="n">${r.n}</td><td class="n">${eur(r.net)}</td><td class="n">${eur(r.vat)}</td><td class="n">${eur(r.total)}</td></tr>`).join('') + '</tbody></table>'
  return head('ΦΠΑ εισροών', `${fmtDate(from)} – ${fmtDate(to)}`)
    + '<h2>Ανά συντελεστή</h2>' + tbl('Συντελεστής', byRate, r => `${r.rate}${typeof r.rate === 'number' ? '%' : ''} · ${r.claim}`)
    + '<h2>Ανά κατηγορία</h2>' + tbl('Κατηγορία', byCat, r => r.cat)
}
