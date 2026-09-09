import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input } from '../../components/ui/Field'

const emptyForm = { name: '', khoi: '', giaoVien: '', siSo: '' }

export default function ClassesTab() {
  const { classes, addClass, updateClass, removeClass } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(cls) {
    setEditingId(cls.id)
    setForm(cls)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const payload = { ...form, siSo: Number(form.siSo) || 0 }
    if (editingId) updateClass(editingId, payload)
    else addClass(payload)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Tổng <span className="font-semibold text-gray-700">{classes.length}</span> lớp học
        </p>
        <Button onClick={openAdd}>
          <Plus size={16} />
          Thêm lớp học
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{c.khoi}</p>
                <h4 className="mt-1 text-lg font-bold text-gray-900">{c.name}</h4>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600">
                  <Pencil size={15} />
                </button>
                <button onClick={() => removeClass(c.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>Giáo viên chủ nhiệm: <span className="font-medium text-gray-700">{c.giaoVien}</span></p>
              <p>Sĩ số: <span className="font-medium text-gray-700">{c.siSo} học sinh</span></p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa lớp học' : 'Thêm lớp học mới'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Lưu thay đổi' : 'Thêm lớp học'}</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Tên lớp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Khối" value={form.khoi} onChange={(e) => setForm({ ...form, khoi: e.target.value })} />
          <Input label="Giáo viên chủ nhiệm" value={form.giaoVien} onChange={(e) => setForm({ ...form, giaoVien: e.target.value })} />
          <Input type="number" min="0" label="Sĩ số" value={form.siSo} onChange={(e) => setForm({ ...form, siSo: e.target.value })} />
        </form>
      </Modal>
    </div>
  )
}
