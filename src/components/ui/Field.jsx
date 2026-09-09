export function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
      <input
        className={`rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
        {...props}
      />
    </label>
  )
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
      <select
        className={`rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
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
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
      <textarea
        className={`rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-100 ${className}`}
        {...props}
      />
    </label>
  )
}
