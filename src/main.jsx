import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MainLayout from './layouts/MainLayouts.jsx';
import Browse from './Pages/Browse.jsx';
import AgentDetail from './Pages/AgentDetail.jsx';
import Submit from './Pages/Submit.jsx';
import Home from './Pages/Home.jsx';
import About from './pages/About.jsx';

const router = createBrowserRouter([
  {
   // Main layout — with Navbar and Footer
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/browse', element: <Browse/> },
      { path: '/agent/:id', element: <AgentDetail /> },
      { path: '/submit', element: <Submit/> },
      { path: '/about', element: <About/> },
    ]
  },
  {
    // Admin layout — no Navbar/Footer
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: <AdminPanel /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router} />,
  </StrictMode>,
)
