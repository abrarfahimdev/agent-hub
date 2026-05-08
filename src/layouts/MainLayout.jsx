// ============================================
// MAIN LAYOUT
// Default layout with Navbar and Footer
// ============================================

import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('agenthub-theme') || 'dark'
  )

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('agenthub-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout