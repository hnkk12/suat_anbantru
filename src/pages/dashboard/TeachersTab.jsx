import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { Input, Select } from '../../components/ui/Field'

const emptyForm = { hoTen: '', email: '', sdt: '', lop: '', trangThai: 'Đang hoạt động' }

export default function TeachersTab() {
  const { teachers, addTeacher, updateTeacher, removeTeacher, classes } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(t) {
    setEditingId(t.id)
    setForm(t)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.hoTen.trim()) return
    if (editingId) updateTeacher(editingId, form)
    else addTeacher(form)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Tổng <span className="font-semibold text-gray-700">{teachers.length}</span> tài khoản giáo viên
        </p>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Thêm tài khoản
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Họ và tên', 'Email', 'SĐT', 'Lớp phụ trách', 'Trạng thái', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {teachers.map((t, idx) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{t.hoTen}</td>
                <td className="px-4 py-3 text-gray-600">{t.email}</td>
                <td className="px-4 py-3 text-gray-600">{t.sdt}</td>
                <td className="px-4 py-3 text-gray-600">{t.lop}</td>
                <td className="px-4 py-3">
                  <Badge tone={t.trangThai === 'Đang hoạt động' ? 'green' : 'gray'}>{t.trangThai}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-teal-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => removeTeacher(t.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa tài khoản giáo viên' : 'Thêm tài khoản giáo viên'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Lưu thay đổi' : 'Thêm tài khoản'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Họ và tên" value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} required />
          <Input type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Số điện thoại" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
          <Select label="Lớp phụ trách" value={form.lop} onChange={(e) => setForm({ ...form, lop: e.target.value })}>
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </Select>
          <Select label="Trạng thái" value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}>
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </Select>
        </form>
      </Modal>
    </div>
  )
}
