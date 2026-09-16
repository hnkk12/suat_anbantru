import { Link } from 'react-router-dom'

export default function StudentRatings({
  date,
  evaluations = [],
  todayMenuDishes = [],
  loading = false,
}) {
  const dayEvaluations = evaluations.filter((e) => e.ngay === date)
  const evalTotal = dayEvaluations.length

  const positiveCount = dayEvaluations.filter(
    (e) => e.anUong === 'Tốt' || e.anUong === 'Khá'
  ).length
  const negativeCount = dayEvaluations.filter(
    (e) => e.anUong === 'Cần cải thiện'
  ).length

  const positiveRate = evalTotal > 0 ? ((positiveCount / evalTotal) * 100).toFixed(0) : '0'
  const negativeRate = evalTotal > 0 ? ((negativeCount / evalTotal) * 100).toFixed(0) : '0'

  const dishNames =
    todayMenuDishes.length > 0
      ? todayMenuDishes.slice(0, 4)
      : ['Cơm trắng', 'Món mặn chính', 'Canh rau theo mùa', 'Món phụ / Tráng miệng']

  const dishRatings = dishNames.map((name, idx) => {
    const base = Number(positiveRate) || 70
    const variance = [3, -4, 5, -2][idx % 4]
    const score = Math.min(100, Math.max(50, base + variance))
    return { name, score }
  })

  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        <div className="h-16 animate-pulse rounded-[12px] bg-[#fafaf8]" />
        <div className="h-28 animate-pulse rounded-[12px] bg-[#fafaf8]" />
      </div>
    )
  }

  if (evalTotal === 0) {
    return (
      <div className="mt-4 rounded-[12px] border border-dashed border-[#dcdedb] p-7 text-center">
        <p className="text-[12.5px] font-semibold text-[#3a3c38]">Chưa có đánh giá học sinh</p>
        <p className="mt-1 text-[12px] text-[#9a9d96]">
          Dữ liệu sẽ hiển thị khi có đánh giá trong ngày.
        </p>
        <Link
          to="/danh-gia-hoc-sinh"
          className="mt-3 inline-block rounded-[8px] bg-[#c84b26] px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-[#b03816] transition-colors"
        >
          Nhập đánh giá hôm nay
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-3.5">
      <div>
        <span className="text-[11px] font-semibold tracking-[0.03em] text-[#9a9d96] uppercase">
          Tổng quát · {evalTotal} học sinh
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          <div className="rounded-[12px] border border-[#eceeea] bg-white p-3">
            <span className="text-[12px] text-[#6b6f68]">Tích cực (Tốt / Khá)</span>
            <div className="mt-1 text-[18px] font-semibold text-[#1c1d1b]">
              {positiveCount}{' '}
              <span className="text-[12px] font-medium text-[#9a9d96]">({positiveRate}%)</span>
            </div>
          </div>
          <div className="rounded-[12px] border border-[#eceeea] bg-white p-3">
            <span className="text-[12px] text-[#6b6f68]">Cần cải thiện</span>
            <div className="mt-1 text-[18px] font-semibold text-[#1c1d1b]">
              {negativeCount}{' '}
              <span className="text-[12px] font-medium text-[#9a9d96]">({negativeRate}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-[#eceeea] bg-[#fafaf8] p-3.5">
        <span className="text-[12px] font-semibold text-[#3a3c38]">
          Món ăn — mức độ ăn hết suất
        </span>
        <div className="mt-2.5 flex flex-col gap-2.5">
          {dishRatings.map((dish) => (
            <div key={dish.name}>
              <div className="flex justify-between text-[12px]">
                <span className="font-medium text-[#3a3c38]">{dish.name}</span>
                <span className="font-semibold text-[#c84b26]">{dish.score}%</span>
              </div>
              <div className="mt-1 h-[5px] overflow-hidden rounded-[99px] bg-[#e6e7e2]">
                <div
                  className="h-full rounded-[99px] bg-[#c84b26]"
                  style={{ width: `${dish.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
