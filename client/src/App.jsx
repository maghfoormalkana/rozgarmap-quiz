import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/HomePage'
import QuizSetup from './pages/QuizSetup'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CategoriesPage from './pages/CategoriesPage'
import QuestionsPage from './pages/QuestionsPage'
import ResultsManagement from './pages/ResultsManagement'
import LoadingSpinner from './components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!admin) return <Navigate to="/admin/login" replace />
  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz-setup" element={<QuizSetup />} />
        <Route path="/quiz/:categoryId" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/questions" element={<QuestionsPage />} />
        <Route path="/admin/results" element={<ResultsManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App