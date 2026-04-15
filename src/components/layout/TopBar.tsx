import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/redux'
import { clearToken } from '@/store/auth/authSlice'

interface Props {
  onMenuClick?: () => void
}

export default function TopBar({ onMenuClick }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleSignOut() {
    dispatch(clearToken())
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      <span className="text-sm font-bold text-blue-700 tracking-tight">דוח אפס</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSignOut}
          className="text-sm text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
        >
          יציאה
        </button>
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="פתח תפריט ניווט"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  )
}
