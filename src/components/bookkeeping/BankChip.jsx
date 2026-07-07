import { useState, useRef, useEffect } from 'react'
import bocLogo from '../../assets/banks/boc.svg'
import eurobankLogo from '../../assets/banks/eurobank.svg'
import revolutLogo from '../../assets/banks/revolut.svg'

// Clickable bank tag chip: shows the bank's real logo, click opens a popover
// with the matched bank transaction's date, description, amount & reference.
// Cash payments render a Cash chip; bank-paid expenses without a matched statement
// line render a subtle "πιθανόν cash;" hint only when explicitly asked (showUnmatched).

export const BANK_STYLE = {
  'Bank of Cyprus': { label: 'BoC', logo: bocLogo,      cls: 'bg-red-600 text-white',  full: 'Bank of Cyprus' },
  'Eurobank':       { label: 'EB',  logo: eurobankLogo, cls: 'bg-blue-900 text-white', full: 'Eurobank Cyprus' },
  'Revolut':        { label: 'R',   logo: revolutLogo,  cls: 'bg-gray-900 text-white', full: 'Revolut Business' },
}

const fmtDate = d => {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const months = ['Ιαν','Φεβ','Μαρ','Απρ','Μαΐ','Ιουν','Ιουλ','Αυγ','Σεπ','Οκτ','Νοε','Δεκ']
  return `${parseInt(day)} ${months[parseInt(m) - 1]} ${y}`
}
const eur = n => '€' + (Number(n) || 0).toLocaleString('el-CY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function BankChip({ expense, showUnmatched = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const isCash = expense.paymentMethod === 'Μετρητά'
  const bank   = expense.bankTagBank

  if (isCash) {
    return (
      <span className="inline-flex items-center gap-1 shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full"
            title="Πληρωμή με μετρητά (ταμείο)">
        💶 Cash
      </span>
    )
  }

  if (!bank && expense.bankPaymentNote) {
    return (
      <span className="inline-flex items-center shrink-0 text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full"
            title={expense.bankPaymentNote}>
        💳 προσ. κάρτα
      </span>
    )
  }

  if (!bank) {
    if (!showUnmatched) return null
    return (
      <span className="inline-flex items-center shrink-0 text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full"
            title="Δεν βρέθηκε στη τράπεζα — πιθανόν μετρητά ή εκτός περιόδου statement">
        πιθανόν cash;
      </span>
    )
  }

  const st = BANK_STYLE[bank] || { label: bank.slice(0, 3), cls: 'bg-gray-600 text-white', full: bank }

  return (
    <span className="relative inline-flex shrink-0" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        className={st.logo
          ? 'inline-flex items-center bg-white border border-gray-200 px-1.5 py-0.5 rounded-full shadow-sm hover:scale-105 hover:border-gray-300 transition-transform'
          : `inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm hover:scale-105 transition-transform ${st.cls}`}
        title={`Πληρώθηκε μέσω ${st.full} — κλικ για λεπτομέρειες`}>
        {st.logo ? <img src={st.logo} alt={st.full} className="h-3 w-auto max-w-[4.5rem]" /> : <>🏦 {st.label}</>}
      </button>
      {open && (
        <span className="absolute z-30 top-6 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-left cursor-default"
              onClick={e => e.stopPropagation()}>
          {st.logo
            ? <img src={st.logo} alt={st.full} className="h-4 w-auto mb-1.5" />
            : <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{st.full}</span>}
          <span className="block text-sm font-semibold text-gray-800">{fmtDate(expense.bankTagDate)}</span>
          <span className="block text-xs text-gray-600 mt-1 break-words">{expense.bankTagDesc}</span>
          <span className="block text-sm font-bold text-gray-900 mt-1.5">{eur(expense.bankTagAmount)}</span>
          {expense.bankTagRef && (
            <span className="block text-[10px] text-gray-400 mt-1 font-mono">ref: {expense.bankTagRef}</span>
          )}
        </span>
      )}
    </span>
  )
}
