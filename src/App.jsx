import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import EmailMarketing from './components/email/EmailMarketing'
import VoteContacts from './components/VoteContacts'
import Navbar from './components/Navbar'
import EklogikáKentra from './components/ekloges/EklogikáKentra'
import BallotSubmit from './components/BallotSubmit'
import BallotResults from './components/BallotResults'

function ProtectedRoute({ children }) {
  const { currentUser, userProfile } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (userProfile?.role === 'ekloges') return <Navigate to="/ekloges" replace />
  return children
}

function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

function EklogesRoute({ children }) {
  const { currentUser, isAdmin, isEkloges } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (!isEkloges && !isAdmin) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { currentUser } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      {currentUser && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/email" element={<AdminRoute><EmailMarketing /></AdminRoute>} />
          <Route path="/votes" element={<AdminRoute><VoteContacts /></AdminRoute>} />
          <Route path="/ekloges" element={<EklogesRoute><EklogikáKentra /></EklogesRoute>} />
          <Route path="/kaipes" element={<BallotSubmit />} />
          <Route path="/ballot-results" element={<AdminRoute><BallotResults /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
