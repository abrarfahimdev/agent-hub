// ============================================
// USER LAYOUT
// Clean layout without Navbar and Footer
// Only for user dashboard pages
// ============================================

import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const UserLayout = () => {
  // Theme state
  const [theme, setTheme] = useState(
    () => localStorage.getItem('agenthub-theme') || 'dark'
  )

  // Auth state
  const { user, loading } = useAuth()

  // Apply theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  // Show loading
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner">🤖</div>
        <p>Loading...</p>
      </div>
    )
  }

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="user-layout">
      <Outlet />
    </div>
  )
}

export default UserLayout