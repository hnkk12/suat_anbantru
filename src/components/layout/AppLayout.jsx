import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fbfbf9] text-[#20211f] antialiased">
      {/* Top Navbar: cố định ở đỉnh */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onToggleSidebarCollapse={() => setSidebarCollapsed((value) => !value)}
        schoolName="bántrú"
      />

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content Area: nhận nội dung linh hoạt qua children */}
        <main className="min-w-0 flex-1 overflow-y-auto"><div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</div></main>
      </div>
    </div>
  )
}
