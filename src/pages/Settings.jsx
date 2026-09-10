import { Settings as SettingsIcon } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'

export default function Settings() {
  return <div className="space-y-6"><PageHeader title="Cài đặt" description="Chức năng đang được hoàn thiện." /><section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><SettingsIcon size={22} /></span><p className="mt-4 text-sm font-medium text-slate-700">Cài đặt hệ thống sẽ sớm được cập nhật.</p></section></div>
}
