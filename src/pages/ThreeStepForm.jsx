import { useRef, useState } from 'react'
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileImage,
  Plus,
  Trash2,
  Download,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
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

  return (
    <div className="flex min-h-[152px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs transition-all hover:border-[#cfd1cb]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#fdf2ee] text-[#c84b26]">
            <FileImage size={16} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-[#1c1d1b]">{group.title}</h3>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[#6b6f68]">{group.description}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-[6px] px-2 py-0.5 text-[11.5px] font-semibold ${
            full ? 'bg-amber-50 text-amber-800' : 'bg-[#fdf2ee] text-[#c84b26]'
          }`}
        >
          {images.length}/{MAX_IMAGES}
        </span>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          onChoose(e.target.files)
          e.target.value = ''
        }}
      />

      <div className="mt-4 flex min-h-[58px] flex-1 flex-wrap content-start items-center gap-2">
        {images.length === 0 ? (
          <button
            type="button"
            disabled={full}
            onClick={() => ref.current?.click()}
            className="flex items-center gap-1.5 rounded-[10px] border border-dashed border-[#f5c6b8] bg-[#fdf2ee]/60 px-3.5 py-2 text-[12.5px] font-semibold text-[#c84b26] transition-colors hover:border-[#c84b26] hover:bg-[#fdf2ee] cursor-pointer"
          >
            <Camera size={14} /> Thêm ảnh <span className="text-[11.5px] text-[#c85a3b]/80">· tối đa 10 ảnh</span>
          </button>
        ) : (
          <>
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative h-14 w-14 overflow-hidden rounded-[8px] border border-[#e3e4df] bg-slate-50"
              >
                <img src={image.src} alt={image.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label={`Xem ${image.name}`}
                    onClick={() => onPreview(index)}
                    className="rounded bg-white p-1 text-[#1c1d1b] shadow-sm"
                  >
                    <Eye size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Xóa ${image.name}`}
                    onClick={() => onRemove(image.id)}
                    className="rounded bg-white p-1 text-rose-600 shadow-sm"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              disabled={full}
              onClick={() => ref.current?.click()}
              className="flex h-14 items-center gap-1 rounded-[8px] border border-dashed border-[#d5d7d0] bg-[#fafaf8] px-3 text-[12px] font-medium text-[#57605a] hover:border-[#c84b26] hover:text-[#c84b26] disabled:opacity-40"
            >
              <Plus size={14} />
              {full ? 'Đủ' : 'Thêm'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ThreeStepForm() {
  const { selectedDate, setSelectedDate } = useApp()
  const [records, setRecords] = useLocalStorageState('three_step_form_images', {})
  const [preview, setPreview] = useState(null)
  const [toast, setToast] = useState(null)

  const dayData = records[selectedDate] || {}
  const total = GROUPS.reduce((sum, group) => sum + (dayData[group.id]?.length || 0), 0)
  const completedGroups = GROUPS.filter((group) => (dayData[group.id]?.length || 0) > 0).length
  const progress = Math.round((completedGroups / GROUPS.length) * 100)

  function saveImages(groupId, files) {
    const current = dayData[groupId] || []
    const allowed = MAX_IMAGES - current.length
    const selected = Array.from(files || [])
    if (selected.length > allowed) {
      setToast('Nhóm này chỉ có thể lưu tối đa 10 ảnh.')
      setTimeout(() => setToast(null), 2500)
    }
    selected.slice(0, allowed).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () =>
        setRecords((previous) => {
          const dateRecord = previous[selectedDate] || {}
          const images = dateRecord[groupId] || []
          return {
            ...previous,
            [selectedDate]: {
              ...dateRecord,
              [groupId]: [
                ...images,
                { id: `${Date.now()}_${Math.random()}`, name: file.name, src: reader.result },
              ],
            },
          }
        })
      reader.readAsDataURL(file)
    })
  }

  function removeImage(groupId, imageId) {
    setRecords((previous) => ({
      ...previous,
      [selectedDate]: {
        ...dayData,
        [groupId]: (dayData[groupId] || []).filter((image) => image.id !== imageId),
      },
    }))
  }

  function handleExport() {
    const lines = [
      `BIÊN BẢN KIỂM THỰC 3 BƯỚC VÀ LƯU MẪU THỨC ĂN`,
      `Ngày thực hiện: ${formatDateVN(selectedDate)}`,
      `Tiến độ hoàn tất: ${completedGroups}/${GROUPS.length} nhóm (${progress}%)`,
      `Tổng số hình ảnh kiểm thực: ${total} ảnh`,
      '--------------------------------------------------',
      ...GROUPS.map((g) => {
        const count = dayData[g.id]?.length || 0
        return `- ${g.title}: ${g.description} [${count} ảnh]`
      }),
      '--------------------------------------------------',
      `Xác nhận của cán bộ phụ trách bán trú và nhân viên y tế trường.`,
    ]
    const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Bien_ban_kiem_thuc_3_buoc_${selectedDate}.txt`
    link.click()
    URL.revokeObjectURL(link.href)
    setToast('Đã xuất biên bản kiểm thực 3 bước thành công')
    setTimeout(() => setToast(null), 2500)
  }

  const previewImages = preview ? dayData[preview.groupId] || [] : []

  return (
    <div className="flex flex-col gap-5.5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[12px] bg-[#c84b26] px-4 py-3 text-[13px] font-medium text-white shadow-xl animate-in fade-in-50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Header matching template */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Biểu mẫu 3 bước
          </h1>
          <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Quy trình kiểm thực 3 bước theo quy định an toàn thực phẩm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" variant="primary" onClick={handleExport}>
            <Download size={14} /> Xuất biên bản
          </Button>

          <div className="flex items-center gap-2 rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2">
            <span className="text-[12px] font-medium text-[#9a9d96]">Ngày</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none bg-transparent font-sans text-[13px] font-medium text-[#1c1d1b] outline-none"
            />
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
          >
            Hôm nay
          </Button>
        </div>
      </div>

      {/* Progress Bar Card matching template */}
      <div className="rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[14px] font-semibold text-[#1c1d1b]">
              Tiến độ lưu ảnh kiểm thực
            </span>
            <p className="mt-0.5 text-[12px] text-[#9a9d96]">
              {formatDateVN(selectedDate)} · {completedGroups}/{GROUPS.length} nhóm đã có ảnh ({total} ảnh)
            </p>
          </div>
          <span className="text-[18px] font-semibold text-[#c84b26]">{progress}%</span>
        </div>
        <div className="mt-3 h-[6px] overflow-hidden rounded-[99px] bg-[#eceeea]">
          <div
            className="h-full rounded-[99px] bg-[#c84b26] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grid of 6 Inspection Groups */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <ImageCard
            key={group.id}
            group={group}
            images={dayData[group.id] || []}
            onChoose={(files) => saveImages(group.id, files)}
            onRemove={(id) => removeImage(group.id, id)}
            onPreview={(index) => setPreview({ groupId: group.id, index })}
          />
        ))}
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview ? GROUPS.find((g) => g.id === preview.groupId)?.title : ''}
        width="max-w-2xl"
        footer={
          <Button variant="neutral" onClick={() => setPreview(null)}>
            Đóng
          </Button>
        }
      >
        {preview && previewImages.length > 0 && (
          <div className="space-y-3">
            <img
              src={previewImages[preview.index]?.src}
              alt={previewImages[preview.index]?.name}
              className="max-h-[55vh] w-full rounded-[12px] object-contain"
            />
            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={preview.index === 0}
                onClick={() => setPreview({ ...preview, index: preview.index - 1 })}
              >
                <ChevronLeft size={15} /> Trước
              </Button>
              <span className="text-[12px] text-[#9a9d96]">
                {preview.index + 1} / {previewImages.length}
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={preview.index === previewImages.length - 1}
                onClick={() => setPreview({ ...preview, index: preview.index + 1 })}
              >
                Sau <ChevronRight size={15} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
