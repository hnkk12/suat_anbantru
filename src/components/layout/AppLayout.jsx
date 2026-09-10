import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f7f7f5] text-gray-800 antialiased">
      {/* Top Navbar: cố định ở đỉnh */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        schoolName="bántrú"
      />

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        />

        {/* Main Content Area: nhận nội dung linh hoạt qua children */}
        <main className="min-w-0 flex-1 overflow-y-auto"><div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div></main>
      </div>
    </div>
  )
}
