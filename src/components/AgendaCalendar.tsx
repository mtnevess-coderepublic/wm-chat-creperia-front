import { WEEKDAY_LABELS, buildMonthGrid, toIsoDate } from '../lib/calendar'
import type { AgendaDayOut } from '../lib/types'

interface AgendaCalendarProps {
  year: number
  month: number // 0-indexado
  daysByDate: Map<string, AgendaDayOut>
  onSelectDay: (day: AgendaDayOut) => void
}

export function AgendaCalendar({ year, month, daysByDate, onSelectDay }: AgendaCalendarProps) {
  const cells = buildMonthGrid(year, month)
  const today = toIsoDate(new Date())

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-xs font-medium tracking-wide text-stone-500 uppercase">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          const day = daysByDate.get(cell.isoDate)
          const isToday = cell.isoDate === today
          const isInteractive = cell.inCurrentMonth && Boolean(day)

          return (
            <button
              key={cell.isoDate}
              type="button"
              disabled={!isInteractive}
              onClick={() => day && onSelectDay(day)}
              className={`flex min-h-28 flex-col items-stretch gap-1 border-r border-b border-stone-100 p-1.5 text-left transition-colors last:border-r-0 [&:nth-child(7n)]:border-r-0 ${
                cell.inCurrentMonth ? 'bg-white' : 'bg-stone-50/60'
              } ${isInteractive ? 'cursor-pointer hover:bg-brand-50/60' : 'cursor-default'}`}
            >
              <span
                className={`self-start text-xs font-semibold ${
                  isToday
                    ? 'flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white'
                    : cell.inCurrentMonth
                      ? 'text-stone-700'
                      : 'text-stone-300'
                }`}
              >
                {cell.date.getDate()}
              </span>

              {day && (
                <div className="flex flex-col gap-0.5 text-[11px] leading-tight">
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                        day.on_site_lunch_available ? 'bg-emerald-500' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-stone-500">Almoço</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                        day.on_site_dinner_available ? 'bg-emerald-500' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-stone-500">Janta</span>
                  </div>
                  <div
                    className={`mt-0.5 rounded px-1 py-0.5 text-center font-medium ${
                      day.at_home_booked >= day.at_home_capacity
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {day.at_home_booked}/{day.at_home_capacity} domicílio
                  </div>
                  {day.note && <p className="truncate text-stone-400 italic">{day.note}</p>}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
