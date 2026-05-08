// ============================================
// FOOTER COMPONENT
// Site footer with links and branding
// ============================================

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-icon">🤖</span>
            <span className="logo-text">Agent<span className="logo-accent">Hub</span></span>
          </div>
          <p>The world's first marketplace for renting and listing AI agents. Find the perfect agent for your business.</p>
          <div className="footer-social">
            <a href="#" className="social-btn">🐙 GitHub</a>
            <a href="#" className="social-btn">🔗 LinkedIn</a>
            <a href="#" className="social-btn">🐦 Twitter</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/browse">Browse Agents</Link>
          <Link to="/submit">List Your Agent</Link>
          <Link to="/about">About Us</Link>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/browse">Sales Agents</Link>
          <Link to="/browse">Content Agents</Link>
          <Link to="/browse">Support Agents</Link>
          <Link to="/browse">Analytics Agents</Link>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="mailto:fahimabrarcse7780@gmail.com">📧 Email Us</a>
          <a href="https://wa.me/8801937239981" target="_blank">📱 WhatsApp</a>
          <a href="https://fiverr.com/abrar7780" target="_blank">💼 Fiverr</a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2026 AgentHub. Built with ❤️ by <a href="https://github.com/abrarfahimdev" target="_blank">Fahim Abrar</a></p>
        <p>Making AI accessible for everyone 🚀</p>
      </div>

    </footer>
  )
}

export default Footer