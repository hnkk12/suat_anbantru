export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-5 border-b border-[#eceeea]">
      {tabs.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`cursor-pointer pb-2.5 text-[13px] transition-colors ${
              isActive
                ? 'border-b-2 border-[#c84b26] font-semibold text-[#c84b26]'
                : 'border-b-2 border-transparent font-medium text-[#8a8d86] hover:text-[#1c1d1b]'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

