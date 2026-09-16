export default function StatCard({ label, value, unit, hint }) {
  return (
    <div className="flex min-h-[96px] flex-col justify-between rounded-[16px] border border-[#e3e4df] bg-white p-[18px] shadow-xs transition-all hover:border-[#cfd1cb]">
      <span className="text-[12.5px] font-medium text-[#6b6f68]">{label}</span>
      <div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[21px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">{value}</span>
          {unit && <span className="text-[12px] font-medium text-[#9a9d96]">{unit}</span>}
        </div>
        {hint && <p className="mt-1 text-[11.5px] text-[#9a9d96]">{hint}</p>}
      </div>
    </div>
  )
}
