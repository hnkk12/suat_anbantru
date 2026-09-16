import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Bell,
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
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

export default function Navbar({ onToggleSidebar, onToggleSidebarCollapse }) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrImageUnavailable, setQrImageUnavailable] = useState(false)

  const notificationRef = useRef(null)
  const qrRef = useRef(null)

  useOutsideClick(notificationRef, () => setNotificationOpen(false))
  useOutsideClick(qrRef, () => setQrOpen(false))

  const [sampleNotifications, setSampleNotifications] = useState([
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
  ])

  const unreadCount = sampleNotifications.filter((n) => n.unread).length

  function markAllRead() {
    setSampleNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <header className="sticky top-0 z-40 h-[60px] shrink-0 border-b border-[#e6e7e2] bg-white/95 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left section: Hamburger button + Brand title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Ẩn / Hiện menu điều hướng"
            className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[#57605a] hover:bg-[#f2f3ee] hover:text-[#1c1d1b] lg:hidden"
          >
            <Menu size={19} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label="Thu gọn hoặc mở rộng sidebar"
            title="Thu gọn sidebar"
            className="hidden h-9 w-9 items-center justify-center rounded-[8px] border border-[#d5d7d0] text-[#57605a] hover:bg-[#fafaf8] hover:text-[#c84b26] lg:flex"
          >
            <Menu size={18} />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#c84b26] text-[12px] font-bold tracking-[0.02em] text-white">
              BT
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#1c1d1b]">
              Quản lý bán trú
            </span>
          </Link>
        </div>

        {/* Right section: Utilities (QR code, Notifications) */}
        <div className="flex items-center gap-2 sm:gap-3">
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
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d5d7d0] bg-white text-[#57605a] shadow-xs transition-colors hover:bg-[#fafaf8] hover:text-[#c84b26] ${
                qrOpen ? 'border-[#c84b26] bg-[#fdf2ee] text-[#c84b26]' : ''
              }`}
            >
              <QrCode size={17} />
            </button>

            {qrOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-[16px] border border-[#e3e4df] bg-white p-5 text-center shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-3 border-b border-[#eceeea]">
                  <span className="text-[14px] font-semibold text-[#1c1d1b]">Mã QR điểm danh</span>
                  <button
                    type="button"
                    onClick={() => setQrOpen(false)}
                    className="rounded-lg p-1 text-[#8a8d86] hover:bg-[#f2f3ee]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mx-auto mt-4 flex h-40 w-40 items-center justify-center rounded-[12px] border border-[#e3e4df] bg-[#fafaf8] p-2">
                  {!qrImageUnavailable ? (
                    <img
                      src="/qr-attendance.png"
                      alt="Mã QR điểm danh"
                      className="h-full w-full object-contain"
                      onError={() => setQrImageUnavailable(true)}
                    />
                  ) : (
                    <span className="px-3 text-center text-[12px] leading-relaxed text-[#9a9d96]">
                      Mã QR điểm danh<br />bán trú trực tuyến
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#6b6f68]">
                  Quét mã trên thiết bị di động để mở trang điểm danh nhanh theo lớp.
                </p>
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((prev) => !prev)
                setQrOpen(false)
              }}
              aria-label="Thông báo"
              className={`relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#d5d7d0] bg-white text-[#57605a] shadow-xs transition-colors hover:bg-[#fafaf8] hover:text-[#c84b26] ${
                notificationOpen ? 'border-[#c84b26] bg-[#fdf2ee] text-[#c84b26]' : ''
              }`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c84b26] text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-[16px] border border-[#e3e4df] bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100 sm:w-96">
                <div className="flex items-center justify-between border-b border-[#eceeea] px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#1c1d1b]">Thông báo mới</span>
                    {unreadCount > 0 && (
                      <span className="rounded-[6px] bg-[#fdf2ee] px-2 py-0.5 text-[11px] font-semibold text-[#c84b26]">
                        {unreadCount} chưa đọc
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[12px] font-medium text-[#c84b26] hover:underline"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#eceeea]">
                  {sampleNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-3 rounded-[12px] p-3 transition-colors hover:bg-[#fafaf8] ${
                        item.unread ? 'bg-[#fdf2ee]/35' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.unread ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fdf2ee] text-[#c84b26]">
                            <CheckCircle2 size={15} />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f2f3ee] text-[#8a8d86]">
                            <AlertCircle size={15} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-[12.5px]">
                        <p className="font-semibold text-[#1c1d1b]">{item.title}</p>
                        <p className="mt-0.5 text-[#6b6f68] leading-relaxed">{item.desc}</p>
                        <p className="mt-1 text-[11px] text-[#9a9d96]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#eceeea] pt-2 pb-1 text-center">
                  <Link
                    to="/bao-cao"
                    onClick={() => setNotificationOpen(false)}
                    className="block text-[12px] font-semibold text-[#c84b26] hover:underline"
                  >
                    Xem toàn bộ lịch sử hoạt động →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
