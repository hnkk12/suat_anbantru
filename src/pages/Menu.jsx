import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardList, Download, ImagePlus, Pencil, Trash2, Upload, UtensilsCrossed } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { Input, Select } from '../components/ui/Field'
import { DAYS_OF_WEEK, MEALS } from '../data/mockData'
import { getDayOfWeekName, formatDateVN } from '../utils/dateUtils'
import StudentRatings from '../components/dashboard/StudentRatings'
import ParentRatings from '../components/dashboard/ParentRatings'

function MealContent({ value }) {
  if (!value) return <span className="text-xs italic text-slate-400">Chưa có thực đơn</span>
  const dishes = value.split(',').map((dish) => dish.trim()).filter(Boolean)
  return <div className="space-y-1">{dishes.map((dish, index) => <p key={index} className="text-xs leading-relaxed text-slate-600">• {dish}</p>)}</div>
}

export default function Menu() {
  const { menu, updateMenuCell, menuDetails, updateMenuDetails, selectedDate, setSelectedDate, evaluations, parentEvaluations } = useApp()
  const [view, setView] = useState('week')
  const [ratingsTab, setRatingsTab] = useState('students')
  const [weekOffset, setWeekOffset] = useState(0)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ngay: '', meal: '', kcal: '', image: null, dishes: [] })
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function openEdit(day, meal) {
    setEditing({ day, meal })
    const detail = menuDetails[`${day}::${meal}`]
    setForm({ ngay: selectedDate, meal, kcal: detail?.kcal || '', image: detail?.image || null, dishes: detail?.dishes || String(menu[day]?.[meal] ?? '').split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ name, type: '', expiryDate: '' })) })
    setFormErrors({})
  }
  function save(event) {
    event.preventDefault()
    const errors = {}
    if (form.kcal !== '' && (!Number.isFinite(Number(form.kcal)) || Number(form.kcal) < 0)) errors.kcal = 'Kcal phải là số không âm.'
    form.dishes.forEach((dish, index) => { if (!dish.name.trim()) errors[`dish-${index}`] = 'Vui lòng nhập tên món ăn.' })
    if (Object.keys(errors).length) return setFormErrors(errors)
    setSaving(true)
    const targetDay = DAYS_OF_WEEK.includes(getDayOfWeekName(form.ngay)) ? getDayOfWeekName(form.ngay) : editing.day
    updateMenuCell(targetDay, form.meal, form.dishes.map((dish) => dish.name.trim()).filter(Boolean).join(', '))
    updateMenuDetails(targetDay, form.meal, { kcal: form.kcal, image: form.image, dishes: form.dishes })
    setSaving(false)
    setEditing(null)
  }
  const selectedDay = DAYS_OF_WEEK.includes(getDayOfWeekName(selectedDate)) ? getDayOfWeekName(selectedDate) : DAYS_OF_WEEK[0]
  const weekLabel = useMemo(() => {
    const base = new Date(`${selectedDate}T00:00:00`)
    const monday = new Date(base)
    monday.setDate(base.getDate() - ((base.getDay() + 6) % 7) + weekOffset * 7)
    const friday = new Date(monday)
    friday.setDate(monday.getDate() + 4)
    const format = (date) => date.toLocaleDateString('vi-VN')
    return `${format(monday)} - ${format(friday)}`
  }, [selectedDate, weekOffset])
  const todayDishes = useMemo(() => Object.values(menu[selectedDay] || {}).flatMap((meal) => String(meal || '').split(',').map((dish) => dish.trim()).filter(Boolean)), [menu, selectedDay])

  function moveDay(step) {
    const date = new Date(`${selectedDate}T00:00:00`)
    date.setDate(date.getDate() + step)
    setSelectedDate(date.toISOString().slice(0, 10))
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Quản trị" eyebrowIcon={ClipboardList} title="Thực đơn" description="Theo dõi và cập nhật thực đơn bán trú. Chọn một bữa ăn để chỉnh sửa món ăn." />

      <div className="flex flex-wrap items-center gap-2">
        {[1, 2, 3, 4].map((template) => <Button key={template} size="sm" variant="secondary" disabled title="Chức năng tải mẫu sẽ được kết nối sau"><Download size={14} /> Tải mẫu {template}</Button>)}
        <Button size="sm" variant="secondary" disabled title="Chức năng xuất Excel sẽ được kết nối sau"><Download size={14} /> Xuất Excel tuần</Button>
        <Button size="sm" disabled title="Chức năng nhập dữ liệu sẽ được kết nối sau"><Upload size={14} /> Nhập dữ liệu</Button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex w-fit rounded-xl bg-slate-100 p-1">
            <button onClick={() => setView('day')} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${view === 'day' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Theo ngày</button>
            <button onClick={() => setView('week')} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${view === 'week' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Theo tuần</button>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><UtensilsCrossed size={15} className="text-emerald-600" />{MEALS.length} buổi ăn · {DAYS_OF_WEEK.length} ngày trong tuần</span>
        </div>
      </section>

      {view === 'day' ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5">
            <button onClick={() => moveDay(-1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><ChevronLeft size={18} /></button>
            <div className="text-center"><p className="text-xs font-medium text-slate-400">Thực đơn theo ngày</p><h2 className="mt-1 text-base font-bold text-slate-900">{selectedDay}, {formatDateVN(selectedDate)}</h2></div>
            <button onClick={() => moveDay(1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><ChevronRight size={18} /></button>
          </div>
          <div className="px-4 pt-4 sm:px-5"><label className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">Chọn ngày <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="bg-transparent outline-none" /></label></div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
            {MEALS.map((meal) => <article key={meal} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4"><div className="flex items-center justify-between gap-2"><div><p className="text-sm font-bold text-slate-800">{meal}</p><p className="mt-0.5 text-[11px] text-slate-400">{(menu[selectedDay]?.[meal] || '').split(',').filter(Boolean).length} món</p></div><button onClick={() => openEdit(selectedDay, meal)} title="Cập nhật thực đơn" className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"><Pencil size={15} /></button></div><div className="mt-4 border-t border-slate-200 pt-3"><MealContent value={menu[selectedDay]?.[meal]} /></div></article>)}
          </div>
          <div className="border-t border-slate-100 p-4 sm:p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-bold text-slate-900">Đánh giá bữa ăn</h2><p className="text-xs text-slate-500">Phản hồi trong ngày {formatDateVN(selectedDate)}</p></div><div className="rounded-xl bg-slate-100 p-1"><button onClick={() => setRatingsTab('students')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${ratingsTab === 'students' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Học sinh</button><button onClick={() => setRatingsTab('parents')} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${ratingsTab === 'parents' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}>Phụ huynh</button></div></div>{ratingsTab === 'students' ? <StudentRatings date={selectedDate} evaluations={evaluations} todayMenuDishes={todayDishes} /> : <ParentRatings date={selectedDate} evaluations={parentEvaluations} />}</div>
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex items-center gap-2"><CalendarDays size={18} className="text-emerald-600" /><div><h2 className="text-base font-bold text-slate-900">Thực đơn tuần</h2><p className="text-xs text-slate-500">{weekLabel} · Nhấn vào thực đơn để cập nhật</p></div></div><div className="flex gap-1"><Button size="sm" variant="secondary" onClick={() => setWeekOffset((value) => value - 1)}>Tuần trước</Button><Button size="sm" variant="secondary" onClick={() => setWeekOffset(0)}>Tuần này</Button><Button size="sm" variant="secondary" onClick={() => setWeekOffset((value) => value + 1)}>Tuần sau</Button></div></div>
          <div className="overflow-x-auto"><table className="min-w-[800px] w-full divide-y divide-slate-100 text-sm"><thead className="bg-slate-50"><tr><th className="w-32 px-4 py-3 text-left text-xs font-semibold text-slate-400">Bữa ăn</th>{DAYS_OF_WEEK.map((day) => <th key={day} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{day}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{MEALS.map((meal) => <tr key={meal}><td className="whitespace-nowrap bg-slate-50/40 px-4 py-4 text-xs font-bold text-slate-700">{meal}</td>{DAYS_OF_WEEK.map((day) => <td key={day} className="min-w-40 p-2 align-top"><button onClick={() => openEdit(day, meal)} className="group min-h-20 w-full rounded-xl border border-transparent p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"><div className="flex justify-between gap-2"><MealContent value={menu[day]?.[meal]} /><Pencil size={13} className="shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-emerald-700" /></div></button></td>)}</tr>)}</tbody></table></div>
        </section>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing ? `Cập nhật ${editing.meal} · ${editing.day}` : ''} width="max-w-3xl" footer={<><Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>Hủy</Button><Button onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thực đơn'}</Button></>}>
        <form onSubmit={save} className="space-y-5"><section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><h3 className="text-sm font-bold text-slate-800">Thông tin thực đơn</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><Input type="date" label="Ngày áp dụng" value={form.ngay} onChange={(event) => setForm({ ...form, ngay: event.target.value })} /><Select label="Buổi" value={form.meal} onChange={(event) => setForm({ ...form, meal: event.target.value })}>{MEALS.map((meal) => <option key={meal}>{meal}</option>)}</Select><div><Input type="number" step="0.1" min="0" label="Tổng kcal dự tính" placeholder="259.5" value={form.kcal} onChange={(event) => setForm({ ...form, kcal: event.target.value })} />{formErrors.kcal && <p className="mt-1 text-xs text-rose-600">{formErrors.kcal}</p>}</div></div><label className="mt-4 flex flex-col gap-1 text-sm"><span className="text-xs font-medium text-slate-500">Hình ảnh thực đơn</span><span className="flex items-center gap-2"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; setForm({ ...form, image: file ? { name: file.name, size: file.size, type: file.type } : null }) }} className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-emerald-700" />{form.image && <button type="button" onClick={() => setForm({ ...form, image: null })} className="text-xs font-medium text-rose-600">Xóa</button>}</span>{form.image && <span className="flex items-center gap-1 text-xs text-emerald-700"><ImagePlus size={13} />{form.image.name}</span>}</label></section><section><div className="flex items-center justify-between"><div><h3 className="text-sm font-bold text-slate-800">Danh sách món ăn</h3><p className="text-xs text-slate-500">{form.dishes.length} món</p></div><Button size="sm" variant="secondary" onClick={() => setForm({ ...form, dishes: [...form.dishes, { name: '', type: '', expiryDate: '' }] })}>+ Thêm món ăn</Button></div><div className="mt-3 space-y-2">{form.dishes.map((dish, index) => <div key={index} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]"><Input label="Tên món ăn" value={dish.name} onChange={(event) => setForm({ ...form, dishes: form.dishes.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })} /><Select label="Loại món" value={dish.type} onChange={(event) => setForm({ ...form, dishes: form.dishes.map((item, i) => i === index ? { ...item, type: event.target.value } : item) })}><option value="">Chưa phân loại</option><option>Món chính</option><option>Canh</option><option>Tráng miệng</option></Select><Input type="date" label="Ngày hết hạn" value={dish.expiryDate} onChange={(event) => setForm({ ...form, dishes: form.dishes.map((item, i) => i === index ? { ...item, expiryDate: event.target.value } : item) })} /><button type="button" onClick={() => setForm({ ...form, dishes: form.dishes.filter((_, i) => i !== index) })} className="self-end rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={16} /></button>{formErrors[`dish-${index}`] && <p className="text-xs text-rose-600 sm:col-span-3">{formErrors[`dish-${index}`]}</p>}</div>)}</div>{form.dishes.length === 0 && <p className="mt-3 text-xs text-slate-400">Chưa có món ăn. Bấm “Thêm món ăn” để bắt đầu.</p>}</section></form>
      </Modal>
    </div>
  )
}
