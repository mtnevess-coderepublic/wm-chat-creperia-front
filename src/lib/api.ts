import axios, { type AxiosError } from 'axios'
import { clearAuth, loadAuth } from './auth-storage'
import type { ApiErrorBody } from './types'

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      clearAuth()
    }
    return Promise.reject(error)
  },
)

export function apiErrorMessage(error: unknown, fallback = 'Algo deu errado.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.detail ?? fallback
  }
  return fallback
}
