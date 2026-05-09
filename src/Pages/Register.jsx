// ============================================
// REGISTER PAGE
// User registration with email and password
// ============================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Handle register
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')

      // Check passwords match
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match!')
        return
      }

      // Check password length
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters!')
        return
      }

      setLoading(true)
      const { error } = await signUp(form.email, form.password, form.fullName)
      if (error) throw error
      setSuccess(true)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success">
            <span>🎉</span>
            <h2>Account Created!</h2>
            <p>Please check your email to confirm your account then login.</p>
            <Link to="/login" className="btn-primary">
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span>🤖</span>
          <h1>AgentHub</h1>
        </div>

        {/* Title */}
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join AgentHub and start renting AI agents</p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account 🚀'}
          </button>
        </form>

        {/* Links */}
        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>

      </div>
    </div>
  )
}

export default Register