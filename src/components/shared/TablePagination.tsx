import { cn } from '@/lib/utils'

interface Props {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onChange: (page: number) => void
}

export function TablePagination({ page, totalPages, totalItems, pageSize, onChange }: Props) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
      <span className="text-slate-500 text-xs">
        {start}–{end} מתוך {totalItems}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              'px-2.5 py-1 rounded border transition-colors text-xs font-medium',
              p === page
                ? 'bg-slate-700 border-slate-700 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100',
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>
      </div>
    </div>
  )
}
