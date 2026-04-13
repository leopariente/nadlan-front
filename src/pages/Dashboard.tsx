import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { loadProjects } from '@/store/projects/projectActions'
import { createReport } from '@/store/reportData/reportDataActions'
import type { CreateReportPayload } from '@/store/reportData/reportDataApi'
import { inputClass } from '@/components/shared/formStyles'

export default function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const projects = useAppSelector(s => s.projects.projects)

  const [showForm, setShowForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [address, setAddress] = useState('')
  const [gush, setGush] = useState('')
  const [helka, setHelka] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(loadProjects())
  }, [dispatch])

  const handleCreate = async () => {
    const name = projectName.trim()
    if (!name || isCreating) return

    const payload: CreateReportPayload = {
      projectName: name,
      address: address.trim(),
      gush: gush.trim(),
      helka: helka.trim(),
    }

    setIsCreating(true)
    setCreateError(null)
    try {
      const result = await dispatch(createReport(payload)).unwrap()
      setShowForm(false)
      setProjectName('')
      setAddress('')
      setGush('')
      setHelka('')
      navigate(`/report/${result.project.id}`)
    } catch {
      setCreateError('שגיאה ביצירת הפרויקט — נסה שוב')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">דוח אפס</h1>
          <p className="text-slate-500 mt-1">כלי לניתוח כדאיות נדל"ן</p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700">הפרויקטים שלי</h2>
          <Button variant="default" size="sm" onClick={() => { setShowForm(v => !v); setCreateError(null) }}>
            + פרויקט חדש
          </Button>
        </div>

        {showForm && (
          <div className="mb-6 bg-white rounded-xl border border-blue-200 p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-slate-700">פרויקט חדש</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">שם הפרויקט *</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="למשל: הרצל 12 — פינוי-בינוי"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">כתובת</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="למשל: הרצל 12, תל אביב-יפו"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">גוש</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="למשל: 6660"
                  value={gush}
                  onChange={e => setGush(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">חלקה</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="למשל: 50"
                  value={helka}
                  onChange={e => setHelka(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreate()}
                />
              </div>
            </div>
            {createError && (
              <p className="text-xs text-red-500 text-right">{createError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowForm(false); setProjectName(''); setAddress(''); setGush(''); setHelka(''); setCreateError(null) }}
                disabled={isCreating}
              >
                ביטול
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleCreate}
                disabled={!projectName.trim() || isCreating}
              >
                {isCreating ? 'יוצר...' : 'צור פרויקט'}
              </Button>
            </div>
          </div>
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
          ))}
        </div>
      </div>
    </div>
  )
}
