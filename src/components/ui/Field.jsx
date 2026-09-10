export function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-semibold text-[#565a55]">{label}</span>}
      <input
        className={`rounded-xl border border-[#cfd1cc] bg-white px-3 py-2.5 text-sm text-[#20211f] shadow-[0_1px_2px_rgba(31,40,37,0.025)] placeholder:text-gray-400 hover:border-[#aeb1ab] focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-semibold text-[#565a55]">{label}</span>}
      <select
        className={`rounded-xl border border-[#cfd1cc] bg-white px-3 py-2.5 text-sm text-[#20211f] shadow-[0_1px_2px_rgba(31,40,37,0.025)] hover:border-[#aeb1ab] focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-semibold text-[#565a55]">{label}</span>}
      <textarea
        className={`rounded-xl border border-[#cfd1cc] bg-white px-3 py-2.5 text-sm text-[#20211f] shadow-[0_1px_2px_rgba(31,40,37,0.025)] placeholder:text-gray-400 hover:border-[#aeb1ab] focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
        {...props}
      />
    </label>
  )
}
