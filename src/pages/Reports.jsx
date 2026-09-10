import { useState } from 'react'
import { BedDouble, CircleDollarSign, Pencil, Percent, Plus, Trash2, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Select } from '../components/ui/Field'
const emptyForm = { totalStudents: '', boardingStudents: '', mealPrice: '' }
const money = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`
const ratio = (record) => record?.totalStudents > 0 ? (record.boardingStudents / record.totalStudents) * 100 : 0
const ratioLabel = (record) => `${ratio(record).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`

function ReportForm({ form, setForm, errors }) {
  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))
  return <div className="grid gap-4 sm:grid-cols-2">
    <div><Input label="Số học sinh" type="number" min="0" step="1" value={form.totalStudents} onChange={(e) => update('totalStudents', e.target.value)} placeholder="Ví dụ: 1000" /><p className="mt-1 text-xs text-rose-600">{errors.totalStudents}</p></div>
    <div><Input label="Số học sinh bán trú" type="number" min="0" step="1" value={form.boardingStudents} onChange={(e) => update('boardingStudents', e.target.value)} placeholder="Ví dụ: 500" /><p className="mt-1 text-xs text-rose-600">{errors.boardingStudents}</p></div>
    <div className="sm:col-span-2"><label className="flex flex-col gap-1 text-sm"><span className="text-xs font-medium text-gray-500">Tiền bán trú / 1 học sinh / ngày</span><div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-100"><input type="number" min="0" value={form.mealPrice} onChange={(e) => update('mealPrice', e.target.value)} placeholder="Ví dụ: 35000" className="min-w-0 flex-1 px-3 py-2 text-sm outline-none" /><span className="border-l border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">đ</span></div></label><p className="mt-1 text-xs text-rose-600">{errors.mealPrice}</p></div>
  </div>
}

export default function Reports() {
  const { schoolYear, setSchoolYear, schoolYears } = useApp()
  const [reports, setReports] = useLocalStorageState('boarding_reports', [])
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const filteredReports = reports.filter((report) => report.schoolYear === schoolYear)
  const currentReport = filteredReports[0]

  function validate() {
    const next = {}; const total = Number(form.totalStudents); const boarding = Number(form.boardingStudents); const price = Number(form.mealPrice)
    if (form.totalStudents === '' || !Number.isInteger(total) || total < 0) next.totalStudents = 'Vui lòng nhập số nguyên không âm.'
    if (form.boardingStudents === '' || !Number.isInteger(boarding) || boarding < 0) next.boardingStudents = 'Vui lòng nhập số nguyên không âm.'
    else if (boarding > total) next.boardingStudents = 'Số học sinh bán trú không được lớn hơn tổng số học sinh.'
    if (form.mealPrice === '' || Number.isNaN(price) || price < 0) next.mealPrice = 'Vui lòng nhập số tiền không âm.'
    setErrors(next); return Object.keys(next).length === 0
  }
  function openCreate() { setEditing('create'); setForm(emptyForm); setErrors({}) }
  function openEdit(report) { setEditing(report); setForm({ totalStudents: String(report.totalStudents), boardingStudents: String(report.boardingStudents), mealPrice: String(report.mealPrice) }); setErrors({}) }
  function saveReport() { if (!validate()) return; const payload = { totalStudents: Number(form.totalStudents), boardingStudents: Number(form.boardingStudents), mealPrice: Number(form.mealPrice), schoolYear }; if (editing === 'create') setReports((previous) => [...previous, { id: `report_${Date.now()}`, ...payload }]); else setReports((previous) => previous.map((report) => report.id === editing.id ? { ...report, ...payload } : report)); setEditing(null) }
  function deleteReport() { setReports((previous) => previous.filter((report) => report.id !== deleting.id)); setDeleting(null) }
  const kpis = [{ label: 'Tổng số học sinh', value: currentReport?.totalStudents ?? '—', Icon: Users }, { label: 'Học sinh bán trú', value: currentReport?.boardingStudents ?? '—', sub: currentReport ? `${currentReport.boardingStudents} / ${currentReport.totalStudents} học sinh` : undefined, Icon: BedDouble }, { label: 'Tỷ lệ bán trú', value: currentReport ? ratioLabel(currentReport) : '—', Icon: Percent }, { label: 'Tiền bán trú / HS / ngày', value: currentReport ? money(currentReport.mealPrice) : '—', Icon: CircleDollarSign }]

  return <div className="space-y-5">
    <PageHeader title="Báo cáo học sinh bán trú" description="Thống kê tình hình học sinh bán trú và đơn giá theo năm học" controls={<div className="flex flex-wrap items-end gap-2"><Select label="Năm học" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="min-w-40">{schoolYears.map((year) => <option key={year}>{year}</option>)}</Select><Button onClick={openCreate}><Plus size={16} />Thêm dữ liệu bán trú</Button></div>} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(({ label, value, sub, Icon }) => <section key={label} className="min-h-32 rounded-2xl border border-[#d9dad5] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5"><div className="flex items-center justify-between"><p className="text-sm font-medium text-[#666a65]">{label}</p><span className="rounded-xl bg-teal-50 p-2.5 text-teal-700"><Icon size={18} /></span></div><p className="mt-3 text-2xl font-semibold tracking-tight text-[#20211f]">{value}</p>{sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}</section>)}</div>
    <section className="overflow-hidden rounded-2xl border border-[#d9dad5] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e7e8e4] px-5 py-4"><div><h2 className="text-base font-semibold text-[#20211f]">Dữ liệu bán trú</h2><p className="mt-0.5 text-xs text-slate-500">Năm học {schoolYear}</p></div><Button size="sm" variant="secondary" onClick={openCreate}><Plus size={15} />Thêm mới</Button></div>{filteredReports.length === 0 ? <div className="px-4 py-12 text-center"><p className="text-sm font-medium text-slate-600">Chưa có dữ liệu báo cáo cho năm học này</p><Button size="sm" className="mt-3" onClick={openCreate}><Plus size={15} />Thêm dữ liệu</Button></div> : <div className="overflow-x-auto"><table className="min-w-[820px] w-full text-sm"><thead className="bg-[#fafaf8] text-left text-xs font-semibold uppercase tracking-wide text-slate-400"><tr>{['STT', 'Năm học', 'Tổng số học sinh', 'Học sinh bán trú', 'Tỷ lệ bán trú', 'Đơn giá / HS / ngày', 'Thao tác'].map((heading) => <th key={heading} className="px-5 py-3.5">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{filteredReports.map((report, index) => <tr key={report.id} className="text-slate-600"><td className="px-5 py-3.5">{index + 1}</td><td className="px-5 py-3.5 font-medium text-slate-900">{report.schoolYear}</td><td className="px-5 py-3.5">{report.totalStudents}</td><td className="px-5 py-3.5"><div>{report.boardingStudents}</div><div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-teal-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.min(100, ratio(report))}%` }} /></div></td><td className="px-5 py-3.5 font-medium text-teal-700">{ratioLabel(report)}</td><td className="px-5 py-3.5">{money(report.mealPrice)}</td><td className="px-5 py-3.5"><div className="flex gap-1"><Button size="sm" variant="ghost" title="Chỉnh sửa" aria-label="Chỉnh sửa" onClick={() => openEdit(report)}><Pencil size={15} /></Button><Button size="sm" variant="ghost" title="Xóa" aria-label="Xóa" className="text-rose-600 hover:bg-rose-50" onClick={() => setDeleting(report)}><Trash2 size={15} /></Button></div></td></tr>)}</tbody></table></div>}</section>
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing === 'create' ? 'Thêm dữ liệu bán trú' : 'Chỉnh sửa dữ liệu bán trú'} width="max-w-xl" footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button><Button onClick={saveReport}>Lưu</Button></>}><ReportForm form={form} setForm={setForm} errors={errors} /></Modal>
    <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Xóa dữ liệu báo cáo" footer={<><Button variant="secondary" onClick={() => setDeleting(null)}>Hủy</Button><Button variant="danger" onClick={deleteReport}>Xóa</Button></>}><p className="text-sm text-slate-600">Xóa dữ liệu năm học <strong>{deleting?.schoolYear}</strong>?</p></Modal>
  </div>
}
