import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Home, Award, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { createResult } from '../services/api'

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
        unanswered: result.unanswered,
        score: result.score
      })
    } catch (err) { 
      console.error('Failed to save result:', err) 
    }
  }

  const getStatus = () => {
    if (result.score >= 70) return { label: 'PASSED', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' }
    if (result.score >= 50) return { label: 'AVERAGE', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' }
    return { label: 'FAILED', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' }
  }

  const status = getStatus()
  const circleProgress = 2 * Math.PI * 80
  const strokeDashoffset = circleProgress - (circleProgress * (result.score || 0)) / 100

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="card p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.border} border mb-6`}>
              <Award className={`w-5 h-5 ${status.color}`} />
              <span className={`font-bold ${status.color}`}>{status.label}</span>
            </div>
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="12" className="text-gray-200 dark:text-gray-700" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className={result.score >= 70 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'} strokeDasharray={circleProgress} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{result.score}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Score</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{result.studentName}</h2>
            <p className="text-gray-500 dark:text-gray-400">{result.batchName} &bull; {result.category}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-rozgar-blue mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalQuestions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.correctAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Correct</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.wrongAnswers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wrong</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Correct Answers</span>
              <span className="text-sm font-semibold text-green-600">{result.correctAnswers} / {result.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Wrong Answers</span>
              <span className="text-sm font-semibold text-red-600">{result.wrongAnswers} / {result.totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-300">Unanswered</span>
              <span className="text-sm font-semibold text-gray-600">{result.unanswered || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rozgar-blue/5 dark:bg-rozgar-blue/10 rounded-lg">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Final Score</span>
              <span className="text-lg font-bold text-rozgar-blue">{result.score}%</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => { sessionStorage.removeItem('quizResult'); sessionStorage.removeItem('quizSetup'); navigate('/quiz-setup') }} className="flex-1 btn-primary flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />Take Another Quiz
            </button>
            <button onClick={() => navigate('/')} className="flex-1 btn-outline flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />Go Home
            </button>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${status.bg} ${status.border} border text-center`}>
          <p className={`font-medium ${status.color}`}>
            {result.score >= 70 ? 'Excellent work! You have a strong understanding of this subject.' : result.score >= 50 ? 'Good effort! Keep practicing to improve your score.' : 'Keep learning! Review the material and try again.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultPage