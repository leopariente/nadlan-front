interface CardProps {
  title: string
  children: React.ReactNode
  bodyClassName?: string
}

export function Card({ title, children, bodyClassName = 'p-5' }: CardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
