import { useNavigate } from 'react-router-dom'

interface Props {
  to?: string
  label?: string
}

export default function BackButton({ to = '/', label = 'חזרה לפרויקטים' }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="mt-1 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
