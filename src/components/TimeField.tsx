import { useEffect, useRef, useState } from 'react'
import { TimePickerPanel } from './TimePickerPanel'

interface TimeFieldProps {
  id?: string
  value: string // "HH:MM:SS" ou ''
  onChange: (time: string) => void
  className?: string
}

/** Insere os dois-pontos automaticamente conforme o usuário digita só números. */
function maskInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)].filter(Boolean)
  return parts.join(':')
}

function isValidTime(display: string): boolean {
  const match = display.match(/^(\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return false
  const [, h, m, s] = match
  return Number(h) <= 23 && Number(m) <= 59 && Number(s) <= 59
}

/** Input de horário em texto (HH:MM:SS, sempre 24h — sem AM/PM) com um seletor popover de hora/minuto. */
export function TimeField({ id, value, onChange, className }: TimeFieldProps) {
  const [text, setText] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resincroniza o texto exibido quando o valor vem de fora (ex.: evento carregado).
  if (value !== syncedValue) {
    setSyncedValue(value)
    setText(value)
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
    if (isValidTime(masked)) onChange(masked)
  }

  function handleSelect(time: string) {
    onChange(time)
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="00:00:00"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setOpen(true)}
        className={`${className ?? ''} pr-8`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir seletor de horário"
        className="absolute inset-y-0 right-1.5 flex items-center text-stone-400 hover:text-stone-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .199.079.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1">
          <TimePickerPanel value={value} onSelect={handleSelect} />
        </div>
      )}
    </div>
  )
}
