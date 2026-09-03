import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { clearAuth, loadAuth, saveAuth, type StoredAuth } from '../lib/auth-storage'
import { exchangeEventToken, login as loginRequest } from '../lib/endpoints'
import type { AuthScope } from '../lib/types'

interface AuthContextValue {
  isAuthenticated: boolean
  scope: AuthScope | null
  eventId: string | null
  loginWithPassword: (password: string) => Promise<void>
  loginWithEventToken: (rawToken: string) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toStoredAuth(response: { access_token: string; scope: AuthScope; event_id: string | null; expires_in: number }): StoredAuth {
  return {
    accessToken: response.access_token,
    scope: response.scope,
    eventId: response.event_id,
    expiresAt: Date.now() + response.expires_in * 1000,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => loadAuth())

  const loginWithPassword = useCallback(async (password: string) => {
    const response = await loginRequest(password)
    const stored = toStoredAuth(response)
    saveAuth(stored)
    setAuth(stored)
  }, [])

  const loginWithEventToken = useCallback(async (rawToken: string) => {
    const response = await exchangeEventToken(rawToken)
    const stored = toStoredAuth(response)
    saveAuth(stored)
    setAuth(stored)
    return stored.eventId as string
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: auth !== null,
      scope: auth?.scope ?? null,
      eventId: auth?.eventId ?? null,
      loginWithPassword,
      loginWithEventToken,
      logout,
    }),
    [auth, loginWithPassword, loginWithEventToken, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}
