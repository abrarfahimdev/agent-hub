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

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id))
      setMessage('🗑️ Review deleted!')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reviews</h1>
        <p>Manage all agent reviews</p>
      </div>

      {message && <div className="admin-message">{message}</div>}

      {loading ? (
        <div className="admin-loading">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">No reviews yet</div>
      ) : (
        <div className="admin-table">
          {reviews.map(review => (
            <div className="admin-agent-row" key={review.id}>
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
              <div className="admin-actions">
                <button className="admin-btn delete" onClick={() => deleteReview(review.id)}>
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