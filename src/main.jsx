// ============================================
// MAIN ENTRY POINT
// React Router v7 setup with layouts
// ============================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layouts
import MainLayout from './layouts/MainLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

// Pages
import Home from './Pages/Home.jsx'
import Browse from './Pages/Browse.jsx'
import AgentDetail from './Pages/AgentDetail.jsx'
import Submit from './Pages/Submit.jsx'
import About from './Pages/About.jsx'

// Admin Pages
import AdminPanel from './Pages/Admin/AdminPanel.jsx'
import Dashboard from './Pages/Admin/Dashboard.jsx'
import Agents from './Pages/Admin/Agents.jsx'
import Reviews from './Pages/Admin/Reviews.jsx'
import Contacts from './Pages/Admin/Contacts.jsx'

import './index.css'
import './App.css'

// ── ROUTER CONFIG ─────────────────────────
const router = createBrowserRouter([
  {
    element: <MainLayout/>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/browse', element: <Browse /> },
      { path: '/agent/:id', element: <AgentDetail /> },
      { path: '/submit', element: <Submit /> },
      { path: '/about', element: <About /> },
    ]
  },
  {
    element: <AdminLayout/>,
    children: [
      {
        path: '/admin',
        element: <AdminPanel />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'agents', element: <Agents /> },
          { path: 'reviews', element: <Reviews /> },
          { path: 'contacts', element: <Contacts /> },
        ]
      }
    ]
  }
])

// ── RENDER APP ─────────────────────────────
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)