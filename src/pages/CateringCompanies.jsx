import { useMemo, useState } from 'react'
import { Building2, CheckCircle2, FileText, Paperclip, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { Input, Select, Textarea } from '../components/ui/Field'

const MODEL_TYPES = {
  MEAL_PROVIDER: 'meal_provider',
  CANTEEN: 'canteen',
  SCHOOL_KITCHEN: 'school_kitchen',
  ON_SITE_PROVIDER: 'on_site_provider',
}
const MODEL_OPTIONS = [
  [MODEL_TYPES.MEAL_PROVIDER, 'Đơn vị cung cấp suất ăn'],
  [MODEL_TYPES.CANTEEN, 'Căn tin'],
  [MODEL_TYPES.SCHOOL_KITCHEN, 'Bếp ăn của trường'],
  [MODEL_TYPES.ON_SITE_PROVIDER, 'Đơn vị cung cấp suất ăn tại trường'],
]
const needsDetailedLegalInfo = (type) => type !== MODEL_TYPES.ON_SITE_PROVIDER
const emptyForm = {
  ten: '', daiDien: '', mst: '', sdt: '', email: '', phuongXa: '', diaChi: '',
  loaiMoHinh: MODEL_TYPES.MEAL_PROVIDER, quyetDinhHoatDong: '', quyetDinhFile: null,
  giayChungNhanAttp: '', attpFile: null, moTa: '', ghiChu: '', trangThai: 'Đang hợp tác',
}

function CompanyForm({ form, setForm, errors }) {
  const update = (key, value) => setForm({ ...form, [key]: value })
  const selectFile = (key, file) => update(key, file ? { name: file.name, size: file.size, type: file.type } : null)
  const detailedLegal = needsDetailedLegalInfo(form.loaiMoHinh)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Input label="Chủ đầu tư" value={form.daiDien} onChange={(e) => update('daiDien', e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <Input label="Tên công ty *" value={form.ten} onChange={(e) => update('ten', e.target.value)} aria-invalid={Boolean(errors.ten)} />
        {errors.ten && <p className="mt-1 text-xs text-rose-600">{errors.ten}</p>}
      </div>
      <div>
        <Input label="Mã số thuế" value={form.mst} onChange={(e) => update('mst', e.target.value)} />
        {errors.mst && <p className="mt-1 text-xs text-rose-600">{errors.mst}</p>}
      </div>
      <div>
        <Input label="Số điện thoại" inputMode="numeric" value={form.sdt} onChange={(e) => update('sdt', e.target.value)} aria-invalid={Boolean(errors.sdt)} />
        {errors.sdt && <p className="mt-1 text-xs text-rose-600">{errors.sdt}</p>}
      </div>
      <div className="sm:col-span-2">
        <Input label="Địa chỉ" value={form.diaChi} onChange={(e) => update('diaChi', e.target.value)} />
      </div>
      <Input type="email" label="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
      <Input label="Phường/xã" value={form.phuongXa} onChange={(e) => update('phuongXa', e.target.value)} />
      <Select label="Loại mô hình" value={form.loaiMoHinh} onChange={(e) => update('loaiMoHinh', e.target.value)}>
        {MODEL_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </Select>
      <Select label="Trạng thái hợp đồng" value={form.trangThai} onChange={(e) => update('trangThai', e.target.value)}>
        <option value="Đang hợp tác">Đang hợp tác</option>
        <option value="Tạm ngưng">Tạm ngưng</option>
      </Select>
      {detailedLegal ? (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:col-span-2">
          <div><h3 className="text-sm font-bold text-slate-800">Thông tin pháp lý</h3><p className="mt-0.5 text-xs text-slate-500">Thông tin quyết định hoạt động và giấy chứng nhận an toàn thực phẩm.</p></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Input label="Số quyết định hoạt động" value={form.quyetDinhHoatDong} onChange={(e) => update('quyetDinhHoatDong', e.target.value)} aria-invalid={Boolean(errors.quyetDinhHoatDong)} />
              {errors.quyetDinhHoatDong && <p className="mt-1 text-xs text-rose-600">{errors.quyetDinhHoatDong}</p>}
            </div>
            <label className="flex flex-col gap-1 text-sm"><span className="text-xs font-medium text-gray-500">File quyết định</span><input type="file" onChange={(e) => selectFile('quyetDinhFile', e.target.files?.[0])} className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-teal-700" />{form.quyetDinhFile && <span className="flex items-center gap-1 text-xs text-teal-700"><Paperclip size={12} />{form.quyetDinhFile.name}</span>}</label>
            <div>
              <Input label="Số giấy chứng nhận ATTP" value={form.giayChungNhanAttp} onChange={(e) => update('giayChungNhanAttp', e.target.value)} aria-invalid={Boolean(errors.giayChungNhanAttp)} />
              {errors.giayChungNhanAttp && <p className="mt-1 text-xs text-rose-600">{errors.giayChungNhanAttp}</p>}
            </div>
            <label className="flex flex-col gap-1 text-sm"><span className="text-xs font-medium text-gray-500">File giấy chứng nhận ATTP</span><input type="file" onChange={(e) => selectFile('attpFile', e.target.files?.[0])} className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-teal-700" />{form.attpFile && <span className="flex items-center gap-1 text-xs text-teal-700"><Paperclip size={12} />{form.attpFile.name}</span>}</label>
          </div>
        </div>
      ) : (
        <div className="sm:col-span-2">
          <Input label="Quyết định hoạt động" value={form.quyetDinhHoatDong} onChange={(e) => update('quyetDinhHoatDong', e.target.value)} aria-invalid={Boolean(errors.quyetDinhHoatDong)} />
          {errors.quyetDinhHoatDong && <p className="mt-1 text-xs text-rose-600">{errors.quyetDinhHoatDong}</p>}
        </div>
      )}
      <Textarea label="Mô tả" className="sm:col-span-2" rows={2} value={form.moTa} onChange={(e) => update('moTa', e.target.value)} />
      <Textarea label="Ghi chú" className="sm:col-span-2" rows={2} value={form.ghiChu} onChange={(e) => update('ghiChu', e.target.value)} />
    </div>
  )
}

function PartnerList({ title, partners, emptyLabel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <p className="text-sm font-bold text-slate-800">{title} <span className="text-slate-400">({partners.length})</span></p>
      {partners.length === 0 ? <p className="py-7 text-center text-xs text-slate-400">{emptyLabel}</p> : <div className="mt-3 space-y-2">{partners.map((partner, index) => <div key={partner.id || index} className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs font-semibold text-slate-800">{partner.ten || partner.name || 'Chưa cập nhật tên'}</p><p className="mt-1 text-xs text-slate-500">{partner.mst ? `MST: ${partner.mst} · ` : ''}{partner.sdt || partner.phone || 'Chưa cập nhật số điện thoại'}</p><p className="mt-1 text-xs text-slate-400">{partner.diaChi || partner.address || 'Chưa cập nhật địa chỉ'}</p></div>)}</div>}
    </div>
  )
}

function AttachmentInfo({ label, file }) {
  if (!file?.name) return <p className="mt-1 text-xs text-slate-400">{label}: Chưa có tệp đính kèm</p>
  const size = file.size ? ` · ${Math.max(1, Math.round(file.size / 1024))} KB` : ''
  return <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-700"><Paperclip size={13} /><span className="truncate">{label}: {file.name}{size}</span></p>
}

function MealProviderSection({ company, onEdit, onRemove }) {
  const suppliers = company.suppliers || company.nhaCungCap || []
  const manufacturers = company.manufacturers || company.nhaSanXuat || []
  const detailed = needsDetailedLegalInfo(company.loaiMoHinh || MODEL_TYPES.MEAL_PROVIDER)
  const modelName = MODEL_OPTIONS.find(([value]) => value === company.loaiMoHinh)?.[1] || 'Đơn vị cung cấp suất ăn'
  const isActive = company.trangThai === 'Đang hợp tác'
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Building2 size={20} /></span><div><h2 className="text-base font-bold text-slate-900">{company.ten}</h2><Badge tone={isActive ? 'green' : 'red'} className="mt-1">{modelName}</Badge></div></div><div className="mt-4 grid gap-1 text-xs text-slate-500 sm:grid-cols-2"><p>MST: {company.mst || 'Chưa cập nhật'}</p><p>Điện thoại: {company.sdt || 'Chưa cập nhật'}</p><p className="sm:col-span-2">Địa chỉ: {company.diaChi || 'Chưa cập nhật'}</p>{company.moTa && <p className="sm:col-span-2">Mô tả: {company.moTa}</p>}</div></div>
      <div className="flex gap-1"><button onClick={() => onEdit(company)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-teal-700"><Pencil size={16} /></button><button onClick={() => onRemove(company)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16} /></button></div>
    </div>
    <div className="grid gap-4 p-5 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><FileText size={16} className="text-slate-400" />Giấy phép / quyết định</div><p className="mt-3 text-xs text-slate-500">Quyết định: {company.quyetDinhHoatDong || 'Chưa cập nhật'}</p><AttachmentInfo label="Tệp quyết định" file={company.quyetDinhFile} />{detailed && <><p className="mt-3 text-xs text-slate-500">Giấy ATTP: {company.giayChungNhanAttp || 'Chưa cập nhật'}</p><AttachmentInfo label="Tệp giấy ATTP" file={company.attpFile} /></>}</div><div className="grid gap-3 sm:grid-cols-2"><PartnerList title="Nhà cung cấp" partners={suppliers} emptyLabel="Chưa có nhà cung cấp" /><PartnerList title="Nhà sản xuất" partners={manufacturers} emptyLabel="Chưa có nhà sản xuất" /></div></div>
  </section>
}

export default function CateringCompanies() {
  const { companies, addCompany, updateCompany, removeCompany } = useApp()
  const [assignedProviderIds, setAssignedProviderIds] = useLocalStorageState('assignedMealProviderIds', companies.filter((company) => company.trangThai === 'Đang hợp tác').map((company) => company.id))
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Tất cả')
  const [selectOpen, setSelectOpen] = useState(false)
  const [draftProviderIds, setDraftProviderIds] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const assignedProviders = companies.filter((company) => assignedProviderIds.includes(company.id))
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return companies.filter((company) => {
      const matchesText = !term || [company.ten, company.daiDien, company.sdt, company.diaChi].join(' ').toLocaleLowerCase('vi').includes(term)
      return matchesText && (status === 'Tất cả' || company.trangThai === status)
    })
  }, [companies, query, status])

  function validate(data) {
    const next = {}
    if (!data.ten.trim()) next.ten = 'Vui lòng nhập tên công ty.'
    if (data.mst && !/^\d{10}(?:\d{3})?$/.test(data.mst.replace(/\s/g, ''))) next.mst = 'Mã số thuế phải gồm 10 hoặc 13 chữ số.'
    if (data.sdt && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(data.sdt.replace(/\s/g, ''))) next.sdt = 'Số điện thoại Việt Nam chưa hợp lệ.'
    return next
  }
  function openAdd() { setEditingId(null); setForm(emptyForm); setErrors({}); setFormOpen(true) }
  function openEdit(company) { setEditingId(company.id); setForm({ ...emptyForm, ...company }); setErrors({}); setFormOpen(true) }
  function saveCompany(event) {
    event.preventDefault()
    const payload = { ...form, ten: form.ten.trim(), mst: form.mst.replace(/\s/g, ''), sdt: form.sdt.replace(/\s/g, '') }
    if (!needsDetailedLegalInfo(payload.loaiMoHinh)) {
      payload.giayChungNhanAttp = ''
      payload.attpFile = null
      payload.quyetDinhFile = null
    }
    const nextErrors = validate(payload)
    if (Object.keys(nextErrors).length) return setErrors(nextErrors)
    setSaving(true)
    try {
      if (editingId) updateCompany(editingId, payload)
      else addCompany(payload)
      setSaving(false); setFormOpen(false)
      setToast({ ok: true, text: editingId ? 'Cập nhật công ty thành công' : 'Thêm công ty thành công' })
      window.setTimeout(() => setToast(null), 2500)
    } catch {
      setSaving(false); setToast({ ok: false, text: 'Không thể cập nhật công ty. Vui lòng thử lại.' })
    }
  }
  function saveSelection() {
    if (JSON.stringify([...draftProviderIds].sort()) === JSON.stringify([...assignedProviderIds].sort())) return
    setSaving(true)
    window.setTimeout(() => {
      setAssignedProviderIds(draftProviderIds); setSaving(false); setSelectOpen(false)
      setToast({ ok: true, text: 'Cập nhật đơn vị cung cấp suất ăn thành công' })
      window.setTimeout(() => setToast(null), 2500)
    }, 250)
  }

  return (
    <div className="space-y-6">
      {toast && <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.ok ? 'bg-teal-700' : 'bg-rose-700'}`}>{toast.ok && <CheckCircle2 size={16} />}{toast.text}</div>}
      <PageHeader title="Công ty cung cấp suất ăn" description="Quản lý đơn vị cung cấp suất ăn bán trú và thông tin đối tác hợp tác cùng nhà trường." />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-base font-bold text-slate-900">Đơn vị cung cấp suất ăn của trường</h2><p className="text-xs text-slate-500">{assignedProviders.length} đơn vị đang được gán</p></div><div className="flex gap-2"><Button variant="secondary" size="sm" onClick={openAdd}><Plus size={15} /> Thêm công ty</Button><Button size="sm" onClick={() => { setDraftProviderIds(assignedProviderIds); setSelectOpen(true) }}>Chọn công ty</Button></div></div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={15} className="absolute left-3 top-2.5 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên công ty, MST hoặc số điện thoại..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-teal-500" /></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"><option>Tất cả</option><option>Đang hợp tác</option><option>Tạm ngưng</option></select></div>
      </section>
      {assignedProviders.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center"><Building2 size={28} className="text-slate-300" /><h2 className="mt-3 text-sm font-bold text-slate-800">Chưa có đơn vị cung cấp suất ăn</h2><Button size="sm" className="mt-4" onClick={() => { setDraftProviderIds(assignedProviderIds); setSelectOpen(true) }}>Chọn công ty</Button></div> : <div className="space-y-5">{assignedProviders.filter((company) => filtered.some((item) => item.id === company.id)).map((company) => <MealProviderSection key={company.id} company={company} onEdit={openEdit} onRemove={(item) => { if (window.confirm(`Xóa công ty “${item.ten}”? `)) { removeCompany(item.id); setAssignedProviderIds((ids) => ids.filter((id) => id !== item.id)) } }} />)}</div>}

      <Modal open={selectOpen} onClose={() => setSelectOpen(false)} title="Chọn công ty" width="max-w-3xl" footer={<><Button variant="secondary" onClick={() => setSelectOpen(false)} disabled={saving}>Hủy</Button><Button onClick={saveSelection} disabled={JSON.stringify([...draftProviderIds].sort()) === JSON.stringify([...assignedProviderIds].sort()) || saving}>{saving ? 'Đang lưu...' : 'Lưu lựa chọn'}</Button></>}>
        <div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">Có thể chọn nhiều đơn vị cung cấp suất ăn cho trường.</p><Button size="sm" variant="secondary" onClick={() => { setSelectOpen(false); openAdd() }}><Plus size={14} /> Thêm công ty</Button></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{companies.map((company) => { const checked = draftProviderIds.includes(company.id); return <button key={company.id} onClick={() => setDraftProviderIds((ids) => checked ? ids.filter((id) => id !== company.id) : [...ids, company.id])} className={`rounded-xl border p-4 text-left transition-colors ${checked ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200'}`}><div className="flex justify-between gap-2"><b className="text-sm text-slate-900">{company.ten}</b><Badge tone={checked ? 'green' : 'gray'}>{checked ? 'Đã chọn' : 'Chọn đơn vị'}</Badge></div><p className="mt-2 text-xs text-slate-500">{company.sdt || 'Chưa có số điện thoại'}</p><p className="mt-1 text-xs text-slate-400">{company.diaChi || 'Chưa có địa chỉ'}</p></button> })}</div>
      </Modal>

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={editingId ? 'Cập nhật công ty' : 'Thêm công ty mới'} width="max-w-2xl" footer={<><Button variant="secondary" onClick={() => setFormOpen(false)} disabled={saving}>Hủy</Button><Button onClick={saveCompany} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button></>}>
        <form onSubmit={saveCompany}><CompanyForm form={form} setForm={setForm} errors={errors} /></form>
      </Modal>
    </div>
  )
}
