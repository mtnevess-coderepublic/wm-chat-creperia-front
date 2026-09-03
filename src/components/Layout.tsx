import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoIcon from '../assets/logo-icon.png'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2 py-2 text-xs font-medium whitespace-nowrap transition-colors sm:px-3 sm:text-sm ${
    isActive ? 'bg-white/15 text-white' : 'text-brand-100/75 hover:bg-white/10 hover:text-white'
  }`

export function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated, scope, logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-brand-900 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4">
          <div className="flex shrink-0 items-center gap-2.5">
            <img src={logoIcon} alt="Créperia da Praia" className="h-9 w-9 shrink-0" />
            <span className="hidden text-sm font-medium tracking-wide text-brand-200/80 sm:inline">
              Central de Eventos
            </span>
          </div>
          {isAuthenticated && (
            <nav className="flex items-center gap-0.5 sm:gap-1">
              {scope === 'full' && (
                <>
                  <NavLink to="/eventos" className={navLinkClass}>
                    Eventos
                  </NavLink>
                  <NavLink to="/agenda" className={navLinkClass}>
                    Agenda
                  </NavLink>
                </>
              )}
              <button
                type="button"
                onClick={logout}
                className="ml-1 rounded-md px-2 py-2 text-xs font-medium whitespace-nowrap text-brand-100/60 transition-colors hover:bg-white/10 hover:text-white sm:ml-2 sm:px-3 sm:text-sm"
              >
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4">{children}</main>
    </div>
  )
}
