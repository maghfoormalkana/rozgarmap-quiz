import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderOpen, HelpCircle, Users, BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { getStats, getResults } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, resultsRes] = await Promise.all([
        getStats(),
        getResults({ limit: 5 })
      ])
      setStats(statsRes.data)
      setRecentResults(resultsRes.data.results || [])
    } catch (err) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />

  const statCards = [
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      icon: FolderOpen,
      color: 'bg-blue-500',
      link: '/admin/categories'
    },
    {
      title: 'Total Questions',
      value: stats?.totalQuestions || 0,
      icon: HelpCircle,
      color: 'bg-green-500',
      link: '/admin/questions'
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'bg-purple-500',
      link: '/admin/results'
    },
    {
      title: 'Quiz Attempts',
      value: stats?.totalAttempts || 0,
      icon: BarChart3,
      color: 'bg-orange-500',
      link: '/admin/results'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your quiz portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link
              key={index}
              to={card.link}
              className="stat-card hover:-translate-y-1 transition-transform"
            >
              <div className={`stat-icon ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Results */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Quiz Attempts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest student submissions</p>
          </div>
          <Link to="/admin/results" className="text-sm text-rozgar-blue hover:underline font-medium">
            View All
          </Link>
        </div>

        {recentResults.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No quiz attempts yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Student</th>
                  <th className="table-header">Batch</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Score</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentResults.map((result) => (
                  <tr key={result._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="table-cell font-medium">{result.studentName}</td>
                    <td className="table-cell">{result.batchName}</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        {result.category}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`font-bold ${
                        result.score >= 70 ? 'text-green-600' : 
                        result.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {result.score}%
                      </span>
                    </td>
                    <td className="table-cell text-gray-500 dark:text-gray-400">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/categories" className="card p-6 hover:border-rozgar-blue transition-colors group">
          <FolderOpen className="w-8 h-8 text-rozgar-blue mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Categories</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit or delete quiz categories</p>
        </Link>
        <Link to="/admin/questions" className="card p-6 hover:border-rozgar-blue transition-colors group">
          <HelpCircle className="w-8 h-8 text-rozgar-blue mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Questions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add questions via form, Excel or JSON</p>
        </Link>
        <Link to="/admin/results" className="card p-6 hover:border-rozgar-blue transition-colors group">
          <BarChart3 className="w-8 h-8 text-rozgar-blue mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">View Results</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Export and filter quiz results</p>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard