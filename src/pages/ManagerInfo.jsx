import { useMemo, useState } from 'react'
import { BriefcaseBusiness, CheckCircle2, Edit3, Phone, School, UserRound, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input } from '../components/ui/Field'

const FALLBACK_INFO = {
  schoolName: 'Trường Test',
  hoTen: 'Lê Hiếu Huy',
  sdt: '0359023998',
  chucVu: 'Giáo viên tin học',
}

function validate(form) {
  const errors = {}
  if (!form.hoTen.trim()) errors.hoTen = 'Vui lòng nhập họ tên.'
  if (!form.sdt.trim()) errors.sdt = 'Vui lòng nhập số điện thoại.'
  else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(form.sdt.replace(/\s/g, ''))) errors.sdt = 'Số điện thoại Việt Nam chưa hợp lệ.'
  if (!form.chucVu.trim()) errors.chucVu = 'Vui lòng nhập chức vụ.'
  return errors
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function ManagerInfo() {
  const { managerInfo, setManagerInfo } = useApp()
  const info = useMemo(() => ({ ...FALLBACK_INFO, ...(managerInfo || {}) }), [managerInfo])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(info)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const isDirty = JSON.stringify(form) !== JSON.stringify(info)
  const initials = (info.hoTen || FALLBACK_INFO.hoTen).trim().slice(0, 1).toUpperCase()

  function openEditor() {
    setForm(info)
    setErrors({})
    setOpen(true)
  }

  function requestClose() {
    if (isDirty) setConfirmDiscard(true)
    else setOpen(false)
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function save(event) {
    event.preventDefault()
    const next = {
      ...form,
      hoTen: form.hoTen.trim(),
      sdt: form.sdt.replace(/\s/g, ''),
      chucVu: form.chucVu.trim(),
    }
    const nextErrors = validate(next)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSaving(true)
    try {
      setManagerInfo(next)
      setSaving(false)
      setOpen(false)
      setToast({ ok: true, text: 'Cập nhật thông tin thành công' })
      window.setTimeout(() => setToast(null), 2500)
    } catch {
      setSaving(false)
      setToast({ ok: false, text: 'Không thể cập nhật thông tin. Vui lòng thử lại.' })
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.ok ? 'bg-emerald-700' : 'bg-rose-700'}`}>
          {toast.ok && <CheckCircle2 size={16} />}{toast.text}
        </div>
      )}

      <PageHeader
        eyebrow="Quản trị"
        eyebrowIcon={UserRound}
        title="Thông tin người phụ trách"
        description="Thông tin liên hệ của người phụ trách công tác bán trú, dùng để phụ huynh và nhà cung cấp liên hệ khi cần."
      />

      <section className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl font-bold text-emerald-700 ring-8 ring-emerald-50/60">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold tracking-tight text-slate-900">{info.hoTen}</h2>
              <p className="mt-1 text-sm text-slate-500">{info.chucVu}</p>
            </div>
          </div>
          <Button onClick={openEditor} className="shrink-0">
            <Edit3 size={16} /> Cập nhật thông tin
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-7">
          <InfoItem icon={School} label="Tên trường" value={info.schoolName} />
          <InfoItem icon={UserRound} label="Họ tên" value={info.hoTen} />
          <InfoItem icon={Phone} label="Điện thoại" value={info.sdt} />
          <InfoItem icon={BriefcaseBusiness} label="Chức vụ" value={info.chucVu} />
        </div>
      </section>

      <Modal
        open={open}
        onClose={requestClose}
        title="Cập nhật thông tin người phụ trách"
        footer={
          <>
            <Button variant="secondary" onClick={requestClose} disabled={saving}>Hủy</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
          </>
        }
      >
        <form onSubmit={save} className="space-y-4">
          <div>
            <Input label="Họ tên" value={form.hoTen} onChange={(event) => updateField('hoTen', event.target.value)} aria-invalid={Boolean(errors.hoTen)} />
            {errors.hoTen && <p className="mt-1 text-xs text-rose-600">{errors.hoTen}</p>}
          </div>
          <div>
            <Input label="Số điện thoại" inputMode="numeric" value={form.sdt} onChange={(event) => updateField('sdt', event.target.value)} aria-invalid={Boolean(errors.sdt)} />
            {errors.sdt && <p className="mt-1 text-xs text-rose-600">{errors.sdt}</p>}
          </div>
          <div>
            <Input label="Chức vụ" value={form.chucVu} onChange={(event) => updateField('chucVu', event.target.value)} aria-invalid={Boolean(errors.chucVu)} />
            {errors.chucVu && <p className="mt-1 text-xs text-rose-600">{errors.chucVu}</p>}
          </div>
        </form>
      </Modal>

      {confirmDiscard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">Bạn có thay đổi chưa được lưu.</h3>
                <p className="mt-1 text-sm text-slate-500">Bạn muốn tiếp tục chỉnh sửa hay bỏ thay đổi?</p>
              </div>
              <button onClick={() => setConfirmDiscard(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmDiscard(false)}>Tiếp tục chỉnh sửa</Button>
              <Button variant="danger" onClick={() => { setConfirmDiscard(false); setOpen(false); setForm(info) }}>Bỏ thay đổi</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
