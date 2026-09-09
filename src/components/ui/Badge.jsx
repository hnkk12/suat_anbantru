const TONE = {
  green: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  red: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
}

export default function Badge({ tone = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[tone]} ${className}`}>
      {children}
    </span>
  )
}
