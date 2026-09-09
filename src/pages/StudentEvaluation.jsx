import { useState } from 'react'
import { Star, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { Select, Input, Textarea } from '../components/ui/Field'
import { EVAL_LEVELS } from '../data/mockData'

const LEVEL_TONE = { 'Tốt': 'green', 'Khá': 'blue', 'Cần cải thiện': 'amber' }

const emptyForm = { hocSinhId: '', ngay: new Date().toISOString().slice(0, 10), anUong: 'Tốt', nguNghi: 'Tốt', yThuc: 'Tốt', nhanXet: '' }

export default function StudentEvaluation() {
  const { students, evaluations, addEvaluation, removeEvaluation } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function studentName(id) {
    return students.find((s) => s.id === id)?.hoTen ?? 'Học sinh đã xóa'
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.hocSinhId) return
    addEvaluation(form)
    setForm(emptyForm)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản trị"
        eyebrowIcon={Star}
        title="Đánh giá học sinh"
        description="Ghi nhận đánh giá hằng ngày về ăn uống, ngủ nghỉ và ý thức của từng học sinh trong giờ bán trú."
        controls={
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            Thêm đánh giá
          </Button>
        }
      />

      <Card title="Lịch sử đánh giá" description={`${evaluations.length} lượt đánh giá`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr>
                {['Ngày', 'Học sinh', 'Ăn uống', 'Ngủ nghỉ', 'Ý thức', 'Nhận xét', ''].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {evaluations.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-600">{ev.ngay}</td>
                  <td className="px-3 py-3 font-medium text-gray-900">{studentName(ev.hocSinhId)}</td>
                  <td className="px-3 py-3"><Badge tone={LEVEL_TONE[ev.anUong]}>{ev.anUong}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={LEVEL_TONE[ev.nguNghi]}>{ev.nguNghi}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={LEVEL_TONE[ev.yThuc]}>{ev.yThuc}</Badge></td>
                  <td className="px-3 py-3 max-w-xs text-gray-500">{ev.nhanXet}</td>
                  <td className="px-3 py-3">
                    <button onClick={() => removeEvaluation(ev.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {evaluations.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-sm text-gray-400">Chưa có đánh giá nào.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Thêm đánh giá học sinh"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmit}>Lưu đánh giá</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Học sinh" value={form.hocSinhId} onChange={(e) => setForm({ ...form, hocSinhId: e.target.value })} required>
            <option value="">-- Chọn học sinh --</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.hoTen} ({s.lop})</option>)}
          </Select>
          <Input type="date" label="Ngày" value={form.ngay} onChange={(e) => setForm({ ...form, ngay: e.target.value })} />
          <Select label="Ăn uống" value={form.anUong} onChange={(e) => setForm({ ...form, anUong: e.target.value })}>
            {EVAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Select label="Ngủ nghỉ" value={form.nguNghi} onChange={(e) => setForm({ ...form, nguNghi: e.target.value })}>
            {EVAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Select label="Ý thức" value={form.yThuc} onChange={(e) => setForm({ ...form, yThuc: e.target.value })}>
            {EVAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
          <Textarea label="Nhận xét" className="sm:col-span-2" rows={3} value={form.nhanXet} onChange={(e) => setForm({ ...form, nhanXet: e.target.value })} />
        </form>
      </Modal>
    </div>
  )
}
