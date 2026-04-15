export default function ReportSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-10 bg-slate-100" />
        <div className="p-5 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded w-32" />
              <div className="h-8 bg-slate-100 rounded w-48" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-10 bg-slate-100" />
        <div className="p-5 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded w-40" />
              <div className="h-8 bg-slate-100 rounded w-36" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
