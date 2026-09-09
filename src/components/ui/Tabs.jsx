export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-5 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`relative pb-3 pt-1 text-sm transition-colors ${
            active === tab.value
              ? 'font-semibold text-gray-900'
              : 'font-medium text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-pink-600" />
          )}
        </button>
      ))}
    </div>
  )
}
