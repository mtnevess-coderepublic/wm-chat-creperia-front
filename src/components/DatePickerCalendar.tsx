import { MONTH_LABELS, WEEKDAY_LABELS, buildMonthGrid, toIsoDate } from '../lib/calendar'

interface DatePickerCalendarProps {
  year: number
  month: number // 0-indexado
  selectedIso: string
  onSelect: (isoDate: string) => void
  onNavigate: (year: number, month: number) => void
}

export function DatePickerCalendar({ year, month, selectedIso, onSelect, onNavigate }: DatePickerCalendarProps) {
  const cells = buildMonthGrid(year, month)
  const today = toIsoDate(new Date())

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1)
    onNavigate(next.getFullYear(), next.getMonth())
  }

  return (
    <div className="w-64 rounded-lg border border-stone-200 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          aria-label="Mês anterior"
          className="rounded p-1 text-stone-500 hover:bg-stone-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium text-stone-700">
          {MONTH_LABELS[month]} {year}
        </span>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          aria-label="Próximo mês"
          className="rounded p-1 text-stone-500 hover:bg-stone-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] font-medium text-stone-400">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell) => {
          const isSelected = cell.isoDate === selectedIso
          const isToday = cell.isoDate === today
          return (
            <button
              key={cell.isoDate}
              type="button"
              disabled={!cell.inCurrentMonth}
              onClick={() => onSelect(cell.isoDate)}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                !cell.inCurrentMonth
                  ? 'cursor-default text-stone-300'
                  : isSelected
                    ? 'bg-brand-600 font-semibold text-white'
                    : isToday
                      ? 'border border-brand-400 text-stone-700 hover:bg-brand-50'
                      : 'text-stone-700 hover:bg-brand-50'
              }`}
            >
              {cell.date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
