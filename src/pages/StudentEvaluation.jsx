import { useState, useMemo } from 'react'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Select, Input, Textarea } from '../components/ui/Field'
import { EVAL_LEVELS } from '../data/mockData'

const emptyForm = {
  hocSinhId: '',
  ngay: new Date().toISOString().slice(0, 10),
  anUong: 'Tốt',
  nguNghi: 'Tốt',
  yThuc: 'Tốt',
  nhanXet: '',
}

export default function StudentEvaluation() {
  const { students, evaluations, addEvaluation, removeEvaluation } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [classFilter, setClassFilter] = useState('Tất cả')
  const [form, setForm] = useState(emptyForm)

  const studentMap = useMemo(() => {
    return new Map(students.map((s) => [s.id, s]))
  }, [students])

  const classList = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.lop).filter(Boolean)))
  }, [students])

  const filtered = useMemo(() => {
    return evaluations.filter((ev) => {
      const student = studentMap.get(ev.hocSinhId)
      const matchClass = classFilter === 'Tất cả' || student?.lop === classFilter
      return matchClass
    })
  }, [evaluations, classFilter, studentMap])

  const stats = useMemo(() => {
    const total = filtered.length
    if (total === 0) return { total: 0, anUongRate: '0%', nguNghiRate: '0%', yThucRate: '0%' }
    const anUongGood = filtered.filter((e) => e.anUong === 'Tốt' || e.anUong === 'Khá').length
    const nguNghiGood = filtered.filter((e) => e.nguNghi === 'Tốt').length
    const yThucGood = filtered.filter((e) => e.yThuc === 'Tốt').length
    return {
      total,
      anUongRate: `${Math.round((anUongGood / total) * 100)}%`,
      nguNghiRate: `${Math.round((nguNghiGood / total) * 100)}%`,
      yThucRate: `${Math.round((yThucGood / total) * 100)}%`,
    }
  }, [filtered])

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.hocSinhId) return
    addEvaluation(form)
    setForm(emptyForm)
    setModalOpen(false)
  }

  function getLevelBadge(level) {
    if (level === 'Tốt') {
      return 'bg-[#fdf2ee] text-[#c84b26]'
    }
    if (level === 'Khá') {
      return 'bg-sky-50 text-sky-800'
    }
    return 'bg-[#f2f3ee] text-[#57605a]'
  }

  return (
    <div className="flex flex-col gap-5.5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Đánh giá học sinh
          </h1>
          <p className="mt-1.5 max-w-[520px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Ghi nhận đánh giá hằng ngày về ăn uống, ngủ nghỉ và ý thức của từng học sinh trong giờ bán trú.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-1.5">
            <Calendar size={14} className="text-[#9a9d96]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none bg-transparent font-sans text-[12.5px] font-medium text-[#1c1d1b] outline-none"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] outline-none"
          >
            <option value="Tất cả">Tất cả lớp</option>
            {classList.map((c) => (
              <option key={c} value={c}>
                Lớp {c}
              </option>
            ))}
          </select>

          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={15} /> Thêm đánh giá
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards matching template */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex min-h-[105px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
          <span className="text-[12.5px] font-medium text-[#6b6f68]">Tổng lượt đánh giá</span>
          <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            {stats.total}
          </span>
        </div>

        <div className="flex min-h-[105px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
          <span className="text-[12.5px] font-medium text-[#6b6f68]">Ăn uống tích cực</span>
          <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#c84b26]">
            {stats.anUongRate}
          </span>
        </div>

        <div className="flex min-h-[105px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
          <span className="text-[12.5px] font-medium text-[#6b6f68]">Ngủ nghỉ tốt</span>
          <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#c84b26]">
            {stats.nguNghiRate}
          </span>
        </div>

        <div className="flex min-h-[105px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
          <span className="text-[12.5px] font-medium text-[#6b6f68]">Nề nếp / Ý thức tốt</span>
          <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#c84b26]">
            {stats.yThucRate}
          </span>
        </div>
      </div>

      {/* Evaluations Table matching template */}
      <div className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#fafaf8]">
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Ngày
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Học sinh
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Lớp
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Ăn uống
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Ngủ nghỉ
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Ý thức
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Nhận xét
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-right text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => {
                const s = studentMap.get(ev.hocSinhId)
                return (
                  <tr
                    key={ev.id}
                    className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                  >
                    <td className="px-4 py-3 text-[#57605a]">{ev.ngay}</td>
                    <td className="px-4 py-3 font-medium text-[#1c1d1b]">
                      {s?.hoTen || 'Học sinh'}
                    </td>
                    <td className="px-4 py-3 text-[#57605a]">{s?.lop || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-[7px] px-2.5 py-1 text-[12px] font-semibold ${getLevelBadge(
                          ev.anUong
                        )}`}
                      >
                        {ev.anUong}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-[7px] px-2.5 py-1 text-[12px] font-semibold ${getLevelBadge(
                          ev.nguNghi
                        )}`}
                      >
                        {ev.nguNghi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-[7px] px-2.5 py-1 text-[12px] font-semibold ${getLevelBadge(
                          ev.yThuc
                        )}`}
                      >
                        {ev.yThuc}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3 text-[#57605a] truncate">
                      {ev.nhanXet || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeEvaluation(ev.id)}
                        title="Xóa đánh giá"
                        className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[13px] text-[#9a9d96]">
                    Chưa có lượt đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Evaluation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thêm đánh giá học sinh"
        footer={
          <>
            <Button variant="neutral" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Lưu đánh giá</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Select
              label="Học sinh *"
              value={form.hocSinhId}
              onChange={(e) => setForm({ ...form, hocSinhId: e.target.value })}
              required
            >
              <option value="">-- Chọn học sinh --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.hoTen} ({s.lop})
                </option>
              ))}
            </Select>
          </div>

          <Input
            type="date"
            label="Ngày đánh giá"
            value={form.ngay}
            onChange={(e) => setForm({ ...form, ngay: e.target.value })}
          />

          <Select
            label="Ăn uống"
            value={form.anUong}
            onChange={(e) => setForm({ ...form, anUong: e.target.value })}
          >
            {EVAL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>

          <Select
            label="Ngủ nghỉ"
            value={form.nguNghi}
            onChange={(e) => setForm({ ...form, nguNghi: e.target.value })}
          >
            {EVAL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>

          <Select
            label="Ý thức / Kỷ luật"
            value={form.yThuc}
            onChange={(e) => setForm({ ...form, yThuc: e.target.value })}
          >
            {EVAL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>

          <div className="sm:col-span-2">
            <Textarea
              label="Nhận xét của giáo viên"
              rows={3}
              value={form.nhanXet}
              onChange={(e) => setForm({ ...form, nhanXet: e.target.value })}
              placeholder="Ghi chú thêm về bữa ăn, khẩu phần ăn..."
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
