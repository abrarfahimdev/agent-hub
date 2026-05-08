// ============================================
// NAVBAR COMPONENT
// Sticky navigation with logo, links and theme
// ============================================

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Check if link is active
  const isActive = (path) => location.pathname === path

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
          <Link to="/browse" className="nav-cta">Get Started</Link>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar