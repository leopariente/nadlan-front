import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const accessToken = useAppSelector(state => state.auth.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />
  return <>{children}</>
}
