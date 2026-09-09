export default function Card({ children, className = '', title, description, action }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-gray-400">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
