import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { loadProjects } from '@/store/projectsSlice'

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const projects = useAppSelector(s => s.projects.projects)
  const loadStatus = useAppSelector(s => s.projects.loadStatus)

  useEffect(() => {
    dispatch(loadProjects())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">דוח אפס</h1>
          <p className="text-slate-500 mt-1">כלי לניתוח כדאיות נדל"ן</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">הפרויקטים שלי</h2>
          <Button variant="default" size="sm">
            + פרויקט חדש
          </Button>
        </div>

        {loadStatus === 'loading' && (
          <p className="text-slate-400 text-sm">טוען פרויקטים...</p>
        )}

        {loadStatus === 'error' && (
          <p className="text-red-500 text-sm">שגיאה בטעינת הפרויקטים</p>
        )}

        <div className="grid gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/report/${project.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="text-right">
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{project.address}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    עודכן לאחרונה: {new Date(project.updatedAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                  דוח אפס
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
