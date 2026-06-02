import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun, GraduationCap, LayoutDashboard, Sparkles } from 'lucide-react'

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-40 ${isHome ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl' : 'bg-white dark:bg-slate-900'} shadow-sm border-b border-gray-100 dark:border-slate-800 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light flex items-center justify-center group-hover:scale-105 transition-transform shadow-glow">
              <span className="text-white font-bold text-lg">RM</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight font-display">
                RozgarMap
              </h1>
              <p className="text-xs text-rozgar-red font-semibold -mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Quiz Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>

            <Link
              to="/quiz-setup"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light text-white hover:shadow-glow transition-all active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              Start Quiz
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar