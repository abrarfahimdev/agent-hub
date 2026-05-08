// ============================================
// ADMIN REVIEWS PAGE
// View and manage all reviews
// ============================================

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter === 'pending') query = query.eq('approved', false)
      if (filter === 'approved') query = query.eq('approved', true)

      const { data, error } = await query
      if (error) throw error
      setReviews(data || [])
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

 
 //approve review
  const approveReview = async (id, agentId) => {
  const { error } = await supabase
    .from('reviews')
    .update({ approved: true })
    .eq('id', id)

  if (!error) {
    // Update agent stats immediately
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('agent_id', agentId)
      .eq('approved', true)

    const count = reviews?.length || 0
    const avgRating = count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0

    await supabase
      .from('agents')
      .update({ reviews_count: count, rating: avgRating })
      .eq('id', agentId)

    setReviews(reviews => reviews.map(r => r.id === id ? { ...r, approved: true } : r))
    showMessage('✅ Review approved!')
  }
}

//reject review
const rejectReview = async (id, agentId) => {
  const { error } = await supabase
    .from('reviews')
    .update({ approved: false })
    .eq('id', id)

  if (!error) {
    // Update agent stats immediately
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('agent_id', agentId)
      .eq('approved', true)

    const count = reviews?.length || 0
    const avgRating = count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0

    await supabase
      .from('agents')
      .update({ reviews_count: count, rating: avgRating })
      .eq('id', agentId)

    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: false } : r))
    showMessage('❌ Review rejected!')
  }
}

//delete review
  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id))
      showMessage('🗑️ Review deleted!')
    }
  }

  return (
    <div className="admin-page">

      {/* ── PAGE HEADER ───────────────────── */}
      <div className="admin-page-header">
        <h1>Reviews</h1>
        <p>Manage and approve all agent reviews</p>
      </div>

      {/* ── MESSAGE ───────────────────────── */}
      {message && <div className="admin-message">{message}</div>}

      {/* ── FILTER TABS ───────────────────── */}
      <div className="admin-filters" style={{ marginBottom: '24px' }}>
        {['all', 'pending', 'approved'].map(f => (
          <button
            key={f}
            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button className="admin-refresh-btn" onClick={fetchReviews}>
          🔄 Refresh
        </button>
      </div>

      {/* ── RESULTS COUNT ─────────────────── */}
      <p className="admin-count">Showing {reviews.length} reviews</p>

      {/* ── REVIEWS LIST ──────────────────── */}
      {loading ? (
        <div className="admin-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">No reviews found</div>
      ) : (
        <div className="admin-table">
          {reviews.map(review => (
            <div className="admin-agent-row" key={review.id}>

              {/* Review Info */}
              <div className="admin-agent-info">
                <div className="admin-agent-icon" style={{ background: '#818cf820', color: '#818cf8' }}>
                  👤
                </div>
                <div>
                  <h4>{review.reviewer_name}</h4>
                  <p>{'⭐'.repeat(review.rating)} · {review.reviewer_email}</p>
                  <p className="admin-seller">"{review.comment}"</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="admin-badges">
                <span className={`admin-badge ${review.approved ? 'approved' : 'pending'}`}>
                  {review.approved ? '✅ Approved' : '⏳ Pending'}
                </span>
              </div>

              {/* Actions */}
              <div className="admin-actions">
               {!review.approved ? (
  <button
    className="admin-btn approve"
    onClick={() => approveReview(review.id, review.agent_id)}
  >
    ✅ Approve
  </button>
) : (
  <button
    className="admin-btn reject"
    onClick={() => rejectReview(review.id, review.agent_id)}
  >
    ❌ Reject
  </button>
)}
                <button
                  className="admin-btn delete"
                  onClick={() => deleteReview(review.id)}
                >
                  🗑️ Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reviews