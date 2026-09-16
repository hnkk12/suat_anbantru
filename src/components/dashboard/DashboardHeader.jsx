import { Link } from 'react-router-dom'
import { formatDateVN } from '../../utils/dateUtils'

export default function DashboardHeader({
  userName = 'Nam',
  selectedDate,
  onDateChange,
}) {
  const todayFormatted = formatDateVN(selectedDate)

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
          Chào buổi sáng, {userName}
        </h1>
        <p className="mt-1.5 max-w-[520px] text-[14px] leading-relaxed text-[#6b6f68]">
          Tổng quan tình hình học sinh bán trú, điểm danh, thực đơn và đánh giá trong ngày{' '}
          <span className="font-medium text-[#1c1d1b]">{todayFormatted}</span>.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2">
          <span className="text-[12px] font-medium text-[#9a9d96]">Ngày</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="border-none bg-transparent font-sans text-[13px] font-medium text-[#1c1d1b] outline-none"
          />
        </div>

        <Link
          to="/hoc-sinh"
          className="rounded-[10px] border border-[#d5d7d0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#1c1d1b] shadow-xs transition-colors hover:bg-[#fafaf8] hover:border-[#c5c8be]"
        >
          Quản lý học sinh
        </Link>
      </div>
    </div>
  )
}
