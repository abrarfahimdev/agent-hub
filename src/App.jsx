// ============================================
// MAIN APP
// Router setup and theme management
// ============================================

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Browse from './pages/Browse'
import AgentDetail from './pages/AgentDetail'
import Submit from './pages/Submit'
import About from './pages/About'
import './App.css'

function App() {

  // Theme state — default dark
  const [theme, setTheme] = useState(
    () => localStorage.getItem('agenthub-theme') || 'dark'
  )

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('agenthub-theme', theme)
  }, [theme])

  // Toggle theme
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <BrowserRouter>
      <div className="app">

        {/* Navbar on every page */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* Page content */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/agent/:id" element={<AgentDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer on every page */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App