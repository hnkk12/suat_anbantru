export default function StatCard({ label, value, unit, hint }) {
  return (
    <div className="rounded-2xl border border-[#d9dad5] bg-white p-5 shadow-[0_2px_9px_rgba(31,40,37,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_16px_rgba(31,40,37,0.07)]">
      <p className="text-sm font-medium text-[#666a65]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#20211f]">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-gray-400">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
