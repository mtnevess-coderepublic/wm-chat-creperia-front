import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/api'
import logo from '../assets/logo.png'

export function LoginPage() {
  const { isAuthenticated, loginWithPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [passwordReadOnly, setPasswordReadOnly] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from ?? '/eventos'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginWithPassword(password)
      navigate('/eventos', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível entrar.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-brand-950">
      {/* Vídeo por Eva Bronzini (https://www.pexels.com/@eva-bronzini/) no Pexels (https://www.pexels.com/). */}
      <video autoPlay loop muted playsInline className="absolute inset-0 z-0 h-full w-full object-cover">
        <source src="/videos/background_video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/80 via-brand-950/70 to-black/80" />

      <div className="relative z-20 w-full max-w-sm px-4">
        <div className="w-full rounded-xl border border-white/10 bg-white shadow-2xl">
          <div className="flex flex-col items-center gap-3 px-6 pb-1 pt-6">
            <img src={logo} alt="Créperia da Praia" className="h-20 w-auto rounded-lg shadow-md" />
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">Portal da equipe</p>
              <h1 className="mt-1 text-2xl font-bold text-stone-900">Bem-vindo!</h1>
              <p className="mt-1 text-sm text-stone-500">Entre com a senha do portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 pb-6 pt-4">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-stone-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoFocus
                placeholder="••••••••"
                autoComplete="off"
                readOnly={passwordReadOnly}
                onFocus={() => setPasswordReadOnly(false)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 w-full rounded-md border border-stone-300 bg-transparent px-3 text-sm text-stone-900 shadow-sm outline-none transition-colors focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30"
              />
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-9 w-full rounded-md bg-brand-600 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      <div className="absolute right-0 bottom-4 left-0 z-20 text-center text-xs text-white/40">
        <p>
          Desenvolvido por{' '}
          <a
            href="https://www.coderepublic.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-white/70"
          >
            CodeRepublic
          </a>
        </p>
      </div>
    </div>
  )
}
