import { useState, useMemo } from 'react'
import { formatDateVN } from '../../utils/dateUtils'
import { AlertCircle, RefreshCw } from 'lucide-react'

const STAR_FILTERS = ['Tất cả', '5★', '4★', '3★', '2★', '1★']

export default function ParentRatings({
  date,
  evaluations = [],
  loading = false,
  error = false,
  onRetry,
}) {
  const [selectedStar, setSelectedStar] = useState('Tất cả')

  // Lọc đánh giá theo ngày nếu có, hoặc danh sách đánh giá phụ huynh tổng thể
  const dateSpecificEvaluations = useMemo(() => {
    const matching = evaluations.filter((e) => e.ngay === date)
    return matching.length > 0 ? matching : evaluations
  }, [evaluations, date])

  // Lọc theo filter sao
  const filtered = useMemo(() => {
    if (selectedStar === 'Tất cả') return dateSpecificEvaluations
    const starNum = parseInt(selectedStar, 10)
    return dateSpecificEvaluations.filter((e) => e.rating === starNum)
  }, [dateSpecificEvaluations, selectedStar])

  // Tính điểm trung bình
  const total = dateSpecificEvaluations.length
  const avgRatingNum =
    total > 0
      ? dateSpecificEvaluations.reduce((sum, item) => sum + (item.rating || 5), 0) / total
      : 0
  const avg = avgRatingNum.toFixed(1)
  const stars =
    '★'.repeat(Math.round(avgRatingNum)) + '☆'.repeat(5 - Math.round(avgRatingNum))

  // Xử lý xuất Excel / CSV
  const handleExportExcel = () => {
    if (filtered.length === 0) {
      alert('Không có dữ liệu đánh giá để xuất.')
      return
    }

    const headers = ['Họ tên phụ huynh', 'Học sinh', 'Lớp', 'Ngày', 'Số sao', 'Nội dung nhận xét']
    const rows = filtered.map((item) => [
      `"${item.phuHuynh || 'Phụ huynh'}"`,
      `"${item.hocSinh || '—'}"`,
      `"${item.lop || '—'}"`,
      `"${item.ngay || date}"`,
      `"${item.rating || 5} sao"`,
      `"${(item.noiDung || '').replace(/"/g, '""')}"`,
    ])

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `danh_gia_phu_huynh_${date || 'export'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="mt-4 rounded-[12px] border border-rose-200 bg-rose-50/50 p-4 text-center text-[12.5px] text-rose-700">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>Không thể tải đánh giá phụ huynh.</span>
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

  if (loading) {
    return (
      <div className="mt-4 space-y-3">
        <div className="h-16 animate-pulse rounded-[12px] bg-[#fafaf8]" />
        <div className="h-28 animate-pulse rounded-[12px] bg-[#fafaf8]" />
      </div>
    )
  }

  if (dateSpecificEvaluations.length === 0) {
    return (
      <div className="mt-4 rounded-[12px] border border-dashed border-[#dcdedb] p-7 text-center">
        <p className="text-[12.5px] font-semibold text-[#3a3c38]">Chưa có đánh giá phụ huynh</p>
        <p className="mt-1 text-[12px] text-[#9a9d96]">Phụ huynh chưa gửi ý kiến đánh giá cho ngày này.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {/* Average rating box + Export button */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#eceeea] bg-[#fafaf8] p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#e3e4df] bg-white text-[16px] font-bold text-[#1c1d1b]">
            {avg}
          </div>
          <div>
            <span className="text-[13px] font-semibold text-[#c84b26]">{stars}</span>
            <p className="mt-0.5 text-[12px] text-[#9a9d96]">
              {total} phản hồi phụ huynh
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          className="rounded-[8px] border border-[#f5c6b8] bg-[#fdf2ee] px-3 py-1.5 text-[12px] font-semibold text-[#c84b26] shadow-xs hover:bg-[#fae4db] hover:border-[#c84b26] hover:text-[#962e10] transition-colors cursor-pointer"
        >
          Xuất Excel
        </button>
      </div>

      {/* Star filters */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#eceeea] pb-2">
        {STAR_FILTERS.map((star) => {
          const isActive = selectedStar === star
          return (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedStar(star)}
              className={`rounded-[7px] px-2.5 py-1 text-[12px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#c84b26] font-semibold text-white'
                  : 'bg-[#f2f3ee] text-[#57605a] hover:bg-[#e8eae3]'
              }`}
            >
              {star}
            </button>
          )
        })}
      </div>

      {/* Reviews list */}
      <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const itemStars = '★'.repeat(item.rating || 5) + '☆'.repeat(5 - (item.rating || 5))
            return (
              <div
                key={item.id || item.phuHuynh}
                className="rounded-[12px] border border-[#eceeea] bg-white p-3 text-[12px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1c1d1b]">
                    {item.phuHuynh}{' '}
                    <span className="font-normal text-[#9a9d96]">
                      · bé {item.hocSinh} ({item.lop})
                    </span>
                  </span>
                  <span className="font-semibold text-[#c84b26]">{itemStars}</span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#57605a]">
                  {item.noiDung}
                </p>
                <span className="mt-1 block text-[11px] text-[#9a9d96]">
                  {formatDateVN(item.ngay || date)}
                </span>
              </div>
            )
          })
        ) : (
          <p className="py-6 text-center text-[12.5px] italic text-[#9a9d96]">
            Không tìm thấy đánh giá nào ở mức lọc này.
          </p>
        )}
      </div>
    </div>
  )
}
