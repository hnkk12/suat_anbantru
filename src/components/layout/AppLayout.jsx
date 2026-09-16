import { useState } from 'react'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbfbf9] text-[#1c1d1b] font-sans antialiased tabular-nums">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header with QR Code and Notifications at the top-right corner */}
        <TopHeader onOpenMobile={() => setMobileOpen(true)} />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="mx-auto max-w-[1180px] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
