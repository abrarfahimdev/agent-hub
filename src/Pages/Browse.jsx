// ============================================
// BROWSE PAGE
// Search, filter and browse all agents
// ============================================

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/agents'
import { useAgents } from '../hooks/useAgents'
import AgentCard from '../components/AgentCard'

// Loading skeleton
const AgentSkeleton = () => (
  <div className="agent-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-body">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
    </div>
    <div className="skeleton-footer" />
  </div>
)

const Browse = () => {
  const [searchParams] = useSearchParams()
  const urlCategory = searchParams.get('category') || 'All'

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(urlCategory)
  const [sortBy, setSortBy] = useState('featured')

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Update category when URL changes
  useEffect(() => {
    setActiveCategory(urlCategory)
  }, [urlCategory])

  // Fetch all agents from Supabase
  const { agents: rawAgents, loading, error } = useAgents(activeCategory, search)

  // Sort agents
  const agents = [...rawAgents].sort((a, b) => {
    if (sortBy === 'featured') return b.featured - a.featured
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'reviews') return b.reviews_count - a.reviews_count
    return 0
  })

  return (
    <div className="browse-page">
      <div className="container">

        {/* ── PAGE HEADER ───────────────────── */}
        <div className="browse-header">
          <h1>Browse <span className="gradient-text">AI Agents</span></h1>
          <p>Discover {rawAgents.length} powerful AI agents ready to work for you</p>
        </div>

        {/* ── SEARCH BAR ────────────────────── */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* ── FILTERS ROW ───────────────────── */}
        <div className="filters-row">
          <div className="category-filters">
            {categories.map((cat, i) => (
              <button
                key={i}
                className={`cat-btn ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="featured">⭐ Featured</option>
            <option value="rating">🏆 Top Rated</option>
            <option value="reviews">💬 Most Reviewed</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💰 Price: High to Low</option>
          </select>
        </div>

        {/* ── RESULTS COUNT ─────────────────── */}
        {!loading && (
          <div className="results-count">
            Showing <strong>{agents.length}</strong> agents
            {activeCategory !== 'All' && <span> in <strong>{activeCategory}</strong></span>}
            {search && <span> for "<strong>{search}</strong>"</span>}
          </div>
        )}

        {/* ── LOADING ───────────────────────── */}
        {loading ? (
          <div className="agents-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <AgentSkeleton key={i} />)}
          </div>
        ) : agents.length > 0 ? (
          /* ── AGENTS GRID ──────────────────── */
          <div className="agents-grid">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          /* ── EMPTY STATE ──────────────────── */
          <div className="empty-state">
            <span>🤖</span>
            <h3>No agents found</h3>
            <p>Try a different search or category</p>
            <button
              className="btn-primary"
              onClick={() => { setSearch(''); setActiveCategory('All') }}
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Browse