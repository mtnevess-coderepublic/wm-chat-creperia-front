import { useState, type FormEvent } from 'react'
import { DateField } from './DateField'
import { TimeField } from './TimeField'
import {
  EVENT_STATUS_OPTIONS,
  MODALIDADE_LABELS,
  MODALIDADE_OPTIONS,
  PERIOD_LABELS,
  PERIOD_OPTIONS,
  STATUS_LABELS,
} from '../lib/labels'
import type { EventStatus, EventWrite, Modalidade, Period } from '../lib/types'

interface EventFormProps {
  initial?: EventWrite
  submitLabel: string
  showForce?: boolean
  onSubmit: (payload: EventWrite) => Promise<void>
}

const emptyForm: EventWrite = {
  event_date: '',
  modality: 'no_espaco',
  period: 'almoco',
  period_start: '',
  period_end: '',
  status: 'provisional',
  ai_description: '',
  customer_name: '',
  customer_phone_number: '',
  force: false,
}

export function EventForm({ initial, submitLabel, showForce = true, onSubmit }: EventFormProps) {
  const [form, setForm] = useState<EventWrite>(initial ?? emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isNoEspaco = form.modality === 'no_espaco'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const payload: EventWrite = {
      ...form,
      period: isNoEspaco ? form.period : null,
      period_start: form.period_start || null,
      period_end: form.period_end || null,
      ai_description: form.ai_description || null,
      customer_name: form.customer_name || null,
      customer_phone_number: form.customer_phone_number || null,
    }

    setSubmitting(true)
    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar evento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Data do evento</label>
        <DateField
          required
          value={form.event_date}
          onChange={(isoDate) => setForm({ ...form, event_date: isoDate })}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Modalidade</label>
        <select
          value={form.modality}
          onChange={(e) => setForm({ ...form, modality: e.target.value as Modalidade })}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        >
          {MODALIDADE_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {MODALIDADE_LABELS[m]}
            </option>
          ))}
        </select>
      </div>

      {isNoEspaco && (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Período</label>
          <select
            value={form.period ?? 'almoco'}
            onChange={(e) => setForm({ ...form, period: e.target.value as Period })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABELS[p]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Horário início</label>
          <TimeField
            value={form.period_start ?? ''}
            onChange={(time) => setForm({ ...form, period_start: time })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Horário fim</label>
          <TimeField
            value={form.period_end ?? ''}
            onChange={(time) => setForm({ ...form, period_end: time })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Nome do cliente</label>
          <input
            type="text"
            value={form.customer_name ?? ''}
            onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Telefone do cliente</label>
          <input
            type="text"
            value={form.customer_phone_number ?? ''}
            onChange={(e) => setForm({ ...form, customer_phone_number: e.target.value })}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        >
          {EVENT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Descrição (IA)</label>
        <textarea
          value={form.ai_description ?? ''}
          onChange={(e) => setForm({ ...form, ai_description: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      {showForce && !isNoEspaco && (
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.force ?? false}
            onChange={(e) => setForm({ ...form, force: e.target.checked })}
          />
          Forçar mesmo com conflito de disponibilidade
        </label>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? 'Salvando...' : submitLabel}
      </button>
    </form>
  )
}
