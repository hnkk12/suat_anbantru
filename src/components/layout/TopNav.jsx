import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  QrCode,
  UserCircle2,
  UtensilsCrossed,
  Users,
  Building2,
  ClipboardList,
  Star,
  ListOrdered,
  BarChart3,
  FileText,
  LogOut,
  Settings,
} from 'lucide-react'

const adminMenu = [
  { to: '/nguoi-phu-trach', label: 'Thông tin người phụ trách', icon: UserCircle2 },
  { to: '/cong-ty-suat-an', label: 'Công ty cung cấp suất ăn', icon: Building2 },
  { to: '/thuc-don', label: 'Thực đơn', icon: ClipboardList },
  { to: '/', label: 'Học sinh', icon: Users },
  { to: '/danh-gia-hoc-sinh', label: 'Đánh giá học sinh', icon: Star },
]

const reportMenu = [
  { to: '/bao-cao', label: 'Báo cáo tổng hợp' },
  { to: '/bao-cao?tab=diem-danh', label: 'Báo cáo điểm danh' },
  { to: '/bao-cao?tab=lop', label: 'Báo cáo theo lớp' },
]

function useOutsideClose(onClose) {
  const ref = useRef(null)
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])
  return ref
}

function Dropdown({ label, items, isActivePrefix }) {
  const [open, setOpen] = useState(false)
  const ref = useOutsideClose(() => setOpen(false))
  const location = useLocation()
  const isActive = location.pathname.startsWith(isActivePrefix)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {label}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 z-40 mt-1 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive: active }) =>
                `flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  active ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {item.icon && <item.icon size={16} className="shrink-0" />}
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopNav({ schoolName = 'TRƯỜNG TEST - ADMIN' }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userRef = useOutsideClose(() => setUserMenuOpen(false))
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-sm font-bold tracking-wide text-gray-900 sm:text-base">{schoolName}</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown label="Quản trị" items={adminMenu} isActivePrefix="/nguoi-phu-trach" />
          <NavLink
            to="/bieu-mau-3-buoc"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <ListOrdered size={15} />
            Biểu mẫu 3 bước
          </NavLink>
          <Dropdown label="Báo cáo" items={reportMenu.map((r) => ({ ...r, icon: BarChart3 }))} isActivePrefix="/bao-cao" />
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/van-ban-lien-quan')}
            className="hidden items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 sm:flex"
          >
            <FileText size={15} />
            Văn bản liên quan
          </button>
          <button
            type="button"
            title="Quét mã QR điểm danh"
            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <QrCode size={18} />
          </button>
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <UserCircle2 size={18} />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 z-40 mt-1 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-400">sukiakira1411@gmail.com</p>
                </div>
                <NavLink
                  to="/nguoi-phu-trach"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  Thông tin tài khoản
                </NavLink>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-gray-100 px-4 py-1.5 md:hidden">
        {adminMenu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-500'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
