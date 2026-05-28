import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { userProfile, isAdmin, isEkloges, logout } = useAuth()
  const [unseenCount, setUnseenCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), where('status', '==', 'pending')),
      snap => setUnseenCount(snap.size)
    )
    return unsub
  }, [isAdmin])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on navigation
  useEffect(() => { setDropdownOpen(false) }, [location.pathname])

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`

  const electionPaths = ['/votes', '/ekloges', '/ballot-results', '/election-archive']
  const electionActive = electionPaths.includes(location.pathname)

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg tracking-wide">Dermlux</span>
            <div className="flex gap-1">
              {userProfile?.role !== 'ekloges' && <Link to="/" className={linkClass('/')}>Dashboard</Link>}
              {userProfile?.role !== 'ekloges' && <Link to="/medical" className={linkClass('/medical')}>Ασθενείς</Link>}
              {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
              {isAdmin && <Link to="/email" className={linkClass('/email')}>Email</Link>}

              {/* Nikoletta 2026 dropdown */}
              {(isAdmin || isEkloges) && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(o => !o)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      electionActive || dropdownOpen
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                    }`}
                  >
                    🗳️ Nikoletta 2026
                    <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {isAdmin && unseenCount > 0 && (
                      <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 leading-none">
                        {unseenCount > 9 ? '9+' : unseenCount}
                      </span>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                      {(isAdmin || isEkloges) && (
                        <Link
                          to="/ekloges"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            location.pathname === '/ekloges'
                              ? 'bg-blue-50 text-blue-800 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🗳️ Εκλογές
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/votes"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            location.pathname === '/votes'
                              ? 'bg-blue-50 text-blue-800 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          👥 Ψηφοφόροι
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/ballot-results"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            location.pathname === '/ballot-results'
                              ? 'bg-blue-50 text-blue-800 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          📊 Αποτελέσματα
                          {unseenCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 leading-none">
                              {unseenCount > 9 ? '9+' : unseenCount}
                            </span>
                          )}
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/election-archive"
                          className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            location.pathname === '/election-archive'
                              ? 'bg-blue-50 text-blue-800 font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          📁 Αρχείο 2026
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-sm">
              {userProfile?.displayName}
              {isAdmin && <span className="ml-1 badge bg-yellow-400 text-yellow-900">Admin</span>}
            </span>
            <button
              onClick={logout}
              className="text-blue-200 hover:text-white text-sm transition-colors"
            >
              Αποσύνδεση
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
