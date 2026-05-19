import { useState } from 'react'
import AppNavbar from './AppNavbar.jsx'
import Sidebar from './Sidebar.jsx'
import { useLiveUpdates } from '../hooks/useLiveUpdates.js'

function DashboardLayout({ title, subtitle, navItems, roleLabel, userName, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifications } = useLiveUpdates()

  return (
    <div className="app-shell">
      <Sidebar
        navItems={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        roleLabel={roleLabel}
      />
      <div className="dashboard-main">
        <AppNavbar
          title={title}
          subtitle={subtitle}
          userName={userName}
          roleLabel={roleLabel}
          notifications={notifications}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="content-wrap container-fluid">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
