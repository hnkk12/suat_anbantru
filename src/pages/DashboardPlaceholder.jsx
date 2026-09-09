import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import SetupProgress from '../components/dashboard/SetupProgress'
import OverviewStats from '../components/dashboard/OverviewStats'
import AttendanceSummary from '../components/dashboard/AttendanceSummary'
import TodayMenu from '../components/dashboard/TodayMenu'
import { getDayOfWeekName } from '../utils/dateUtils'
import StudentRatings from '../components/dashboard/StudentRatings'
import ParentRatings from '../components/dashboard/ParentRatings'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardPlaceholder() {
  const {
    stats,
    selectedDate,
    setSelectedDate,
    menu,
    evaluations,
    parentEvaluations = [],
    mealPrice = 35000,
  } = useApp()

  // State chuyển đổi Tab đánh giá
  const [activeRatingsTab, setActiveRatingsTab] = useState('hoc-sinh')

  // Trạng thái tải / lỗi giả lập
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Handler thử lại khi lỗi
  const handleRetry = () => {
    setLoading(true)
    setHasError(false)
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }

  // Lấy danh sách các món ăn trong ngày từ thực đơn hiện tại
  const todayMenuDishes = useMemo(() => {
    const dayName = getDayOfWeekName(selectedDate)
    const dayMenu = menu ? menu[dayName] : null
    if (!dayMenu) return []

    const dishes = []
    Object.values(dayMenu).forEach((mealStr) => {
      if (typeof mealStr === 'string') {
        mealStr.split(',').forEach((d) => {
          const trimmed = d.trim()
          if (trimmed) dishes.push(trimmed)
        })
      }
    })
    return dishes
  }, [menu, selectedDate])

  return (
    <div className="space-y-6">
      {/* 1. Header trang Tổng quan */}
      <DashboardHeader
        userName="Nam"
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onResetToday={() => setSelectedDate('2026-09-09')}
      />

      {/* 1.5. Tiến độ thiết lập hệ thống (kiểu Payroll setup progress) */}
      <SetupProgress />

      {/* Thông báo lỗi nếu toàn trang gặp sự cố kết nối */}
      {hasError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs text-rose-800 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối mạng.</span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1 font-bold underline hover:text-rose-900"
          >
            <RefreshCw size={13} />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* 2. Khối KPI tổng quan (4 Card) */}
      <OverviewStats
        totalStudents={stats.tongHocSinh}
        boardingStudents={stats.banTru}
        mealPrice={mealPrice}
        loading={loading}
        error={hasError}
        onRetry={handleRetry}
      />

      {/* 3. Khối thống kê điểm danh bán trú (3 Card) */}
      <AttendanceSummary
        date={selectedDate}
        total={stats.tongHocSinh}
        boarding={stats.banTru}
        nonBoarding={stats.khongBanTru}
        sleepOnly={stats.chiNgu}
        loading={loading}
        error={hasError}
        onRetry={handleRetry}
      />

      {/* 4. Layout 2 cột: Cột trái (Thực đơn hôm nay ~45%) | Cột phải (Đánh giá ~55%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Cột trái (5/12 ~ 42-45%): Thực đơn hôm nay */}
        <div className="lg:col-span-5 flex flex-col">
          <TodayMenu
            date={selectedDate}
            menu={menu}
            loading={loading}
            error={hasError}
            onRetry={handleRetry}
          />
        </div>

        {/* Cột phải (7/12 ~ 55-58%): Khối Đánh giá (Tabs: Đánh giá học sinh | Đánh giá phụ huynh) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex flex-1 flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div>
              {/* Tab Navigation Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80">
                <div className="flex gap-4 sm:gap-6">
                  {/* Tab 1: Đánh giá học sinh */}
                  <button
                    type="button"
                    onClick={() => setActiveRatingsTab('hoc-sinh')}
                    className={`relative pb-3 text-xs sm:text-sm transition-colors ${
                      activeRatingsTab === 'hoc-sinh'
                        ? 'font-semibold text-gray-900 border-b-2 border-pink-600'
                        : 'font-medium text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Đánh giá học sinh</span>
                  </button>

                  {/* Tab 2: Đánh giá phụ huynh */}
                  <button
                    type="button"
                    onClick={() => setActiveRatingsTab('phu-huynh')}
                    className={`relative pb-3 text-xs sm:text-sm transition-colors ${
                      activeRatingsTab === 'phu-huynh'
                        ? 'font-semibold text-gray-900 border-b-2 border-pink-600'
                        : 'font-medium text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Đánh giá phụ huynh</span>
                  </button>
                </div>

                <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
                  Phản hồi bán trú
                </span>
              </div>

              {/* Tab Content Body */}
              <div className="mt-4">
                {activeRatingsTab === 'hoc-sinh' && (
                  <StudentRatings
                    date={selectedDate}
                    evaluations={evaluations}
                    todayMenuDishes={todayMenuDishes}
                    loading={loading}
                    error={hasError}
                    onRetry={handleRetry}
                  />
                )}

                {activeRatingsTab === 'phu-huynh' && (
                  <ParentRatings
                    date={selectedDate}
                    evaluations={parentEvaluations}
                    loading={loading}
                    error={hasError}
                    onRetry={handleRetry}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
