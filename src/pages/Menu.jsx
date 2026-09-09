import { useState } from 'react'
import { ClipboardList, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PageHeader from '../components/layout/PageHeader'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { Textarea } from '../components/ui/Field'
import { DAYS_OF_WEEK, MEALS } from '../data/mockData'

export default function Menu() {
  const { menu, updateMenuCell } = useApp()
  const [editing, setEditing] = useState(null)
  const [value, setValue] = useState('')

  function openEdit(day, meal) {
    setEditing({ day, meal })
    setValue(menu[day]?.[meal] ?? '')
  }

  function handleSave(e) {
    e.preventDefault()
    updateMenuCell(editing.day, editing.meal, value)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quản trị"
        eyebrowIcon={ClipboardList}
        title="Thực đơn tuần"
        description="Xây dựng thực đơn bán trú theo tuần. Bấm vào từng ô để chỉnh sửa món ăn."
      />

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Bữa ăn</th>
              {DAYS_OF_WEEK.map((d) => (
                <th key={d} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MEALS.map((meal) => (
              <tr key={meal}>
                <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-700">{meal}</td>
                {DAYS_OF_WEEK.map((day) => (
                  <td key={day} className="group relative min-w-[180px] px-4 py-4 align-top text-gray-600">
                    <div className="flex items-start justify-between gap-2">
                      <span>{menu[day]?.[meal] || <span className="text-gray-300">Chưa có thực đơn</span>}</span>
                      <button
                        onClick={() => openEdit(day, meal)}
                        className="shrink-0 rounded-lg p-1 text-gray-300 opacity-0 transition-opacity hover:bg-gray-100 hover:text-green-600 group-hover:opacity-100"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `${editing.meal} - ${editing.day}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thực đơn</Button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <Textarea
            label="Món ăn"
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nhập tên món ăn, cách nhau bởi dấu phẩy..."
            autoFocus
          />
        </form>
      </Modal>
    </div>
  )
}
