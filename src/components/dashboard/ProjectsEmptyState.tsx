interface Props {
  onCreateClick: () => void
}

export default function ProjectsEmptyState({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </div>
      <p className="text-slate-700 font-medium">אין פרויקטים עדיין</p>
      <p className="text-slate-400 text-sm mt-1">צור פרויקט חדש כדי להתחיל</p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
      >
        + פרויקט חדש
      </button>
    </div>
  )
}
