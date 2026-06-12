import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy routes: each page downloads only when first visited,
// so the initial load stays small (xlsx, recharts etc. live in their own chunks).
const Home            = lazy(() => import('./components/Home'))
const Dashboard       = lazy(() => import('./components/Dashboard'))
const AdminPanel      = lazy(() => import('./components/AdminPanel'))
const EmailMarketing  = lazy(() => import('./components/email/EmailMarketing'))
const VoteContacts    = lazy(() => import('./components/VoteContacts'))
const EklogikáKentra  = lazy(() => import('./components/ekloges/EklogikáKentra'))
const BallotResults   = lazy(() => import('./components/BallotResults'))
const ElectionArchive = lazy(() => import('./components/ElectionArchive'))
const MedicalRecords  = lazy(() => import('./components/medical/MedicalRecords'))
const PatientProfile  = lazy(() => import('./components/medical/PatientProfile'))
const Bookkeeping     = lazy(() => import('./components/bookkeeping/Bookkeeping'))
const ImportExpensify = lazy(() => import('./components/bookkeeping/ImportExpensify'))
const UnsubscribePage = lazy(() => import('./components/email/UnsubscribePage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-blue-600 text-sm font-medium animate-pulse">Φόρτωση σελίδας…</div>
    </div>
  )
}

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
  const location = useLocation()
  const isPublicPage = location.pathname === '/unsubscribe'

  return (
    <div className="min-h-screen flex flex-col">
      {currentUser && !isPublicPage && <Navbar />}
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <div key={location.pathname} className="route-fade">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/waitlist" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/email" element={<AdminRoute><EmailMarketing /></AdminRoute>} />
              <Route path="/votes" element={<AdminRoute><VoteContacts /></AdminRoute>} />
              <Route path="/ekloges" element={<EklogesRoute><EklogikáKentra /></EklogesRoute>} />
              <Route path="/ballot-results" element={<AdminRoute><BallotResults /></AdminRoute>} />
              <Route path="/election-archive" element={<ProtectedRoute><ElectionArchive /></ProtectedRoute>} />
              <Route path="/medical" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
              <Route path="/medical/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
              <Route path="/bookkeeping" element={<AdminRoute><Bookkeeping /></AdminRoute>} />
              <Route path="/import-expensify" element={<AdminRoute><ImportExpensify /></AdminRoute>} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
