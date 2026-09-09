export default function StatCard({ icon: Icon, label, value, unit, hint, tone = 'green' }) {
  const toneMap = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    orange: 'bg-orange-50 text-orange-600',
    gray: 'bg-gray-100 text-gray-500',
  }
  return (
    <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          {value}
          {unit && <span className="ml-1 text-sm font-medium text-gray-400">{unit}</span>}
        </p>
        {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      </div>
      {Icon && (
        <div className={`rounded-lg p-2.5 ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
