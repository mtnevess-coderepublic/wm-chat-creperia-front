export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export interface CalendarCell {
  date: Date
  isoDate: string
  inCurrentMonth: boolean
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function lastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

/** Grid de células (domingo a sábado) cobrindo o mês, com dias do mês vizinho preenchendo as semanas incompletas. */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = lastDayOfMonth(year, month).getDate()

  const cells: CalendarCell[] = []

  for (let i = startWeekday; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    cells.push({ date, isoDate: toIsoDate(date), inCurrentMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    cells.push({ date, isoDate: toIsoDate(date), inCurrentMonth: true })
  }
  while (cells.length % 7 !== 0) {
    const previous = cells[cells.length - 1].date
    const date = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1)
    cells.push({ date, isoDate: toIsoDate(date), inCurrentMonth: false })
  }

  return cells
}
