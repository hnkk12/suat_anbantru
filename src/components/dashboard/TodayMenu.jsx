import { Link, useNavigate } from 'react-router-dom'
import { formatDateVN, getDayOfWeekName } from '../../utils/dateUtils'
import { AlertCircle, RefreshCw, Plus } from 'lucide-react'

export default function TodayMenu({
  date,
  menu = {},
  loading = false,
  error = false,
  onRetry,
}) {
  const navigate = useNavigate()
  const todayFormatted = formatDateVN(date)
  const dayLabel = getDayOfWeekName(date)
  const dayMenu = menu ? menu[dayLabel] : null

  if (error) {
    return (
      <div className="flex h-full flex-col justify-center rounded-[16px] border border-rose-200 bg-rose-50/50 p-6 text-center text-[12.5px] text-rose-700">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>Không thể tải thực đơn hôm nay.</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center justify-center gap-1 font-semibold underline hover:text-rose-800"
          >
            <RefreshCw size={12} /> Thử lại
          </button>
        )}
      </div>
    )
  }

  const hasTodayMenu = Boolean(
    dayMenu && Object.values(dayMenu).some((val) => typeof val === 'string' && val.trim().length > 0)
  )

  const todayMeals = hasTodayMenu
    ? Object.entries(dayMenu)
        .filter(([, content]) => Boolean(content && content.trim()))
        .map(([name, content]) => ({
          name,
          dishes: content.split(',').map((d) => d.trim()).filter(Boolean),
        }))
    : []

  return (
    <div className="flex h-full flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-[#eceeea] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-[#1c1d1b]">Thực đơn hôm nay</h3>
              <span className="rounded-[6px] bg-[#f2f3ee] px-2 py-0.5 text-[11px] font-semibold text-[#57605a]">
                {dayLabel}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-[#9a9d96]">{todayFormatted}</p>
          </div>
          <Link
            to="/thuc-don"
            className="text-[12.5px] font-semibold text-[#c84b26] hover:underline"
          >
            Xem cả tuần
          </Link>
        </div>

        {/* Content */}
        <div className="mt-3.5 flex flex-col gap-2.5">
          {loading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-[12px] bg-[#fafaf8]" />
              ))}
            </div>
          ) : hasTodayMenu ? (
            todayMeals.map((meal) => (
              <div
                key={meal.name}
                className="rounded-[12px] border border-[#eceeea] bg-[#fafaf8] p-3 sm:px-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-[6px] border border-[#e3e4df] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#57605a]">
                    {meal.name}
                  </span>
                  <span className="text-[11.5px] text-[#9a9d96]">
                    {meal.dishes.length} món
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {meal.dishes.map((dish, idx) => (
                    <span
                      key={idx}
                      className="rounded-[7px] border border-[#e6e7e2] bg-white px-2.5 py-1 text-[12.5px] text-[#3a3c38]"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#dcdedb] p-6 text-center">
              <p className="text-[12.5px] text-[#9a9d96]">Chưa có món ăn cho ngày này.</p>
              <button
                type="button"
                onClick={() => navigate('/thuc-don')}
                className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#c84b26] hover:underline"
              >
                <Plus size={14} /> Thêm thực đơn
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {hasTodayMenu && (
        <div className="mt-4 flex items-center justify-between border-t border-[#f1f2ee] pt-3 text-[12px] text-[#6b6f68]">
          <span>Tiêu chuẩn: Đảm bảo kiểm thực 3 bước</span>
          <Link to="/thuc-don" className="font-semibold text-[#c84b26] hover:underline">
            Chỉnh sửa thực đơn
          </Link>
        </div>
      )}
    </div>
  )
}
