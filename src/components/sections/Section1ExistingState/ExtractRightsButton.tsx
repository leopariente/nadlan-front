import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { extractRights } from '@/store/reportData/reportDataActions'

export function ExtractRightsButton() {
  const { id: reportId } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const status = useAppSelector(s => s.reportData?.extractionStatus ?? 'idle')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !reportId) return
    e.target.value = ''
    dispatch(extractRights({ reportId, file }))
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
        disabled={status === 'extracting'}
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'extracting' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            מחלץ זכויות...
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

      {status === 'extracted' && (
        <span className="text-sm text-green-600">הנתונים חולצו בהצלחה</span>
      )}
      {/* {status === 'error' && ( */}
        {/* <span className="text-sm text-red-500">שגיאה בעיבוד הקובץ</span> */}
      {/* )} */}
      {status == 'error' && (
        <span className="text-sm text-red-500">זה עולה לי כסף גבר, לא תרבל כלכך בקלות</span>
      )}
    </div>
  )
}
