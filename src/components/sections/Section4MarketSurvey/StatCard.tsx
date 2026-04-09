interface Props {
  label: string
  value: string | number
  suffix?: string
}

export function StatCard({ label, value, suffix = '' }: Props) {
  return (
    <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2.5 min-w-0">
      <p className="text-[11px] text-slate-400 truncate">{label}</p>
      <p className="text-sm font-bold text-slate-700 tabular-nums truncate">
        {typeof value === 'number' ? Math.round(value).toLocaleString('he-IL') : value}
        {suffix && <span className="text-xs font-normal text-slate-400 ms-1">{suffix}</span>}
      </p>
    </div>
  )
}
