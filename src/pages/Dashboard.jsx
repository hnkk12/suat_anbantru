import { useEffect, useState } from 'react'
import { CircleHelp, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StatCard from '../components/layout/StatCard'
import Tabs from '../components/ui/Tabs'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import StudentsTab from './dashboard/StudentsTab'
import ClassesTab from './dashboard/ClassesTab'
import TeachersTab from './dashboard/TeachersTab'

const TABS = [
  { value: 'hoc-sinh', label: 'Học sinh' },
  { value: 'lop-hoc', label: 'Lớp học' },
  { value: 'giao-vien', label: 'Tài khoản giáo viên' },
]

export default function Dashboard() {
  const {
    schoolYear,
    setSchoolYear,
    schoolYears,
    searchTerm,
    setSearchTerm,
    stats,
  } = useApp()
  const [tab, setTab] = useState('hoc-sinh')
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setHelpOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Học sinh
          </h1>
          <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Danh sách học sinh theo năm học. Dùng ô tìm kiếm để lọc theo tên, lớp hoặc số điện thoại.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] outline-none hover:border-[#b8bbb2] focus:border-[#c84b26]"
          >
            {schoolYears.map((year) => (
              <option key={year} value={year}>
                Năm học {year}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9d96]"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tên, lớp, SĐT..."
              className="w-[200px] rounded-[10px] border border-[#d5d7d0] bg-white py-2 pl-8 pr-3 text-[13px] font-sans text-[#1c1d1b] outline-none placeholder:text-[#9a9d96] hover:border-[#b8bbb2] focus:border-[#c84b26]"
            />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng học sinh" value={stats.tongHocSinh} />
        <StatCard label="Số lớp" value={stats.soLop} />
        <StatCard label="Đã điểm danh" value={`${stats.daDiemDanh} / ${stats.tongHocSinh}`} />
        <StatCard label="Năm học" value={schoolYear} />
      </div>

      {/* Tabs Section matching template layout */}
      <div className="flex items-center justify-between border-b border-[#eceeea] pb-1">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <button
          type="button"
          aria-label="Hướng dẫn sử dụng"
          title="Hướng dẫn sử dụng"
          onClick={() => setHelpOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[#8a8d86] hover:bg-[#f2f3ee] hover:text-[#c84b26] transition-colors"
        >
          <CircleHelp size={17} />
        </button>
      </div>

      <div>
        {tab === 'hoc-sinh' && <StudentsTab />}
        {tab === 'lop-hoc' && <ClassesTab />}
        {tab === 'giao-vien' && <TeachersTab />}
      </div>

      {/* Help Modal */}
      <Modal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Hướng dẫn sử dụng"
        width="max-w-md"
        footer={
          <Button variant="neutral" onClick={() => setHelpOpen(false)}>
            Đóng
          </Button>
        }
      >
        <p className="text-[13px] text-[#6b6f68]">
          Cách thao tác nhanh trên trang quản lý học sinh bán trú:
        </p>
        <ol className="mt-4 space-y-3">
          {[
            'Chọn năm học và tìm kiếm học sinh/lớp/tài khoản theo từ khóa.',
            'Tab Học sinh dùng để thêm mới, sửa đổi trạng thái bán trú hoặc xóa học sinh.',
            'Tab Lớp học và Tài khoản giáo viên giúp phân bổ sĩ số và gán người phụ trách.',
          ].map((item, index) => (
            <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-[#1c1d1b]">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fdf2ee] text-[11px] font-bold text-[#c84b26]">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </Modal>
    </div>
  )
}
