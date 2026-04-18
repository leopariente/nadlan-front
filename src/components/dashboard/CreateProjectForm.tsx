import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/hooks/redux'
import { createReport } from '@/store/reportData/reportDataActions'
import type { CreateReportPayload } from '@/store/reportData/reportDataApi'
import { inputClass } from '@/components/shared/formStyles'

interface Props {
  onClose: () => void
}

export default function CreateProjectForm({ onClose }: Props) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [projectName, setProjectName] = useState('')
  const [address, setAddress] = useState('')
  const [gush, setGush] = useState('')
  const [helka, setHelka] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

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
      navigate(`/report/${result.project.id}`)
    } catch {
      setCreateError('שגיאה ביצירת הפרויקט — נסה שוב')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancel = () => {
    setProjectName('')
    setAddress('')
    setGush('')
    setHelka('')
    setCreateError(null)
    onClose()
  }

  return (
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
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isCreating}>
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
  )
}
