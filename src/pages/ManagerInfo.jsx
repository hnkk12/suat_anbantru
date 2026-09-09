import { useState } from 'react'
import { UserCircle2, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Field'

export default function ManagerInfo() {
  const { managerInfo, setManagerInfo } = useApp()
  const [form, setForm] = useState(managerInfo)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setManagerInfo(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản trị"
        eyebrowIcon={UserCircle2}
        title="Thông tin người phụ trách"
        description="Thông tin liên hệ của người phụ trách công tác bán trú, dùng để phụ huynh và nhà cung cấp liên hệ khi cần."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Cập nhật thông tin" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Họ và tên" value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} required />
            <Input label="Chức vụ" value={form.chucVu} onChange={(e) => setForm({ ...form, chucVu: e.target.value })} />
            <Input label="Số điện thoại" value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
            <Input type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Textarea
              label="Ghi chú"
              className="sm:col-span-2"
              rows={3}
              value={form.ghiChu}
              onChange={(e) => setForm({ ...form, ghiChu: e.target.value })}
            />
            <div className="flex items-center gap-3 sm:col-span-2">
              <Button type="submit">Lưu thông tin</Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <CheckCircle2 size={16} /> Đã lưu thay đổi
                </span>
              )}
            </div>
          </form>
        </Card>

        <Card title="Xem trước">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <UserCircle2 size={32} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{form.hoTen || 'Chưa cập nhật'}</p>
              <p className="text-sm text-gray-500">{form.chucVu || 'Chưa cập nhật chức vụ'}</p>
            </div>
            <div className="w-full space-y-1.5 border-t border-gray-100 pt-3 text-left text-sm text-gray-600">
              <p><span className="text-gray-400">SĐT:</span> {form.sdt || '—'}</p>
              <p><span className="text-gray-400">Email:</span> {form.email || '—'}</p>
              {form.ghiChu && <p className="text-gray-400">{form.ghiChu}</p>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
