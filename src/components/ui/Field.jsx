export function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-[12px] font-semibold text-[#57605a]">{label}</span>}
      <input
        className={`rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] placeholder:text-[#9a9d96] hover:border-[#b8bbb2] focus:border-[#c84b26] focus:outline-none focus:ring-1 focus:ring-[#c84b26]/30 transition-colors ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-[12px] font-semibold text-[#57605a]">{label}</span>}
      <select
        className={`rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] hover:border-[#b8bbb2] focus:border-[#c84b26] focus:outline-none focus:ring-1 focus:ring-[#c84b26]/30 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="text-[12px] font-semibold text-[#57605a]">{label}</span>}
      <textarea
        className={`rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] font-medium text-[#1c1d1b] placeholder:text-[#9a9d96] hover:border-[#b8bbb2] focus:border-[#c84b26] focus:outline-none focus:ring-1 focus:ring-[#c84b26]/30 transition-colors ${className}`}
        {...props}
      />
    </label>
  )
}

