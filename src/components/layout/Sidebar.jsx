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
  Sparkles,
  ChevronRight,
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

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:w-64 lg:shrink-0 lg:translate-x-0 lg:border-r lg:shadow-none ${
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
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {/* Main Navigation Section */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quản trị bán trú
            </div>
            <nav className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.to

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 font-semibold text-emerald-700 shadow-xs ring-1 ring-emerald-200/70'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {/* Active left indicator bar */}
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-emerald-600" />
                    )}
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.3 : 1.9}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Shortcuts / Secondary Navigation Section */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Lối tắt & Tiện ích
            </div>
            <nav className="space-y-1">
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
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-100 font-semibold text-slate-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        size={16}
                        strokeWidth={isActive ? 2.2 : 1.8}
                        className={`shrink-0 ${
                          isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronRight
                      size={12}
                      className={`shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 ${
                        isActive ? 'opacity-100 text-slate-500' : ''
                      }`}
                    />
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Gusto Style Pro Banner / Quick Helper */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-white p-3.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Sparkles size={14} className="text-emerald-600" />
              <span>Tiêu chuẩn dinh dưỡng</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
              Đảm bảo 100% định lượng calo và quy trình kiểm thực 3 bước an toàn vệ sinh.
            </p>
          </div>
        </div>

        {/* Bottom-left: Organization & User Information Card (Shortcut tới Quản lý phân quyền) */}
        <div className="border-t border-slate-200 bg-slate-50/60 p-3">
          <Link
            to="/phan-quyen-menu"
            onClick={onClose}
            title="Quản lý phân quyền"
            className="group flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs transition-all hover:border-emerald-500/60 hover:bg-slate-50 hover:shadow-sm cursor-pointer"
          >
            {/* Square avatar with abbreviation 'ui' */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 font-bold uppercase tracking-wider text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xs">ui</span>
            </div>

            {/* School / Organization info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">uit</p>
                <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                  Simple
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <p className="truncate text-[11px] text-slate-500 font-medium">Gói Cơ bản</p>
              </div>
            </div>

            {/* Chevron indicator */}
            <ChevronRight
              size={15}
              className="shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600"
            />
          </Link>
        </div>
      </aside>
    </>
  )
}
