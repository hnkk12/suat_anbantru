import { useState, useMemo } from 'react'
import {
  BedDouble,
  CircleDollarSign,
  Pencil,
  Percent,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input } from '../components/ui/Field'

const emptyForm = { totalStudents: '', boardingStudents: '', mealPrice: '' }
const money = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`
const ratio = (record) =>
  record?.totalStudents > 0 ? (record.boardingStudents / record.totalStudents) * 100 : 0
const ratioLabel = (record) =>
  `${ratio(record).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`

const WEEK_DATA = [
  { day: 'Thứ 2', suat: 32 },
  { day: 'Thứ 3', suat: 35 },
  { day: 'Thứ 4', suat: 34 },
  { day: 'Thứ 5', suat: 33 },
  { day: 'Thứ 6', suat: 35 },
]

function ReportForm({ form, setForm, errors }) {
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Input
          label="Tổng số học sinh *"
          type="number"
          min="0"
          step="1"
          value={form.totalStudents}
          onChange={(e) => update('totalStudents', e.target.value)}
          placeholder="Ví dụ: 1000"
        />
        {errors.totalStudents && (
          <p className="mt-1 text-xs text-rose-600">{errors.totalStudents}</p>
        )}
      </div>
      <div>
        <Input
          label="Số học sinh bán trú *"
          type="number"
          min="0"
          step="1"
          value={form.boardingStudents}
          onChange={(e) => update('boardingStudents', e.target.value)}
          placeholder="Ví dụ: 500"
        />
        {errors.boardingStudents && (
          <p className="mt-1 text-xs text-rose-600">{errors.boardingStudents}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <Input
          label="Tiền ăn bán trú / 1 học sinh / ngày *"
          type="number"
          min="0"
          value={form.mealPrice}
          onChange={(e) => update('mealPrice', e.target.value)}
          placeholder="Ví dụ: 35000"
        />
        {errors.mealPrice && (
          <p className="mt-1 text-xs text-rose-600">{errors.mealPrice}</p>
        )}
      </div>
    </div>
  )
}

export default function Reports() {
  const { schoolYear, setSchoolYear, schoolYears, students, classes } = useApp()
  const [reports, setReports] = useLocalStorageState('boarding_reports', [
    {
      id: 'rep_1',
      schoolYear: '2026 - 2027',
      totalStudents: 120,
      boardingStudents: 85,
      mealPrice: 35000,
    },
    {
      id: 'rep_2',
      schoolYear: '2025 - 2026',
      totalStudents: 115,
      boardingStudents: 78,
      mealPrice: 32000,
    },
  ])
  const [activeTab, setActiveTab] = useState('nam-hoc') // 'nam-hoc' | 'theo-lop' | 'suat-an'
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const filteredReports = reports.filter((report) => report.schoolYear === schoolYear)
  const currentReport = filteredReports[0] || reports[0]

  const classBreakdown = useMemo(() => {
    return classes.map((c) => {
      const classStudents = students.filter((s) => s.lop === c.name)
      const boardingCount = classStudents.filter((s) => s.trangThai === 'Bán trú').length
      const rate = classStudents.length > 0 ? (boardingCount / classStudents.length) * 100 : 0
      return {
        ...c,
        siSo: classStudents.length,
        banTru: boardingCount,
        rate: rate.toFixed(1),
      }
    })
  }, [classes, students])

  function validate() {
    const next = {}
    const total = Number(form.totalStudents)
    const boarding = Number(form.boardingStudents)
    const price = Number(form.mealPrice)
    if (form.totalStudents === '' || !Number.isInteger(total) || total < 0) {
      next.totalStudents = 'Vui lòng nhập số nguyên không âm.'
    }
    if (form.boardingStudents === '' || !Number.isInteger(boarding) || boarding < 0) {
      next.boardingStudents = 'Vui lòng nhập số nguyên không âm.'
    } else if (boarding > total) {
      next.boardingStudents = 'Số học sinh bán trú không được lớn hơn tổng số.'
    }
    if (form.mealPrice === '' || Number.isNaN(price) || price < 0) {
      next.mealPrice = 'Vui lòng nhập số tiền không âm.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function openCreate() {
    setEditing('create')
    setForm(emptyForm)
    setErrors({})
  }

  function openEdit(report) {
    setEditing(report)
    setForm({
      totalStudents: String(report.totalStudents),
      boardingStudents: String(report.boardingStudents),
      mealPrice: String(report.mealPrice),
    })
    setErrors({})
  }

  function saveReport() {
    if (!validate()) return
    const payload = {
      totalStudents: Number(form.totalStudents),
      boardingStudents: Number(form.boardingStudents),
      mealPrice: Number(form.mealPrice),
      schoolYear,
    }
    if (editing === 'create') {
      setReports((prev) => [...prev, { id: `report_${Date.now()}`, ...payload }])
    } else {
      setReports((prev) =>
        prev.map((report) => (report.id === editing.id ? { ...report, ...payload } : report))
      )
    }
    setEditing(null)
  }

  function deleteReport() {
    setReports((prev) => prev.filter((report) => report.id !== deleting.id))
    setDeleting(null)
  }

  const maxSuat = Math.max(...WEEK_DATA.map((d) => d.suat), 1)

  const kpis = [
    { label: 'Tổng số học sinh', value: currentReport?.totalStudents ?? '—', Icon: Users },
    {
      label: 'Học sinh bán trú',
      value: currentReport?.boardingStudents ?? '—',
      sub: currentReport
        ? `${currentReport.boardingStudents} / ${currentReport.totalStudents} học sinh`
        : undefined,
      Icon: BedDouble,
    },
    {
      label: 'Tỷ lệ bán trú',
      value: currentReport ? ratioLabel(currentReport) : '—',
      Icon: Percent,
    },
    {
      label: 'Tiền bán trú / HS / ngày',
      value: currentReport ? money(currentReport.mealPrice) : '—',
      Icon: CircleDollarSign,
    },
  ]

  return (
    <div className="flex flex-col gap-5.5">
      {/* Header matching template */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Báo cáo thống kê
          </h1>
          <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Thống kê tình hình học sinh bán trú, suất ăn và phân bổ theo từng năm học.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] outline-none"
          >
            {schoolYears.map((year) => (
              <option key={year} value={year}>
                Năm học {year}
              </option>
            ))}
          </select>
          <Button onClick={openCreate} size="sm">
            <Plus size={15} /> Thêm dữ liệu năm học
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards matching template */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, sub }) => (
          <div
            key={label}
            className="flex min-h-[118px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs"
          >
            <span className="text-[12.5px] font-medium text-[#6b6f68]">{label}</span>
            <div>
              <span className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
                {value}
              </span>
              {sub && <p className="mt-1 text-[11.5px] text-[#9a9d96]">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Clean Tabs matching template */}
      <div className="rounded-[16px] border border-[#e3e4df] bg-white shadow-xs overflow-hidden">
        <div className="flex items-center gap-6 border-b border-[#eceeea] px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('nam-hoc')}
            className={`pb-3 text-[13px] font-sans transition-colors ${
              activeTab === 'nam-hoc'
                ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
            }`}
          >
            Dữ liệu bán trú theo năm
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('theo-lop')}
            className={`pb-3 text-[13px] font-sans transition-colors ${
              activeTab === 'theo-lop'
                ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
            }`}
          >
            Thống kê theo lớp ({classes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('suat-an')}
            className={`pb-3 text-[13px] font-sans transition-colors ${
              activeTab === 'suat-an'
                ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
            }`}
          >
            Biểu đồ suất ăn tuần
          </button>
        </div>

        <div className="p-5">
          {/* Tab 1: Annual Boarding Records */}
          {activeTab === 'nam-hoc' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="bg-[#fafaf8]">
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      STT
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Năm học
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Tổng số học sinh
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Học sinh bán trú
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Tỷ lệ bán trú
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Đơn giá / HS / ngày
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-right text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, idx) => (
                    <tr
                      key={report.id}
                      className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                    >
                      <td className="px-4 py-3 text-[#57605a]">{idx + 1}</td>
                      <td className="px-4 py-3 font-semibold text-[#1c1d1b]">
                        {report.schoolYear}
                      </td>
                      <td className="px-4 py-3 text-[#57605a]">{report.totalStudents}</td>
                      <td className="px-4 py-3 text-[#57605a]">
                        <div>{report.boardingStudents}</div>
                        <div className="mt-1 h-[5px] w-28 overflow-hidden rounded-[99px] bg-[#eceeea]">
                          <div
                            className="h-full rounded-[99px] bg-[#c84b26]"
                            style={{ width: `${Math.min(100, ratio(report))}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#c84b26]">
                        {ratioLabel(report)}
                      </td>
                      <td className="px-4 py-3 text-[#57605a]">{money(report.mealPrice)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(report)}
                            title="Chỉnh sửa"
                            className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(report)}
                            title="Xóa"
                            className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Class Breakdown */}
          {activeTab === 'theo-lop' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="bg-[#fafaf8]">
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Lớp
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Giáo viên chủ nhiệm
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Sĩ số
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Bán trú
                    </th>
                    <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                      Tỷ lệ bán trú
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classBreakdown.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                    >
                      <td className="px-4 py-3 font-semibold text-[#1c1d1b]">{c.name}</td>
                      <td className="px-4 py-3 text-[#57605a]">{c.teacher || 'Chưa phân công'}</td>
                      <td className="px-4 py-3 text-[#57605a]">{c.siSo} học sinh</td>
                      <td className="px-4 py-3 text-[#57605a]">{c.banTru} học sinh</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#c84b26] min-w-[42px]">{c.rate}%</span>
                          <div className="h-[5px] w-24 overflow-hidden rounded-[99px] bg-[#eceeea]">
                            <div
                              className="h-full rounded-[99px] bg-[#c84b26]"
                              style={{ width: `${c.rate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Weekly Meal Chart */}
          {activeTab === 'suat-an' && (
            <div className="space-y-4 py-2">
              <p className="text-[13px] font-semibold text-[#1c1d1b]">
                Số suất bán trú theo các ngày trong tuần
              </p>
              <div className="flex items-end gap-6 sm:gap-12 pt-6 pb-2 justify-center max-w-xl mx-auto">
                {WEEK_DATA.map((d) => (
                  <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[12px] font-semibold text-[#c84b26]">{d.suat}</span>
                    <div className="flex h-36 w-full items-end justify-center">
                      <div
                        className="w-10 rounded-t-[8px] bg-[#c84b26] transition-all"
                        style={{ height: `${(d.suat / maxSuat) * 100}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-medium text-[#57605a]">{d.day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === 'create' ? 'Thêm dữ liệu bán trú năm học' : 'Chỉnh sửa dữ liệu năm học'}
        footer={
          <>
            <Button variant="neutral" onClick={() => setEditing(null)}>
              Hủy
            </Button>
            <Button onClick={saveReport}>Lưu dữ liệu</Button>
          </>
        }
      >
        <ReportForm form={form} setForm={setForm} errors={errors} />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Xóa dữ liệu báo cáo"
        width="max-w-md"
        footer={
          <>
            <Button variant="neutral" onClick={() => setDeleting(null)}>
              Hủy
            </Button>
            <Button variant="danger" onClick={deleteReport}>
              Xóa
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-[#57605a]">
          Bạn có chắc chắn muốn xóa dữ liệu năm học{' '}
          <strong className="text-[#1c1d1b]">{deleting?.schoolYear}</strong>?
        </p>
      </Modal>
    </div>
  )
}
