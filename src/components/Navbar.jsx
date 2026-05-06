import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { userProfile, isAdmin, logout } = useAuth()
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
              <Link to="/" className={linkClass('/')}>Dashboard</Link>
              {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
              {isAdmin && <Link to="/email" className={linkClass('/email')}>Email</Link>}
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
