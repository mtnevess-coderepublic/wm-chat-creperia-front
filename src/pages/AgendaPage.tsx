import { useEffect, useMemo, useState } from 'react'
import { AgendaCalendar } from '../components/AgendaCalendar'
import { AgendaDayModal } from '../components/AgendaDayModal'
import { apiErrorMessage } from '../lib/api'
import { MONTH_LABELS, lastDayOfMonth, toIsoDate } from '../lib/calendar'
import { getAgenda } from '../lib/endpoints'
import type { AgendaDayOut } from '../lib/types'

export function AgendaPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-indexado

  const [days, setDays] = useState<AgendaDayOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<AgendaDayOut | null>(null)

  const daysByDate = useMemo(() => {
    const map = new Map<string, AgendaDayOut>()
    for (const day of days) map.set(day.event_date, day)
    return map
  }, [days])

  async function load(y: number, m: number) {
    setLoading(true)
    setError(null)
    try {
      const from = toIsoDate(new Date(y, m, 1))
      const to = toIsoDate(lastDayOfMonth(y, m))
      const data = await getAgenda(from, to)
      setDays(data)
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível carregar a agenda.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(year, month)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month])

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  function goToday() {
    const today = new Date()
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  function handleDayUpdated(updated: AgendaDayOut) {
    setDays((prev) => prev.map((d) => (d.event_date === updated.event_date ? updated : d)))
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-stone-900">Agenda</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Mês anterior"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            ‹
          </button>
          <span className="w-40 text-center text-sm font-medium text-stone-700">
            {MONTH_LABELS[month]} {year}
          </span>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Próximo mês"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            ›
          </button>
          <button
            type="button"
            onClick={goToday}
            className="ml-2 rounded-md border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Hoje
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-stone-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> Disponível
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-400" /> Bloqueado
        </span>
        <span>Clique em um dia para editar a disponibilidade</span>
      </div>

      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-stone-500">Carregando...</p>
      ) : (
        <AgendaCalendar year={year} month={month} daysByDate={daysByDate} onSelectDay={setSelectedDay} />
      )}

      {selectedDay && (
        <AgendaDayModal day={selectedDay} onClose={() => setSelectedDay(null)} onUpdated={handleDayUpdated} />
      )}
    </div>
  )
}
