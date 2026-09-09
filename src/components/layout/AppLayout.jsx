import TopNav from './TopNav'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-6">{children}</main>
    </div>
  )
}
