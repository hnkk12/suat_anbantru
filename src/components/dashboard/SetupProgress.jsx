import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function SetupProgress() {
  const { managerInfo, companies, menu, students, evaluations } = useApp()

  const steps = [
    { label: 'Thông tin người phụ trách', done: Boolean(managerInfo?.hoTen && managerInfo?.sdt), to: '/nguoi-phu-trach' },
    { label: 'Công ty cung cấp suất ăn', done: companies.length > 0, to: '/cong-ty-suat-an' },
    { label: 'Thực đơn trong tuần', done: Object.values(menu || {}).some((day) => Object.values(day).some((v) => v && v.trim())), to: '/thuc-don' },
    { label: 'Danh sách học sinh', done: students.length > 0, to: '/hoc-sinh' },
    { label: 'Đánh giá học sinh hằng ngày', done: evaluations.length > 0, to: '/danh-gia-hoc-sinh' },
  ]

  const doneCount = steps.filter((s) => s.done).length
  const percent = Math.round((doneCount / steps.length) * 100)
  const nextStep = steps.find((s) => !s.done)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">Tiến độ thiết lập hệ thống</h2>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-teal-800 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold text-gray-500">{percent}%</span>
      </div>

      <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-gray-900">Hoàn tất thiết lập bán trú</p>
          <p className="text-xs text-gray-500">
            {nextStep ? `Việc tiếp theo: ${nextStep.label}` : 'Bạn đã hoàn tất tất cả các bước thiết lập'}
          </p>
        </div>
        <Link
          to={nextStep ? nextStep.to : '/hoc-sinh'}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-950"
        >
          Tiếp tục
        </Link>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Gói hiện tại: <span className="font-medium text-gray-700">Bán trú Simple</span>.{' '}
        <Link to="/phan-quyen-menu" className="font-medium text-teal-800 hover:underline">Xem gói & phân quyền</Link>
      </p>
    </div>
  )
}
