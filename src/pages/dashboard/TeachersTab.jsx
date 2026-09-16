import { useState } from 'react'
import { Plus, Pencil, Trash2, Download, Upload, CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Field'

const emptyForm = { hoTen: '', email: '', sdt: '', lop: '', trangThai: 'Đang hoạt động' }

export default function TeachersTab() {
  const { teachers, addTeacher, updateTeacher, removeTeacher, classes } = useApp()
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

  function openEdit(t) {
    setEditingId(t.id)
    setForm(t)
    setModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.hoTen.trim()) return
    if (editingId) {
      updateTeacher(editingId, form)
      showToast('Đã cập nhật thông tin tài khoản giáo viên.')
    } else {
      addTeacher(form)
      showToast('Đã thêm tài khoản giáo viên mới.')
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
          Tổng <span className="font-semibold text-[#1c1d1b]">{teachers.length}</span> tài khoản giáo viên
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const headers = ['Họ và tên', 'Email', 'Số điện thoại', 'Lớp phụ trách', 'Trạng thái (Đang hoạt động / Tạm nghỉ)']
              const blob = new Blob(['\uFEFF' + headers.join(',')], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'mau_nhap_giao_vien.csv'
              a.click()
              showToast('Đã tải mẫu nhập tài khoản giáo viên.')
            }}
            title="Tải file mẫu Excel"
          >
            <Download size={14} /> Tải mẫu
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => showToast('Mở hộp thoại chọn file Excel danh sách giáo viên.')}
            title="Import danh sách tài khoản từ file Excel"
          >
            <Upload size={14} /> Import TK
          </Button>

          <Button onClick={openAdd} size="sm">
            <Plus size={15} /> Thêm tài khoản
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#fafaf8]">
                <th className="w-12 border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  #
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Họ và tên
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Email
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Số điện thoại
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Lớp phụ trách
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Trạng thái
                </th>
                <th className="border-b border-[#eceeea] px-4 py-3 text-right text-[11.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, idx) => (
                <tr
                  key={t.id}
                  className="border-b border-[#eef0ec] transition-colors hover:bg-[#fafaf8]"
                >
                  <td className="px-4 py-3 text-[#9a9d96]">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1c1d1b]">{t.hoTen}</td>
                  <td className="px-4 py-3 text-[#57605a]">{t.email}</td>
                  <td className="px-4 py-3 text-[#57605a]">{t.sdt}</td>
                  <td className="px-4 py-3 text-[#57605a]">{t.lop || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-[7px] px-2.5 py-1 text-[12px] font-semibold ${
                        t.trangThai === 'Đang hoạt động'
                          ? 'bg-[#fdf2ee] text-[#c84b26]'
                          : 'bg-[#f2f3ee] text-[#57605a]'
                      }`}
                    >
                      {t.trangThai}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        title="Chỉnh sửa"
                        className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          removeTeacher(t.id)
                          showToast('Đã xóa tài khoản giáo viên.')
                        }}
                        title="Xóa"
                        className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[13px] text-[#9a9d96]">
                    Chưa có tài khoản giáo viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Sửa tài khoản giáo viên' : 'Thêm tài khoản giáo viên'}
        footer={
          <>
            <Button variant="neutral" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              {editingId ? 'Lưu thay đổi' : 'Thêm tài khoản'}
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
            placeholder="Ví dụ: Nguyễn Văn An"
          />
          <Input
            type="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="an.nguyen@truongtest.edu.vn"
          />
          <Input
            label="Số điện thoại"
            value={form.sdt}
            onChange={(e) => setForm({ ...form, sdt: e.target.value })}
            placeholder="0987654321"
          />
          <Select
            label="Lớp phụ trách"
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
          <Select
            label="Trạng thái"
            value={form.trangThai}
            onChange={(e) => setForm({ ...form, trangThai: e.target.value })}
          >
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </Select>
        </form>
      </Modal>
    </div>
  )
}
