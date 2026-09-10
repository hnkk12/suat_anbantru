export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-[#dedfda]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`relative pb-3 pt-1 text-sm transition-colors ${
            active === tab.value
              ? 'font-semibold text-[#20211f]'
              : 'font-medium text-[#686b66] hover:text-[#20211f]'
          }`}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-teal-700" />
          )}
        </button>
      ))}
    </div>
  )
}
