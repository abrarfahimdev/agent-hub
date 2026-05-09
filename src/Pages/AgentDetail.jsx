// ============================================
// AGENT DETAIL PAGE
// Full details, pricing, wishlist and view counter
// ============================================

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAgent } from '../hooks/useAgents'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// ── REVIEWS LIST COMPONENT ─────────────────
const ReviewsList = ({ agentId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('agent_id', agentId)
        .eq('approved', true)
        .order('created_at', { ascending: false })
      setReviews(data || [])
      setLoading(false)
    }
    fetchReviews()
  }, [agentId])

  if (loading) return (
    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading reviews...</p>
  )

  if (reviews.length === 0) return (
    <div className="no-reviews">
      <p>No reviews yet. Be the first to review!</p>
    </div>
  )
  const toggleWishlist = async () => {
  if (!user) {
    navigate('/login')
    return
  }
  try {
    setWishlistLoading(true)
    if (wishlisted) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('agent_id', id)
      console.log('Delete error:', error)
      setWishlisted(false)
    } else {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, agent_id: id }])
      console.log('Insert data:', data)
      console.log('Insert error:', error)
      if (!error) setWishlisted(true)
    }
  } catch (err) {
    console.error('Wishlist error:', err)
  } finally {
    setWishlistLoading(false)
  }
}

  return (
    <div className="reviews-list">
      {reviews.map(review => (
        <div className="review-card" key={review.id}>
          <div className="review-header">
            <span className="review-avatar">👤</span>
            <div>
              <p className="review-name">{review.reviewer_name}</p>
              <p className="review-date">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="review-stars">{'⭐'.repeat(review.rating)}</div>
          </div>
          <p className="review-text">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

// ── MAIN COMPONENT ─────────────────────────
const AgentDetail = () => {
  const { id } = useParams()
  const { agent, loading, error } = useAgent(id)
  const { user } = useAuth()
  const navigate = useNavigate()

  // State
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [views, setViews] = useState(0)

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    reviewer_name: '',
    reviewer_email: '',
    rating: 5,
    comment: ''
  })
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  // ── Increment view counter ─────────────────
  useEffect(() => {
    if (agent) {
      incrementViews()
    }
  }, [agent])

  const incrementViews = async () => {
    const newViews = (agent.views || 0) + 1
    await supabase
      .from('agents')
      .update({ views: newViews })
      .eq('id', id)
    setViews(newViews)
  }

  // ── Check if wishlisted ────────────────────
  useEffect(() => {
    if (user && agent) checkWishlist()
  }, [user, agent])

  const checkWishlist = async () => {
    try {
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('agent_id', id)
        .single()
      setWishlisted(!!data)
    } catch {
      setWishlisted(false)
    }
  }

  // ── Toggle wishlist ────────────────────────
  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      setWishlistLoading(true)
      if (wishlisted) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('agent_id', id)
        setWishlisted(false)
      } else {
        await supabase
          .from('wishlists')
          .insert([{ user_id: user.id, agent_id: id }])
        setWishlisted(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setWishlistLoading(false)
    }
  }

  // ── Submit review ──────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmittingReview(true)
      const { error } = await supabase
        .from('reviews')
        .insert([{ ...reviewForm, agent_id: id }])
      if (error) throw error
      setReviewSuccess(true)
      setReviewForm({ reviewer_name: '', reviewer_email: '', rating: 5, comment: '' })
      setTimeout(() => setReviewSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingReview(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="agent-detail">
        <div className="container">
          <div className="detail-loading">
            <div className="skeleton-detail-hero" />
            <div className="skeleton-detail-content" />
          </div>
        </div>
      </div>
    )
  }

  // Error or not found
  if (error || !agent) {
    return (
      <div className="not-found">
        <div className="container">
          <span>🤖</span>
          <h2>Agent Not Found</h2>
          <p>The agent you are looking for does not exist.</p>
          <Link to="/browse" className="btn-primary">Browse Agents</Link>
        </div>
      </div>
    )
  }

  // Check if current user is the owner
  const isOwner = user?.email === agent.seller_email

  return (
    <div className="agent-detail">
      <div className="container">

        {/* ── BACK BUTTON ───────────────────── */}
        <Link to="/browse" className="back-btn">
          ← Back to Browse
        </Link>

        {/* ── AGENT HERO ────────────────────── */}
        <div className="detail-hero" style={{ background: agent.color + '12', borderColor: agent.color + '30' }}>
          <div className="detail-left">
            <div className="detail-icon" style={{ background: agent.color + '25', color: agent.color }}>
              {agent.icon}
            </div>
            <div className="detail-info">
              {agent.featured && <div className="featured-badge">⭐ Featured</div>}
              <h1>{agent.name}</h1>
              <p className="detail-tagline">{agent.tagline}</p>
              <div className="detail-meta">
                <span className="detail-category" style={{ color: agent.color }}>
                  {agent.category}
                </span>
                <span className="detail-rating">
                  ⭐ {agent.rating} ({agent.reviews_count} reviews)
                </span>
                <span className="detail-seller">
                  {agent.seller_avatar} {agent.seller_name}
                </span>
                <span className="detail-views">
                  👁️ {views || agent.views || 0} views
                </span>
              </div>

              {/* Wishlist button — hide for owner */}
              {!isOwner && (
                <button
                  className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`}
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlisted ? '❤️ Saved' : '🤍 Save to Wishlist'}
                </button>
              )}
            </div>
          </div>

          {/* ── PRICING CARD — Buyer View ──────── */}
          {!isOwner && (
            <div className="pricing-card" style={{ borderColor: agent.color + '40' }}>
              <div className="pricing-header" style={{ background: agent.color + '15' }}>
                <p className="pricing-label">Monthly Rental</p>
                <div className="pricing-amount">
                  <span className="price-big">${agent.price}</span>
                  <span className="price-period">/{agent.price_type}</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pf-item">✅ 24/7 Agent Access</div>
                <div className="pf-item">✅ Full Setup Support</div>
                <div className="pf-item">✅ Monthly Updates</div>
                <div className="pf-item">✅ Cancel Anytime</div>
              </div>
              {user ? (
                
              <a    href={`https://wa.me/8801937239981?text=Hi! I want to rent ${agent.name} for $${agent.price}/${agent.price_type}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-rent-big"
                  style={{ background: agent.color }}
                >
                  Rent Now — ${agent.price}/{agent.price_type}
                </a>
              ) : (
                <Link
                  to="/login"
                  className="btn-rent-big"
                  style={{ background: agent.color, textAlign: 'center' }}
                >
                  🔐 Login to Rent
                </Link>
              )}
              
              <a  href={agent.demo_url}
                target="_blank"
                rel="noreferrer"
                className="btn-demo-big"
              >
                Try Free Demo First 🎯
              </a>
            </div>
          )}

          {/* ── OWNER CARD ────────────────────── */}
          {isOwner && (
            <div className="owner-card" style={{ borderColor: agent.color + '40' }}>
              <div className="owner-card-header" style={{ background: agent.color + '15' }}>
                <p className="owner-label">Your Agent</p>
                <span className={`dashboard-status ${agent.approved ? 'approved' : 'pending'}`}>
                  {agent.approved ? '✅ Approved' : '⏳ Pending Review'}
                </span>
              </div>
              <div className="owner-stats">
                <div className="owner-stat">
                  <span>${agent.price}</span>
                  <p>Price/{agent.price_type}</p>
                </div>
                <div className="owner-stat">
                  <span>{agent.reviews_count}</span>
                  <p>Reviews</p>
                </div>
                <div className="owner-stat">
                  <span>{views || agent.views || 0}</span>
                  <p>Views</p>
                </div>
              </div>
              <div className="owner-actions">
                {agent.featured && (
                  <div className="owner-featured">⭐ Featured Agent</div>
                )}
                <a
                  href={agent.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ background: agent.color, display: 'block', textAlign: 'center', marginBottom: '10px' }}
                >
                  🔗 View Demo
                </a>
                <Link
                  to="/dashboard"
                  className="btn-outline"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* ── DETAIL CONTENT ────────────────── */}
        <div className="detail-content">

          {/* ── LEFT COLUMN ───────────────────── */}
          <div className="detail-main">

            {/* About */}
            <div className="detail-section">
              <h2>About This Agent</h2>
              <p>{agent.description}</p>
            </div>

            {/* Features */}
            <div className="detail-section">
              <h2>What It Does</h2>
              <div className="features-list">
                {[
                  'Automates repetitive tasks 24/7 without breaks',
                  'Integrates with your existing tools and workflows',
                  'Learns and improves from every interaction',
                  'Provides detailed reports and analytics',
                  'Scales instantly based on your needs',
                  'Dedicated support and regular updates included',
                ].map((feature, i) => (
                  <div className="feature-item" key={i}>
                    <span style={{ color: agent.color }}>✓</span>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="detail-section">
              <h2>Tags</h2>
              <div className="detail-tags">
                {agent.tags && agent.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="detail-tag"
                    style={{ color: agent.color, borderColor: agent.color + '40', background: agent.color + '10' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="detail-section">
              <h2>Reviews ({agent.reviews_count})</h2>
              <ReviewsList agentId={id} />
            </div>

            {/* Leave a Review — hide for owner */}
            {!isOwner && (
              <div className="detail-section">
                <h2>Leave a Review</h2>
                {!user && (
                  <div className="login-to-review">
                    <p>Please <Link to="/login">login</Link> to leave a review.</p>
                  </div>
                )}
                {user && (
                  <>
                    {reviewSuccess && (
                      <div className="review-success">
                        ✅ Thank you! Your review is pending approval.
                      </div>
                    )}
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Your Name</label>
                          <input
                            type="text"
                            placeholder="John Smith"
                            value={reviewForm.reviewer_name}
                            onChange={e => setReviewForm({ ...reviewForm, reviewer_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Your Email</label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={reviewForm.reviewer_email}
                            onChange={e => setReviewForm({ ...reviewForm, reviewer_email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Rating</label>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                          placeholder="Share your experience with this agent..."
                          rows={4}
                          value={reviewForm.comment}
                          onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={submittingReview}
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review ⭐'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

          </div>

          {/* ── RIGHT SIDEBAR ─────────────────── */}
          <div className="detail-sidebar">

            {/* Seller Card — hide for owner */}
            {!isOwner && (
              <div className="seller-card">
                <h3>About the Seller</h3>
                <div className="seller-info">
                  <span className="seller-avatar">{agent.seller_avatar}</span>
                  <div>
                    <p className="seller-name">{agent.seller_name}</p>
                    <p className="seller-badge">✅ Verified Seller</p>
                  </div>
                </div>
                <div className="seller-stats">
                  <div className="seller-stat">
                    <span>{agent.reviews_count}</span>
                    <p>Total Sales</p>
                  </div>
                  <div className="seller-stat">
                    <span>{agent.rating}</span>
                    <p>Avg Rating</p>
                  </div>
                </div>
                
              <a    href={`https://wa.me/${agent.seller_whatsapp}?text=Hi! I want to know more about ${agent.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-contact"
                >
                  📱 Contact Seller
                </a>
              </div>
            )}

            {/* Safety Card */}
            <div className="safety-card">
              <h3>🛡️ Safe & Secure</h3>
              <div className="safety-items">
                <p>✅ Verified agent quality</p>
                <p>✅ Money back guarantee</p>
                <p>✅ 24/7 customer support</p>
                <p>✅ Cancel anytime</p>
              </div>
            </div>

            {/* Share Card */}
            <div className="share-card">
              <h3>📤 Share This Agent</h3>
              <div className="share-buttons">
                
               <a   href={`https://wa.me/?text=${encodeURIComponent('Check out ' + agent.name + ' on AgentHub! ' + window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="share-btn whatsapp"
                >
                  📱 WhatsApp
                </a>
                
               <a   href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out ' + agent.name + ' - ' + agent.tagline)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="share-btn twitter"
                >
                  🐦 Twitter
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentDetail