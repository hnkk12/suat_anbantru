import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  User,
  Building2,
  Utensils,
  Users,
  ClipboardCheck,
  LayoutDashboard,
  ListOrdered,
  BarChart3,
  FileText,
  X,
  ChevronRight,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react'

// Cấu hình danh sách menu chính — đúng thứ tự theo yêu cầu
const MAIN_NAV_ITEMS = [
  {
    name: 'Thông tin người phụ trách',
    to: '/nguoi-phu-trach',
    icon: User,
  },
  {
    name: 'Công ty cung cấp suất ăn',
    to: '/cong-ty-suat-an',
    icon: Building2,
  },
  {
    name: 'Thực đơn',
    to: '/thuc-don',
    icon: Utensils,
  },
  {
    name: 'Học sinh',
    to: '/hoc-sinh',
    icon: Users,
  },
  {
    name: 'Đánh giá học sinh',
    to: '/danh-gia-hoc-sinh',
    icon: ClipboardCheck,
  },
]

// Cấu hình các lối tắt và mục phụ (Shortcuts / Tiện ích mở rộng)
const SHORTCUT_NAV_ITEMS = [
  {
    name: 'Tổng quan hệ thống',
    to: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Biểu mẫu 3 bước',
    to: '/bieu-mau-3-buoc',
    icon: ListOrdered,
  },
  {
    name: 'Báo cáo thống kê',
    to: '/bao-cao',
    icon: BarChart3,
  },
  {
    name: 'Văn bản liên quan',
    to: '/van-ban-lien-quan',
    icon: FileText,
  },
]

export default function Sidebar({ isOpen, onClose, collapsed }) {
  const location = useLocation()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape') setAccountOpen(false)
      if (event.type === 'mousedown' && accountRef.current && !accountRef.current.contains(event.target)) setAccountOpen(false)
    }
    document.addEventListener('keydown', closeMenu)
    document.addEventListener('mousedown', closeMenu)
    return () => { document.removeEventListener('keydown', closeMenu); document.removeEventListener('mousedown', closeMenu) }
  }, [])

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          role="presentation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-[#dedfda] bg-white shadow-lg transition-all duration-300 ease-in-out lg:static lg:z-0 lg:shrink-0 lg:translate-x-0 lg:border-r lg:shadow-none ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'} ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5 lg:hidden">
          <span className="text-sm font-bold text-slate-900">Danh mục điều hướng</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Content Area (Scrollable) */}
        <div className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {/* Main Navigation Section */}
          <nav className="space-y-0.5">
            {MAIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center rounded-lg py-2 text-sm transition-colors duration-100 ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${
                    isActive
                      ? 'bg-teal-50/80 font-semibold text-teal-900'
                      : 'font-medium text-[#5d615c] hover:bg-[#f5f6f3] hover:text-[#20211f]'
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.75}
                    className={`shrink-0 ${
                      isActive ? 'text-teal-800' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className={collapsed ? 'hidden' : 'truncate'}>{item.name}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="h-px bg-gray-100" />

          {/* Shortcuts / Secondary Navigation Section */}
          <div>
            <div className={`flex items-center justify-between px-3 pb-1.5 ${collapsed ? 'hidden' : ''}`}>
              <span className="text-xs font-semibold text-gray-400">Shortcuts</span>
            </div>
            <nav className="space-y-0.5">
              {SHORTCUT_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to)

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`group flex items-center rounded-lg py-2 text-sm transition-colors duration-100 ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${
                      isActive
                        ? 'bg-teal-50/80 font-semibold text-teal-900'
                        : 'font-medium text-[#5d615c] hover:bg-[#f5f6f3] hover:text-[#20211f]'
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.2 : 1.75}
                      className={`shrink-0 ${
                        isActive ? 'text-teal-800' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                  <span className={collapsed ? 'hidden' : 'truncate'}>{item.name}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Bottom-left: Organization & User Information Card (Shortcut tới Quản lý phân quyền) */}
        <div ref={accountRef} className="relative border-t border-[#e5e6e1] bg-[#fafaf8] p-3">
          {accountOpen && <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-xl"><Link to="/phan-quyen-menu" onClick={() => { setAccountOpen(false); onClose() }} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-800"><ShieldCheck size={16} />Phân quyền menu</Link><Link to="/cai-dat" onClick={() => { setAccountOpen(false); onClose() }} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-800"><Settings size={16} />Cài đặt</Link><div className="my-1 border-t border-slate-100" /><button type="button" onClick={() => { setAccountOpen(false); alert('Đã đăng xuất phiên làm việc của Lê Hiếu Huy.') }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"><LogOut size={16} />Đăng xuất</button></div>}
          <button
            type="button"
            aria-label="Mở menu tài khoản"
            aria-expanded={accountOpen}
            onClick={() => setAccountOpen((value) => !value)}
            className="group flex w-full items-center justify-between gap-2.5 rounded-xl border border-[#d9dad5] bg-white p-2.5 text-left shadow-xs transition-all hover:border-teal-600/50 hover:bg-teal-50/40 hover:shadow-sm"
          >
            {/* Square avatar with abbreviation 'ui' */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 font-bold uppercase tracking-wider text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xs">ui</span>
            </div>

            {/* School / Organization info */}
            <div className={`min-w-0 flex-1 ${collapsed ? 'hidden' : ''}`}>
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-teal-900 transition-colors">uit</p>
                <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.2 text-xs font-semibold text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                  Simple
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
                <p className="truncate text-xs text-slate-500 font-medium">Gói Cơ bản</p>
              </div>
            </div>

            {/* Chevron indicator */}
            <ChevronRight
              size={15}
              className={`shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-teal-600 ${collapsed ? 'hidden' : ''}`}
            />
          </button>
        </div>
      </aside>
    </>
  )
}
