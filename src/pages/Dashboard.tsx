import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { loadProjects, deleteProjects } from '@/store/projects/projectActions'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TopBar from '@/components/layout/TopBar'
import ProjectCard from '@/components/dashboard/ProjectCard'
import ProjectCardSkeleton from '@/components/dashboard/ProjectCardSkeleton'
import ProjectsEmptyState from '@/components/dashboard/ProjectsEmptyState'
import ProjectsErrorState from '@/components/dashboard/ProjectsErrorState'
import CreateProjectForm from '@/components/dashboard/CreateProjectForm'

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const projects = useAppSelector(s => s.projects.projects)
  const loadStatus = useAppSelector(s => s.projects.loadStatus)

  const [showForm, setShowForm] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionsOpen, setActionsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(loadProjects())
  }, [dispatch])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setActionsOpen(false)
      }
    }
    if (actionsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [actionsOpen])

  function toggleSelect(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleDelete = async () => {
    await dispatch(deleteProjects([...selectedIds])).unwrap()
    setSelectedIds(new Set())
    setActionsOpen(false)
  }

  const selectionCount = selectedIds.size
  const showList = (loadStatus === 'loaded' || loadStatus === 'idle') && projects.length > 0

  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar />
      <div className="pt-14 px-4 sm:px-8 pb-4 sm:pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">דוח אפס</h1>
            <p className="text-slate-500 mt-1">כלי לניתוח כדאיות נדל"ן</p>
          </div>

          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-700">הפרויקטים שלי</h2>
            <div className="flex items-center gap-2">
              {selectionCount > 0 && (
                <div className="relative" ref={actionsRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActionsOpen(v => !v)}
                    className="text-base leading-none px-2.5"
                  >
                    ⋮
                  </Button>
                  {actionsOpen && (
                    <div className="absolute start-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      <button
                        type="button"
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => { setActionsOpen(false); setShowDeleteDialog(true) }}
                      >
                        מחק ({selectionCount})
                      </button>
                    </div>
                  )}
                </div>
              )}
              <Button variant="default" size="sm" onClick={() => setShowForm(v => !v)}>
                + פרויקט חדש
              </Button>
            </div>
          </div>

          {showForm && <CreateProjectForm onClose={() => setShowForm(false)} />}

          {loadStatus === 'loading' && (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => <ProjectCardSkeleton key={i} />)}
            </div>
          )}

          {loadStatus === 'loaded' && projects.length === 0 && (
            <ProjectsEmptyState onCreateClick={() => setShowForm(true)} />
          )}

          {loadStatus === 'error' && (
            <ProjectsErrorState onRetry={() => dispatch(loadProjects())} />
          )}

          {showList && (
            <div className="grid gap-4">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isSelected={selectedIds.has(project.id)}
                  onSelect={e => toggleSelect(e, project.id)}
                  onClick={() => navigate(`/report/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="מחיקת פרויקטים"
          description={`האם למחוק ${selectionCount} פרויקט${selectionCount > 1 ? 'ים' : ''}? פעולה זו אינה הפיכה.`}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}
