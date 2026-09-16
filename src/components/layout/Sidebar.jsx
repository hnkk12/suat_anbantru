import { useEffect, useRef, useState, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  ShieldCheck,
  Settings,
  LogOut,
  X,
  Menu,
  LayoutDashboard,
  UserRound,
  Building2,
  UtensilsCrossed,
  Users,
  Star,
  ClipboardCheck,
  BarChart3,
  FileText,
} from 'lucide-react'

const HOME_ITEM = { name: 'Tổng quan', to: '/', icon: LayoutDashboard }

const MAIN_NAV_ITEMS = [
  { name: 'Người phụ trách', to: '/nguoi-phu-trach', icon: UserRound },
  { name: 'Công ty cung cấp suất ăn', to: '/cong-ty-suat-an', icon: Building2 },
  { name: 'Thực đơn', to: '/thuc-don', icon: UtensilsCrossed },
  { name: 'Học sinh', to: '/hoc-sinh', icon: Users },
  { name: 'Đánh giá học sinh', to: '/danh-gia-hoc-sinh', icon: Star },
]

const SHORTCUT_NAV_ITEMS = [
  { name: 'Biểu mẫu 3 bước', to: '/bieu-mau-3-buoc', icon: ClipboardCheck },
  { name: 'Báo cáo thống kê', to: '/bao-cao', icon: BarChart3 },
  { name: 'Văn bản liên quan', to: '/van-ban-lien-quan', icon: FileText },
]

