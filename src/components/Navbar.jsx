import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { userProfile, isAdmin, isEkloges, logout } = useAuth()
  const [unseenCount, setUnseenCount] = useState(0)

  useEffect(() => {
    if (!isAdmin) return
    const unsub = onSnapshot(
      query(collection(db, 'ballot_results'), where('seen', '==', false)),
      snap => setUnseenCount(snap.size)
    )
    return unsub
  }, [isAdmin])
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg tracking-wide">Dermlux</span>
            <div className="flex gap-1">
              {userProfile?.role !== 'ekloges' && <Link to="/" className={linkClass('/')}>Dashboard</Link>}
              {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
              {isAdmin && <Link to="/email" className={linkClass('/email')}>Email</Link>}
              {isAdmin && <Link to="/votes" className={linkClass('/votes')}>Ψηφοφόροι</Link>}
              {(isAdmin || isEkloges) && <Link to="/ekloges" className={linkClass('/ekloges')}>🗳️ Εκλογές</Link>}
              {isAdmin && (
                <Link to="/ballot-results" className={`${linkClass('/ballot-results')} relative`}>
                  📊 Αποτελέσματα
                  {unseenCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 leading-none">
                      {unseenCount > 9 ? '9+' : unseenCount}
                    </span>
                  )}
                </Link>
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
