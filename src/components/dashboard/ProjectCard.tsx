import type { ProjectSummary } from '@/types'

interface Props {
  project: ProjectSummary
  isSelected: boolean
  onSelect: (e: React.MouseEvent) => void
  onClick: () => void
}

export default function ProjectCard({ project, isSelected, onSelect, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group ${
        isSelected ? 'border-blue-400 bg-blue-50' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          onClick={onSelect}
          className={`mt-1 w-4 h-4 rounded border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors ${
            isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 hover:border-blue-400'
          }`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div className="flex-1 flex items-start justify-between">
          <div className="text-right">
            <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
              {project.projectName}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{project.address}</p>
            {(project.gush || project.helka) && (
              <p className="text-xs text-slate-400 mt-1">
                {project.gush && <span>גוש {project.gush}</span>}
                {project.gush && project.helka && <span className="mx-1">·</span>}
                {project.helka && <span>חלקה {project.helka}</span>}
              </p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              עודכן לאחרונה: {new Date(project.updatedAt).toLocaleDateString('he-IL')}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
            דוח אפס
          </span>
        </div>
      </div>
    </div>
  )
}
