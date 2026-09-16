export default function OverviewStats({
  totalStudents = 0,
  boardingStudents = 0,
  mealPrice = 35000,
  loading = false,
}) {
  const rate = totalStudents > 0 ? ((boardingStudents / totalStudents) * 100).toFixed(1) : '0'
  const formattedPrice = Number(mealPrice).toLocaleString('vi-VN') + ' đ'

  const cards = [
    {
      id: 'total',
      label: 'Tổng số học sinh',
      value: loading ? '—' : String(totalStudents),
      unit: 'học sinh',
      hasProgress: false,
    },
    {
      id: 'boarding',
      label: 'Học sinh bán trú',
      value: loading ? '—' : String(boardingStudents),
      unit: 'học sinh',
      hasProgress: false,
    },
    {
      id: 'rate',
      label: 'Tỷ lệ bán trú',
      value: loading ? '—' : `${rate}%`,
      unit: '',
      hasProgress: true,
      progressPercent: Number(rate),
    },
    {
      id: 'price',
      label: 'Tiền ăn / học sinh / ngày',
      value: loading ? '—' : formattedPrice,
      unit: '',
      hasProgress: false,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex min-h-[118px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs transition-all hover:border-[#cfd1cb]"
        >
          <span className="text-[12.5px] font-medium text-[#6b6f68]">{card.label}</span>
          <div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-[12px] font-medium text-[#9a9d96]">{card.unit}</span>
              )}
            </div>
            {card.hasProgress && (
              <div className="mt-2.5 h-[5px] overflow-hidden rounded-[99px] bg-[#eceeea]">
                <div
                  className="h-full rounded-[99px] bg-[#c84b26] transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, card.progressPercent))}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
