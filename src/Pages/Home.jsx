// ============================================
// HOME PAGE
// Hero, featured agents, categories, stats
// ============================================

import { Link } from 'react-router-dom'
import { categories } from '../data/agents'
import { useFeaturedAgents } from '../hooks/useAgents'
import AgentCard from '../Components/AgentCard'

// Loading skeleton component
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

const Home = () => {
  // Fetch featured agents from Supabase
  const { agents: featuredAgents, loading } = useFeaturedAgents()

  return (
    <div className="home">

      {/* ── HERO SECTION ──────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-blob blob3" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              🚀 The #1 AI Agent Marketplace
            </div>
            <h1>
              Rent Powerful <span className="gradient-text">AI Agents</span><br />
              for Your Business
            </h1>
            <p>
              Discover, rent and deploy AI agents that work 24/7.
              From sales to support, content to code — find the perfect
              agent for any task.
            </p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn-primary">
                Browse Agents 🤖
              </Link>
              <Link to="/submit" className="btn-outline">
                List Your Agent 💰
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span>50+</span>
                <p>AI Agents</p>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span>1K+</span>
                <p>Happy Users</p>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span>8</span>
                <p>Categories</p>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat">
                <span>$15</span>
                <p>Starting From</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ────────────────── */}
      <section className="categories-section section">
        <div className="container">
          <p className="section-tag">Explore</p>
          <h2 className="section-title">Browse by Category</h2>
          <div className="categories-grid">
            {categories.filter(c => c.name !== 'All').map((cat, i) => (
              <Link
                to={`/browse?category=${cat.name}`}
                className="category-card"
                key={i}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED AGENTS ───────────────────── */}
      <section className="featured-section section">
        <div className="container">
          <p className="section-tag">Top Picks</p>
          <h2 className="section-title">Featured Agents</h2>

          {/* Loading state */}
          {loading ? (
            <div className="agents-grid">
              {[1, 2, 3].map(i => <AgentSkeleton key={i} />)}
            </div>
          ) : (
            <div className="agents-grid">
              {featuredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}

          <div className="view-all">
            <Link to="/browse" className="btn-outline">
              View All Agents →
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section className="how-section section">
        <div className="container">
          <p className="section-tag">Simple Process</p>
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            {[
              { step: '01', icon: '🔍', title: 'Browse Agents', desc: 'Explore our marketplace of powerful AI agents across 8 categories.' },
              { step: '02', icon: '🎯', title: 'Choose Your Agent', desc: 'Read reviews, try demos and pick the perfect agent for your needs.' },
              { step: '03', icon: '💳', title: 'Rent & Deploy', desc: 'Subscribe monthly and deploy your agent in minutes. No coding needed.' },
              { step: '04', icon: '🚀', title: 'Grow Faster', desc: 'Watch your agent work 24/7 while you focus on what matters most.' },
            ].map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────── */}
      <section className="testimonials-section section">
        <div className="container">
          <p className="section-tag">Social Proof</p>
          <h2 className="section-title">What People Say</h2>
          <div className="testimonials-grid">
            {[
              { name: 'Ahmed Hassan', role: 'CEO, TechStart', avatar: '👨‍💼', text: 'AgentHub completely transformed our sales process. Our revenue grew 40% in the first month!', rating: 5 },
              { name: 'Sarah Johnson', role: 'Marketing Manager', avatar: '👩‍💼', text: 'ContentGenius saves me 10 hours every week. The quality is incredible and consistent.', rating: 5 },
              { name: 'Mohammed Ali', role: 'Startup Founder', avatar: '🧑‍🚀', text: 'CustomerCare Bot handles 80% of our support tickets automatically. Game changer!', rating: 5 },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">{'⭐'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="author-avatar">{t.avatar}</span>
                  <div>
                    <p className="author-name">{t.name}</p>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ───────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to supercharge your business?</h2>
            <p>Join 1,000+ businesses already using AgentHub to grow faster.</p>
            <div className="cta-buttons">
              <Link to="/browse" className="btn-primary">Browse Agents 🤖</Link>
              <Link to="/submit" className="btn-white">List Your Agent 💰</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home