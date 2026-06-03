import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, CheckCircle, XCircle, RotateCcw, Home, Award,
  Sparkles, TrendingUp, Clock, BookOpen, ArrowRight,
  Zap, Target, Star
} from 'lucide-react'
import { createResult } from '../services/api'
import toast from 'react-hot-toast'

const ResultPage = () => {
  const navigate = useNavigate()
  const result = JSON.parse(sessionStorage.getItem('quizResult') || '{}')

  useEffect(() => {
    if (!result.studentName) {
      navigate('/')
      return
    }
    saveResult()
  }, [])

  const saveResult = async () => {
    try {
      await createResult({
        studentName: result.studentName,
        batchName: result.batchName,
        category: result.category,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        score: result.score
      })
    } catch (err) {
      console.error('Failed to save result:', err)
    }
  }

  const getStatus = () => {
    if (result.score >= 70) return { 
      label: 'PASSED', 
      color: 'text-green-500', 
      bg: 'bg-green-50 dark:bg-green-900/20', 
      border: 'border-green-200 dark:border-green-800',
      gradient: 'from-green-400 to-green-600',
      message: 'Excellent work! You have a strong understanding of this subject.'
    }
    if (result.score >= 50) return { 
      label: 'AVERAGE', 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50 dark:bg-yellow-900/20', 
      border: 'border-yellow-200 dark:border-yellow-800',
      gradient: 'from-yellow-400 to-orange-500',
      message: 'Good effort! Keep practicing to improve your score.'
    }
    return { 
      label: 'NEEDS PRACTICE', 
      color: 'text-red-500', 
      bg: 'bg-red-50 dark:bg-red-900/20', 
      border: 'border-red-200 dark:border-red-800',
      gradient: 'from-red-400 to-red-600',
      message: 'Keep learning! Review the material and try again.'
    }
  }

  const status = getStatus()
  const circleProgress = 2 * Math.PI * 90
  const strokeDashoffset = circleProgress - (circleProgress * (result.score || 0)) / 100

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80" 
          alt="Celebration"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Score Card */}
        <div className="glass-card p-8 sm:p-12 mb-8 animate-scale-in">
          <div className="text-center mb-10">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${status.bg} ${status.border} border mb-8`}>
              <Award className={`w-5 h-5 ${status.color}`} />
              <span className={`font-bold ${status.color} text-lg`}>{status.label}</span>
            </div>

            {/* Circular Progress with Image Background */}
            <div className="relative w-56 h-56 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-100 dark:text-slate-700"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circleProgress}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={result.score >= 70 ? '#22c55e' : result.score >= 50 ? '#eab308' : '#ef4444'} />
                    <stop offset="100%" stopColor={result.score >= 70 ? '#16a34a' : result.score >= 50 ? '#f97316' : '#dc2626'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-700 shadow-lg flex items-center justify-center mb-2">
                  <Trophy className={`w-10 h-10 ${result.score >= 70 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
                </div>
                <span className="text-5xl font-bold text-gray-900 dark:text-white font-display">{result.score}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Score</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
              {result.studentName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              {result.batchName}
              <span className="text-gray-300">|</span>
              <Target className="w-4 h-4" />
              {result.category}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.totalQuestions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl border border-green-100 dark:border-green-800/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.correctAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Correct</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-2xl border border-red-100 dark:border-red-800/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{result.wrongAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Wrong</p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="space-y-3 mb-10">
            <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-slate-700/50 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Correct Answers
              </span>
              <span className="text-sm font-bold text-green-600">{result.correctAnswers} / {result.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-slate-700/50 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Wrong Answers
              </span>
              <span className="text-sm font-bold text-red-600">{result.wrongAnswers} / {result.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-slate-700/50 rounded-xl">
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Unanswered
              </span>
              <span className="text-sm font-bold text-gray-600">{result.totalQuestions - result.correctAnswers - result.wrongAnswers}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rozgar-blue/10 to-rozgar-blue/5 dark:from-rozgar-blue/20 dark:to-rozgar-blue/10 rounded-xl border border-rozgar-blue/20">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Star className="w-4 h-4 text-rozgar-blue" />
                Final Score
              </span>
              <span className="text-2xl font-bold text-rozgar-blue">{result.score}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                sessionStorage.removeItem('quizResult')
                sessionStorage.removeItem('quizSetup')
                navigate('/quiz-setup')
              }}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
            >
              <RotateCcw className="w-5 h-5" />
              Take Another Quiz
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 btn-outline flex items-center justify-center gap-2 py-4"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        <div className={`p-6 rounded-2xl ${status.bg} ${status.border} border text-center glass-card`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className={`w-5 h-5 ${status.color}`} />
            <p className={`font-bold text-lg ${status.color}`}>
              {status.message}
            </p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {result.score >= 70 
              ? 'You are performing exceptionally well. Keep up the great work!' 
              : result.score >= 50 
              ? 'You are on the right track. Focus on your weak areas and try again.' 
              : 'Don\'t give up! Review the study materials and retake the quiz to improve.'}
          </p>
        </div>

        {/* Performance Insight */}
        <div className="mt-8 glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-rozgar-blue" />
            <h3 className="font-bold text-gray-900 dark:text-white">Performance Insight</h3>
          </div>
          <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage