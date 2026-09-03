import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AgendaPage } from './pages/AgendaPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventNewPage } from './pages/EventNewPage'
import { EventsListPage } from './pages/EventsListPage'
import { LoginPage } from './pages/LoginPage'

/**
 * Home do app: cada tipo de sessão tem um destino próprio. Sem isso, "/" mandava
 * todo mundo para /eventos e a sessão de link de evento entrava em loop de redirect.
 */
function HomeRedirect() {
  const { isAuthenticated, scope, eventId } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (scope === 'event' && eventId) return <Navigate to={`/eventos/${eventId}`} replace />
  return <Navigate to="/eventos" replace />
}

function AppShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Tela cheia, sem o header/nav do portal. */}
          <Route path="/login" element={<LoginPage />} />

          <Route element={<AppShell />}>
            <Route path="/" element={<HomeRedirect />} />

            <Route
              path="/eventos"
              element={
                <ProtectedRoute requireScope="full">
                  <EventsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/eventos/novo"
              element={
                <ProtectedRoute requireScope="full">
                  <EventNewPage />
                </ProtectedRoute>
              }
            />
            {/* Sem ProtectedRoute: aceita tanto login normal (scope "full")
                quanto o link de evento com ?token= (trocado por scope "event" dentro da própria página). */}
            <Route path="/eventos/:id" element={<EventDetailPage />} />

            <Route
              path="/agenda"
              element={
                <ProtectedRoute requireScope="full">
                  <AgendaPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<HomeRedirect />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
