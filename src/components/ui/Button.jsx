const VARIANTS = {
  primary: 'border border-teal-800 bg-teal-800 text-white shadow-sm hover:border-teal-900 hover:bg-teal-900 hover:shadow-md',
  secondary: 'border border-[#c8cac5] bg-white text-[#30332f] shadow-[0_1px_2px_rgba(31,40,37,0.03)] hover:border-[#9fa39d] hover:bg-[#fafaf8]',
  danger: 'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50',
  ghost: 'text-gray-500 hover:bg-[#f3f4f1] hover:text-gray-800',
}

const SIZES = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm font-semibold',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
