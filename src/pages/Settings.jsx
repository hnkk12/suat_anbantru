import { Link } from 'react-router-dom'
import { Settings as SettingsIcon, ShieldCheck, UserCheck } from 'lucide-react'

export default function Settings() {
  const settingLinks = [
    {
      title: 'Phân quyền menu & tài khoản',
      desc: 'Quản lý quyền xem, thêm, sửa, xóa trên từng chức năng của hệ thống.',
      to: '/phan-quyen-menu',
      icon: ShieldCheck,
    },
    {
      title: 'Thông tin người phụ trách',
      desc: 'Cấu hình thông tin đại diện quản lý bán trú của nhà trường.',
      to: '/nguoi-phu-trach',
      icon: UserCheck,
    },
  ]

  return (
    <div className="flex flex-col gap-5.5">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
          Cài đặt
        </h1>
        <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
          Cấu hình tài khoản, phân quyền và cài đặt chung hệ thống bán trú.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {settingLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-start gap-3.5 rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs transition-all hover:border-[#c84b26]/50 hover:shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#fdf2ee] text-[#c84b26]">
                <Icon size={20} />
              </span>
              <div>
                <h3 className="text-[14.5px] font-semibold text-[#1c1d1b]">{item.title}</h3>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[#6b6f68]">{item.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-[16px] border border-dashed border-[#dcdedb] p-10 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f3ee] text-[#57605a]">
          <SettingsIcon size={20} />
        </span>
        <p className="mt-3 text-[13.5px] font-semibold text-[#1c1d1b]">Cấu hình nâng cao</p>
        <p className="mt-1 text-[12.5px] text-[#9a9d96]">
          Các tùy chọn sao lưu dữ liệu, thông báo SMS và tích hợp Zalo OA sẽ được cập nhật tại đây.
        </p>
      </div>
    </div>
  )
}
