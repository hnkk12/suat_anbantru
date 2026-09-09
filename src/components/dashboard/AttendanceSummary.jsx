import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { formatDateVN } from '../../utils/dateUtils'

export default function AttendanceSummary({
  date,
  total = 0,
  boarding = 0,
  nonBoarding = 0,
  sleepOnly = 0,
  loading = false,
  error = false,
  onRetry,
}) {
  const navigate = useNavigate()
  const formattedDate = formatDateVN(date)

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 text-center text-xs text-rose-700">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>Không thể tải thống kê điểm danh bán trú.</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1 font-semibold underline hover:text-rose-800"
          >
            <RefreshCw size={12} /> Thử lại
          </button>
        )}
      </div>
    )
  }

  const boardingRate = total > 0 ? ((boarding / total) * 100).toFixed(1) : 0
  const nonBoardingRate = total > 0 ? ((nonBoarding / total) * 100).toFixed(1) : 0
  const sleepOnlyRate = total > 0 ? ((sleepOnly / total) * 100).toFixed(1) : 0

  const cards = [
    { id: 'ban-tru', title: 'Bán trú', count: boarding, rate: `${boardingRate}%` },
    { id: 'khong-ban-tru', title: 'Không bán trú', count: nonBoarding, rate: `${nonBoardingRate}%` },
    { id: 'chi-ngu', title: 'Chỉ ngủ bán trú', count: sleepOnly, rate: `${sleepOnlyRate}%` },
  ]

  const handleCardClick = (_card) => {
    navigate('/hoc-sinh')
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-bold tracking-tight text-slate-900">
          Thống kê điểm danh bán trú
        </h2>
        <p className="text-xs text-slate-500">
          {formattedDate} · Nhấn vào thẻ để xem chi tiết
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCardClick(item)
            }}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300"
          >
            <div>
              <span className="text-xs font-medium text-gray-500">{item.title}</span>
              {loading ? (
                <div className="mt-1 h-5 w-16 animate-pulse rounded bg-gray-100" />
              ) : (
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold text-gray-900">
                    {item.count}
                  </span>
                  <span className="text-xs font-medium text-gray-400">học sinh</span>
                </div>
              )}
            </div>

            <div>
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {loading ? '—' : item.rate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
