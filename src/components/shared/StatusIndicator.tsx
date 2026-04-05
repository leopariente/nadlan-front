import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { setSaveStatus, type SaveStatus } from '@/store/reportSlice'
import { cn } from '@/lib/utils'

type Props = {
  saveStatus: SaveStatus
  setSaveStatus: (status: SaveStatus) => void
}

function StatusIndicator({ saveStatus, setSaveStatus }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (saveStatus === 'saved') {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [saveStatus, setSaveStatus])

  if (saveStatus === 'idle') return null

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-sm px-3 py-1 rounded-full',
        saveStatus === 'saving' && 'text-slate-500',
        saveStatus === 'saved' && 'text-green-600',
        saveStatus === 'error' && 'text-red-600'
      )}
    >
      {saveStatus === 'saving' && (
        <>
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          שומר...
        </>
      )}
      {saveStatus === 'saved' && (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          נשמר
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
          שגיאה בשמירה
        </>
      )}
    </span>
  )
}

const mapStateToProps = (state: RootState) => ({
  saveStatus: state.report.saveStatus,
})

const mapDispatchToProps = {
  setSaveStatus,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(StatusIndicator)
