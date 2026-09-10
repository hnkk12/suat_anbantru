import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]">
      <div className={`w-full ${width} overflow-hidden rounded-2xl border border-[#d9dad5] bg-white shadow-[0_20px_60px_rgba(22,31,29,0.18)]`}>
        <div className="flex items-center justify-between border-b border-[#e7e8e4] px-5 py-4">
          <h3 className="text-lg font-semibold tracking-tight text-[#20211f]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-[#e7e8e4] bg-[#fbfbf9] px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
