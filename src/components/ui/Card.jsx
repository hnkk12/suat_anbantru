export default function Card({ children, className = '', title, description, action }) {
  return (
    <div className={`overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#eceeea] px-6 py-4">
          <div>
            {title && <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1c1d1b]">{title}</h3>}
            {description && <p className="mt-0.5 text-[12.5px] text-[#6b6f68]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

