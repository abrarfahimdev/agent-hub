// ============================================
// ADMIN DASHBOARD
// Overview stats and recent activity
// ============================================

import { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const Dashboard = () => {
  const { stats } = useOutletContext()
  const [recentAgents, setRecentAgents] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecent()
  }, [])

  const fetchRecent = async () => {
    try {
      const { data: agents } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentAgents(agents || [])
      setRecentReviews(reviews || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page">
      {/* ── PAGE HEADER ───────────────────── */}
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening.</p>
      </div>
      {/* ── STATS GRID ────────────────────── */}
      <div className="dashboard-stats">
        {[
          { label: 'Total Agents', value: stats.total, icon: '🤖', color: '#818cf8', link: '/admin/agents' },
          { label: 'Approved', value: stats.approved, icon: '✅', color: '#34d399', link: '/admin/agents?filter=approved' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', color: '#fbbf24', link: '/admin/agents?filter=pending' },
          { label: 'Featured', value: stats.featured, icon: '⭐', color: '#f59e0b', link: '/admin/agents?filter=featured' },
          { label: 'Reviews', value: stats.reviews, icon: '💬', color: '#60a5fa', link: '/admin/reviews' },
          { label: 'Contacts', value: stats.contacts, icon: '📧', color: '#f472b6', link: '/admin/contacts' },
        ].map((stat, i) => (
          <Link to={stat.link} className="dashboard-stat-card" key={i} style={{ borderColor: stat.color + '30' }}>
            <div className="stat-icon" style={{ background: stat.color + '15', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3 style={{ color: stat.color }}>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── RECENT ACTIVITY ───────────────── */}
      <div className="dashboard-grid">

        {/* Recent Agents */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Recent Agents</h2>
            <Link to="/admin/agents" className="view-all-link">View All →</Link>
          </div>
          <div className="recent-list">
            {recentAgents.map(agent => (
              <div className="recent-item" key={agent.id}>
                <div className="recent-icon" style={{ background: agent.color + '20', color: agent.color }}>
                  {agent.icon}
                </div>
                <div className="recent-info">
                  <h4>{agent.name}</h4>
                  <p>{agent.category} · ${agent.price}/{agent.price_type}</p>
                </div>
                <span className={`recent-badge ${agent.approved ? 'approved' : 'pending'}`}>
                  {agent.approved ? '✅' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Recent Reviews</h2>
            <Link to="/admin/reviews" className="view-all-link">View All →</Link>
          </div>
          <div className="recent-list">
            {recentReviews.length === 0 ? (
              <p className="no-data">No reviews yet</p>
            ) : (
              recentReviews.map(review => (
                <div className="recent-item" key={review.id}>
                  <div className="recent-avatar">👤</div>
                  <div className="recent-info">
                    <h4>{review.reviewer_name}</h4>
                    <p>{'⭐'.repeat(review.rating)} · {review.comment?.slice(0, 40)}...</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ── QUICK ACTIONS ─────────────────── */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/agents?filter=pending" className="quick-action-card">
            <span>⏳</span>
            <h4>Review Pending</h4>
            <p>{stats.pending} agents waiting</p>
          </Link>
          <Link to="/submit" target="_blank" className="quick-action-card">
            <span>➕</span>
            <h4>Add Agent</h4>
            <p>List a new agent</p>
          </Link>
          <Link to="/browse" target="_blank" className="quick-action-card">
            <span>🌐</span>
            <h4>View Marketplace</h4>
            <p>See live site</p>
          </Link>
          <Link to="/admin/contacts" className="quick-action-card">
            <span>📧</span>
            <h4>View Contacts</h4>
            <p>{stats.contacts} messages</p>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Dashboard