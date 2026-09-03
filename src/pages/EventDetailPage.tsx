import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EventForm } from '../components/EventForm'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/api'
import { getEvent, updateEvent } from '../lib/endpoints'
import {
  CREATED_BY_BADGE_CLASSES,
  CREATED_BY_LABELS,
  MODALIDADE_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  formatDateTimeBR,
} from '../lib/labels'
import type { EventOut, EventWrite } from '../lib/types'

function eventToWrite(event: EventOut): EventWrite {
  return {
    event_date: event.event_date,
    modality: event.modality,
    period: event.period,
    period_start: event.period_start,
    period_end: event.period_end,
    status: event.status,
    ai_description: event.ai_description,
    customer_name: event.customer_name,
    customer_phone_number: event.customer_phone_number,
    force: false,
  }
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated, loginWithEventToken } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const rawToken = searchParams.get('token')

  const [exchanging, setExchanging] = useState(Boolean(rawToken))
  const [accessError, setAccessError] = useState<string | null>(null)
  const [event, setEvent] = useState<EventOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. Se a URL trouxer ?token=, trocamos pelo JWT de escopo "event" e limpamos a querystring.
  useEffect(() => {
    if (!rawToken) return
    let cancelled = false
    setExchanging(true)
    loginWithEventToken(rawToken)
      .then(() => {
        if (cancelled) return
        setSearchParams({}, { replace: true })
      })
      .catch((err) => {
        if (cancelled) return
        setAccessError(apiErrorMessage(err, 'Link inválido ou expirado.'))
      })
      .finally(() => {
        if (!cancelled) setExchanging(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawToken])

  // 2. Assim que autenticados (via login normal ou troca de token) e sem token pendente, carregamos o evento.
  useEffect(() => {
    if (rawToken || accessError) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname }, replace: true })
      return
    }
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)
    getEvent(id)
      .then((data) => {
        if (!cancelled) setEvent(data)
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err, 'Não foi possível carregar o evento.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated, rawToken, accessError])

  async function handleSubmit(payload: EventWrite) {
    if (!id) return
    try {
      const updated = await updateEvent(id, payload)
      setEvent(updated)
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Não foi possível salvar o evento.'))
    }
  }

  if (accessError) {
    return <p className="text-sm text-rose-600">{accessError}</p>
  }
  if (exchanging || loading) {
    return <p className="text-sm text-stone-500">Carregando...</p>
  }
  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>
  }
  if (!event) {
    return null
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">
            Evento — {MODALIDADE_LABELS[event.modality]}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[event.status]}`}
            >
              {STATUS_LABELS[event.status]}
            </span>
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CREATED_BY_BADGE_CLASSES[event.created_by]}`}
            >
              {CREATED_BY_LABELS[event.created_by]}
            </span>
          </div>
          {(event.customer_name || event.customer_phone_number) && (
            <p className="mt-2 text-sm text-stone-600">
              {event.customer_name}
              {event.customer_name && event.customer_phone_number ? ' · ' : ''}
              {event.customer_phone_number}
            </p>
          )}
          {event.conversation_id && (
            <a
              href={`https://app-utalk.umbler.com/chats/${event.conversation_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 0 0-.75.75v9.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 13.75 18h-9.5A2.25 2.25 0 0 1 2 15.75v-9.5A2.25 2.25 0 0 1 4.25 4h4a.75.75 0 0 1 0 1.5h-4Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M12.5 2a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V3.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06L15.44 2.75H13.25a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
              Ver conversa na íntegra
            </a>
          )}
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs text-stone-500 sm:grid-cols-2 sm:text-right">
          <dt>Criado em</dt>
          <dd>{formatDateTimeBR(event.created_at)}</dd>
          <dt>Atualizado em</dt>
          <dd>{formatDateTimeBR(event.updated_at)}</dd>
          <dt>Expira em</dt>
          <dd>{formatDateTimeBR(event.expires_at)}</dd>
          <dt>Confirmado em</dt>
          <dd>{formatDateTimeBR(event.confirmed_at)}</dd>
        </dl>
      </div>

      <EventForm initial={eventToWrite(event)} submitLabel="Salvar alterações" onSubmit={handleSubmit} />
    </div>
  )
}
