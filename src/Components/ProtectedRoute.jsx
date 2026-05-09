// ============================================
// PROTECTED ROUTE
// Redirects to login if user is not logged in
// ============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Still checking auth status
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner">🤖</div>
        <p>Loading...</p>
      </div>
    )
  }

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in — show the page
  return children
}

export default ProtectedRoute