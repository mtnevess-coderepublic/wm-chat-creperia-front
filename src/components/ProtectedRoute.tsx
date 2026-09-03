import type { ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AuthScope } from '../lib/types'

interface ProtectedRouteProps {
  children: ReactNode
  requireScope?: AuthScope // 'full' exige acesso total; omitido aceita 'full' ou 'event'
}

/**
 * Sessão de link de evento (scope "event") tentando abrir uma área do portal.
 * Não dá para redirecionar para "/" — a home manda de volta para cá e o app trava
 * em loop —, então mostramos as saídas possíveis.
 */
function FullAccessRequired() {
  const { eventId, logout } = useAuth()
  const navigate = useNavigate()

  function handleLoginAgain() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-stone-200 bg-white p-6 text-center">
      <h1 className="text-lg font-semibold text-stone-900">Acesso restrito</h1>
      <p className="mt-2 text-sm text-stone-600">
        Você entrou pelo link do seu evento, que dá acesso apenas a ele. Para abrir esta área é
        preciso entrar com a senha da equipe.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {eventId && (
          <Link
            to={`/eventos/${eventId}`}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Voltar para o meu evento
          </Link>
        )}
        <button
          type="button"
          onClick={handleLoginAgain}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
        >
          Entrar com a senha da equipe
        </button>
      </div>
    </div>
  )
}

export function ProtectedRoute({ children, requireScope }: ProtectedRouteProps) {
  const { isAuthenticated, scope } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireScope === 'full' && scope !== 'full') {
    return <FullAccessRequired />
  }

  return <>{children}</>
}
