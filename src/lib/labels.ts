import type { CreatedBy, EventStatus, Modalidade, Period } from './types'

export const MODALIDADE_LABELS: Record<Modalidade, string> = {
  no_espaco: 'No espaço',
  a_domicilio: 'A domicílio',
  crepe_no_cone: 'Crepe no cone',
}

export const PERIOD_LABELS: Record<Period, string> = {
  almoco: 'Almoço',
  janta: 'Janta',
}

export const STATUS_LABELS: Record<EventStatus, string> = {
  provisional: 'Provisório',
  confirmed: 'Confirmado',
  finished: 'Finalizado',
  expired: 'Expirado',
  cancelled: 'Cancelado',
}

export const STATUS_BADGE_CLASSES: Record<EventStatus, string> = {
  provisional: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  finished: 'bg-stone-200 text-stone-600',
  expired: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-stone-200 text-stone-500 line-through',
}

export const CREATED_BY_LABELS: Record<CreatedBy, string> = {
  portal: 'Cadastrado pela equipe',
  ai_agent: 'Reservado pelo bot',
}

export const CREATED_BY_BADGE_CLASSES: Record<CreatedBy, string> = {
  portal: 'bg-stone-100 text-stone-600',
  ai_agent: 'bg-sky-100 text-sky-700',
}

export const EVENT_STATUS_OPTIONS: EventStatus[] = [
  'provisional',
  'confirmed',
  'finished',
  'expired',
  'cancelled',
]

export const MODALIDADE_OPTIONS: Modalidade[] = ['no_espaco', 'a_domicilio', 'crepe_no_cone']

export const PERIOD_OPTIONS: Period[] = ['almoco', 'janta']

export function formatDateBR(isoDate: string | null): string {
  if (!isoDate) return '—'
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function formatDateTimeBR(isoDateTime: string | null): string {
  if (!isoDateTime) return '—'
  return new Date(isoDateTime).toLocaleString('pt-BR')
}
