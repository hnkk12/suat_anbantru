import { useState } from 'react'
import { Building2, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Input, Select } from '../components/ui/Field'

const emptyForm = { ten: '', daiDien: '', sdt: '', diaChi: '', trangThai: 'Đang hợp tác' }

export default function CateringCompanies() {
  const { companies, addCompany, updateCompany, removeCompany } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.ten.trim()) return
    if (editingId) {
      updateCompany(editingId, form)
      setEditingId(null)
    } else {
      addCompany(form)
    }
    setForm(emptyForm)
  }

  function startEdit(c) {
    setEditingId(c.id)
    setForm(c)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản trị"
        eyebrowIcon={Building2}
        title="Công ty cung cấp suất ăn"
        description="Quản lý danh sách các đơn vị cung cấp suất ăn bán trú đang hợp tác với trường."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title={editingId ? 'Sửa thông tin công ty' : 'Thêm công ty mới'} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Tên công ty" value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} required />
            <Input label="Người đại diện" value={form.daiDien} onChange={(e) => setForm({ ...form, daiDien: e.target.value })} />
            <Input label="Số điện thoại" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
            <Input label="Địa chỉ" value={form.diaChi} onChange={(e) => setForm({ ...form, diaChi: e.target.value })} />
            <Select label="Trạng thái hợp đồng" value={form.trangThai} onChange={(e) => setForm({ ...form, trangThai: e.target.value })}>
              <option value="Đang hợp tác">Đang hợp tác</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
            </Select>
            <div className="flex gap-2">
              <Button type="submit" className="w-full">{editingId ? 'Lưu thay đổi' : 'Thêm công ty'}</Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card title="Danh sách công ty" description={`${companies.length} công ty`} className="lg:col-span-2">
          <div className="space-y-3">
            {companies.map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{c.ten}</p>
                    <Badge tone={c.trangThai === 'Đang hợp tác' ? 'green' : 'gray'}>{c.trangThai}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Đại diện: {c.daiDien} · {c.sdt}</p>
                  <p className="text-sm text-gray-400">{c.diaChi}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(c)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-green-600">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => removeCompany(c.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {companies.length === 0 && <p className="py-6 text-center text-sm text-gray-400">Chưa có công ty nào.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
