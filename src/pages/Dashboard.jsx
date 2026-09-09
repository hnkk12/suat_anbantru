import { useState } from 'react'
import { Search } from 'lucide-react'
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
                className="w-56 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng học sinh" value={stats.tongHocSinh} />
        <StatCard label="Tổng suất bán trú" value={stats.tongSuatBanTru} unit="suất" hint={`Ngày ${selectedDate}`} />
        <StatCard label="Số lớp" value={stats.soLop} />
        <StatCard label="Năm học đang chọn" value={schoolYear} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Đã điểm danh" value={`${stats.daDiemDanh} / ${stats.tongHocSinh}`} hint={`Ngày ${selectedDate}`} />
        <StatCard label="Bán trú" value={stats.banTru} unit="học sinh" hint="Trạng thái bán trú trong ngày" />
        <StatCard label="Không bán trú" value={stats.khongBanTru} unit="học sinh" hint="Trạng thái bán trú trong ngày" />
        <StatCard label="Chỉ ngủ bán trú" value={stats.chiNgu} unit="học sinh" hint="Trạng thái bán trú trong ngày" />
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
