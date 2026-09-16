import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Field'
import { DAYS_OF_WEEK, MEALS } from '../data/mockData'
import { getDayOfWeekName, formatDateVN } from '../utils/dateUtils'
import StudentRatings from '../components/dashboard/StudentRatings'
import ParentRatings from '../components/dashboard/ParentRatings'

function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function MenuCalendar({ selectedDate, setSelectedDate, menu }) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(`${selectedDate}T00:00:00`))
  const today = toIsoDate(new Date())
  const year = visibleMonth.getFullYear()
  const month = visibleMonth.getMonth()
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const datesWithMenu = useMemo(() => {
    const dates = new Map()
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = toIsoDate(new Date(year, month, day))
      const mealCount = MEALS.filter((meal) => Boolean(menu[getDayOfWeekName(date)]?.[meal])).length
      if (mealCount > 0) dates.set(date, mealCount)
    }
    return dates
  }, [year, month, daysInMonth, menu])

  const monthLabel = visibleMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  return (
    <div className="w-full rounded-[16px] border border-[#e3e4df] bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between pb-2">
        <p className="text-[13.5px] font-semibold capitalize text-[#1c1d1b]">{monthLabel}</p>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Tháng trước"
            onClick={() => setVisibleMonth(new Date(year, month - 1, 1))}
            className="rounded-[6px] p-1 text-[#8a8d86] hover:bg-[#f2f3ee] hover:text-[#c84b26]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Tháng sau"
            onClick={() => setVisibleMonth(new Date(year, month + 1, 1))}
            className="rounded-[6px] p-1 text-[#8a8d86] hover:bg-[#f2f3ee] hover:text-[#c84b26]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((lbl) => (
          <span key={lbl} className="py-0.5 text-[10.5px] font-semibold text-[#9a9d96]">
            {lbl}
          </span>
        ))}
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <span key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const date = toIsoDate(new Date(year, month, day))
          const meals = datesWithMenu.get(date) || 0
          const selected = date === selectedDate
          const isToday = date === today

          let style = 'text-[#57605a] hover:bg-[#f7f8f6]'
          if (selected) {
            style = 'bg-[#c84b26] text-white font-semibold'
          } else if (isToday) {
            style = 'border border-[#c84b26] text-[#c84b26] font-semibold'
          }

          return (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`relative flex h-8 w-8 items-center justify-center justify-self-center rounded-[8px] text-[12px] transition-colors ${style}`}
            >
              {day}
              {meals > 0 && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#c84b26]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Menu() {
  const {
    menu,
    updateMenuCell,
    menuDetails,
    updateMenuDetails,
    selectedDate,
    setSelectedDate,
    evaluations,
    parentEvaluations,
  } = useApp()

  const [viewMode, setViewMode] = useState('week')
  const [ratingsTab, setRatingsTab] = useState('students')
  const [editing, setEditing] = useState(null)
  const [toast, setToast] = useState(null)

  const [form, setForm] = useState({
    day: 'Thứ 2',
    meal: 'Bữa trưa',
    kcal: '',
    image: null,
    dishes: [{ name: '', type: 'Món chính', expiryDate: '' }],
  })

  function showToast(text) {
    setToast(text)
    setTimeout(() => setToast(null), 2500)
  }

  const selectedDay = DAYS_OF_WEEK.includes(getDayOfWeekName(selectedDate))
    ? getDayOfWeekName(selectedDate)
    : 'Thứ 2'

  function openEdit(day, meal) {
    setEditing({ day, meal })
    const key = `${day}::${meal}`
    const detail = menuDetails[key]
    const content = menu[day]?.[meal] || ''
    const dishesList = detail?.dishes?.length
      ? detail.dishes
      : content
      ? content.split(',').map((d) => ({ name: d.trim(), type: 'Món chính', expiryDate: '' }))
      : [{ name: '', type: 'Món chính', expiryDate: '' }]

    setForm({
      day,
      meal,
      kcal: detail?.kcal || '',
      image: detail?.image || null,
      dishes: dishesList,
    })
  }

  function handleSave(e) {
    e.preventDefault()
    if (!editing) return
    const dishNames = form.dishes.map((d) => d.name.trim()).filter(Boolean)
    updateMenuCell(form.day, form.meal, dishNames.join(', '))
    updateMenuDetails(form.day, form.meal, {
      kcal: form.kcal,
      image: form.image,
      dishes: form.dishes,
    })
    setEditing(null)
    showToast(`Đã cập nhật thực đơn ${form.meal} - ${form.day}.`)
  }

  function addDishRow() {
    setForm((prev) => ({
      ...prev,
      dishes: [...prev.dishes, { name: '', type: 'Món phụ', expiryDate: '' }],
    }))
  }

  function removeDishRow(index) {
    setForm((prev) => ({
      ...prev,
      dishes: prev.dishes.filter((_, i) => i !== index),
    }))
  }

  function updateDishRow(index, field, value) {
    setForm((prev) => ({
      ...prev,
      dishes: prev.dishes.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }))
  }

  function handleExportWeekExcel() {
    const headers = ['Ngày', 'Bữa sáng', 'Bữa trưa', 'Bữa xế']
    const rows = DAYS_OF_WEEK.map((day) => [
      day,
      `"${menu[day]?.['Bữa sáng'] || ''}"`,
      `"${menu[day]?.['Bữa trưa'] || ''}"`,
      `"${menu[day]?.['Bữa xế'] || ''}"`,
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thuc_don_tuan_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    showToast('Đã xuất file thực đơn tuần.')
  }

  const todayDishes = useMemo(() => {
    return Object.values(menu[selectedDay] || {}).flatMap((meal) =>
      String(meal || '')
        .split(',')
        .map((dish) => dish.trim())
        .filter(Boolean)
    )
  }, [menu, selectedDay])

  return (
    <div className="flex flex-col gap-5.5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-[#c84b26] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in-50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Thực đơn
          </h1>
          <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Theo dõi và cập nhật thực đơn bán trú. Nhấn vào từng bữa ăn để chỉnh sửa chi tiết.
          </p>
        </div>

        {/* View mode & week navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-[10px] border border-[#d5d7d0] bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                viewMode === 'week'
                  ? 'bg-[#fdf2ee] text-[#c84b26]'
                  : 'text-[#6b6f68] hover:text-[#1c1d1b]'
              }`}
            >
              Xem cả tuần
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                viewMode === 'day'
                  ? 'bg-[#fdf2ee] text-[#c84b26]'
                  : 'text-[#6b6f68] hover:text-[#1c1d1b]'
              }`}
            >
              Xem theo ngày
            </button>
          </div>
        </div>
      </div>

      {/* Quick Download Buttons from original project */}
      <div className="flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4].map((templateNum) => (
          <Button
            key={templateNum}
            size="sm"
            variant="secondary"
            onClick={() => showToast(`Đã tải mẫu thực đơn dinh dưỡng ${templateNum}.`)}
            title={`Tải mẫu thực đơn tiêu chuẩn ${templateNum}`}
          >
            <Download size={14} /> Tải mẫu {templateNum}
          </Button>
        ))}
        <Button
          size="sm"
          variant="primary"
          onClick={handleExportWeekExcel}
          title="Xuất bảng thực đơn tuần ra file Excel"
        >
          <FileSpreadsheet size={14} /> Xuất Excel tuần
        </Button>
      </div>

      {/* Content Layout */}
      {viewMode === 'week' ? (
        /* Weekly Table matching template full-width */
        <div className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="bg-[#fafaf8]">
                  <th className="w-24 border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                    Ngày
                  </th>
                      {MEALS.map((meal) => (
                        <th
                          key={meal}
                          className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]"
                        >
                          {meal}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => (
                      <tr
                        key={day}
                        className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                      >
                        <td className="px-4 py-3.5 font-semibold text-[#1c1d1b]">{day}</td>
                        {MEALS.map((meal) => {
                          const content = menu[day]?.[meal]
                          const detail = menuDetails[`${day}::${meal}`]
                          return (
                            <td
                              key={meal}
                              onClick={() => openEdit(day, meal)}
                              className="group cursor-pointer px-4 py-3.5 text-[#57605a] hover:bg-[#fdf2ee]/40"
                              title="Nhấn để chỉnh sửa bữa ăn"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="min-w-0">
                                  <span className="leading-relaxed">
                                    {content || <span className="text-[#9a9d96] italic">—</span>}
                                  </span>
                                  {detail?.kcal && (
                                    <span className="ml-1.5 inline-block rounded-[5px] border border-[#f5c6b8] bg-[#fdf2ee] px-1.5 py-0.2 text-[10.5px] font-semibold text-[#c85a3b]">
                                      {detail.kcal} kcal
                                    </span>
                                  )}
                                </div>
                                <Pencil
                                  size={13}
                                  className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 text-[#c84b26] transition-opacity"
                                />
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        ) : (
          /* Day View with Full Ratings & Nutritional Details + Calendar */
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <div className="rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#eceeea] pb-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1c1d1b]">
                      Thực đơn {selectedDay}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[#9a9d96]">
                      Ngày {formatDateVN(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {MEALS.map((meal) => {
                    const content = menu[selectedDay]?.[meal]
                    const detail = menuDetails[`${selectedDay}::${meal}`]
                    const dishes = content
                      ? content.split(',').map((d) => d.trim()).filter(Boolean)
                      : []

                    return (
                      <div
                        key={meal}
                        className="flex items-start justify-between rounded-[12px] border border-[#eceeea] bg-[#fafaf8] p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-[6px] border border-[#e3e4df] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#57605a]">
                              {meal}
                            </span>
                            {detail?.kcal && (
                              <span className="rounded-[6px] border border-[#f5c6b8] bg-[#fdf2ee] px-2 py-0.5 text-[11px] font-semibold text-[#c85a3b]">
                                {detail.kcal} kcal
                              </span>
                            )}
                          </div>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {dishes.length > 0 ? (
                              dishes.map((d, i) => (
                                <span
                                  key={i}
                                  className="rounded-[7px] border border-[#e6e7e2] bg-white px-2.5 py-1 text-[12.5px] text-[#3a3c38]"
                                >
                                  {d}
                                </span>
                              ))
                            ) : (
                              <span className="text-[12px] italic text-[#9a9d96]">
                                Chưa thiết lập món ăn
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(selectedDay, meal)}
                        >
                          <Pencil size={14} /> Sửa
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Day's Ratings Tabs */}
              <div className="rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
                <div className="flex gap-5 border-b border-[#eceeea]">
                  <button
                    type="button"
                    onClick={() => setRatingsTab('students')}
                    className={`cursor-pointer pb-2.5 text-[13px] font-sans transition-colors ${
                      ratingsTab === 'students'
                        ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                        : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
                    }`}
                  >
                    Đánh giá học sinh ngày này
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatingsTab('parents')}
                    className={`cursor-pointer pb-2.5 text-[13px] font-sans transition-colors ${
                      ratingsTab === 'parents'
                        ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                        : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
                    }`}
                  >
                    Đánh giá phụ huynh ngày này
                  </button>
                </div>

                <div>
                  {ratingsTab === 'students' && (
                    <StudentRatings
                      date={selectedDate}
                      evaluations={evaluations}
                      todayMenuDishes={todayDishes}
                    />
                  )}
                  {ratingsTab === 'parents' && (
                    <ParentRatings
                      date={selectedDate}
                      evaluations={parentEvaluations}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Calendar in day view (4 cols) */}
            <div className="lg:col-span-4">
              <MenuCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                menu={menu}
              />
            </div>
          </div>
        )}

      {/* Edit Meal Modal with Kcal, Dishes table, and Images */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Cập nhật ${form.meal} - ${form.day}` : ''}
        width="max-w-xl"
        footer={
          <>
            <Button variant="neutral" onClick={() => setEditing(null)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu thực đơn</Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Ngày"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>

            <Select
              label="Bữa ăn"
              value={form.meal}
              onChange={(e) => setForm({ ...form, meal: e.target.value })}
            >
              {MEALS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Năng lượng (Kcal)"
            type="number"
            value={form.kcal}
            onChange={(e) => setForm({ ...form, kcal: e.target.value })}
            placeholder="Ví dụ: 650"
          />

          {/* Dishes list */}
          <div>
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[12px] font-semibold text-[#57605a]">Danh sách món ăn</span>
              <button
                type="button"
                onClick={addDishRow}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#c84b26] hover:underline"
              >
                <Plus size={14} /> Thêm món
              </button>
            </div>

            <div className="space-y-2">
              {form.dishes.map((dish, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={dish.name}
                    onChange={(e) => updateDishRow(index, 'name', e.target.value)}
                    placeholder="Tên món ăn (Ví dụ: Thịt kho trứng)"
                    className="flex-1 rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#c84b26]"
                  />
                  <select
                    value={dish.type}
                    onChange={(e) => updateDishRow(index, 'type', e.target.value)}
                    className="w-32 rounded-[10px] border border-[#d5d7d0] bg-white px-2 py-2 text-[12.5px] outline-none"
                  >
                    <option value="Món chính">Món chính</option>
                    <option value="Món xào">Món xào</option>
                    <option value="Canh">Canh</option>
                    <option value="Tráng miệng">Tráng miệng</option>
                  </select>
                  {form.dishes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDishRow(index)}
                      className="rounded p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}
