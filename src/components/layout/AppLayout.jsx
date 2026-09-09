import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-gray-800 antialiased flex flex-col">
      {/* Top Navbar: cố định ở đỉnh */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        schoolName="bántrú"
      />

      {/* Main Layout Container (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area: nhận nội dung linh hoạt qua children */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
