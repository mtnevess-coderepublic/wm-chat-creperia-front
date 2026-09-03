import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DateField } from '../components/DateField'
import { apiErrorMessage } from '../lib/api'
import { toIsoDate } from '../lib/calendar'
import { listEvents } from '../lib/endpoints'
import {
  CREATED_BY_BADGE_CLASSES,
  CREATED_BY_LABELS,
  EVENT_STATUS_OPTIONS,
  MODALIDADE_LABELS,
  PERIOD_LABELS,
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  formatDateBR,
} from '../lib/labels'
import type { EventOut, EventStatus } from '../lib/types'

export function EventsListPage() {
  const [events, setEvents] = useState<EventOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromDate, setFromDate] = useState(() => toIsoDate(new Date()))
  const [toDate, setToDate] = useState('')
  const [status, setStatus] = useState<EventStatus | ''>('')
  const [includeExpiredAndCanceled, setIncludeExpiredAndCanceled] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await listEvents({
        from_date: fromDate || undefined,
        to_date: toDate || undefined,
        status: status || undefined,
        include_expired_and_canceled: includeExpiredAndCanceled || undefined,
      })
      setEvents(data)
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível carregar os eventos.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Eventos</h1>
        <Link
          to="/eventos/novo"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Novo evento
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          load()
        }}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4"
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">De</label>
          <DateField
            value={fromDate}
            onChange={setFromDate}
            className="w-36 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Até</label>
          <DateField
            value={toDate}
            onChange={setToDate}
            className="w-36 rounded-md border border-stone-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EventStatus | '')}
            className="rounded-md border border-stone-300 px-2 py-1.5 text-sm"
          >
            <option value="">Todos</option>
            {EVENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <label
          className={`mb-0.5 flex items-center gap-2 self-end pb-2 text-sm ${
            status ? 'text-stone-300' : 'text-stone-600'
          }`}
          title={status ? 'Ignorado quando um status específico é selecionado' : undefined}
        >
          <input
            type="checkbox"
            checked={includeExpiredAndCanceled}
            disabled={Boolean(status)}
            onChange={(e) => setIncludeExpiredAndCanceled(e.target.checked)}
          />
          Mostrar expirados/cancelados
        </label>
        <button
          type="submit"
          className="rounded-md border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Filtrar
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-stone-500">Carregando...</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-stone-500">Nenhum evento encontrado.</p>
      ) : (
        <>
          {/* Cards empilhados no mobile — a tabela larga não cabe bem em telas pequenas. */}
          <div className="flex flex-col gap-3 sm:hidden">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/eventos/${event.id}`}
                className="block rounded-lg border border-stone-200 bg-white p-4 hover:bg-stone-50"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-stone-900">{formatDateBR(event.event_date)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[event.status]}`}
                  >
                    {STATUS_LABELS[event.status]}
                  </span>
                </div>
                <p className="text-sm text-stone-700">
                  {MODALIDADE_LABELS[event.modality]}
                  {event.modality === 'no_espaco' && event.period && (
                    <span className="ml-1.5 text-xs text-stone-400">({PERIOD_LABELS[event.period]})</span>
                  )}
                </p>
                {event.period_start && event.period_end && (
                  <p className="text-xs text-stone-500">
                    {event.period_start.slice(0, 5)} – {event.period_end.slice(0, 5)}
                  </p>
                )}
                {(event.customer_name || event.customer_phone_number) && (
                  <p className="mt-1 text-xs text-stone-500">
                    {event.customer_name}
                    {event.customer_name && event.customer_phone_number ? ' · ' : ''}
                    {event.customer_phone_number}
                  </p>
                )}
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${CREATED_BY_BADGE_CLASSES[event.created_by]}`}
                >
                  {CREATED_BY_LABELS[event.created_by]}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-lg border border-stone-200 bg-white sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                <tr>
                  <th className="px-4 py-2">Data</th>
                  <th className="px-4 py-2">Modalidade</th>
                  <th className="px-4 py-2">Período</th>
                  <th className="px-4 py-2">Cliente</th>
                  <th className="px-4 py-2">Origem</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-stone-50">
                    <td className="px-4 py-2">{formatDateBR(event.event_date)}</td>
                    <td className="px-4 py-2">
                      {MODALIDADE_LABELS[event.modality]}
                      {event.modality === 'no_espaco' && event.period && (
                        <span className="ml-1.5 text-xs text-stone-400">({PERIOD_LABELS[event.period]})</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {event.period_start && event.period_end
                        ? `${event.period_start.slice(0, 5)} – ${event.period_end.slice(0, 5)}`
                        : '—'}
                    </td>
                    <td className="px-4 py-2">
                      {event.customer_name ?? '—'}
                      {event.customer_phone_number && (
                        <span className="block text-xs text-stone-400">{event.customer_phone_number}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${CREATED_BY_BADGE_CLASSES[event.created_by]}`}
                      >
                        {CREATED_BY_LABELS[event.created_by]}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASSES[event.status]}`}
                      >
                        {STATUS_LABELS[event.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to={`/eventos/${event.id}`}
                        className="text-sm font-medium text-brand-600 hover:underline"
                      >
                        Ver / editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
