import { useState } from 'react'
import { Plus, Pencil, Trash2, Upload, Download, CheckCircle2 } from 'lucide-react'
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
  const [toast, setToast] = useState(null)

  function showToast(text) {
    setToast(text)
    setTimeout(() => setToast(null), 2500)
  }

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
    if (editingId) {
      updateClass(editingId, payload)
      showToast('Đã lưu thay đổi thông tin lớp học.')
    } else {
      addClass(payload)
      showToast('Đã thêm lớp học mới thành công.')
    }
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-3.5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-[#c84b26] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in-50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-[#6b6f68]">
          Tổng <span className="font-semibold text-[#1c1d1b]">{classes.length}</span> lớp học
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => showToast('Mở hộp thoại chọn file Excel danh sách lớp học.')}
            title="Import danh sách lớp học từ file Excel"
          >
            <Upload size={14} /> Import LH
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const headers = ['Tên lớp', 'Khối', 'Giáo viên chủ nhiệm', 'Sĩ số']
              const blob = new Blob(['\uFEFF' + headers.join(',')], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'mau_nhap_lop_hoc.csv'
              a.click()
              showToast('Đã tải mẫu nhập lớp học.')
            }}
            title="Tải file mẫu Excel lớp học"
          >
            <Download size={14} /> Tải mẫu
          </Button>

          <Button onClick={openAdd} size="sm">
            <Plus size={15} /> Thêm lớp học
          </Button>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs transition-all hover:border-[#cfd1cb]"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  {c.khoi || 'Khối lớp'}
                </span>
                <h4 className="mt-0.5 text-[18px] font-semibold text-[#1c1d1b]">{c.name}</h4>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
                  title="Sửa lớp học"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeClass(c.id)
                    showToast('Đã xóa lớp học.')
                  }}
                  className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                  title="Xóa lớp học"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4 border-t border-[#f1f2ee] pt-3 text-[12.5px] text-[#57605a]">
              <p>
                Giáo viên chủ nhiệm:{' '}
                <span className="font-semibold text-[#1c1d1b]">{c.giaoVien || 'Chưa phân công'}</span>
              </p>
              <p className="mt-1">
                Sĩ số:{' '}
                <span className="font-semibold text-[#1c1d1b]">{c.siSo || 0} học sinh</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa lớp học' : 'Thêm lớp học mới'}
        footer={
          <>
            <Button variant="neutral" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Lưu thay đổi' : 'Thêm lớp học'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Tên lớp *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Ví dụ: 1A"
          />
          <Input
            label="Khối"
            value={form.khoi}
            onChange={(e) => setForm({ ...form, khoi: e.target.value })}
            placeholder="Ví dụ: Khối 1"
          />
          <Input
            label="Giáo viên chủ nhiệm"
            value={form.giaoVien}
            onChange={(e) => setForm({ ...form, giaoVien: e.target.value })}
            placeholder="Họ tên giáo viên"
          />
          <Input
            type="number"
            min="0"
            label="Sĩ số"
            value={form.siSo}
            onChange={(e) => setForm({ ...form, siSo: e.target.value })}
            placeholder="30"
          />
        </form>
      </Modal>
    </div>
  )
}
