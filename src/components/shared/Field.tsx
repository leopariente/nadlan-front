interface FieldProps {
  label: string
  unit?: string
  children: React.ReactNode
}

export function Field({ label, unit, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500">
        {label}
        {unit && <span className="text-slate-400 font-normal ms-1">({unit})</span>}
      </label>
      {children}
    </div>
  )
}
