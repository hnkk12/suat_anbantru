export default function Card({ children, className = '', title, description, action }) {
  return (
    <div className={`rounded-2xl border border-[#d9dad5] bg-white shadow-[0_2px_9px_rgba(31,40,37,0.045)] ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-[#e7e8e4] px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold tracking-tight text-[#20211f]">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
