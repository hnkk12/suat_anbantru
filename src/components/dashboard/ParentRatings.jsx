import { useState, useMemo } from 'react'
import DashboardEmptyState from './DashboardEmptyState'
import { formatDateVN } from '../../utils/dateUtils'

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

  // Tính điểm trung bình & phân bố
  const total = dateSpecificEvaluations.length
  const avgRating =
    total > 0
      ? (
          dateSpecificEvaluations.reduce((sum, item) => sum + (item.rating || 5), 0) / total
        ).toFixed(1)
      : '0.0'

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
      <DashboardEmptyState
        isError
        onRetry={onRetry}
        title="Không thể tải đánh giá phụ huynh"
        description="Đã xảy ra lỗi khi lấy phản hồi từ cổng phụ huynh."
      />
    )
  }

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
      </div>
    )
  }

  if (dateSpecificEvaluations.length === 0) {
    return (
      <DashboardEmptyState
        title="Chưa có đánh giá phụ huynh"
        description="Phụ huynh chưa gửi ý kiến đánh giá cho ngày này."
      />
    )
  }

  return (
    <div className="space-y-3.5">
      {/* 1. Header điểm trung bình + Nút Xuất Excel */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shadow-2xs">
            <span className="text-xl font-extrabold">{avgRating}</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-amber-500 font-bold text-sm tracking-wider">
                {'★'.repeat(Math.round(Number(avgRating)))}
                {'☆'.repeat(5 - Math.round(Number(avgRating)))}
              </span>
              <span className="ml-1 text-xs font-bold text-slate-900">{avgRating}/5.0</span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 font-medium">
              Dựa trên <span className="font-semibold text-slate-700">{total}</span> lượt phản hồi phụ huynh
            </p>
          </div>
        </div>

        {/* Nút Xuất Excel */}
        <button
          type="button"
          onClick={handleExportExcel}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-emerald-700"
        >
          Xuất Excel
        </button>
      </div>

      {/* 2. Bộ lọc sao */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-2">
        {STAR_FILTERS.map((star) => {
          const isActive = selectedStar === star
          return (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedStar(star)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 font-semibold text-white shadow-2xs'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {star}
            </button>
          )
        })}
      </div>

      {/* 3. Danh sách đánh giá phụ huynh */}
      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-white p-3 text-xs shadow-2xs transition-colors hover:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.phuHuynh}</span>
                  <span className="text-slate-400 text-[11px]">
                    {' '}• Phụ huynh bé {item.hocSinh} ({item.lop})
                  </span>
                </div>
                <div className="text-amber-500 font-medium text-xs tracking-wider">
                  {'★'.repeat(item.rating || 5)}
                  {'☆'.repeat(5 - (item.rating || 5))}
                </div>
              </div>
              <p className="mt-1.5 text-slate-600 leading-relaxed">{item.noiDung}</p>
              <div className="mt-1.5 text-[10px] text-slate-400">
                {formatDateVN(item.ngay)}
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-xs text-slate-400 italic">
            Không tìm thấy đánh giá nào ở mức này.
          </p>
        )}
      </div>
    </div>
  )
}
