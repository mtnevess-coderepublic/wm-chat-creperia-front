import { useEffect, useRef } from 'react'

interface TimePickerPanelProps {
  value: string // "HH:MM:SS" ou ''
  onSelect: (time: string) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

function TimeColumn({
  options,
  selected,
  onSelect,
}: {
  options: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  return (
    <div className="max-h-52 flex-1 overflow-y-auto p-1">
      {options.map((option) => {
        const isSelected = option === selected
        return (
          <button
            key={option}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(option)}
            className={`block w-full rounded px-2 py-1 text-center text-sm tabular-nums transition-colors ${
              isSelected ? 'bg-brand-600 font-semibold text-white' : 'text-stone-700 hover:bg-brand-50'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export function TimePickerPanel({ value, onSelect }: TimePickerPanelProps) {
  const [h = '', m = ''] = value ? value.split(':') : []

  return (
    <div className="flex w-36 divide-x divide-stone-100 rounded-lg border border-stone-200 bg-white shadow-xl">
      <TimeColumn options={HOURS} selected={h} onSelect={(hour) => onSelect(`${hour}:${m || '00'}:00`)} />
      <TimeColumn options={MINUTES} selected={m} onSelect={(minute) => onSelect(`${h || '00'}:${minute}:00`)} />
    </div>
  )
}
