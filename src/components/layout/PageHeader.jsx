export default function PageHeader({ title, description, controls }) {
  return (
    <div className="py-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.025em] text-[#20211f] sm:text-[28px]">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-[#676a65]">{description}</p>}
        </div>
        {controls && <div className="flex flex-wrap items-end gap-2">{controls}</div>}
      </div>
    </div>
  )
}
