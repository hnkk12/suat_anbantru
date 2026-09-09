import { useState } from 'react'
import { FileText, Plus, Trash2, Download, UploadCloud } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
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
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)

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
    <div className="space-y-6">
      <PageHeader
        title="Văn bản liên quan"
        description="Lưu trữ các văn bản, quy định, mẫu biểu liên quan đến công tác bán trú của trường."
        controls={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Thêm văn bản
          </Button>
        }
      />

      <Card title="Danh sách văn bản" description={`${documents.length} tài liệu`}>
        <div className="divide-y divide-gray-100">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{d.ten}</p>
                  <p className="text-xs text-gray-400">
                    Đăng ngày {d.ngayDang} · {d.kichThuoc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="gray">{d.loai}</Badge>
                {d.url ? (
                  <a
                    href={d.url}
                    download={d.ten}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-teal-600"
                    title="Tải xuống"
                  >
                    <Download size={16} />
                  </a>
                ) : (
                  <span title="Tài liệu mẫu, chưa gắn file (không có backend lưu trữ)" className="cursor-not-allowed rounded-lg p-1.5 text-gray-300">
                    <Download size={16} />
                  </span>
                )}
                <button onClick={() => removeDocument(d.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {documents.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Chưa có văn bản nào.</p>}
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thêm văn bản mới"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>Thêm văn bản</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tên văn bản" value={name} onChange={(e) => setName(e.target.value)} required />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium text-gray-500">File đính kèm (tùy chọn)</span>
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500">
              <UploadCloud size={16} className="text-gray-400" />
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" />
            </div>
            <span className="text-xs text-gray-400">Lưu ý: file chỉ tồn tại trong phiên làm việc hiện tại vì chưa kết nối máy chủ lưu trữ.</span>
          </label>
        </form>
      </Modal>
    </div>
  )
}
