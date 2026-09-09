import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  QrCode,
  ChevronDown,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  User,
  Settings,
  LogOut,
} from 'lucide-react'

function useOutsideClick(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler()
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

export default function Navbar({ onToggleSidebar, schoolName = 'Quản Lý Suất Ăn Bán Trú' }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrImageUnavailable, setQrImageUnavailable] = useState(false)

  const userRef = useRef(null)
  const notificationRef = useRef(null)
  const qrRef = useRef(null)

  useOutsideClick(userRef, () => setUserDropdownOpen(false))
  useOutsideClick(notificationRef, () => setNotificationOpen(false))
  useOutsideClick(qrRef, () => setQrOpen(false))

  const sampleNotifications = [
    {
      id: 1,
      title: 'Lớp 1A đã xác nhận suất ăn',
      desc: '32/32 học sinh đăng ký ăn trưa hôm nay.',
      time: '10 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Nhà bếp gửi thực đơn tuần sau',
      desc: 'Công ty An Lành đã đề xuất thực đơn tuần 37.',
      time: '1 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Kiểm tra nhiệt độ lưu mẫu đạt chuẩn',
      desc: 'Mẫu thức ăn ca trưa 09/09 đã được niêm phong.',
      time: '3 giờ trước',
      unread: false,
    },
  ]

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left section: Hamburger button + Logo & App Name */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Ẩn / Hiện menu điều hướng"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/20 transition-transform group-hover:scale-105">
              <UtensilsCrossed size={19} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                {schoolName}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-700">
                Hệ thống chuẩn hoá bữa ăn học đường
              </span>
            </div>
          </Link>
        </div>

        {/* Right section: Utilities icons + User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev)
                setQrOpen(false)
                setUserDropdownOpen(false)
              }}
              aria-label="Thông báo"
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                notificationOpen ? 'bg-slate-100 text-slate-900 ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <Bell size={18} strokeWidth={1.9} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white ring-2 ring-white">
                2
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Thông báo mới</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      2 chưa đọc
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 hover:text-emerald-600"
                  >
                    Đánh dấu đã đọc
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {sampleNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-3 transition-colors hover:bg-slate-50 rounded-xl ${
                        item.unread ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.unread ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <CheckCircle2 size={14} />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <AlertCircle size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-slate-500">{item.desc}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1.5 text-center">
                  <Link
                    to="/bao-cao"
                    onClick={() => setNotificationOpen(false)}
                    className="block py-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Xem toàn bộ lịch sử hoạt động →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* QR attendance code */}
          <div className="relative" ref={qrRef}>
            <button
              type="button"
              onClick={() => {
                setQrOpen((prev) => !prev)
                setNotificationOpen(false)
                setUserDropdownOpen(false)
              }}
              aria-label="Mở mã QR điểm danh"
              title="Mã QR điểm danh"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                qrOpen ? 'bg-slate-100 text-slate-900 ring-2 ring-emerald-500/20' : ''
              }`}
            >
              <QrCode size={18} strokeWidth={1.9} />
            </button>

            {qrOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                  {!qrImageUnavailable ? (
                    <img
                      src="/qr-attendance.png"
                      alt="Mã QR điểm danh"
                      className="h-full w-full object-contain"
                      onError={() => setQrImageUnavailable(true)}
                    />
                  ) : (
                    <span className="px-3 text-center text-[11px] leading-relaxed text-slate-400">
                      Thêm file<br /><b>public/qr-attendance.png</b>
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">Mã QR điểm danh</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Quét mã để mở chức năng điểm danh bán trú.</p>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* User Profile Area: Avatar, Name, Role + Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => {
                setUserDropdownOpen((prev) => !prev)
                setNotificationOpen(false)
                setQrOpen(false)
              }}
              className="group flex items-center gap-2.5 rounded-xl border border-transparent p-1.5 transition-all hover:border-slate-200 hover:bg-slate-50 focus:outline-none"
            >
              {/* Avatar circle */}
              <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 font-semibold text-white shadow-xs">
                <span className="text-xs sm:text-sm">NK</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {/* User text (Desktop) */}
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-none text-slate-900">Nam Khang Ha</p>
                <p className="mt-1 text-[11px] leading-none text-slate-500">uit - Quản trị viên</p>
              </div>

              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100 text-xs">
                <div className="border-b border-slate-100 px-3 py-2.5">
                  <p className="font-bold text-slate-900">Nam Khang Ha</p>
                  <p className="text-slate-400 text-[11px]">namkhang@uit.edu.vn</p>
                  <div className="mt-1.5 inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    uit - Quản trị viên
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    to="/nguoi-phu-trach"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
                  >
                    <User size={15} className="text-slate-400" />
                    <span>Hồ sơ người phụ trách</span>
                  </Link>

                  <Link
                    to="/bao-cao"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700"
                  >
                    <Settings size={15} className="text-slate-400" />
                    <span>Cấu hình báo cáo</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      alert('Đã đăng xuất phiên làm việc của Nam Khang Ha.')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
