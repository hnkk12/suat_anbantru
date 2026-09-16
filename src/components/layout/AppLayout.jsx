import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fbfbf9] text-[#1c1d1b] font-sans antialiased tabular-nums">
      {/* Sidebar with Hamburger button located inside its header */}
      <Sidebar />

      {/* Main Content Area exactly matching template */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="mx-auto max-w-[1180px] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-11">
          {children}
        </div>
      </main>
    </div>
  )
}
