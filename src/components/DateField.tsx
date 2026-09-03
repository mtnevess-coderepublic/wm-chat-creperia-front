import { useEffect, useRef, useState } from 'react'
import { DatePickerCalendar } from './DatePickerCalendar'

interface DateFieldProps {
  id?: string
  value: string // ISO "YYYY-MM-DD" ou ''
  onChange: (isoDate: string) => void
  required?: boolean
  className?: string
}

function isoToDisplay(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d}/${m}/${y}`
}

function displayToIso(display: string): string {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ''
  const [, d, m, y] = match
  const day = Number(d)
  const month = Number(m)
  if (month < 1 || month > 12 || day < 1 || day > 31) return ''
  return `${y}-${m}-${d}`
}

/** Insere as barras automaticamente conforme o usuário digita só números. */
function maskInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)
  return parts.join('/')
}

function viewFromIso(iso: string): { year: number; month: number } {
  const base = iso ? new Date(`${iso}T00:00:00`) : new Date()
  return { year: base.getFullYear(), month: base.getMonth() }
}

/** Input de data em texto (dd/mm/aaaa, independente do idioma do navegador) com um calendário popover para seleção. */
export function DateField({ id, value, onChange, required, className }: DateFieldProps) {
  const [text, setText] = useState(() => isoToDisplay(value))
  const [syncedValue, setSyncedValue] = useState(value)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => viewFromIso(value))
  const containerRef = useRef<HTMLDivElement>(null)

  // Resincroniza o texto exibido quando o valor vem de fora (ex.: reset de filtro, evento carregado).
  if (value !== syncedValue) {
    setSyncedValue(value)
    setText(isoToDisplay(value))
  }

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function handleChange(raw: string) {
    const masked = maskInput(raw)
    setText(masked)
    if (masked === '') {
      onChange('')
      return
    }
    const iso = displayToIso(masked)
    if (iso) {
      onChange(iso)
      setView(viewFromIso(iso))
    }
  }

  function openPicker() {
    setView(viewFromIso(value))
    setOpen(true)
  }

  function handleSelect(isoDate: string) {
    onChange(isoDate)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/aaaa"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={openPicker}
        required={required}
        className={`${className ?? ''} pr-8`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-label="Abrir calendário"
        className="absolute inset-y-0 right-1.5 flex items-center text-stone-400 hover:text-stone-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.5A2.75 2.75 0 0 1 18.25 6.75v8.5A2.75 2.75 0 0 1 15.5 18h-11a2.75 2.75 0 0 1-2.75-2.75v-8.5A2.75 2.75 0 0 1 4.5 4H5V2.75A.75.75 0 0 1 5.75 2ZM4.5 5.5A1.25 1.25 0 0 0 3.25 6.75V8h13.5V6.75A1.25 1.25 0 0 0 15.5 5.5h-11ZM16.75 9.5H3.25v5.75A1.25 1.25 0 0 0 4.5 16.5h11a1.25 1.25 0 0 0 1.25-1.25V9.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1">
          <DatePickerCalendar
            year={view.year}
            month={view.month}
            selectedIso={value}
            onSelect={handleSelect}
            onNavigate={(year, month) => setView({ year, month })}
          />
        </div>
      )}
    </div>
  )
}
