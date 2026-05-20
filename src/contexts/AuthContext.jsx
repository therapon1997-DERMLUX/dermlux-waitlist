import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, firebaseConfig } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading]         = useState(true)

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return signOut(auth)
  }

  // Create a new agent/admin without signing out current admin
  async function createUser(email, password, displayName, role = 'agent') {
    const { initializeApp, deleteApp } = await import('firebase/app')
    const secondaryApp  = initializeApp(firebaseConfig, 'Secondary-' + Date.now())
    const secondaryAuth = getAuth(secondaryApp)
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        email,
        displayName,
        role,
        active: true,
        createdAt: serverTimestamp(),
      })
      return cred.user
    } finally {
      await secondaryAuth.signOut()
      await deleteApp(secondaryApp)
    }
  }

  async function fetchUserProfile(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) {
        setUserProfile(snap.data())
      } else {
        await setDoc(doc(db, 'users', uid), {
          email:       auth.currentUser?.email,
          displayName: auth.currentUser?.email,
          role:        'agent',
          active:      true,
          createdAt:   serverTimestamp(),
        })
        setUserProfile({ role: 'agent', displayName: auth.currentUser?.email })
      }
    } catch (err) {
      console.error('fetchUserProfile error:', err)
      // Still set a basic profile so the app doesn't get stuck
      setUserProfile({ role: 'agent', displayName: auth.currentUser?.email })
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const isAdmin = userProfile?.role === 'admin'
  const isEkloges = userProfile?.role === 'ekloges' || userProfile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, isAdmin, isEkloges, login, logout, createUser, loading }}>
      {loading
        ? <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="text-blue-600 text-lg font-medium">Φόρτωση…</div>
          </div>
        : children
      }
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
