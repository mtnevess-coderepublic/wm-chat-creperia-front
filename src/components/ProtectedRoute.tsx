import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AuthScope } from '../lib/types'

interface ProtectedRouteProps {
  children: ReactNode
  requireScope?: AuthScope // 'full' exige acesso total; omitido aceita 'full' ou 'event'
}

export function ProtectedRoute({ children, requireScope }: ProtectedRouteProps) {
  const { isAuthenticated, scope } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireScope === 'full' && scope !== 'full') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
