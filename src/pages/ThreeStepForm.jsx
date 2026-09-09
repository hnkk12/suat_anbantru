import { useMemo, useState } from 'react'
import { Check, ListOrdered, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Select, Input, Textarea } from '../components/ui/Field'
import { BOARDING_STATUS } from '../data/mockData'

const STEPS = ['Chọn học sinh', 'Chọn loại đăng ký', 'Xác nhận']

function Stepper({ step }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, idx) => {
        const n = idx + 1
        const active = n === step
        const done = n < step
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-green-600 text-white' : active ? 'border-2 border-green-600 text-green-600' : 'border-2 border-gray-200 text-gray-400'
                }`}
              >
                {done ? <Check size={16} /> : n}
              </div>
              <span className={`text-xs font-medium ${active || done ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
            </div>
            {n !== STEPS.length && (
              <div className={`mx-2 mb-5 h-0.5 flex-1 ${done ? 'bg-green-600' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

const emptyForm = {
  hocSinhId: '', loaiDangKy: BOARDING_STATUS.BAN_TRU, ngayApDung: new Date().toISOString().slice(0, 10), ghiChu: '',
}

export default function ThreeStepForm() {
  const { students, addRegistration } = useApp()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [done, setDone] = useState(false)

  const selectedStudent = useMemo(() => students.find((s) => s.id === form.hocSinhId), [students, form.hocSinhId])

  function next() {
    if (step === 1 && !form.hocSinhId) return
    setStep((s) => Math.min(3, s + 1))
  }
  function back() {
    setStep((s) => Math.max(1, s - 1))
  }

  function handleConfirm() {
    addRegistration({ ...form, ngayTao: new Date().toISOString().slice(0, 10) })
    setDone(true)
  }

  function reset() {
    setForm(emptyForm)
    setStep(1)
    setDone(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Đăng ký bán trú"
        eyebrowIcon={ListOrdered}
        title="Biểu mẫu đăng ký 3 bước"
        description="Đăng ký loại hình bán trú cho học sinh theo quy trình 3 bước: chọn học sinh, chọn loại đăng ký, xác nhận thông tin."
      />

      <Card>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Đăng ký thành công</h3>
            <p className="max-w-md text-sm text-gray-500">
              Đã ghi nhận đăng ký <span className="font-medium text-gray-700">{form.loaiDangKy}</span> cho học sinh{' '}
              <span className="font-medium text-gray-700">{selectedStudent?.hoTen}</span> áp dụng từ ngày {form.ngayApDung}.
            </p>
            <Button onClick={reset}>Tạo đăng ký khác</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <Stepper step={step} />

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Chọn học sinh cần đăng ký</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setForm({ ...form, hocSinhId: s.id })}
                      className={`flex items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                        form.hocSinhId === s.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{s.hoTen}</p>
                        <p className="text-xs text-gray-500">Lớp {s.lop} · {s.phuHuynh}</p>
                      </div>
                      {form.hocSinhId === s.id && <Check size={18} className="text-green-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Loại đăng ký" value={form.loaiDangKy} onChange={(e) => setForm({ ...form, loaiDangKy: e.target.value })}>
                  {Object.values(BOARDING_STATUS).map((v) => <option key={v} value={v}>{v}</option>)}
                </Select>
                <Input type="date" label="Ngày áp dụng" value={form.ngayApDung} onChange={(e) => setForm({ ...form, ngayApDung: e.target.value })} />
                <Textarea label="Ghi chú thêm (không bắt buộc)" className="sm:col-span-2" rows={3} value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-5 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Học sinh</span>
                  <span className="font-medium text-gray-900">{selectedStudent?.hoTen} — Lớp {selectedStudent?.lop}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Loại đăng ký</span>
                  <span className="font-medium text-gray-900">{form.loaiDangKy}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Ngày áp dụng</span>
                  <span className="font-medium text-gray-900">{form.ngayApDung}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ghi chú</span>
                  <span className="max-w-xs text-right font-medium text-gray-900">{form.ghiChu || '—'}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <Button variant="secondary" onClick={back} disabled={step === 1}>
                <ChevronLeft size={16} /> Quay lại
              </Button>
              {step < 3 ? (
                <Button onClick={next} disabled={step === 1 && !form.hocSinhId}>
                  Tiếp tục <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleConfirm}>Xác nhận đăng ký</Button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