export default function Sidebar({ mobileOpen: externalMobileOpen, onMobileClose }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  const isControlled = externalMobileOpen !== undefined
  const mobileOpen = isControlled ? externalMobileOpen : internalMobileOpen
  const closeMobile = useCallback(() => {
    if (isControlled) {
      onMobileClose?.()
    } else {
      setInternalMobileOpen(false)
    }
  }, [isControlled, onMobileClose])

  // Close menus on Escape or click outside
  useEffect(() => {
    const closeMenu = (event) => {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        closeMobile()
      }
      if (
        event.type === 'mousedown' &&
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('keydown', closeMenu)
    document.addEventListener('mousedown', closeMenu)
    return () => {
      document.removeEventListener('keydown', closeMenu)
      document.removeEventListener('mousedown', closeMenu)
    }
  }, [closeMobile])

  const linkClass = (isActive) =>
    `text-left border-none rounded-[9px] px-3 py-2 text-[13.5px] font-sans font-medium transition-colors ${
      isActive
        ? 'bg-[#fdf2ee] font-semibold text-[#c84b26]'
        : 'bg-transparent text-[#57605a] hover:bg-[#f7f8f6] hover:text-[#1c1d1b]'
    }`

  const iconLinkClass = (isActive) =>
    `flex h-9 w-9 items-center justify-center rounded-[8px] transition-colors ${
      isActive
        ? 'bg-[#fdf2ee] text-[#c84b26]'
        : 'text-[#57605a] hover:bg-[#f7f8f6] hover:text-[#1c1d1b]'
    }`

  // Render Full Sidebar Content matching template
  const renderFullContent = (isMobile = false) => (
    <div className="flex h-full min-h-0 flex-col w-[264px] bg-white">
      {/* Brand Header matching template + Hamburger button căn góc trái */}
      <div
        style={{
          height: '58px',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #eceeea',
        }}
      >
        {/* Hamburger button căn góc trái */}
        <button
          type="button"
          onClick={() => {
            if (isMobile) {
              closeMobile()
            } else {
              setCollapsed(true)
            }
          }}
          aria-label={isMobile ? 'Đóng menu' : 'Thu gọn menu'}
          title={isMobile ? 'Đóng menu' : 'Thu gọn menu'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26] transition-colors cursor-pointer"
        >
          {isMobile ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: '#c84b26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            BT
          </div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: '#1c1d1b',
            }}
          >
            Bán trú
          </span>
        </div>
      </div>

      {/* Top Home Nav matching template */}
      <nav
        style={{
          padding: '6px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
      >
        <NavLink
          to={HOME_ITEM.to}
          end
          onClick={() => isMobile && closeMobile()}
          className={({ isActive }) =>
            linkClass(isActive || location.pathname === '/')
          }
        >
          {HOME_ITEM.name}
        </NavLink>
      </nav>

      <div style={{ height: '1px', background: '#eceeea', margin: '10px 22px' }} />

      {/* Section: QUẢN LÝ matching template */}
      <div style={{ padding: '0 14px' }}>
        <p
          style={{
            margin: '0 0 6px 8px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#a3a69e',
            textTransform: 'uppercase',
          }}
        >
          Quản lý
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => isMobile && closeMobile()}
              className={({ isActive }) => linkClass(isActive)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{ height: '1px', background: '#eceeea', margin: '14px 22px' }} />

      {/* Section: LỐI TẮT matching template */}
      <div style={{ padding: '0 14px' }}>
        <p
          style={{
            margin: '0 0 6px 8px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#a3a69e',
            textTransform: 'uppercase',
          }}
        >
          Lối tắt
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {SHORTCUT_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => isMobile && closeMobile()}
              className={({ isActive }) => linkClass(isActive)}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Footer */}
      <div
        ref={accountRef}
        style={{
          marginTop: 'auto',
          padding: '16px 20px',
          borderTop: '1px solid #eceeea',
          position: 'relative',
        }}
      >
        {/* Admin Popover Menu */}
        {accountOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 min-w-[224px] rounded-[14px] border border-[#e3e4df] bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100 z-50">
            <Link
              to="/phan-quyen-menu"
              onClick={() => {
                setAccountOpen(false)
                if (isMobile) closeMobile()
              }}
              className="flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] font-medium text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
            >
              <ShieldCheck size={16} />
              Phân quyền menu
            </Link>

            <Link
              to="/cai-dat"
              onClick={() => {
                setAccountOpen(false)
                if (isMobile) closeMobile()
              }}
              className="flex items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] font-medium text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
            >
              <Settings size={16} />
              Cài đặt
            </Link>

            <div className="my-1 border-t border-[#eceeea]" />

            <button
              type="button"
              onClick={() => {
                setAccountOpen(false)
                alert('Đã đăng xuất phiên làm việc.')
              }}
              className="flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        )}

        <button
          type="button"
          aria-label="Mở menu tài khoản"
          onClick={() => setAccountOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            padding: 0,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#f0f1ec',
              border: '1px solid #e3e4df',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#5d605a',
              flexShrink: 0,
            }}
          >
            AD
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1c1d1b' }}>
              Admin
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#8a8d86' }}>Quản trị viên</p>
          </div>
        </button>
      </div>
    </div>
  )

  // Render Collapsed (Mini) Sidebar Content
  const renderCollapsedContent = () => (
    <div className="flex h-full min-h-0 flex-col items-center w-[64px] bg-white py-4">
      {/* Top Hamburger button to expand + BT logo */}
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Mở rộng menu"
        title="Mở rộng menu"
        className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26] transition-colors cursor-pointer"
      >
        <Menu size={18} />
      </button>

      <button
        type="button"
        onClick={() => setCollapsed(false)}
        title="Bán trú"
        className="mt-2.5 flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#c84b26] text-[12px] font-bold text-white cursor-pointer"
      >
        BT
      </button>

      <div className="my-3 h-[1px] w-8 bg-[#eceeea]" />

      {/* Nav items as icons */}
      <div className="flex flex-col items-center gap-1">
        <NavLink
          to={HOME_ITEM.to}
          end
          title={HOME_ITEM.name}
          className={({ isActive }) =>
            iconLinkClass(isActive || location.pathname === '/')
          }
        >
          <HOME_ITEM.icon size={17} />
        </NavLink>

        <div className="my-2 h-[1px] w-6 bg-[#eceeea]" />

        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.name}
            className={({ isActive }) => iconLinkClass(isActive)}
          >
            <item.icon size={17} />
          </NavLink>
        ))}

        <div className="my-2 h-[1px] w-6 bg-[#eceeea]" />

        {SHORTCUT_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.name}
            className={({ isActive }) => iconLinkClass(isActive)}
          >
            <item.icon size={17} />
          </NavLink>
        ))}
      </div>

      {/* Bottom User Avatar in mini mode */}
      <div ref={accountRef} className="relative mt-auto pt-3">
        {accountOpen && (
          <div className="absolute bottom-full left-2 mb-2 min-w-[180px] rounded-[14px] border border-[#e3e4df] bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100 z-50">
            <div className="border-b border-[#eceeea] px-3 py-2">
              <p className="text-[13px] font-semibold text-[#1c1d1b]">Admin</p>
              <p className="text-[11px] text-[#8a8d86]">Quản trị viên</p>
            </div>
            <div className="py-1">
              <Link
                to="/phan-quyen-menu"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12.5px] text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
              >
                <ShieldCheck size={15} /> Phân quyền menu
              </Link>
              <Link
                to="/cai-dat"
                onClick={() => setAccountOpen(false)}
                className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12.5px] text-[#57605a] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
              >
                <Settings size={15} /> Cài đặt
              </Link>
              <div className="my-1 border-t border-[#eceeea]" />
              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false)
                  alert('Đã đăng xuất phiên làm việc.')
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-[12.5px] text-rose-600 hover:bg-rose-50 cursor-pointer"
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          title="Admin - Quản trị viên"
          className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#e3e4df] bg-[#f0f1ec] text-[11px] font-bold text-[#5d605a] cursor-pointer"
        >
          AD
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden animate-in fade-in-50"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Drawer (always full 264px when opened) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col overflow-y-auto bg-white border-r border-[#e6e7e2] transition-transform duration-250 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {renderFullContent(true)}
      </aside>

      {/* Desktop Sidebar (Collapsible between 264px and 64px) */}
      <aside
        style={{
          width: collapsed ? '64px' : '264px',
          flexShrink: 0,
          background: '#ffffff',
          borderRight: '1px solid #e6e7e2',
          overflowY: 'auto',
          transition: 'width 0.2s ease-in-out',
        }}
        className="hidden flex-col lg:flex"
      >
        {collapsed ? renderCollapsedContent() : renderFullContent(false)}
      </aside>
    </>
  )
}
