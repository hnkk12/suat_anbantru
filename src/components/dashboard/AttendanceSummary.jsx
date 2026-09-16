import { useNavigate } from 'react-router-dom'
import { formatDateVN, getDayOfWeekName } from '../../utils/dateUtils'

export default function AttendanceSummary({
  date,
  total = 0,
  boarding = 0,
  nonBoarding = 0,
  sleepOnly = 0,
  loading = false,
}) {
  const navigate = useNavigate()
  const todayFormatted = formatDateVN(date)
  const dayLabel = getDayOfWeekName(date)

  const boardingRate = total > 0 ? ((boarding / total) * 100).toFixed(0) : '0'
  const nonBoardingRate = total > 0 ? ((nonBoarding / total) * 100).toFixed(0) : '0'
  const sleepOnlyRate = total > 0 ? ((sleepOnly / total) * 100).toFixed(0) : '0'

  const cards = [
    { label: 'Bán trú', count: boarding, rate: boardingRate },
    { label: 'Không bán trú', count: nonBoarding, rate: nonBoardingRate },
    { label: 'Chỉ ngủ bán trú', count: sleepOnly, rate: sleepOnlyRate },
  ]

  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1c1d1b]">
          Điểm danh bán trú
        </h2>
        <p className="mt-0.5 text-[12.5px] text-[#9a9d96]">
          {todayFormatted} · {dayLabel}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={() => navigate('/hoc-sinh')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/hoc-sinh')}
            className="flex cursor-pointer items-center justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs transition-all hover:border-[#cfd1cb]"
          >
            <div>
              <span className="text-[12.5px] font-medium text-[#6b6f68]">{card.label}</span>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-[22px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
                  {loading ? '—' : card.count}
                </span>
                <span className="text-[12px] font-medium text-[#9a9d96]">học sinh</span>
              </div>
            </div>
            <span className="rounded-[8px] bg-[#f2f3ee] px-2.5 py-1 text-[12.5px] font-semibold text-[#57605a]">
              {loading ? '—' : `${card.rate}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
