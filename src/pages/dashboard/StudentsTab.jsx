import { useMemo, useState } from 'react'
import { ArrowUpDown, CalendarCheck, Download, FileSpreadsheet, Filter, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { Input, Select } from '../../components/ui/Field'
import { BOARDING_STATUS } from '../../data/mockData'

const STATUS_TONE = {
  [BOARDING_STATUS.BAN_TRU]: 'green',
  [BOARDING_STATUS.KHONG_BAN_TRU]: 'gray',
  [BOARDING_STATUS.CHI_NGU]: 'amber',
}

const emptyForm = { hoTen: '', lop: '', ngaySinh: '', phuHuynh: '', sdt: '', trangThai: BOARDING_STATUS.BAN_TRU }

export default function StudentsTab() {
  const { students, addStudent, updateStudent, removeStudent, classes, searchTerm } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return students
    return students.filter((s) =>
      [s.hoTen, s.lop, s.sdt, s.phuHuynh].join(' ').toLowerCase().includes(term)
    )
  }, [students, searchTerm])

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
    if (editingId) updateStudent(editingId, form)
    else addStudent(form)
    setModalOpen(false)
  }
  const allSelected = filtered.length > 0 && filtered.every((student) => selectedIds.has(student.id))
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
      if (allSelected) filtered.forEach((student) => next.delete(student.id))
      else filtered.forEach((student) => next.add(student.id))
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-gray-500">
          Hiển thị <span className="font-semibold text-gray-700">{filtered.length}</span> / {students.length} học sinh
        </span>
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" disabled title="Chưa có service import"><Upload size={14} />Import HS</Button><Button size="sm" variant="secondary" disabled title="Chưa có service tải mẫu"><Download size={14} />Tải mẫu</Button><Button size="sm" variant="secondary" disabled title="Chưa có service export"><FileSpreadsheet size={14} />Xuất Excel</Button><Button size="sm" variant="secondary" disabled title="Chưa có service export"><FileSpreadsheet size={14} />Xuất Excel theo khoảng ngày</Button><Button onClick={openAdd}><Plus size={16} />Thêm học sinh</Button><Button size="sm" variant="secondary" disabled={!selectedIds.size} title="Chưa có flow điểm danh"><CalendarCheck size={14} />Điểm danh</Button><Button size="sm" variant="secondary" disabled title="Chưa có flow điểm danh tổng"><CalendarCheck size={14} />Điểm danh tổng</Button></div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 text-teal-800 focus:ring-teal-700" />
          Chọn tất cả
        </label>
        {selectedIds.size > 0 && <span className="text-xs font-semibold text-teal-700">Đã chọn {selectedIds.size} học sinh</span>}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Filter size={14} />
          Lọc
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['', '#', 'Họ và tên', 'Lớp', 'Ngày sinh', 'Phụ huynh', 'SĐT', 'Trạng thái bán trú', ''].map((h, idx) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                  {h ? (
                    <span className="inline-flex items-center gap-1">
                      {h}
                      {idx > 0 && idx < 7 && <ArrowUpDown size={12} className="text-gray-300" />}
                    </span>
                  ) : (
                    h
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleStudent(s.id)} className="h-4 w-4 rounded border-gray-300 text-teal-800 focus:ring-teal-700" /></td>
                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{s.hoTen}</td>
                <td className="px-4 py-3 text-gray-600">{s.lop}</td>
                <td className="px-4 py-3 text-gray-600">{s.ngaySinh}</td>
                <td className="px-4 py-3 text-gray-600">{s.phuHuynh}</td>
                <td className="px-4 py-3 text-gray-600">{s.sdt}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[s.trangThai] ?? 'gray'}>{s.trangThai}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-teal-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => removeStudent(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-16 text-center">
                  <p className="text-sm font-semibold text-gray-900">Không tìm thấy học sinh</p>
                  <p className="mt-1 text-sm text-gray-500">Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Lưu thay đổi' : 'Thêm học sinh'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Họ và tên" value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} required />
          <Select label="Lớp" value={form.lop} onChange={(e) => setForm({ ...form, lop: e.target.value })}>
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </Select>
          <Input type="date" label="Ngày sinh" value={form.ngaySinh} onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })} />
          <Select label="Trạng thái bán trú" value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}>
            {Object.values(BOARDING_STATUS).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
          <Input label="Phụ huynh" value={form.phuHuynh} onChange={(e) => setForm({ ...form, phuHuynh: e.target.value })} />
          <Input label="Số điện thoại" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
        </form>
      </Modal>
    </div>
  )
}
