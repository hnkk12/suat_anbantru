import { useState } from 'react'
import { Search, Users, UtensilsCrossed, Layers, CalendarCheck2, ClipboardCheck, Moon, UserX } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import StatCard from '../components/layout/StatCard'
import Tabs from '../components/ui/Tabs'
import { Select, Input } from '../components/ui/Field'
import StudentsTab from './dashboard/StudentsTab'
import ClassesTab from './dashboard/ClassesTab'
import TeachersTab from './dashboard/TeachersTab'

const TABS = [
  { value: 'hoc-sinh', label: 'Học sinh' },
  { value: 'lop-hoc', label: 'Lớp học' },
  { value: 'giao-vien', label: 'Tài khoản giáo viên' },
]

export default function Dashboard() {
  const { schoolYear, setSchoolYear, schoolYears, selectedDate, setSelectedDate, searchTerm, setSearchTerm, stats } = useApp()
  const [tab, setTab] = useState('hoc-sinh')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản lý học sinh"
        eyebrowIcon={Users}
        title="Danh sách theo năm học"
        description="Chọn năm học trước, sau đó dùng các tab bên dưới để thao tác đúng: học sinh, lớp học, hoặc tài khoản giáo viên."
        controls={
          <>
            <Select value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="min-w-[150px]">
              {schoolYears.map((y) => (
                <option key={y} value={y}>Năm học {y}</option>
              ))}
            </Select>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên, lớp, SĐT, email..."
                className="w-56 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Tổng học sinh" value={stats.tongHocSinh} tone="green" />
        <StatCard icon={UtensilsCrossed} label="Tổng suất bán trú" value={stats.tongSuatBanTru} unit="suất" hint={`Ngày ${selectedDate}`} tone="amber" />
        <StatCard icon={Layers} label="Số lớp" value={stats.soLop} tone="blue" />
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Năm học đang chọn</p>
          <p className="mt-2 text-xl font-bold text-green-800">Năm học {schoolYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck2} label="Đã điểm danh" value={`${stats.daDiemDanh} / ${stats.tongHocSinh}`} hint={`Ngày ${selectedDate}`} tone="blue" />
        <StatCard icon={ClipboardCheck} label="Bán trú" value={stats.banTru} unit="học sinh" hint="Trạng thái bán trú trong ngày" tone="green" />
        <StatCard icon={UserX} label="Không bán trú" value={stats.khongBanTru} unit="học sinh" hint="Trạng thái bán trú trong ngày" tone="gray" />
        <StatCard icon={Moon} label="Chỉ ngủ bán trú" value={stats.chiNgu} unit="học sinh" hint="Trạng thái bán trú trong ngày" tone="amber" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 pt-2">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        <div className="p-4">
          {tab === 'hoc-sinh' && <StudentsTab />}
          {tab === 'lop-hoc' && <ClassesTab />}
          {tab === 'giao-vien' && <TeachersTab />}
        </div>
      </div>
    </div>
  )
}
