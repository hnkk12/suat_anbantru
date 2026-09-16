import { useMemo, useState } from 'react'
import { Edit3, CheckCircle2, AlertCircle, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Input, Textarea } from '../components/ui/Field'

const FALLBACK_INFO = {
  hoTen: 'Đỗ Thị Thanh Tâm',
  chucVu: 'Phó Hiệu trưởng phụ trách bán trú',
  sdt: '0909112233',
  email: 'tam.do@truongtest.edu.vn',
  ghiChu: 'Phụ trách tiếp nhận phản ánh về suất ăn bán trú của phụ huynh.',
}

function validate(form) {
  const errors = {}
  if (!form.hoTen?.trim()) errors.hoTen = 'Vui lòng nhập họ và tên.'
  if (!form.chucVu?.trim()) errors.chucVu = 'Vui lòng nhập chức vụ.'
  const cleanPhone = form.sdt?.replace(/\s/g, '') || ''
  if (!cleanPhone) {
    errors.sdt = 'Vui lòng nhập số điện thoại.'
  } else if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(cleanPhone)) {
    errors.sdt = 'Số điện thoại Việt Nam chưa hợp lệ.'
  }
  return errors
}

export default function ManagerInfo() {
  const { managerInfo, setManagerInfo } = useApp()
  const info = useMemo(() => ({ ...FALLBACK_INFO, ...(managerInfo || {}) }), [managerInfo])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(info)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [toast, setToast] = useState(null)

  const isDirty = useMemo(() => {
    return (
      form.hoTen !== info.hoTen ||
      form.chucVu !== info.chucVu ||
      form.sdt !== info.sdt ||
      form.email !== info.email ||
      form.ghiChu !== info.ghiChu
    )
  }, [form, info])

  function openEditor() {
    setForm(info)
    setErrors({})
    setOpen(true)
  }

  function handleCloseModal() {
    if (isDirty) {
      setConfirmDiscard(true)
    } else {
      setOpen(false)
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function save(event) {
    event.preventDefault()
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSaving(true)
    setTimeout(() => {
      setManagerInfo(form)
      setSaving(false)
      setOpen(false)
      setToast('Cập nhật thông tin thành công')
      setTimeout(() => setToast(null), 2500)
    }, 200)
  }

  const managerFields = [
    { label: 'Họ tên', value: info.hoTen },
    { label: 'Chức vụ', value: info.chucVu },
    { label: 'Số điện thoại', value: info.sdt },
    { label: 'Email', value: info.email },
    { label: 'Ghi chú', value: info.ghiChu },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-[#c84b26] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in-50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Header exactly matching template */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', color: '#1c1d1b' }}>
            Người phụ trách
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#6b6f68', maxWidth: '480px' }}>
            Thông tin người phụ trách công tác bán trú tại trường.
          </p>
        </div>
        <Button onClick={openEditor} size="sm">
          <Edit3 size={15} /> Cập nhật thông tin
        </Button>
      </div>

      {/* Card exactly matching template: border: 1px solid #e3e4df; border-radius: 16px; background: #fff; padding: 24px; max-width: 520px; display: flex; flex-direction: column; gap: 16px */}
      <div
        style={{
          border: '1px solid #e3e4df',
          borderRadius: '16px',
          background: '#fff',
          padding: '24px',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {managerFields.map((f, idx) => (
          <div
            key={f.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              borderBottom: idx < managerFields.length - 1 ? '1px solid #f1f2ee' : 'none',
              paddingBottom: idx < managerFields.length - 1 ? '12px' : 0,
            }}
          >
            <span style={{ fontSize: '13px', color: '#9a9d96' }}>{f.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 500, textAlign: 'right', maxWidth: '280px', color: '#1c1d1b' }}>
              {f.value || '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Edit Modal to retain full edit feature */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Cập nhật thông tin người phụ trách"
        footer={
          <>
            <Button variant="neutral" onClick={handleCloseModal} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </>
        }
      >
        <form onSubmit={save} className="flex flex-col gap-4">
          <div>
            <Input
              label="Họ tên *"
              value={form.hoTen}
              onChange={(e) => updateField('hoTen', e.target.value)}
            />
            {errors.hoTen && <p className="mt-1 text-xs text-rose-600">{errors.hoTen}</p>}
          </div>

          <div>
            <Input
              label="Chức vụ *"
              value={form.chucVu}
              onChange={(e) => updateField('chucVu', e.target.value)}
            />
            {errors.chucVu && <p className="mt-1 text-xs text-rose-600">{errors.chucVu}</p>}
          </div>

          <div>
            <Input
              label="Số điện thoại *"
              inputMode="numeric"
              value={form.sdt}
              onChange={(e) => updateField('sdt', e.target.value)}
            />
            {errors.sdt && <p className="mt-1 text-xs text-rose-600">{errors.sdt}</p>}
          </div>

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
          />

          <Textarea
            label="Ghi chú"
            rows={3}
            value={form.ghiChu}
            onChange={(e) => updateField('ghiChu', e.target.value)}
          />
        </form>
      </Modal>

      {/* Confirm Discard Modal */}
      {confirmDiscard && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1c1d1b]">
                    Thay đổi chưa được lưu
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[#6b6f68]">
                    Bạn có một số thông tin đã chỉnh sửa. Bạn muốn tiếp tục sửa hay bỏ thay đổi?
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDiscard(false)}
                className="rounded-[6px] p-1 text-[#8a8d86] hover:bg-[#f2f3ee]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setConfirmDiscard(false)}>
                Tiếp tục chỉnh sửa
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setConfirmDiscard(false)
                  setOpen(false)
                  setForm(info)
                }}
              >
                Bỏ thay đổi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
