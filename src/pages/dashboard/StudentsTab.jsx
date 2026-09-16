import { useMemo, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  CalendarCheck,
  Filter,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Field'
import { BOARDING_STATUS } from '../../data/mockData'

const emptyForm = {
  hoTen: '',
  lop: '',
  ngaySinh: '',
  phuHuynh: '',
  sdt: '',
  trangThai: BOARDING_STATUS.BAN_TRU,
}

export default function StudentsTab() {
  const { students, addStudent, updateStudent, removeStudent, classes, searchTerm } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState('all')
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(text) {
    setToast(text)
    setTimeout(() => setToast(null), 2500)
  }

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return students.filter((s) => {
      const matchText =
        !term ||
        [s.hoTen, s.lop, s.sdt, s.phuHuynh].some((v) => v?.toLowerCase().includes(term))
      const matchStatus = statusFilter === 'all' || s.trangThai === statusFilter
      return matchText && matchStatus
    })
  }, [students, searchTerm, statusFilter])

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(student) {
    setEditingId(student.id)
    setForm(student)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.hoTen.trim()) return
    if (editingId) {
      updateStudent(editingId, form)
      showToast('Đã cập nhật thông tin học sinh.')
    } else {
      addStudent(form)
      showToast('Đã thêm học sinh mới thành công.')
    }
    setModalOpen(false)
  }

  const allSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id))

  function toggleStudent(id) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (allSelected) filtered.forEach((s) => next.delete(s.id))
      else filtered.forEach((s) => next.add(s.id))
      return next
    })
  }

  function handleExportExcel() {
    if (filtered.length === 0) {
      alert('Không có dữ liệu học sinh để xuất file.')
      return
    }
    const headers = ['STT', 'Họ và tên', 'Lớp', 'Ngày sinh', 'Phụ huynh', 'Số điện thoại', 'Trạng thái']
    const rows = filtered.map((s, idx) => [
      idx + 1,
      `"${s.hoTen || ''}"`,
      `"${s.lop || ''}"`,
      `"${s.ngaySinh || ''}"`,
      `"${s.phuHuynh || ''}"`,
      `"${s.sdt || ''}"`,
      `"${s.trangThai || ''}"`,
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `danh_sach_hoc_sinh_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Đã xuất danh sách học sinh ra file Excel.')
  }

  function handleAttendance() {
    if (!selectedIds.size) return
    showToast(`Đã ghi nhận điểm danh cho ${selectedIds.size} học sinh.`)
  }

  function getStatusStyle(status) {
    if (status === 'Bán trú') {
      return 'bg-[#fdf2ee] text-[#c84b26]'
    }
    return 'bg-[#f2f3ee] text-[#57605a]'
  }

  return (
    <div className="flex flex-col gap-3.5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-[#c84b26] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in-50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-[#6b6f68]">
          Hiển thị <span className="font-semibold text-[#1c1d1b]">{filtered.length}</span> / {students.length} học sinh
        </span>

        {/* All buttons from the original project */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => showToast('Mở hộp thoại chọn file Excel danh sách học sinh.')}
            title="Nhập danh sách học sinh từ file Excel"
          >
            <Upload size={14} /> Import HS
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const templateHeaders = ['Họ và tên', 'Lớp', 'Ngày sinh (YYYY-MM-DD)', 'Phụ huynh', 'Số điện thoại', 'Trạng thái (Bán trú / Không bán trú)']
              const blob = new Blob(['\uFEFF' + templateHeaders.join(',')], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'mau_nhap_hoc_sinh.csv'
              a.click()
              showToast('Đã tải mẫu nhập học sinh.')
            }}
            title="Tải file mẫu Excel"
          >
            <Download size={14} /> Tải mẫu
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportExcel}
            title="Xuất file Excel toàn bộ danh sách"
          >
            <FileSpreadsheet size={14} /> Xuất Excel
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleExportExcel}
            title="Xuất danh sách học sinh theo khoảng ngày"
          >
            <FileSpreadsheet size={14} /> Xuất Excel theo khoảng ngày
          </Button>

          <Button onClick={openAdd} size="sm">
            <Plus size={15} /> Thêm học sinh
          </Button>

          <Button
            size="sm"
            variant="primary"
            disabled={!selectedIds.size}
            onClick={handleAttendance}
            title="Điểm danh các học sinh được chọn"
          >
            <CalendarCheck size={14} /> Điểm danh
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => showToast('Đã ghi nhận điểm danh tổng cho toàn trường.')}
            title="Điểm danh tổng"
          >
            <CalendarCheck size={14} /> Điểm danh tổng
          </Button>
        </div>
      </div>

      {/* Select All & Filter Bar */}
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[#57605a]">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 rounded border-[#d5d7d0] text-[#c84b26] focus:ring-[#c84b26]"
            />
            Chọn tất cả
          </label>
          {selectedIds.size > 0 && (
            <span className="text-[12px] font-semibold text-[#c84b26]">
              Đã chọn {selectedIds.size} học sinh
            </span>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-1.5 text-[12.5px] font-medium text-[#1c1d1b] shadow-xs hover:bg-[#fafaf8]"
          >
            <Filter size={13} />
            <span>Lọc{statusFilter !== 'all' ? `: ${statusFilter}` : ''}</span>
          </button>

          {filterMenuOpen && (
            <div className="absolute right-0 mt-1.5 z-20 w-48 rounded-[12px] border border-[#e3e4df] bg-white p-1.5 shadow-xl animate-in fade-in-50">
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all')
                  setFilterMenuOpen(false)
                }}
                className={`w-full rounded-[8px] px-3 py-1.5 text-left text-[12.5px] font-medium ${
                  statusFilter === 'all' ? 'bg-[#fdf2ee] text-[#c84b26] font-semibold' : 'text-[#57605a] hover:bg-[#fafaf8]'
                }`}
              >
                Tất cả trạng thái
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter(BOARDING_STATUS.BAN_TRU)
                  setFilterMenuOpen(false)
                }}
                className={`w-full rounded-[8px] px-3 py-1.5 text-left text-[12.5px] font-medium ${
                  statusFilter === BOARDING_STATUS.BAN_TRU ? 'bg-[#fdf2ee] text-[#c84b26] font-semibold' : 'text-[#57605a] hover:bg-[#fafaf8]'
                }`}
              >
                Bán trú
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter(BOARDING_STATUS.KHONG_BAN_TRU)
                  setFilterMenuOpen(false)
                }}
                className={`w-full rounded-[8px] px-3 py-1.5 text-left text-[12.5px] font-medium ${
                  statusFilter === BOARDING_STATUS.KHONG_BAN_TRU ? 'bg-[#fdf2ee] text-[#c84b26] font-semibold' : 'text-[#57605a] hover:bg-[#fafaf8]'
                }`}
              >
                Không bán trú
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter(BOARDING_STATUS.CHI_NGU)
                  setFilterMenuOpen(false)
                }}
                className={`w-full rounded-[8px] px-3 py-1.5 text-left text-[12.5px] font-medium ${
                  statusFilter === BOARDING_STATUS.CHI_NGU ? 'bg-[#fdf2ee] text-[#c84b26] font-semibold' : 'text-[#57605a] hover:bg-[#fafaf8]'
                }`}
              >
                Chỉ ngủ bán trú
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table matching template styling */}
      <div className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#fafaf8]">
                <th className="w-10 border-b border-[#eceeea] px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-[#d5d7d0] text-[#c84b26] focus:ring-[#c84b26]"
                  />
                </th>
                <th className="w-12 border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  #
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  <span className="inline-flex items-center gap-1">
                    Họ và tên <ArrowUpDown size={12} className="text-[#9a9d96]" />
                  </span>
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Lớp
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Ngày sinh
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Phụ huynh
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  SĐT
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Trạng thái bán trú
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-right text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                >
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleStudent(s.id)}
                      className="h-4 w-4 rounded border-[#d5d7d0] text-[#c84b26] focus:ring-[#c84b26]"
                    />
                  </td>
                  <td className="px-4 py-3 text-[#9a9d96]">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1c1d1b]">{s.hoTen}</td>
                  <td className="px-4 py-3 text-[#57605a]">{s.lop}</td>
                  <td className="px-4 py-3 text-[#57605a]">{s.ngaySinh}</td>
                  <td className="px-4 py-3 text-[#57605a]">{s.phuHuynh}</td>
                  <td className="px-4 py-3 text-[#57605a]">{s.sdt}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-[7px] px-2.5 py-1 text-[12px] font-semibold ${getStatusStyle(s.trangThai)}`}>
                      {s.trangThai}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        title="Chỉnh sửa"
                        className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStudent(s.id)}
                        title="Xóa"
                        className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[13px] text-[#9a9d96]">
                    Không tìm thấy học sinh phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
        footer={
          <>
            <Button variant="neutral" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Lưu thay đổi' : 'Thêm học sinh'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Họ và tên *"
            value={form.hoTen}
            onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
            required
          />
          <Select
            label="Lớp"
            value={form.lop}
            onChange={(e) => setForm({ ...form, lop: e.target.value })}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            label="Ngày sinh"
            value={form.ngaySinh}
            onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
          />
          <Select
            label="Trạng thái bán trú"
            value={form.trangThai}
            onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
          >
            {Object.values(BOARDING_STATUS).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
          <Input
            label="Phụ huynh"
            value={form.phuHuynh}
            onChange={(e) => setForm({ ...form, phuHuynh: e.target.value })}
          />
          <Input
            label="Số điện thoại"
            value={form.sdt}
            onChange={(e) => setForm({ ...form, sdt: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  )
}
