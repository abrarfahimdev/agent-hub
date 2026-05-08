// ============================================
// ADMIN AGENTS PAGE
// Manage all agent listings
// ============================================

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const Agents = () => {
  const [searchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter') || 'all'

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(urlFilter)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAgents()
  }, [filter])

  const fetchAgents = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'pending') query = query.eq('approved', false)
      if (filter === 'approved') query = query.eq('approved', true)
      if (filter === 'featured') query = query.eq('featured', true)

      const { data, error } = await query
      if (error) throw error
      setAgents(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const approveAgent = async (id) => {
    const { error } = await supabase.from('agents').update({ approved: true }).eq('id', id)
    if (!error) {
      setAgents(agents.map(a => a.id === id ? { ...a, approved: true } : a))
      showMessage('✅ Agent approved!')
    }
  }

  const rejectAgent = async (id) => {
    const { error } = await supabase.from('agents').update({ approved: false }).eq('id', id)
    if (!error) {
      setAgents(agents.map(a => a.id === id ? { ...a, approved: false } : a))
      showMessage('❌ Agent rejected!')
    }
  }

  const toggleFeatured = async (id, current) => {
    const { error } = await supabase.from('agents').update({ featured: !current }).eq('id', id)
    if (!error) {
      setAgents(agents.map(a => a.id === id ? { ...a, featured: !current } : a))
      showMessage(current ? '★ Removed from featured!' : '⭐ Featured!')
    }
  }

  const deleteAgent = async (id) => {
    if (!window.confirm('Delete this agent?')) return
    const { error } = await supabase.from('agents').delete().eq('id', id)
    if (!error) {
      setAgents(agents.filter(a => a.id !== id))
      showMessage('🗑️ Deleted!')
    }
  }

  // Filter by search
  const filtered = agents.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.category?.toLowerCase().includes(search.toLowerCase()) ||
    a.seller_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page">

      {/* ── PAGE HEADER ───────────────────── */}
      <div className="admin-page-header">
        <h1>Agents</h1>
        <p>Manage all agent listings</p>
      </div>

      {/* ── MESSAGE ───────────────────────── */}
      {message && <div className="admin-message">{message}</div>}

      {/* ── SEARCH + FILTERS ──────────────── */}
      <div className="agents-toolbar">
        <input
          type="text"
          placeholder="🔍 Search agents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search"
        />
        <div className="admin-filters">
          {['all', 'pending', 'approved', 'featured'].map(f => (
            <button
              key={f}
              className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS COUNT ─────────────────── */}
      <p className="admin-count">Showing {filtered.length} agents</p>

      {/* ── AGENTS LIST ───────────────────── */}
      {loading ? (
        <div className="admin-loading">Loading agents...</div>
      ) : (
        <div className="admin-table">
          {filtered.map(agent => (
            <div className="admin-agent-row" key={agent.id}>
              <div className="admin-agent-info">
                <div className="admin-agent-icon" style={{ background: agent.color + '20', color: agent.color }}>
                  {agent.icon}
                </div>
                <div>
                  <h4>{agent.name}</h4>
                  <p>{agent.category} · ${agent.price}/{agent.price_type}</p>
                  <p className="admin-seller">👤 {agent.seller_name} · {agent.seller_email}</p>
                </div>
              </div>
              <div className="admin-badges">
                <span className={`admin-badge ${agent.approved ? 'approved' : 'pending'}`}>
                  {agent.approved ? '✅ Approved' : '⏳ Pending'}
                </span>
                {agent.featured && <span className="admin-badge featured">⭐ Featured</span>}
              </div>
              <div className="admin-actions">
                {!agent.approved ? (
                  <button className="admin-btn approve" onClick={() => approveAgent(agent.id)}>✅ Approve</button>
                ) : (
                  <button className="admin-btn reject" onClick={() => rejectAgent(agent.id)}>❌ Reject</button>
                )}
                <button
                  className={`admin-btn ${agent.featured ? 'unfeature' : 'feature'}`}
                  onClick={() => toggleFeatured(agent.id, agent.featured)}
                >
                  {agent.featured ? '★ Unfeature' : '⭐ Feature'}
                </button>
                <a href={agent.demo_url} target="_blank" rel="noreferrer" className="admin-btn demo">🔗 Demo</a>
                <button className="admin-btn delete" onClick={() => deleteAgent(agent.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Agents