import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CompetitionListPage from './pages/CompetitionListPage'
import CompetitionDetailPage from './pages/CompetitionDetailPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCompetitionsPage from './pages/AdminCompetitionsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminTypesPage from './pages/AdminTypesPage'
import useAuthStore from './store/useAuthStore'
import useCompetitionStore from './store/useCompetitionStore'
import ToastContainer from './components/ToastContainer'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore()

  // Only block if we haven't finished the initial check
  if (isInitializing) return (
    <div className="min-h-screen flex items-center justify-center bg-himatik-navy">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-himatik-gold"></div>
    </div>
  )

  return isAuthenticated ? children : <Navigate to="/admin/login" />
}

function App() {
  const { fetchCompetitions } = useCompetitionStore()
  const { initAuth, isInitializing } = useAuthStore()

  useEffect(() => {
    fetchCompetitions()
  }, [fetchCompetitions])

  useEffect(() => {
    const unsubscribe = initAuth()
    return () => unsubscribe()
  }, [initAuth])

  if (isInitializing) return (
    <div className="min-h-screen flex items-center justify-center bg-himatik-navy">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-himatik-gold"></div>
    </div>
  )

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/lomba" element={<MainLayout><CompetitionListPage /></MainLayout>} />
        <Route path="/lomba/:id" element={<MainLayout><CompetitionDetailPage /></MainLayout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard area */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="competitions" element={<AdminCompetitionsPage />} />
                <Route path="types" element={<AdminTypesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
