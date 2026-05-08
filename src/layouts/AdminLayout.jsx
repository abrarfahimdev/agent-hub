import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('agenthub-theme') || 'dark'
  )

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="admin-main">
      <Outlet />
    </div>
  )
}

export default AdminLayout