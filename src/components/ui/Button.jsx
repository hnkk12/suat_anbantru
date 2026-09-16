const VARIANTS = {
  primary: 'border border-[#b83d18] bg-[#c84b26] text-white hover:bg-[#b03816] active:bg-[#962e10] shadow-xs',
  accent: 'border border-[#b83d18] bg-[#c84b26] text-white hover:bg-[#b03816] active:bg-[#962e10] shadow-xs',
  secondary: 'border border-[#f5c6b8] bg-[#fdf2ee] text-[#c84b26] hover:bg-[#fae4db] hover:border-[#c84b26] hover:text-[#962e10] active:bg-[#f5c6b8] shadow-xs',
  outline: 'border border-[#f5c6b8] bg-white text-[#c84b26] hover:bg-[#fdf2ee] hover:border-[#c84b26] active:bg-[#fae4db] shadow-xs',
  neutral: 'border border-[#d5d7d0] bg-white text-[#57605a] hover:bg-[#fafaf8] hover:text-[#1c1d1b] hover:border-[#b8bbb2] shadow-xs',
  danger: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
  ghost: 'bg-transparent text-[#c84b26] hover:bg-[#fdf2ee] hover:text-[#962e10]',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-[12.5px]',
  md: 'px-4 py-2.5 text-[13px]',
  lg: 'px-5 py-3 text-[14px]',
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-[10px] font-semibold cursor-pointer font-sans transition-all disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

