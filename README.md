# wm-chat-creperia-front

Portal web (Vite + React + TypeScript + Tailwind CSS) para consumir a API do
backend [`wm-chat-creperia`](../wm-chat-creperia) (FastAPI).

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste VITE_API_BASE se o backend não estiver em localhost:8000
npm run dev
```

O backend precisa estar rodando com `ENV=DEV` para liberar CORS para
`http://localhost:5173` (ver `app/main.py` no repo do backend).

## Estrutura

- `src/lib/types.ts` — tipos espelhando os schemas Pydantic da API.
- `src/lib/endpoints.ts` — funções de chamada para cada rota (`/portal/auth`,
  `/portal/events`, `/portal/agenda`, `/dev/messages`).
- `src/context/AuthContext.tsx` — sessão do portal (JWT em `localStorage`),
  com dois fluxos de login:
  - senha do portal (`scope: full`) — acesso a todas as rotas de eventos/agenda;
  - troca do link de evento (`?token=` em `/eventos/:id`, `scope: event`) —
    acesso restrito àquele evento.
- `src/pages/` — telas: login, lista de eventos, novo evento, detalhe/edição
  de evento e agenda.

## Build

```bash
npm run build
npm run lint
```
