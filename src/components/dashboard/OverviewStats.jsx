import { AlertCircle, RefreshCw } from 'lucide-react'

export default function OverviewStats({
  totalStudents = 0,
  boardingStudents = 0,
  mealPrice = 35000,
  loading = false,
  error = false,
  onRetry,
}) {
  if (error) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs text-rose-700 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Không thể tải dữ liệu chỉ số tổng quan.</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 font-semibold underline hover:text-rose-800"
          >
            <RefreshCw size={12} /> Thử lại
          </button>
        )}
      </div>
    )
  }

  const rate = totalStudents > 0 ? ((boardingStudents / totalStudents) * 100).toFixed(1) : 0
  const formattedPrice = mealPrice.toLocaleString('vi-VN') + ' đ'

  const cards = [
    {
      id: 'total',
      label: 'Tổng số học sinh',
      value: loading ? '—' : totalStudents.toLocaleString('vi-VN'),
      unit: 'học sinh',
    },
    {
      id: 'boarding',
      label: 'Học sinh bán trú',
      value: loading ? '—' : boardingStudents.toLocaleString('vi-VN'),
      unit: 'học sinh',
    },
    {
      id: 'rate',
      label: 'Tỷ lệ bán trú',
      value: loading ? '—' : `${rate}%`,
      unit: null,
      isProgress: true,
      percentage: Number(rate),
    },
    {
      id: 'price',
      label: 'Tiền ăn bán trú / học sinh / ngày',
      value: loading ? '—' : formattedPrice,
      unit: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 line-clamp-1">{card.label}</span>
          </div>

          <div className="mt-2">
            {loading ? (
              <div className="h-7 w-20 animate-pulse rounded bg-slate-100" />
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</span>
                {card.unit && <span className="text-xs font-medium text-slate-400">{card.unit}</span>}
              </div>
            )}

            {/* Mini progress bar cho thẻ Tỷ lệ */}
            {card.isProgress && !loading && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, card.percentage))}%` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400">Mục tiêu 80%</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
