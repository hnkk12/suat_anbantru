import { Link } from 'react-router-dom'
import { formatDateVN } from '../../utils/dateUtils'

export default function DashboardHeader({
  userName = 'Nam',
  selectedDate,
  onDateChange,
  onResetToday,
}) {
  const todayFormatted = formatDateVN(selectedDate)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Subtitle */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Chào buổi sáng, {userName}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Trực ban bán trú
          </span>
        </div>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Tổng quan tình hình học sinh bán trú, điểm danh, thực đơn và đánh giá trong ngày{' '}
          <span className="font-semibold text-slate-700">{todayFormatted}</span>.
        </p>
      </div>

      {/* Date Filter & Shortcut Button */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Date Filter Input */}
        <div className="relative flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-xs">
          <span className="mr-2 text-xs font-medium text-slate-400">Ngày:</span>
          <input
            type="date"
            aria-label="Chọn ngày xem thống kê"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none"
          />
          {onResetToday && (
            <button
              type="button"
              onClick={onResetToday}
              title="Quay về ngày hôm nay"
              className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200"
            >
              Hôm nay
            </button>
          )}
        </div>

        {/* Shortcut: Quản lý học sinh */}
        <Link
          to="/hoc-sinh"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-emerald-700"
        >
          Quản lý học sinh
        </Link>
      </div>
    </div>
  )
}
