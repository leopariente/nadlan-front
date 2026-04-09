interface Props {
  label: string
  value: number
  unit?: string
}

export function MetricCard({ label, value, unit = 'מ"ר' }: Props) {
  return (
    <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-800 tabular-nums">
        {Math.round(value).toLocaleString('he-IL')}
        <span className="text-xs font-normal text-slate-400 ms-1">{unit}</span>
      </p>
    </div>
  )
}
