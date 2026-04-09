import { cn } from '@/lib/utils'

export function ComputedRow({
  label,
  value,
  unit = 'מ"ר',
}: {
  label: React.ReactNode
  value: number
  unit?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5">
      <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">{label}</span>
      <span className="text-sm font-bold text-slate-700 tabular-nums">
        {Math.round(value).toLocaleString('he-IL')}
        <span className="text-xs font-normal text-slate-400 ms-1">{unit}</span>
      </span>
    </div>
  )
}

export function Section1Row({
  label,
  value,
  unit = 'מ"ר',
}: {
  label: string
  value: number
  unit?: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-100/70 border border-slate-200 px-4 py-2.5">
      <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="bg-slate-300 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-semibold leading-none">
          מסעיף 1
        </span>
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-600 tabular-nums">
        {Math.round(value).toLocaleString('he-IL')}
        <span className="text-xs font-normal text-slate-400 ms-1">{unit}</span>
      </span>
    </div>
  )
}

export function InlineInputRow({
  label,
  value,
  onChange,
  placeholder,
  unit = 'מ"ר',
  disabled,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  placeholder?: string
  unit?: string
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-4 py-2">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={0}
          disabled={disabled}
          value={value || ''}
          placeholder={placeholder ?? '0'}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={
            'w-20 rounded border border-slate-200 px-2 py-1 text-sm text-right text-slate-800 tabular-nums ' +
            'focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed'
          }
        />
        <span className="text-xs text-slate-400 w-6">{unit}</span>
      </div>
    </div>
  )
}

export function KeyRow({
  label,
  value,
  unit = 'מ"ר',
}: {
  label: string
  value: number
  unit?: string
}) {
  const isNeg = value < 0
  return (
    <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
      <span className="text-xs font-semibold text-amber-900">{label}</span>
      <span className={cn('text-sm font-bold tabular-nums', isNeg ? 'text-red-600' : 'text-amber-800')}>
        {Math.round(value).toLocaleString('he-IL')}
        <span className={cn('text-xs font-normal ms-1', isNeg ? 'text-red-400' : 'text-amber-600')}>
          {unit}
        </span>
      </span>
    </div>
  )
}
