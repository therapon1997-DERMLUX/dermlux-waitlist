import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { userProfile, isAdmin, isEkloges, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? 'bg-[#9D835E] text-[#161616]'
        : 'text-[#cfc9bb] hover:bg-[#2a2620] hover:text-[#EEECE0]'
    }`

  const mobileLinkClass = (path) =>
    `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-[#9D835E] text-[#161616]'
        : 'text-[#cfc9bb] hover:bg-[#2a2620]'
    }`

  return (
    <nav className="bg-[#161616] text-[#EEECE0] shadow-md relative z-50 border-b border-[#9D835E]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-serif text-xl tracking-wide text-[#EEECE0] group-hover:text-white transition-colors" style={{ fontFamily: "'Prata', Georgia, serif" }}>
              DermLux
            </span>
            <span className="hidden sm:block text-[8px] font-bold uppercase tracking-[2.5px] text-[#9D835E]">
              Portal
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex gap-1">
            {userProfile?.role !== 'ekloges' && <Link to="/waitlist" className={linkClass('/waitlist')}>Λίστα Αναμονής</Link>}
            {userProfile?.role !== 'ekloges' && <Link to="/medical" className={linkClass('/medical')}>Ασθενείς</Link>}
            {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
            {isAdmin && <Link to="/email" className={linkClass('/email')}>Email</Link>}
            {isAdmin && <Link to="/bookkeeping" className={linkClass('/bookkeeping')}>Λογιστικά</Link>}
            {isAdmin && <Link to="/banks" className={linkClass('/banks')}>Τράπεζες</Link>}
            {isAdmin && <Link to="/claude" className={linkClass('/claude')}>Claude</Link>}
            {isAdmin && <Link to="/stavri" className={linkClass('/stavri')}>Σταύρη Μεταξά</Link>}
            {(isAdmin || isEkloges) && (
              <Link to="/election-archive" className={linkClass('/election-archive')}>🗳️ Εκλογές 2026</Link>
            )}
          </div>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-[#8B8378] text-sm">
              {userProfile?.displayName}
              {isAdmin && <span className="ml-1 badge bg-[#9D835E] text-[#161616]">Admin</span>}
            </span>
            <button onClick={logout} className="text-[#8B8378] hover:text-[#EEECE0] text-sm transition-colors">
              Αποσύνδεση
            </button>
          </div>

          {/* Mobile: right side */}
          <div className="flex md:hidden items-center gap-3">
            <span className="text-[#8B8378] text-sm">{userProfile?.displayName?.split(' ')[0]}</span>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="text-[#cfc9bb] hover:text-[#EEECE0] p-1.5 rounded-md transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0e0d0b] px-4 pb-4 pt-2 flex flex-col gap-1" onClick={() => setMenuOpen(false)}>
          {userProfile?.role !== 'ekloges' && <Link to="/" className={mobileLinkClass('/')}>🏠 Αρχική</Link>}
          {userProfile?.role !== 'ekloges' && <Link to="/waitlist" className={mobileLinkClass('/waitlist')}>📋 Λίστα Αναμονής</Link>}
          {userProfile?.role !== 'ekloges' && <Link to="/medical" className={mobileLinkClass('/medical')}>🏥 Ασθενείς</Link>}
          {isAdmin && <Link to="/admin" className={mobileLinkClass('/admin')}>⚙️ Admin</Link>}
          {isAdmin && <Link to="/email" className={mobileLinkClass('/email')}>📧 Email</Link>}
          {isAdmin && <Link to="/bookkeeping" className={mobileLinkClass('/bookkeeping')}>📒 Λογιστικά</Link>}
          {isAdmin && <Link to="/banks" className={mobileLinkClass('/banks')}>🏦 Τράπεζες</Link>}
          {isAdmin && <Link to="/claude" className={mobileLinkClass('/claude')}>💻 Claude</Link>}
          {isAdmin && <Link to="/stavri" className={mobileLinkClass('/stavri')}>👩‍💻 Σταύρη Μεταξά</Link>}
          {(isAdmin || isEkloges) && (
            <Link to="/election-archive" className={mobileLinkClass('/election-archive')}>🗳️ Εκλογές 2026</Link>
          )}
          <div className="border-t border-[#2a2620] mt-2 pt-2">
            <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-[#8B8378] hover:text-[#EEECE0] rounded-lg">
              🚪 Αποσύνδεση
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
