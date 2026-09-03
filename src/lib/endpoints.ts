import { api } from './api'
import type {
  AgendaDayOut,
  AvailabilityLockRequest,
  EventOut,
  EventWrite,
  TokenResponse,
} from './types'

// --- Auth --------------------------------------------------------------

export async function login(password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/portal/auth/login', { password })
  return data
}

export async function exchangeEventToken(token: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/portal/auth/exchange', { token })
  return data
}

// --- Eventos -------------------------------------------------------------

export interface ListEventsParams {
  from_date?: string
  to_date?: string
  status?: string
  /** Default do backend é false (esconde expirados/cancelados). Ignorado quando `status` é informado. */
  include_expired_and_canceled?: boolean
}

export async function listEvents(params: ListEventsParams = {}): Promise<EventOut[]> {
  const { data } = await api.get<EventOut[]>('/portal/events', { params })
  return data
}

export async function getEvent(eventId: string): Promise<EventOut> {
  const { data } = await api.get<EventOut>(`/portal/events/${eventId}`)
  return data
}

export async function createEvent(payload: EventWrite): Promise<EventOut> {
  const { data } = await api.post<EventOut>('/portal/events', payload)
  return data
}

export async function updateEvent(eventId: string, payload: EventWrite): Promise<EventOut> {
  const { data } = await api.put<EventOut>(`/portal/events/${eventId}`, payload)
  return data
}

// --- Agenda --------------------------------------------------------------

export async function getAgenda(fromDate: string, toDate: string): Promise<AgendaDayOut[]> {
  const { data } = await api.get<AgendaDayOut[]>('/portal/agenda', {
    params: { from_date: fromDate, to_date: toDate },
  })
  return data
}

export async function updateAgendaDay(
  eventDate: string,
  payload: AvailabilityLockRequest,
): Promise<AgendaDayOut> {
  const { data } = await api.put<AgendaDayOut>(`/portal/agenda/${eventDate}`, payload)
  return data
}

// --- Health ----------------------------------------------------------------

export async function health(): Promise<{ status: string }> {
  const { data } = await api.get<{ status: string }>('/health')
  return data
}
