import { useState } from 'react'
import { apiErrorMessage } from '../lib/api'
import { updateAgendaDay } from '../lib/endpoints'
import { formatDateBR } from '../lib/labels'
import type { AgendaDayOut } from '../lib/types'

interface AgendaDayModalProps {
  day: AgendaDayOut
  onClose: () => void
  onUpdated: (updated: AgendaDayOut) => void
}

export function AgendaDayModal({ day, onClose, onUpdated }: AgendaDayModalProps) {
  const [lunchBlocked, setLunchBlocked] = useState(!day.on_site_lunch_available)
  const [dinnerBlocked, setDinnerBlocked] = useState(!day.on_site_dinner_available)
  const [capacity, setCapacity] = useState(String(day.at_home_capacity))
  const [note, setNote] = useState(day.note ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const updated = await updateAgendaDay(day.event_date, {
        on_site_lunch_blocked: lunchBlocked,
        on_site_dinner_blocked: dinnerBlocked,
        at_home_capacity: capacity === '' ? null : Number(capacity),
        note: note || null,
      })
      onUpdated(updated)
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Não foi possível salvar.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        <h2 className="pr-6 text-lg font-semibold text-stone-900">{formatDateBR(day.event_date)}</h2>
        <p className="mb-4 text-sm text-stone-500">
          {day.at_home_booked} de {day.at_home_capacity} vagas (a domicílio / cone) ocupadas
        </p>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={lunchBlocked} onChange={(e) => setLunchBlocked(e.target.checked)} />
            Bloquear almoço (no espaço)
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={dinnerBlocked} onChange={(e) => setDinnerBlocked(e.target.checked)} />
            Bloquear janta (no espaço)
          </label>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">
              Capacidade a domicílio / cone (vazio = padrão)
            </label>
            <input
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Nota</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
