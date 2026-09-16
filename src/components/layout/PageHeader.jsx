export default function PageHeader({ title, description, controls }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
      <div>
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-[540px] text-[13.5px] leading-normal text-[#6b6f68]">
            {description}
          </p>
        )}
      </div>
      {controls && (
        <div className="flex flex-wrap items-center gap-2.5">
          {controls}
        </div>
      )}
    </div>
  )
}
