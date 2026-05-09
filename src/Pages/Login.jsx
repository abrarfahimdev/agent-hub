// ============================================
// LOGIN PAGE
// User login with email and password
// ============================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  // Form state
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle login
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    setLoading(true)
    setError('')

    // Sign in
    const { data, error } = await signIn(form.email, form.password)
    if (error) throw error

    console.log('User ID:', data.user.id)
    console.log('User email:', data.user.email)

    // Fetch profile directly to check role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    console.log('Profile data:', profileData)
    console.log('Profile error:', profileError)
    console.log('Role:', profileData?.role)

    // Redirect based on role
    if (profileData?.role === 'admin') {
      console.log('Redirecting to admin!')
      navigate('/admin/dashboard')
    } else {
      console.log('Redirecting to dashboard!')
      navigate('/dashboard')
    }

  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
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
          <h2>Welcome back!</h2>
          <p>Login to your AgentHub account</p>
        </div>

        {/* Error */}
        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Links */}
        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>

      </div>
    </div>
  )
}

export default Login