import { cn } from '@/lib/utils'
import { SECTIONS, type SectionNumber } from '@/constants/sections'

interface Props {
  current: SectionNumber
  onChange: (n: SectionNumber) => void
}

export default function SectionNav({ current, onChange }: Props) {
  return (
    <nav className="p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
        שלבי הדוח
      </p>
      <ol className="space-y-0.5">
        {SECTIONS.map(({ number, label }) => {
          const isActive = current === number

          return (
            <li key={number}>
              <button
                onClick={() => onChange(number as SectionNumber)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-right',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-e-2 border-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500',
                  )}
                >
                  {number}
                </span>
                <span className="flex-1">{label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
