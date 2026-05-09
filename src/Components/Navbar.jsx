// ============================================
// NAVBAR COMPONENT
// Sticky navigation with logo, links and auth
// ============================================

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  // Check if link is active
  const isActive = (path) => location.pathname === path

  // Handle logout
  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">

        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">Agent<span className="logo-accent">Hub</span></span>
        </Link>

        {/* Desktop Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/browse" className={isActive('/browse') ? 'active' : ''}>Browse</Link>
          <Link to="/submit" className={isActive('/submit') ? 'active' : ''}>List Agent</Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>About</Link>

          {/* Show on mobile only */}
          {!user ? (
            <>
              <Link to="/login" className="nav-mobile-link">Login</Link>
              <Link to="/register" className="nav-mobile-link">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-mobile-link">Dashboard</Link>
              <button className="nav-mobile-link" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-actions">

          {/* Theme Toggle */}
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Auth Buttons */}
          {!user ? (
            <div className="nav-auth">
              <Link to="/login" className="btn-outline nav-login">Login</Link>
              <Link to="/register" className="nav-cta">Register</Link>
            </div>
          ) : (
            <div className="nav-user">
              <button
                className="nav-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {profile?.full_name?.charAt(0).toUpperCase() || '👤'}
              </button>
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <p className="nav-dropdown-name">{profile?.full_name || 'User'}</p>
                    <p className="nav-dropdown-email">{user?.email}</p>
                  </div>
                  <Link to="/dashboard" className="nav-dropdown-item">
                    📊 Dashboard
                  </Link>
                  <Link to="/submit" className="nav-dropdown-item">
                    ➕ Submit Agent
                  </Link>
                  <button
                    className="nav-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar