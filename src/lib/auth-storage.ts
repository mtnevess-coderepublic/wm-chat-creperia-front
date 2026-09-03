import type { AuthScope } from './types'

const STORAGE_KEY = 'wm_portal_auth'

export interface StoredAuth {
  accessToken: string
  scope: AuthScope
  eventId: string | null
  expiresAt: number // epoch ms
}

export function loadAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredAuth
    if (!parsed.accessToken || Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveAuth(auth: StoredAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}
