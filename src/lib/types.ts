// Tipos espelhando os schemas Pydantic do backend (wm-chat-creperia)

export type Modalidade = 'no_espaco' | 'a_domicilio' | 'crepe_no_cone'

export type Period = 'almoco' | 'janta'

export type EventStatus =
  | 'provisional'
  | 'confirmed'
  | 'finished'
  | 'expired'
  | 'cancelled'

export type AuthScope = 'full' | 'event'

export type CreatedBy = 'portal' | 'ai_agent'

export interface EventOut {
  id: string
  event_date: string // "YYYY-MM-DD"
  modality: Modalidade
  period: Period | null
  period_start: string | null // "HH:MM:SS"
  period_end: string | null // "HH:MM:SS"
  status: EventStatus
  job_id: string | null
  expires_at: string | null // ISO datetime
  confirmed_at: string | null // ISO datetime
  ai_description: string | null
  created_by: CreatedBy
  customer_name: string | null
  customer_phone_number: string | null
  /** Só preenchido quando created_by === 'ai_agent' (ID da conversa no WhatsApp/Umbler Talk). */
  conversation_id: string | null
  created_at: string
  updated_at: string
}

export interface EventWrite {
  event_date: string
  modality: Modalidade
  period?: Period | null
  period_start?: string | null
  period_end?: string | null
  status: EventStatus
  ai_description?: string | null
  customer_name?: string | null
  customer_phone_number?: string | null
  force?: boolean
}

export interface AgendaDayOut {
  event_date: string
  on_site_lunch_available: boolean
  on_site_dinner_available: boolean
  at_home_capacity: number
  at_home_booked: number
  note: string | null
}

export interface AvailabilityLockRequest {
  on_site_lunch_blocked?: boolean
  on_site_dinner_blocked?: boolean
  at_home_capacity?: number | null
  note?: string | null
}

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
  scope: AuthScope
  expires_in: number // segundos
  event_id: string | null
}

export interface ApiErrorBody {
  detail: string
}
