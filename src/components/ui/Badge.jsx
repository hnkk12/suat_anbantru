const TONE = {
  green: 'bg-[#fdf2ee] text-[#c84b26]',
  carrot: 'bg-[#fdf2ee] text-[#c85a3b] border border-[#f5c6b8]',
  orange: 'bg-[#fdf2ee] text-[#c85a3b] border border-[#f5c6b8]',
  gray: 'bg-[#f2f3ee] text-[#57605a]',
  amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
  red: 'bg-rose-50 text-rose-700 border border-rose-200/60',
  blue: 'bg-sky-50 text-sky-800 border border-sky-200/60',
}

export default function Badge({ tone = 'gray', children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-[7px] px-2.5 py-0.5 text-[12px] font-semibold ${TONE[tone] || TONE.gray} ${className}`}>
      {children}
    </span>
  )
}

