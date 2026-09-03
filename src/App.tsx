import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { AgendaPage } from './pages/AgendaPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { EventNewPage } from './pages/EventNewPage'
import { EventsListPage } from './pages/EventsListPage'
import { LoginPage } from './pages/LoginPage'

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
            <Route path="/" element={<Navigate to="/eventos" replace />} />

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

            <Route path="*" element={<Navigate to="/eventos" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}
