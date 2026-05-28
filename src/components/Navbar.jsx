import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { userProfile, isAdmin, isEkloges, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`

  const mobileLinkClass = (path) =>
    `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-700'
    }`

  return (
    <nav className="bg-blue-800 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <span className="font-bold text-lg tracking-wide">Nikoletta 2026</span>

          {/* Desktop links */}
          <div className="hidden md:flex gap-1">
            {userProfile?.role !== 'ekloges' && <Link to="/" className={linkClass('/')}>Dashboard</Link>}
            {userProfile?.role !== 'ekloges' && <Link to="/medical" className={linkClass('/medical')}>Ασθενείς</Link>}
            {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
            {isAdmin && <Link to="/email" className={linkClass('/email')}>Email</Link>}
            {(isAdmin || isEkloges) && (
              <Link to="/election-archive" className={linkClass('/election-archive')}>🗳️ Εκλογές 2026</Link>
            )}
          </div>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-blue-200 text-sm">
              {userProfile?.displayName}
              {isAdmin && <span className="ml-1 badge bg-yellow-400 text-yellow-900">Admin</span>}
            </span>
            <button onClick={logout} className="text-blue-200 hover:text-white text-sm transition-colors">
              Αποσύνδεση
            </button>
          </div>

          {/* Mobile: right side */}
          <div className="flex md:hidden items-center gap-3">
            <span className="text-blue-200 text-sm">{userProfile?.displayName?.split(' ')[0]}</span>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="text-blue-200 hover:text-white p-1.5 rounded-md transition-colors"
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
        <div className="md:hidden bg-blue-900 px-4 pb-4 pt-2 flex flex-col gap-1" onClick={() => setMenuOpen(false)}>
          {userProfile?.role !== 'ekloges' && <Link to="/" className={mobileLinkClass('/')}>🏠 Dashboard</Link>}
          {userProfile?.role !== 'ekloges' && <Link to="/medical" className={mobileLinkClass('/medical')}>🏥 Ασθενείς</Link>}
          {isAdmin && <Link to="/admin" className={mobileLinkClass('/admin')}>⚙️ Admin</Link>}
          {isAdmin && <Link to="/email" className={mobileLinkClass('/email')}>📧 Email</Link>}
          {(isAdmin || isEkloges) && (
            <Link to="/election-archive" className={mobileLinkClass('/election-archive')}>🗳️ Εκλογές 2026</Link>
          )}
          <div className="border-t border-blue-700 mt-2 pt-2">
            <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-blue-200 hover:text-white rounded-lg">
              🚪 Αποσύνδεση
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
