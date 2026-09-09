import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BarChart3, Users, UtensilsCrossed, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import StatCard from '../components/layout/StatCard'
import { Select } from '../components/ui/Field'
import Tabs from '../components/ui/Tabs'

const WEEK_DATA = [
  { day: 'T2', suat: 3 }, { day: 'T3', suat: 4 }, { day: 'T4', suat: 4 },
  { day: 'T5', suat: 2 }, { day: 'T6', suat: 4 },
]

const TABS = [
  { value: 'tong-hop', label: 'Tổng hợp' },
  { value: 'diem-danh', label: 'Điểm danh' },
  { value: 'lop', label: 'Theo lớp' },
]

export default function Reports() {
  const { students, classes, evaluations } = useApp()
  const [params] = useSearchParams()
  const initialTab = params.get('tab') === 'diem-danh' || params.get('tab') === 'lop' ? params.get('tab') : 'tong-hop'
  const [tab, setTab] = useState(initialTab)
  const [range, setRange] = useState('Tuần này')

  const maxSuat = Math.max(...WEEK_DATA.map((d) => d.suat), 1)

  const classBreakdown = useMemo(() => {
    return classes.map((c) => ({
      ...c,
      soHocSinh: students.filter((s) => s.lop === c.name).length,
      banTru: students.filter((s) => s.lop === c.name && s.trangThai === 'Bán trú').length,
    }))
  }, [classes, students])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Báo cáo"
        eyebrowIcon={BarChart3}
        title="Báo cáo bán trú"
        description="Tổng hợp số liệu học sinh, suất ăn và điểm danh bán trú theo thời gian."
        controls={
          <Select value={range} onChange={(e) => setRange(e.target.value)}>
            <option>Tuần này</option>
            <option>Tháng này</option>
            <option>Học kỳ này</option>
          </Select>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Tổng học sinh" value={students.length} tone="green" />
        <StatCard icon={UtensilsCrossed} label="Suất ăn / tuần (ước tính)" value={WEEK_DATA.reduce((a, b) => a + b.suat, 0)} tone="amber" />
        <StatCard icon={TrendingUp} label="Lượt đánh giá đã ghi nhận" value={evaluations.length} tone="blue" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 pt-2">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        <div className="p-5">
          {tab === 'tong-hop' && (
            <div>
              <p className="mb-4 text-sm font-medium text-gray-600">Số suất bán trú theo ngày trong tuần</p>
              <div className="flex items-end gap-4 sm:gap-8">
                {WEEK_DATA.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-40 w-full items-end justify-center">
                      <div
                        className="w-8 rounded-t-md bg-green-500 sm:w-12"
                        style={{ height: `${(d.suat / maxSuat) * 100}%` }}
                        title={`${d.suat} suất`}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{d.day}</span>
                    <span className="text-xs text-gray-400">{d.suat} suất</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'diem-danh' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr>
                    {['Ngày', 'Học sinh', 'Ăn uống', 'Ngủ nghỉ', 'Ý thức'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {evaluations.map((ev) => (
                    <tr key={ev.id}>
                      <td className="px-3 py-3 text-gray-600">{ev.ngay}</td>
                      <td className="px-3 py-3 font-medium text-gray-900">{students.find((s) => s.id === ev.hocSinhId)?.hoTen ?? '—'}</td>
                      <td className="px-3 py-3 text-gray-600">{ev.anUong}</td>
                      <td className="px-3 py-3 text-gray-600">{ev.nguNghi}</td>
                      <td className="px-3 py-3 text-gray-600">{ev.yThuc}</td>
                    </tr>
                  ))}
                  {evaluations.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Chưa có dữ liệu điểm danh.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'lop' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead>
                  <tr>
                    {['Lớp', 'Khối', 'Sĩ số', 'Học sinh trong hệ thống', 'Bán trú'].map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classBreakdown.map((c) => (
                    <tr key={c.id}>
                      <td className="px-3 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-3 py-3 text-gray-600">{c.khoi}</td>
                      <td className="px-3 py-3 text-gray-600">{c.siSo}</td>
                      <td className="px-3 py-3 text-gray-600">{c.soHocSinh}</td>
                      <td className="px-3 py-3 text-gray-600">{c.banTru}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
