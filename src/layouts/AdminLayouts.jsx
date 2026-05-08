// ============================================
// ADMIN LAYOUT
// Clean layout without Navbar and Footer
// ============================================

import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="app">
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout