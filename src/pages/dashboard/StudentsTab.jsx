import { useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Hiển thị <span className="font-semibold text-gray-700">{filtered.length}</span> / {students.length} học sinh
        </p>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Thêm học sinh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Họ và tên', 'Lớp', 'Ngày sinh', 'Phụ huynh', 'SĐT', 'Trạng thái bán trú', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s, idx) => (
              <tr key={s.id} className="hover:bg-gray-50">
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
                    <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600">
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
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                  Không tìm thấy học sinh phù hợp.
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
