import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardEmptyState({
  title = 'Chưa có dữ liệu',
  description = 'Dữ liệu sẽ hiển thị khi có cập nhật mới trong ngày.',
  actionLabel,
  onAction,
  isError = false,
  onRetry,
}) {
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-8 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertCircle size={20} />
        </div>
        <p className="mt-2 text-xs font-semibold text-rose-800">Không thể tải dữ liệu.</p>
        <p className="mt-1 max-w-xs text-xs text-rose-600 leading-relaxed">
          Đã có lỗi xảy ra trong quá trình truy xuất thông tin từ hệ thống.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-xs transition-colors hover:bg-rose-50"
          >
            <RefreshCw size={13} />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-8 text-center">
      <p className="text-xs font-bold text-slate-800">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-500 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-3 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-teal-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
