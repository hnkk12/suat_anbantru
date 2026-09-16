import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className={`w-full ${width} overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-[#eceeea] px-6 py-4">
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1c1d1b]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-[#8a8d86] hover:bg-[#f2f3ee] hover:text-[#1c1d1b] transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
        {footer && <div className="flex justify-end gap-2.5 border-t border-[#eceeea] bg-[#fafaf8] px-6 py-3.5">{footer}</div>}
      </div>
    </div>
  )
}

