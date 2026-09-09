export default function PageHeader({ eyebrow, eyebrowIcon: EyebrowIcon, title, description, controls }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
              {EyebrowIcon && <EyebrowIcon size={14} />}
              {eyebrow}
            </span>
          )}
          <h1 className="mt-3 text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>}
        </div>
        {controls && <div className="flex flex-wrap items-center gap-2">{controls}</div>}
      </div>
    </div>
  )
}
