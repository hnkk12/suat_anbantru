import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  QrCode,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
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
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrImageUnavailable, setQrImageUnavailable] = useState(false)

  const notificationRef = useRef(null)
  const qrRef = useRef(null)

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
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left section: Hamburger button + Wordmark logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Ẩn / Hiện menu điều hướng"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none lg:hidden"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center">
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-teal-900">
              {schoolName}
            </span>
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
              }}
              aria-label="Thông báo"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                notificationOpen ? 'bg-gray-100 text-gray-900' : ''
              }`}
            >
              <Bell size={18} strokeWidth={1.9} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white ring-2 ring-white">
                2
              </span>
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Thông báo mới</span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                      2 chưa đọc
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-slate-500 hover:text-teal-600"
                  >
                    Đánh dấu đã đọc
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {sampleNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-3 transition-colors hover:bg-slate-50 rounded-xl ${
                        item.unread ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.unread ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-600">
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
                        <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-1.5 text-center">
                  <Link
                    to="/bao-cao"
                    onClick={() => setNotificationOpen(false)}
                    className="block py-1.5 text-xs font-semibold text-teal-700 hover:underline"
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
              }}
              aria-label="Mở mã QR điểm danh"
              title="Mã QR điểm danh"
              className={`flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${
                qrOpen ? 'bg-gray-100 text-gray-900' : ''
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
                    <span className="px-3 text-center text-xs leading-relaxed text-slate-400">
                      Thêm file<br /><b>public/qr-attendance.png</b>
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900">Mã QR điểm danh</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">Quét mã để mở chức năng điểm danh bán trú.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            title="Trợ giúp"
            aria-label="Trợ giúp"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:flex"
          >
            <HelpCircle size={18} strokeWidth={1.9} />
          </button>

        </div>
      </div>
    </header>
  )
}
