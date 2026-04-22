import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { refreshAccessToken } from '@/store/auth/authActions'
import { isTokenExpired } from '@/lib/utils'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector(state => state.auth.accessToken)
  const refreshToken = useAppSelector(state => state.auth.refreshToken)

  const [initializing, setInitializing] = useState(
    () => !!accessToken && isTokenExpired(accessToken) && !!refreshToken,
  )
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || !initializing) return
    initialized.current = true
    dispatch(refreshAccessToken())
      .unwrap()
      .catch(() => {})
      .finally(() => setInitializing(false))
  }, [dispatch, initializing])

  if (initializing) return null
  if (!accessToken) return <Navigate to="/login" replace />
  return <>{children}</>
}
