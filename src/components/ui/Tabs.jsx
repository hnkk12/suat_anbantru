export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.value
              ? 'text-green-700'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-green-600" />
          )}
        </button>
      ))}
    </div>
  )
}
