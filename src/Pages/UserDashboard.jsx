// ============================================
// USER DASHBOARD
// Personal dashboard for logged in users
// ============================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const UserDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  // State
  const [myAgents, setMyAgents] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch data on load
  useEffect(() => {
    if (user) {
      fetchMyAgents()
      fetchWishlist()
    }
  }, [user])

  // Fetch user's submitted agents
  const fetchMyAgents = async () => {
    try {
      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('seller_email', user.email)
        .order('created_at', { ascending: false })
      setMyAgents(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const { data } = await supabase
        .from('wishlists')
        .select('*, agents(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setWishlist(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-page">

      {/* ── SIDEBAR ───────────────────────── */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <Link to="/" className="dashboard-logo">
            <span>🤖</span>
            <h2>Agent<span className="logo-accent">Hub</span></h2>
          </Link>
        </div>

        {/* User Info */}
        <div className="dashboard-user">
          <div className="dashboard-avatar">
            {profile?.full_name?.charAt(0).toUpperCase() || '👤'}
          </div>
          <div>
            <p className="dashboard-name">{profile?.full_name || 'User'}</p>
            <p className="dashboard-email">{user?.email}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="dashboard-nav">
          <button
            className={`dashboard-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button
            className={`dashboard-link ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <span>🤖</span> My Agents
            {myAgents.length > 0 && (
              <span className="dashboard-badge">{myAgents.length}</span>
            )}
          </button>
          <button
            className={`dashboard-link ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span>❤️</span> Wishlist
            {wishlist.length > 0 && (
              <span className="dashboard-badge">{wishlist.length}</span>
            )}
          </button>
          <button
            className={`dashboard-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span> Profile
          </button>
        </nav>

        {/* Bottom Links */}
        <div className="dashboard-sidebar-footer">
          <Link to="/browse" className="dashboard-link">
            <span>🔍</span> Browse Agents
          </Link>
          <Link to="/submit" className="dashboard-link">
            <span>➕</span> Submit Agent
          </Link>
          <button className="dashboard-link logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────── */}
      <div className="dashboard-content">

        {/* ── OVERVIEW TAB ──────────────────── */}
        {activeTab === 'overview' && (
          <div className="dashboard-section">
            <div className="dashboard-page-header">
              <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}! 👋</h1>
              <p>Here's your AgentHub overview</p>
            </div>

            {/* Stats */}
            <div className="dashboard-stats">
              {[
                { icon: '🤖', label: 'My Agents', value: myAgents.length, color: '#818cf8' },
                { icon: '✅', label: 'Approved', value: myAgents.filter(a => a.approved).length, color: '#34d399' },
                { icon: '⏳', label: 'Pending', value: myAgents.filter(a => !a.approved).length, color: '#fbbf24' },
                { icon: '❤️', label: 'Wishlist', value: wishlist.length, color: '#f43f5e' },
              ].map((stat, i) => (
                <div className="user-stat-card" key={i} style={{ borderColor: stat.color + '30' }}>
                  <div className="user-stat-icon" style={{ background: stat.color + '15', color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 style={{ color: stat.color }}>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-quick">
              <h2>Quick Actions</h2>
              <div className="dashboard-quick-grid">
                <Link to="/submit" className="quick-card">
                  <span>➕</span>
                  <h4>Submit New Agent</h4>
                  <p>List your AI agent on the marketplace</p>
                </Link>
                <Link to="/browse" className="quick-card">
                  <span>🔍</span>
                  <h4>Browse Agents</h4>
                  <p>Find the perfect agent for your business</p>
                </Link>
                <button className="quick-card" onClick={() => setActiveTab('agents')}>
                  <span>🤖</span>
                  <h4>My Agents</h4>
                  <p>View and manage your submitted agents</p>
                </button>
                <button className="quick-card" onClick={() => setActiveTab('wishlist')}>
                  <span>❤️</span>
                  <h4>My Wishlist</h4>
                  <p>View your saved agents</p>
                </button>
              </div>
            </div>

            {/* Recent Agents */}
            {myAgents.length > 0 && (
              <div className="dashboard-recent">
                <h2>Recent Submissions</h2>
                <div className="dashboard-agents-list">
                  {myAgents.slice(0, 3).map(agent => (
                    <div className="dashboard-agent-item" key={agent.id}>
                      <div className="dashboard-agent-icon" style={{ background: agent.color + '20', color: agent.color }}>
                        {agent.icon}
                      </div>
                      <div className="dashboard-agent-info">
                        <h4>{agent.name}</h4>
                        <p>{agent.category} · ${agent.price}/{agent.price_type}</p>
                      </div>
                      <span className={`dashboard-status ${agent.approved ? 'approved' : 'pending'}`}>
                        {agent.approved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MY AGENTS TAB ─────────────────── */}
        {activeTab === 'agents' && (
          <div className="dashboard-section">
            <div className="dashboard-page-header">
              <h1>My Agents 🤖</h1>
              <Link to="/submit" className="btn-primary">+ Submit New Agent</Link>
            </div>

            {loading ? (
              <div className="dashboard-loading">Loading your agents...</div>
            ) : myAgents.length === 0 ? (
              <div className="dashboard-empty">
                <span>🤖</span>
                <h3>No agents yet!</h3>
                <p>Submit your first AI agent and start earning.</p>
                <Link to="/submit" className="btn-primary">Submit Agent</Link>
              </div>
            ) : (
              <div className="dashboard-agents-grid">
                {myAgents.map(agent => (
                  <div className="dashboard-agent-card" key={agent.id}>
                    <div className="dashboard-agent-card-header" style={{ background: agent.color + '15' }}>
                      <div className="dashboard-agent-icon" style={{ background: agent.color + '25', color: agent.color }}>
                        {agent.icon}
                      </div>
                      <span className={`dashboard-status ${agent.approved ? 'approved' : 'pending'}`}>
                        {agent.approved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="dashboard-agent-card-body">
                      <h3>{agent.name}</h3>
                      <p className="agent-tagline">{agent.tagline}</p>
                      <div className="dashboard-agent-meta">
                        <span>{agent.category}</span>
                        <span>${agent.price}/{agent.price_type}</span>
                        <span>⭐ {agent.rating}</span>
                      </div>
                    </div>
                    <div className="dashboard-agent-card-footer">
                      <Link
                        to={`/agent/${agent.id}`}
                        className="btn-outline"
                        style={{ fontSize: '13px', padding: '8px 16px' }}
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── WISHLIST TAB ──────────────────── */}
        {activeTab === 'wishlist' && (
          <div className="dashboard-section">
            <div className="dashboard-page-header">
              <h1>My Wishlist ❤️</h1>
              <p>Agents you have saved</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="dashboard-empty">
                <span>❤️</span>
                <h3>No saved agents yet!</h3>
                <p>Browse agents and save your favorites.</p>
                <Link to="/browse" className="btn-primary">Browse Agents</Link>
              </div>
            ) : (
              <div className="dashboard-agents-grid">
                {wishlist.map(item => (
                  <div className="dashboard-agent-card" key={item.id}>
                    <div className="dashboard-agent-card-header" style={{ background: item.agents?.color + '15' }}>
                      <div className="dashboard-agent-icon" style={{ background: item.agents?.color + '25', color: item.agents?.color }}>
                        {item.agents?.icon}
                      </div>
                      <span className="dashboard-status approved">❤️ Saved</span>
                    </div>
                    <div className="dashboard-agent-card-body">
                      <h3>{item.agents?.name}</h3>
                      <p className="agent-tagline">{item.agents?.tagline}</p>
                      <div className="dashboard-agent-meta">
                        <span>{item.agents?.category}</span>
                        <span>${item.agents?.price}/{item.agents?.price_type}</span>
                        <span>⭐ {item.agents?.rating}</span>
                      </div>
                    </div>
                    <div className="dashboard-agent-card-footer">
                      <Link
                        to={`/agent/${item.agents?.id}`}
                        className="btn-primary"
                        style={{ fontSize: '13px', padding: '8px 16px', display: 'block', textAlign: 'center', width: '100%' }}
                      >
                        View Agent →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ───────────────────── */}
        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <div className="dashboard-page-header">
              <h1>My Profile 👤</h1>
              <p>Your account information</p>
            </div>

            <div className="profile-card">
              <div className="profile-avatar-big">
                {profile?.full_name?.charAt(0).toUpperCase() || '👤'}
              </div>
              <div className="profile-info">
                <div className="profile-field">
                  <label>Full Name</label>
                  <p>{profile?.full_name || 'Not set'}</p>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="profile-field">
                  <label>Role</label>
                  <p>{profile?.role || 'user'}</p>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <p>{new Date(user?.created_at).toLocaleDateString()}</p>
                </div>
                <div className="profile-field">
                  <label>Total Agents</label>
                  <p>{myAgents.length} agents submitted</p>
                </div>
                <div className="profile-field">
                  <label>Wishlist</label>
                  <p>{wishlist.length} agents saved</p>
                </div>
              </div>
            </div>

            <button
              className="btn-outline"
              onClick={handleLogout}
              style={{ marginTop: '24px' }}
            >
              🚪 Logout
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default UserDashboard