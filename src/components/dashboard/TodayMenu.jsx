import { Link, useNavigate } from 'react-router-dom'
import { formatDateVN, getDayOfWeekName } from '../../utils/dateUtils'
import DashboardEmptyState from './DashboardEmptyState'

const MEAL_TONES = {
  'Bữa sáng': 'bg-amber-50 text-amber-800 border-amber-200/80',
  'Bữa trưa': 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  'Bữa xế': 'bg-teal-50 text-teal-800 border-teal-200/80',
}

export default function TodayMenu({
  date,
  menu = {},
  loading = false,
  error = false,
  onRetry,
}) {
  const navigate = useNavigate()
  const formattedDate = formatDateVN(date)
  const dayName = getDayOfWeekName(date)
  const dayMenu = menu ? menu[dayName] : null

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Thực đơn hôm nay {formattedDate}
        </h3>
        <DashboardEmptyState
          isError
          onRetry={onRetry}
          title="Không thể tải thực đơn"
          description="Đã xảy ra lỗi khi lấy danh sách món ăn cho ngày này."
        />
      </div>
    )
  }

  // Kiểm tra xem có món ăn nào không
  const hasMeals =
    dayMenu &&
    Object.values(dayMenu).some((val) => typeof val === 'string' && val.trim().length > 0)

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                Thực đơn hôm nay
              </h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {dayName || 'Ngày thường'}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">{formattedDate}</p>
          </div>

          <Link
            to="/thuc-don"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            Xem thực đơn tuần
          </Link>
        </div>

        {/* Content */}
        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : hasMeals ? (
            <div className="space-y-3">
              {Object.entries(dayMenu).map(([mealType, mealContent]) => {
                const tone = MEAL_TONES[mealType] || 'bg-slate-50 text-slate-700 border-slate-200'

                // Tách các món ăn theo dấu phẩy
                const dishList = mealContent
                  ? mealContent
                      .split(',')
                      .map((d) => d.trim())
                      .filter(Boolean)
                  : []

                return (
                  <div
                    key={mealType}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold ${tone}`}>
                          {mealType}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {dishList.length} món
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {dishList.length > 0 ? (
                        dishList.map((dish, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs border border-slate-200/70"
                          >
                            {dish}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs italic text-slate-400">Chưa xếp món</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <DashboardEmptyState
              title="Chưa có món ăn nào"
              description="Vui lòng nhập dữ liệu thực đơn để hiển thị."
              actionLabel="+ Thêm thực đơn"
              onAction={() => navigate('/thuc-don')}
            />
          )}
        </div>
      </div>

      {/* Footer CTA */}
      {hasMeals && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tiêu chuẩn: Đảm bảo kiểm thực 3 bước</span>
          <Link to="/thuc-don" className="font-semibold text-emerald-700 hover:underline">
            Chỉnh sửa thực đơn
          </Link>
        </div>
      )}
    </div>
  )
}
