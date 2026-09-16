import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import OverviewStats from '../components/dashboard/OverviewStats'
import AttendanceSummary from '../components/dashboard/AttendanceSummary'
import TodayMenu from '../components/dashboard/TodayMenu'
import { getDayOfWeekName } from '../utils/dateUtils'
import StudentRatings from '../components/dashboard/StudentRatings'
import ParentRatings from '../components/dashboard/ParentRatings'

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

  const [activeRatingsTab, setActiveRatingsTab] = useState('hoc-sinh')

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
    <div className="flex flex-col gap-7">
      {/* 1. Header trang Tổng quan */}
      <DashboardHeader
        userName="Nam"
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* 2. 4 KPI Cards */}
      <OverviewStats
        totalStudents={stats.tongHocSinh}
        boardingStudents={stats.banTru}
        mealPrice={mealPrice}
      />

      {/* 3. Điểm danh bán trú */}
      <AttendanceSummary
        date={selectedDate}
        total={stats.tongHocSinh}
        boarding={stats.banTru}
        nonBoarding={stats.khongBanTru}
        sleepOnly={stats.chiNgu}
      />

      {/* 4. Grid 2 cột: 5fr / 7fr (Thực đơn hôm nay / Đánh giá) */}
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        {/* Cột trái (5/12): Thực đơn hôm nay */}
        <div className="flex flex-col lg:col-span-5">
          <TodayMenu date={selectedDate} menu={menu} />
        </div>

        {/* Cột phải (7/12): Đánh giá học sinh / phụ huynh */}
        <div className="flex flex-col lg:col-span-7">
          <div className="flex flex-1 flex-col rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
            {/* Tabs Header */}
            <div className="flex gap-5 border-b border-[#eceeea]">
              <button
                type="button"
                onClick={() => setActiveRatingsTab('hoc-sinh')}
                className={`cursor-pointer pb-2.5 text-[13px] font-sans transition-colors ${
                  activeRatingsTab === 'hoc-sinh'
                    ? 'border-b-2 border-[#c84b26] font-semibold text-[#1c1d1b]'
                    : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
                }`}
              >
                Đánh giá học sinh
              </button>

              <button
                type="button"
                onClick={() => setActiveRatingsTab('phu-huynh')}
                className={`cursor-pointer pb-2.5 text-[13px] font-sans transition-colors ${
                  activeRatingsTab === 'phu-huynh'
                    ? 'border-b-2 border-[#c84b26] font-semibold text-[#1c1d1b]'
                    : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
                }`}
              >
                Đánh giá phụ huynh
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {activeRatingsTab === 'hoc-sinh' && (
                <StudentRatings
                  date={selectedDate}
                  evaluations={evaluations}
                  todayMenuDishes={todayMenuDishes}
                />
              )}

              {activeRatingsTab === 'phu-huynh' && (
                <ParentRatings
                  date={selectedDate}
                  evaluations={parentEvaluations}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
