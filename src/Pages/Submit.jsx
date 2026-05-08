// ============================================
// SUBMIT PAGE
// Form to list a new AI agent on the platform
// ============================================

import { useState } from 'react'
import { supabase } from '../lib/supabase'

const Submit = () => {

  // Form state
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    category: '',
    price: '',
    price_type: 'month',
    demo_url: '',
    tags: '',
    seller_name: '',
    seller_email: '',
    seller_whatsapp: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submit — save to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // Convert tags string to array
      const tagsArray = form.tags
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : []

      // Insert into Supabase
      const { error } = await supabase
        .from('agents')
        .insert([{
          name: form.name,
          tagline: form.tagline,
          description: form.description,
          category: form.category,
          price: parseFloat(form.price),
          price_type: form.price_type,
          demo_url: form.demo_url,
          tags: tagsArray,
          seller_name: form.seller_name,
          seller_email: form.seller_email,
          seller_whatsapp: form.seller_whatsapp,
          icon: '🤖',
          color: '#818cf8',
          rating: 0,
          reviews_count: 0,
          featured: false,
          approved: false, // needs admin approval
        }])

      if (error) throw error
      setSubmitted(true)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Categories list
  const categories = [
    'Sales', 'Content', 'Development', 'Support',
    'Marketing', 'HR', 'Analytics', 'Legal', 'Other'
  ]

  // Success screen
  if (submitted) {
    return (
      <div className="submit-page">
        <div className="container">
          <div className="success-screen">
            <div className="success-icon">🎉</div>
            <h2>Application Submitted!</h2>
            <p>Thank you for listing your agent. We will review it and get back to you within 24 hours.</p>
            <div className="success-steps">
              <div className="success-step">
                <span>1</span>
                <p>We review your agent</p>
              </div>
              <div className="success-step">
                <span>2</span>
                <p>We test the demo</p>
              </div>
              <div className="success-step">
                <span>3</span>
                <p>Your agent goes live</p>
              </div>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setSubmitted(false)
                setStep(1)
                setForm({
                  name: '', tagline: '', description: '',
                  category: '', price: '', price_type: 'month',
                  demo_url: '', tags: '', seller_name: '',
                  seller_email: '', seller_whatsapp: ''
                })
              }}
            >
              Submit Another Agent
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="submit-page">
      <div className="container">

        {/* ── PAGE HEADER ───────────────────── */}
        <div className="submit-header">
          <h1>List Your <span className="gradient-text">AI Agent</span></h1>
          <p>Join our marketplace and start earning from your AI agent today</p>
        </div>

        {/* ── BENEFITS ROW ──────────────────── */}
        <div className="benefits-row">
          {[
            { icon: '💰', title: 'Earn Monthly', desc: 'Get paid every month for your agent' },
            { icon: '🌍', title: 'Global Reach', desc: 'Reach 1000+ businesses worldwide' },
            { icon: '🚀', title: 'Easy Setup', desc: 'List your agent in 5 minutes' },
            { icon: '📊', title: 'Analytics', desc: 'Track rentals and earnings' },
          ].map((b, i) => (
            <div className="benefit-card" key={i}>
              <span>{b.icon}</span>
              <h4>{b.title}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* ── STEP INDICATOR ────────────────── */}
        <div className="step-indicator">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`}>
              <span>{s}</span>
              <p>{s === 1 ? 'Agent Info' : s === 2 ? 'Pricing' : 'Your Info'}</p>
            </div>
          ))}
        </div>

        {/* ── ERROR MESSAGE ─────────────────── */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {/* ── FORM ──────────────────────────── */}
        <form className="submit-form" onSubmit={handleSubmit}>

          {/* Step 1 — Agent Info */}
          {step === 1 && (
            <div className="form-step">
              <h2>Step 1 — Agent Information</h2>

              <div className="form-group">
                <label>Agent Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. SalesBot Pro"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tagline *</label>
                <input
                  type="text"
                  name="tagline"
                  placeholder="e.g. Close deals while you sleep"
                  value={form.tagline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="Describe what your agent does, who it's for and what problems it solves..."
                  rows={5}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    placeholder="e.g. Sales, Email, CRM"
                    value={form.tags}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Demo URL *</label>
                <input
                  type="url"
                  name="demo_url"
                  placeholder="https://your-agent-demo.com"
                  value={form.demo_url}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setStep(2)}
                disabled={!form.name || !form.tagline || !form.description || !form.category || !form.demo_url}
              >
                Next: Pricing →
              </button>
            </div>
          )}

          {/* Step 2 — Pricing */}
          {step === 2 && (
            <div className="form-step">
              <h2>Step 2 — Pricing</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 29"
                    value={form.price}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Billing Period *</label>
                  <select
                    name="price_type"
                    value={form.price_type}
                    onChange={handleChange}
                  >
                    <option value="month">Monthly</option>
                    <option value="week">Weekly</option>
                    <option value="day">Daily</option>
                    <option value="use">Per Use</option>
                  </select>
                </div>
              </div>

              {/* Pricing Preview */}
              {form.price && (
                <div className="price-preview">
                  <p>Your agent will be listed at:</p>
                  <h3>${form.price} / {form.price_type}</h3>
                  <p className="price-note">AgentHub takes 20% commission per rental</p>
                </div>
              )}

              <div className="form-nav">
                <button type="button" className="btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!form.price}
                >
                  Next: Your Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Seller Info */}
          {step === 3 && (
            <div className="form-step">
              <h2>Step 3 — Your Information</h2>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="seller_name"
                  placeholder="Your full name"
                  value={form.seller_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Email *</label>
                <input
                  type="email"
                  name="seller_email"
                  placeholder="your@email.com"
                  value={form.seller_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  name="seller_whatsapp"
                  placeholder="+880 1234567890"
                  value={form.seller_whatsapp}
                  onChange={handleChange}
                />
              </div>

              {/* Summary */}
              <div className="submit-summary">
                <h3>Summary</h3>
                <div className="summary-item">
                  <span>Agent</span>
                  <strong>{form.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Category</span>
                  <strong>{form.category}</strong>
                </div>
                <div className="summary-item">
                  <span>Price</span>
                  <strong>${form.price}/{form.price_type}</strong>
                </div>
              </div>

              <div className="form-nav">
                <button type="button" className="btn-outline" onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!form.seller_name || !form.seller_email || loading}
                >
                  {loading ? 'Submitting...' : 'Submit Agent 🚀'}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export default Submit