// ============================================
// AGENT CARD COMPONENT
// Reusable card for displaying agent info
// ============================================

import { Link } from 'react-router-dom'

const AgentCard = ({ agent }) => {
  console.log(agent.demo_url)
  return (
    <div className="agent-card">

      {/* Featured Badge */}
      {agent.featured && (
        <div className="featured-badge">⭐ Featured</div>
      )}

      {/* Card Header */}
      <div className="card-header" style={{ background: agent.color + '18' }}>
        <div className="agent-icon" style={{ background: agent.color + '25', color: agent.color }}>
          {agent.icon}
        </div>
        <div className="agent-meta">
          <span className="agent-category" style={{ color: agent.color }}>
            {agent.category}
          </span>
          <div className="agent-rating">
            ⭐ {agent.rating} <span>({agent.reviews_count || agent.reviews || 0})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-tagline">{agent.tagline}</p>
        <p className="agent-desc">{agent.description}</p>

        {/* Tags */}
        <div className="agent-tags">
          {agent.tags && agent.tags.map((tag, i) => (
            <span
              key={i}
              className="agent-tag"
              style={{
                color: agent.color,
                borderColor: agent.color + '40',
                background: agent.color + '10'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer */}
     <div className="card-footer" onClick={e => e.stopPropagation()}>
  <div className="agent-price">
    <span className="price-amount">${agent.price}</span>
    <span className="price-type">/{agent.price_type || agent.priceType}</span>
  </div>
  <div className="card-actions">
    
     <a href={agent.demo_url || agent.demo}
      target="_blank"
      rel="noreferrer"
      className="btn-demo"
      onClick={e => e.stopPropagation()}
    >
      Demo
    </a>
    <Link
      to={`/agent/${agent.id}`}
      className="btn-rent"
      style={{ background: agent.color }}
      onClick={e => e.stopPropagation()}
    >
      Rent Now
    </Link>
  </div>
</div>

    </div>
  )
}

export default AgentCard