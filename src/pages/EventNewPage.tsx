import { useNavigate } from 'react-router-dom'
import { EventForm } from '../components/EventForm'
import { apiErrorMessage } from '../lib/api'
import { createEvent } from '../lib/endpoints'
import type { EventWrite } from '../lib/types'

export function EventNewPage() {
  const navigate = useNavigate()

  async function handleSubmit(payload: EventWrite) {
    try {
      const event = await createEvent(payload)
      navigate(`/eventos/${event.id}`, { replace: true })
    } catch (err) {
      throw new Error(apiErrorMessage(err, 'Não foi possível criar o evento.'))
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-stone-900">Novo evento</h1>
      <EventForm submitLabel="Criar evento" onSubmit={handleSubmit} />
    </div>
  )
}
