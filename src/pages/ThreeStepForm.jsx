import { useRef, useState } from 'react'
import { CalendarDays, Camera, ChevronLeft, ChevronRight, Eye, FileImage, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { formatDateVN } from '../utils/dateUtils'

const GROUPS = [
  { id: 'form_1', title: 'Biểu mẫu 1', description: 'Hình ảnh kiểm tra nguyên liệu đầu vào.' },
  { id: 'form_1a', title: 'Biểu mẫu 1A', description: 'Hình ảnh kiểm thực bước một.' },
  { id: 'form_2', title: 'Biểu mẫu 2', description: 'Hình ảnh kiểm thực bước hai.' },
  { id: 'form_3', title: 'Biểu mẫu 3', description: 'Hình ảnh kiểm thực bước ba.' },
  { id: 'form_5', title: 'Biểu mẫu 5', description: 'Hình ảnh giao nhận suất ăn.' },
  { id: 'sample_storage', title: 'Hình lưu mẫu', description: 'Hình ảnh lưu mẫu thức ăn trong ngày.' },
]
const MAX_IMAGES = 10

function ImageCard({ group, images, onChoose, onPreview, onRemove }) {
  const ref = useRef(null)
  const full = images.length >= MAX_IMAGES
  return <article className="flex min-h-[152px] flex-col rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 gap-2.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700"><FileImage size={16} /></span><div className="min-w-0"><h2 className="text-sm font-bold text-slate-900">{group.title}</h2><p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{group.description}</p></div></div><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${full ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}>{images.length}/{MAX_IMAGES}</span></div>
    <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { onChoose(e.target.files); e.target.value = '' }} />
    <div className="mt-3 flex min-h-16 flex-1 flex-wrap content-start items-center gap-2">{images.length === 0 ? <button type="button" disabled={full} onClick={() => ref.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-dashed border-teal-300 bg-teal-50/60 px-3 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"><Camera size={15} />Thêm ảnh <span className="font-normal text-teal-600">· JPG, PNG · tối đa 10</span></button> : <>{images.map((image, index) => <div key={image.id} className="group relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"><img src={image.src} alt={image.name} className="h-full w-full object-cover" /><div className="absolute inset-0 flex items-center justify-center gap-1 bg-slate-900/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"><button type="button" aria-label={`Xem ${image.name}`} onClick={() => onPreview(index)} className="rounded-md bg-white p-1 text-slate-700 shadow-sm"><Eye size={12} /></button><button type="button" aria-label={`Xóa ${image.name}`} onClick={() => onRemove(image.id)} className="rounded-md bg-white p-1 text-rose-600 shadow-sm"><Trash2 size={12} /></button></div></div>)}<button type="button" disabled={full} onClick={() => ref.current?.click()} className="flex h-14 items-center gap-1 rounded-lg border border-dashed border-teal-300 bg-teal-50/60 px-2.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"><Plus size={14} />{full ? 'Đã đạt giới hạn' : 'Thêm ảnh'}</button></>}</div>
  </article>
}

export default function ThreeStepForm() {
  const { selectedDate, setSelectedDate } = useApp()
  const [records, setRecords] = useLocalStorageState('three_step_form_images', {})
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState(null)
  const dayData = records[selectedDate] || {}
  const total = GROUPS.reduce((sum, group) => sum + (dayData[group.id]?.length || 0), 0)
  const completedGroups = GROUPS.filter((group) => (dayData[group.id]?.length || 0) > 0).length
  const progress = Math.round((completedGroups / GROUPS.length) * 100)

  function saveImages(groupId, files) {
    const current = dayData[groupId] || []
    const allowed = MAX_IMAGES - current.length
    const selected = Array.from(files || [])
    if (selected.length > allowed) setMessage(`Nhóm này chỉ có thể lưu tối đa ${MAX_IMAGES} ảnh.`)
    selected.slice(0, allowed).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => setRecords((previous) => {
        const dateRecord = previous[selectedDate] || {}
        const images = dateRecord[groupId] || []
        return { ...previous, [selectedDate]: { ...dateRecord, [groupId]: [...images, { id: `${Date.now()}_${Math.random()}`, name: file.name, src: reader.result }] } }
      })
      reader.readAsDataURL(file)
    })
  }
  function removeImage(groupId, imageId) {
    setRecords((previous) => ({ ...previous, [selectedDate]: { ...dayData, [groupId]: (dayData[groupId] || []).filter((image) => image.id !== imageId) } }))
  }
  const previewImages = preview ? dayData[preview.groupId] || [] : []

  return <div className="space-y-6">
    {message && <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-rose-700 px-4 py-3 text-sm font-medium text-white shadow-xl">{message}</div>}
    <PageHeader eyebrow="Quản trị" eyebrowIcon={FileImage} title="Biểu mẫu 3 bước" description="Quản lý hình ảnh biểu mẫu theo từng ngày." controls={<Button variant="secondary" disabled title="Chưa có service export"><FileImage size={16} /> Xuất biểu mẫu 3 bước</Button>} />
    <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><p className="text-xs font-medium text-slate-400">Ngày xem dữ liệu</p><p className="mt-1 text-base font-bold text-slate-900">{formatDateVN(selectedDate)}</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"><CalendarDays size={15} /><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent outline-none" /></label><Button size="sm" variant="secondary" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}>Hôm nay</Button></div></section>
    <section className="rounded-xl border border-teal-100 bg-teal-50/40 px-4 py-3"><div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><p className="text-sm font-bold text-teal-900">Tiến độ biểu mẫu</p><p className="text-xs text-teal-700">{completedGroups}/{GROUPS.length} nhóm có ảnh · {total} ảnh</p><span className="text-base font-bold text-teal-800">{progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-teal-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${progress}%` }} /></div></section>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{GROUPS.map((group) => <ImageCard key={group.id} group={group} images={dayData[group.id] || []} onChoose={(files) => saveImages(group.id, files)} onRemove={(id) => removeImage(group.id, id)} onPreview={(index) => setPreview({ groupId: group.id, index })} />)}</div>
    <Modal open={Boolean(preview)} onClose={() => setPreview(null)} title={preview ? GROUPS.find((group) => group.id === preview.groupId)?.title : ''} width="max-w-2xl" footer={<Button variant="secondary" onClick={() => setPreview(null)}>Đóng</Button>}>{preview && previewImages.length > 0 && <div className="space-y-3"><img src={previewImages[preview.index]?.src} alt={previewImages[preview.index]?.name} className="max-h-[55vh] w-full rounded-xl object-contain" /><div className="flex items-center justify-between"><Button size="sm" variant="secondary" disabled={preview.index === 0} onClick={() => setPreview({ ...preview, index: preview.index - 1 })}><ChevronLeft size={15} /> Trước</Button><span className="text-xs text-slate-500">{preview.index + 1}/{previewImages.length}</span><Button size="sm" variant="secondary" disabled={preview.index === previewImages.length - 1} onClick={() => setPreview({ ...preview, index: preview.index + 1 })}>Sau <ChevronRight size={15} /></Button></div></div>}</Modal>
  </div>
}
