export default function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="mt-1 w-4 h-4 rounded bg-slate-200 flex-shrink-0" />
        <div className="flex-1 flex items-start justify-between">
          <div className="space-y-2 text-right">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
