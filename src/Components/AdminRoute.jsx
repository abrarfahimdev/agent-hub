// ============================================
// ADMIN ROUTE
// Redirects to home if user is not admin
// ============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth()

  // Still checking auth
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner">🤖</div>
        <p>Loading...</p>
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but not admin
  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // Is admin — show page
  return children
}

export default AdminRoute