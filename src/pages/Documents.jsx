import { useState, useMemo } from 'react'
import { FileText, Plus, Trash2, Download, UploadCloud, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { Input } from '../components/ui/Field'

function formatSize(bytes) {
  if (!bytes) return '—'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

export default function Documents() {
  const { documents, addDocument, removeDocument } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tất cả')
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return documents.filter((d) => {
      const matchSearch = !term || d.ten?.toLowerCase().includes(term)
      const matchType = typeFilter === 'Tất cả' || d.loai === typeFilter
      return matchSearch && matchType
    })
  }, [documents, searchTerm, typeFilter])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    const doc = {
      ten: name,
      loai: file ? (file.name.split('.').pop() || 'FILE').toUpperCase() : 'FILE',
      ngayDang: new Date().toISOString().slice(0, 10),
      kichThuoc: file ? formatSize(file.size) : '—',
      url: file ? URL.createObjectURL(file) : null,
    }
    addDocument(doc)
    setName('')
    setFile(null)
    setModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-5.5">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Văn bản liên quan
          </h1>
          <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
            Văn bản, quy định và mẫu hợp đồng liên quan đến bán trú.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9d96]"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm văn bản..."
              className="w-[180px] rounded-[10px] border border-[#d5d7d0] bg-white py-2 pl-8 pr-3 text-[13px] text-[#1c1d1b] outline-none placeholder:text-[#9a9d96] focus:border-[#c84b26]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] outline-none"
          >
            <option value="Tất cả">Tất cả định dạng</option>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
          </select>

          <Button onClick={() => setModalOpen(true)} size="sm">
            <Plus size={15} /> Thêm văn bản
          </Button>
        </div>
      </div>

      {/* Document List Card */}
      <div className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white p-5 shadow-xs">
        <div className="divide-y divide-[#eceeea]">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#fdf2ee] text-[#c84b26]">
                  <FileText size={17} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-[#1c1d1b]">{d.ten}</p>
                  <p className="text-[12px] text-[#9a9d96]">
                    Đăng ngày {d.ngayDang} · {d.kichThuoc}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge tone="gray">{d.loai}</Badge>
                {d.url ? (
                  <a
                    href={d.url}
                    download={d.ten}
                    className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-[#fdf2ee] hover:text-[#c84b26]"
                    title="Tải xuống"
                  >
                    <Download size={16} />
                  </a>
                ) : (
                  <span
                    title="Tài liệu mẫu"
                    className="cursor-not-allowed rounded-[6px] p-1.5 text-[#d5d7d0]"
                  >
                    <Download size={16} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeDocument(d.id)}
                  className="rounded-[6px] p-1.5 text-[#8a8d86] hover:bg-rose-50 hover:text-rose-600"
                  title="Xóa văn bản"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="py-12 text-center text-[13px] text-[#9a9d96]">
              Không có văn bản nào phù hợp.
            </p>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thêm văn bản mới"
        footer={
          <>
            <Button variant="neutral" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Thêm văn bản</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Tên văn bản *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ví dụ: Quy định an toàn thực phẩm năm học 2026-2027"
          />

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-[12px] font-semibold text-[#57605a]">
              File đính kèm (tùy chọn)
            </span>
            <div className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#d5d7d0] bg-[#fafaf8] p-4 text-[13px] text-[#57605a]">
              <UploadCloud size={18} className="text-[#9a9d96]" />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-[12px] text-[#57605a]"
              />
            </div>
          </label>
        </form>
      </Modal>
    </div>
  )
}
