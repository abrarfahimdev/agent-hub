// ============================================
// ABOUT PAGE
// About AgentHub platform and creator
// ============================================

import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="about-page">

      {/* ── HERO ──────────────────────────────── */}
      <section className="about-hero">
        <div className="container">
          <p className="section-tag">Our Story</p>
          <h1>About <span className="gradient-text">AgentHub</span></h1>
          <p>The world's first marketplace for renting and listing AI agents. We connect businesses with powerful AI solutions.</p>
        </div>
      </section>

      {/* ── MISSION ───────────────────────────── */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <p className="section-tag">Our Mission</p>
              <h2>Making AI <span className="gradient-text">Accessible</span> for Everyone</h2>
              <p>We believe every business — big or small — deserves access to powerful AI tools. AgentHub makes it easy to find, rent and deploy AI agents without any technical knowledge.</p>
              <p>Our platform connects AI builders with businesses that need automation. Sellers earn recurring income. Buyers get powerful tools at affordable prices. Everyone wins.</p>
              <Link to="/browse" className="btn-primary">Explore Agents 🤖</Link>
            </div>
            <div className="mission-stats">
              {[
                { icon: '🤖', value: '50+', label: 'AI Agents' },
                { icon: '👥', value: '1K+', label: 'Happy Users' },
                { icon: '🌍', value: '30+', label: 'Countries' },
                { icon: '⭐', value: '4.8', label: 'Avg Rating' },
              ].map((stat, i) => (
                <div className="mission-stat" key={i}>
                  <span className="mission-stat-icon">{stat.icon}</span>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────── */}
      <section className="values-section section">
        <div className="container">
          <p className="section-tag">What We Stand For</p>
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {[
              { icon: '🔒', title: 'Trust & Safety', desc: 'Every agent is verified and tested before listing. We guarantee quality and security for all users.', color: '#10b981' },
              { icon: '💡', title: 'Innovation', desc: 'We constantly push the boundaries of what AI agents can do, bringing the latest technology to our marketplace.', color: '#8b5cf6' },
              { icon: '🤝', title: 'Community', desc: 'We build a thriving community of AI builders and businesses that help each other grow and succeed.', color: '#f59e0b' },
              { icon: '📈', title: 'Growth', desc: 'We are committed to helping both sellers and buyers grow their businesses through the power of AI automation.', color: '#3b82f6' },
            ].map((value, i) => (
              <div className="value-card" key={i} style={{ borderColor: value.color + '30' }}>
                <div className="value-icon" style={{ background: value.color + '15', color: value.color }}>
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREATOR ───────────────────────────── */}
      <section className="creator-section section">
        <div className="container">
          <p className="section-tag">The Builder</p>
          <h2 className="section-title">Meet the Creator</h2>
          <div className="creator-card">
            <div className="creator-left">
              <div className="creator-avatar">👨‍💻</div>
              <div className="creator-info">
                <h3>Fahim Abrar</h3>
                <p className="creator-role">React Developer & AI App Builder</p>
                <p className="creator-location">📍 Jessore, Bangladesh</p>
                <div className="creator-links">
                  <a href="https://github.com/abrarfahimdev" target="_blank" className="creator-link">🐙 GitHub</a>
                  <a href="https://linkedin.com/in/fahim-abrar-cse" target="_blank" className="creator-link">🔗 LinkedIn</a>
                  <a href="https://fiverr.com/abrar7780" target="_blank" className="creator-link">💼 Fiverr</a>
                </div>
              </div>
            </div>
            <div className="creator-right">
              <p>I built AgentHub because I believe AI should be accessible to every business, not just big tech companies. As a React Developer and AI App Builder, I wanted to create a platform where AI builders can monetize their work and businesses can find the tools they need.</p>
              <p>AgentHub is built with React, Vite and a passion for making AI simple and affordable for everyone.</p>
              <div className="creator-projects">
                <h4>Other Projects</h4>
                <div className="creator-project-links">
                  <a href="https://majestic-jalebi-eb0808.netlify.app" target="_blank" className="project-pill">⚡ AI Chatbot</a>
                  <a href="https://wondrous-pudding-9a8ae7.netlify.app" target="_blank" className="project-pill">📄 PDF Summarizer</a>
                  <a href="https://small-biz-landing.vercel.app" target="_blank" className="project-pill">📱 SmallBiz Landing</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────── */}
      <section className="faq-section section">
        <div className="container">
          <p className="section-tag">Questions</p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {[
              { q: 'How does renting an AI agent work?', a: 'Browse our marketplace, pick an agent, pay the monthly fee and get instant access. Our team helps you set it up within 24 hours.' },
              { q: 'Can I try before I rent?', a: 'Yes! Every agent has a free demo link so you can test it before committing to a subscription.' },
              { q: 'How do I list my AI agent?', a: 'Click "List Agent" in the navbar, fill out the form with your agent details and submit. We review and list it within 24 hours.' },
              { q: 'How much can I earn as a seller?', a: 'You keep 80% of every rental fee. With 10 customers at $29/month, you earn $232/month passively.' },
              { q: 'Is there a free plan?', a: 'We offer a free demo for all agents. Paid plans start from just $15/month with full access and support.' },
              { q: 'What payment methods are accepted?', a: 'We accept WhatsApp payments, bKash, bank transfer and international cards via our payment partners.' },
            ].map((faq, i) => (
              <div className="faq-card" key={i}>
                <h4>❓ {faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to get started?</h2>
            <p>Browse 50+ AI agents or list your own and start earning today.</p>
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

export default About