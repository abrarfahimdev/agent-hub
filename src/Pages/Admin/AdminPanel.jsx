// ============================================
// ADMIN PANEL
// Full dashboard with stats, charts and management
// ============================================

import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const AdminPanel = () => {
      const [theme, setTheme] = useState(
    () => localStorage.getItem('agenthub-theme') || 'dark'
  )
   useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const location = useLocation()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    featured: 0,
    reviews: 0,
    contacts: 0,
  })

  // Fetch stats on load
  useEffect(() => {
    fetchStats()
  }, [])

  // Redirect to dashboard by default
  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard')
    }
  }, [location])

  const fetchStats = async () => {
    const { data: agents } = await supabase.from('agents').select('id, approved, featured')
    const { data: reviews } = await supabase.from('reviews').select('id')
    const { data: contacts } = await supabase.from('contacts').select('id')

    setStats({
      total: agents?.length || 0,
      approved: agents?.filter(a => a.approved).length || 0,
      pending: agents?.filter(a => !a.approved).length || 0,
      featured: agents?.filter(a => a.featured).length || 0,
      reviews: reviews?.length || 0,
      contacts: contacts?.length || 0,
    })
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-wrapper">

      {/* ── SIDEBAR ───────────────────────── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span>🤖</span>
          <h2>AgentHub</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className={`sidebar-link ${isActive('/admin/dashboard') ? 'active' : ''}`}>
            <span>📊</span> Dashboard
          </Link>
          <Link to="/admin/agents" className={`sidebar-link ${isActive('/admin/agents') ? 'active' : ''}`}>
            <span>🤖</span> Agents
            {stats.pending > 0 && <span className="sidebar-badge">{stats.pending}</span>}
          </Link>
          <Link to="/admin/reviews" className={`sidebar-link ${isActive('/admin/reviews') ? 'active' : ''}`}>
            <span>⭐</span> Reviews
          </Link>
          <Link to="/admin/contacts" className={`sidebar-link ${isActive('/admin/contacts') ? 'active' : ''}`}>
            <span>📧</span> Contacts
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link">
            <span>🌐</span> View Site
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────── */}
      <div className="admin-content">
        <Outlet context={{ stats, fetchStats }} />
      </div>

    </div>
  )
}

export default AdminPanel