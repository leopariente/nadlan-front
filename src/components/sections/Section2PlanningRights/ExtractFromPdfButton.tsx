import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ReportDataApi } from '@/store/reportData/reportDataApi'
import type { Section2Data } from '@/types'

const api = new ReportDataApi()

interface Props {
  onSuccess: (data: Section2Data) => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ExtractFromPdfButton({ onSuccess }: Props) {
  const { id: reportId } = useParams<{ id: string }>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  function handleClick() {
    fileRef.current?.click()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // reset so same file can be re-picked
    e.target.value = ''

    setStatus('loading')
    setMessage(null)
    try {
      const result = await api.extractRights(reportId ?? '', file)
      onSuccess(result.section2)
      setStatus('success')
      setMessage(`חולצו נתונים מ-${result.page_count} עמודים`)
    } catch (err: unknown) {
      setStatus('error')
      const axiosErr = err as { response?: { data?: { detail?: string; message?: string } } }
      const detail =
        axiosErr?.response?.data?.detail ??
        axiosErr?.response?.data?.message ??
        'שגיאה בעיבוד הקובץ'
      setMessage(detail)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        disabled={status === 'loading'}
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            מחלץ נתונים...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            חילוץ זכויות מ-PDF
          </>
        )}
      </button>

      {message && (
        <span
          className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
