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

// ADMIN EXAM IMPORTS
import AdminExamSubmissions from './pages/AdminExamSubmissions';
import AdminExamSubmissionDetails from './pages/AdminExamSubmissionDetails';
import AdminPopupSettings from './pages/AdminPopupSettings';

// STUDENT EXAM IMPORTS
import ExamLandingPage from './pages/ExamLandingPage';
import ExamRegistrationPage from './pages/ExamRegistrationPage';
import ExamInstructionsPage from './pages/ExamInstructionsPage';
import ExamPage from './pages/ExamPage';
import ExamSuccessPage from './pages/ExamSuccessPage';

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
        
        {/* STUDENT EXAM ROUTES */}
        <Route path="/exam/landing/:categoryId" element={<ExamLandingPage />} />
        <Route path="/exam/register" element={<ExamRegistrationPage />} />
        <Route path="/exam/instructions" element={<ExamInstructionsPage />} />
        <Route path="/exam/start" element={<ExamPage />} />
        <Route path="/exam/success" element={<ExamSuccessPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/questions" element={<QuestionsPage />} />
        <Route path="/admin/results" element={<ResultsManagement />} />

        {/* EXAM MANAGEMENT */}
        <Route path="/admin/exam-submissions" element={<AdminExamSubmissions />} />
        <Route path="/admin/exam-submissions/:id" element={<AdminExamSubmissionDetails />} />
        <Route path="/admin/popup-settings" element={<AdminPopupSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App