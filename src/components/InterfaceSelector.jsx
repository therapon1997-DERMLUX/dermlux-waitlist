import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/* Base44-style interface selector: every module of the portal grouped as an
   "interface" with its pages as tabs. Shown as the post-login landing page. */

const GOLD = '#9D835E'

const ICONS = {
  clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3.5 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  bag: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
  vote: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
  cog: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />,
}

const INTERFACES = [
  {
    id: 'callcenter',
    title: 'Call Center',
    desc: 'Λίστα αναμονής, κλήσεις και ιατρικά αρχεία πελατών.',
    icon: 'clock',
    accent: '#9D845F',
    show: (a) => !a.staffOnly && !a.isEklogesOnly,
    tabs: [
      { to: '/waitlist', label: 'Λίστα Αναμονής' },
      { to: '/medical', label: 'Ασθενείς' },
    ],
  },
  {
    id: 'eshop',
    title: 'ZO® Eshop',
    desc: 'Το ηλεκτρονικό κατάστημα ZO Skin Health — δοκιμαστική έκδοση.',
    icon: 'bag',
    accent: '#1B3FC4',
    badge: 'TEST',
    show: (a) => a.isAdmin,
    tabs: [{ to: '/eshop', label: 'Κατάστημα' }],
  },
  {
    id: 'books',
    title: 'Λογιστικά',
    desc: 'Βιβλία εξόδων, τραπεζικές κινήσεις και αποδείξεις καταστημάτων.',
    icon: 'book',
    accent: '#4ade80',
    show: (a) => a.isAdmin || a.isAccountant || a.isExpenses,
    tabs: [
      { to: '/bookkeeping', label: 'Βιβλία', show: (a) => a.isAdmin || a.isAccountant },
      { to: '/banks', label: 'Τράπεζες', show: (a) => a.isAdmin || a.isAccountant },
      { to: '/upload', label: 'Αποδείξεις', show: (a) => a.isAdmin || a.isExpenses },
    ],
  },
  {
    id: 'ekloges',
    title: 'Εκλογές 2026',
    desc: 'Αρχείο εκλογών, επαφές, εκλογικά κέντρα και αποτελέσματα.',
    icon: 'vote',
    accent: '#7E88BC',
    show: (a) => a.isAdmin || a.isEkloges,
    tabs: [
      { to: '/election-archive', label: 'Αρχείο' },
      { to: '/votes', label: 'Επαφές' },
      { to: '/ekloges', label: 'Εκλογικά Κέντρα' },
      { to: '/ballot-results', label: 'Αποτελέσματα' },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    desc: 'Email καμπάνιες, επαφές, templates και στατιστικά.',
    icon: 'mail',
    accent: '#B392A4',
    show: (a) => a.isAdmin,
    tabs: [{ to: '/email', label: 'Email Marketing' }],
  },
  {
    id: 'management',
    title: 'Διαχείριση',
    desc: 'Χρήστες και ρόλοι, Claude remote και εργαλεία ομάδας.',
    icon: 'cog',
    accent: '#8B8378',
    show: (a) => a.isAdmin,
    tabs: [
      { to: '/admin', label: 'Admin Panel' },
      { to: '/claude', label: 'Claude' },
      { to: '/stavri', label: 'Σταύρη Μεταξά' },
    ],
  },
  {
    id: 'presentation',
    title: 'Παρουσίαση',
    desc: 'Η εταιρική αρχική σελίδα DermLux με τα στατιστικά.',
    icon: 'home',
    accent: '#EEECE0',
    show: (a) => !a.staffOnly && !a.isEklogesOnly,
    tabs: [{ to: '/home', label: 'Αρχική DermLux' }],
  },
]

export default function InterfaceSelector() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { userProfile, isAdmin } = auth
  const flags = {
    ...auth,
    staffOnly: auth.isExpenses || auth.isAccountant,
    isEklogesOnly: userProfile?.role === 'ekloges',
  }
  const visible = INTERFACES.filter((i) => i.show(flags))

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#161616] text-[#EEECE0] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl mb-2" style={{ fontFamily: "'Prata', Georgia, serif" }}>
            Καλωσήρθες{userProfile?.displayName ? `, ${userProfile.displayName.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-[#8B8378] uppercase tracking-[0.25em]">Διάλεξε interface</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((itf) => {
            const tabs = itf.tabs.filter((t) => !t.show || t.show(flags))
            if (tabs.length === 0) return null
            return (
              <div
                key={itf.id}
                onClick={() => navigate(tabs[0].to)}
                className="group cursor-pointer rounded-xl border border-[#9D835E]/20 bg-[#1d1b17] hover:border-[#9D835E]/60 hover:bg-[#211e19] transition-all duration-200 p-5 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#9D835E]/25 group-hover:scale-105 transition-transform" style={{ color: itf.accent }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">{ICONS[itf.icon]}</svg>
                  </div>
                  {itf.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded" style={{ background: '#FFF6DE', color: '#8a6d1a' }}>
                      {itf.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-lg mb-1" style={{ fontFamily: "'Prata', Georgia, serif", color: '#EEECE0' }}>{itf.title}</h2>
                <p className="text-[12.5px] text-[#8B8378] leading-relaxed mb-4">{itf.desc}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {tabs.map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#9D835E]/30 text-[#cfc9bb] hover:bg-[#9D835E] hover:text-[#161616] transition-colors"
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {isAdmin && (
          <p className="text-center text-[11px] text-[#5c564c] mt-10">
            Τα interfaces που βλέπει κάθε χρήστης εξαρτώνται από τον ρόλο του.
          </p>
        )}
      </div>
    </div>
  )
}
