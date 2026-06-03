import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, ChevronLeft, ChevronRight, Flag, Send, AlertTriangle } from 'lucide-react'
import { getQuizQuestions } from '../services/api'
import { useQuiz } from '../hooks/useQuiz'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'

const QuizPage = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimeUpModal, setShowTimeUpModal] = useState(false)
  const quizSetup = JSON.parse(sessionStorage.getItem('quizSetup') || '{}')

  const { currentIndex, currentQuestion, answers, timeLeft, setTimeLeft, isSubmitted, progress, answeredCount, totalQuestions, selectAnswer, goToQuestion, nextQuestion, prevQuestion, calculateScore, submitQuiz } = useQuiz(questions, quizSetup.quizTime || 30)

  useEffect(() => { if (!quizSetup.studentName) { navigate('/quiz-setup'); return } fetchQuestions() }, [categoryId])

  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); setShowTimeUpModal(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [loading, isSubmitted, questions.length])

  const fetchQuestions = async () => {
    try {
      const res = await getQuizQuestions(categoryId)
      // Store correct answers separately for score calculation
      const questionsWithAnswers = res.data.map(q => ({
        ...q,
        correctAnswer: q.correctAnswer || q._correctAnswer
      }))
      setQuestions(questionsWithAnswers)
      setTimeLeft((quizSetup.quizTime || 30) * 60)
    } catch (err) { navigate('/quiz-setup') }
    finally { setLoading(false) }
  }

  const handleSubmit = useCallback(() => {
    const score = submitQuiz()
    const resultData = {
      ...quizSetup,
      category: quizSetup.categoryName,
      totalQuestions: score.total,
      correctAnswers: score.correct,
      wrongAnswers: score.wrong,
      unanswered: score.unanswered,
      score: score.percentage,
      answers: answers
    }
    sessionStorage.setItem('quizResult', JSON.stringify(resultData))
    navigate('/result')
  }, [submitQuiz, quizSetup, answers, navigate])

  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` }
  const getTimerColor = () => { const total = (quizSetup.quizTime || 30) * 60; const percentage = (timeLeft / total) * 100; if (percentage <= 10) return 'text-red-500 animate-pulse'; if (percentage <= 25) return 'text-orange-500'; return 'text-rozgar-blue' }

  if (loading) return <LoadingSpinner fullScreen text="Loading quiz..." />

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">No questions available for this category</p>
          <button onClick={() => navigate('/quiz-setup')} className="mt-4 btn-primary">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">{quizSetup.categoryName}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Question {currentIndex + 1} of {totalQuestions}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-32">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-rozgar-blue rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 font-mono font-bold ${getTimerColor()}`}>
              <Clock className="w-4 h-4" />{formatTime(timeLeft)}
            </div>
            <button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-2 px-4 py-2 bg-rozgar-red text-white rounded-lg hover:bg-rozgar-red-dark transition-colors text-sm font-medium">
              <Send className="w-4 h-4" />Submit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <div className="flex-1">
          <div className="card p-6 sm:p-8">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full bg-rozgar-blue/10 dark:bg-rozgar-blue/20 text-rozgar-blue text-xs font-semibold mb-4">Question {currentIndex + 1}</span>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white leading-relaxed">{currentQuestion?.question}</h2>
            </div>
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, idx) => {
                const isSelected = answers[currentQuestion._id] === option
                return (
                  <button key={idx} onClick={() => selectAnswer(currentQuestion._id, option)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${isSelected ? 'border-rozgar-blue bg-rozgar-blue/5 dark:bg-rozgar-blue/10 shadow-md' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-rozgar-blue bg-rozgar-blue' : 'border-gray-300 dark:border-gray-500'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-base ${isSelected ? 'font-medium text-rozgar-blue' : 'text-gray-700 dark:text-gray-300'}`}>{option}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button onClick={prevQuestion} disabled={currentIndex === 0} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-5 h-5" />Previous
              </button>
              <button onClick={nextQuestion} disabled={currentIndex === totalQuestions - 1} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rozgar-blue text-white font-medium hover:bg-rozgar-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Next<ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q._id]
                const isCurrent = idx === currentIndex
                return (
                  <button key={q._id} onClick={() => goToQuestion(idx)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${isCurrent ? 'bg-rozgar-blue text-white shadow-md scale-110' : isAnswered ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rozgar-blue" /><span className="text-gray-600 dark:text-gray-400">Current</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300" /><span className="text-gray-600 dark:text-gray-400">Answered</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-700" /><span className="text-gray-600 dark:text-gray-400">Not Answered</span></div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-rozgar-blue dark:text-blue-300 font-medium">{answeredCount} of {totalQuestions} answered</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 z-20">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q._id]
            const isCurrent = idx === currentIndex
            return (
              <button key={q._id} onClick={() => goToQuestion(idx)} className={`w-9 h-9 rounded-lg text-sm font-medium shrink-0 transition-all ${isCurrent ? 'bg-rozgar-blue text-white' : isAnswered ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Quiz?" size="sm">
        <div className="text-center">
          <Flag className="w-12 h-12 text-rozgar-blue mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">You have answered <strong>{answeredCount}</strong> out of <strong>{totalQuestions}</strong> questions.</p>
          {answeredCount < totalQuestions && <p className="text-sm text-orange-500 mb-4">{totalQuestions - answeredCount} question(s) remaining. Are you sure?</p>}
          <div className="flex gap-3 mt-6">
            <button onClick={() => setShowSubmitModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Continue Quiz</button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-lg bg-rozgar-red text-white font-medium hover:bg-rozgar-red-dark transition-colors">Submit Now</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showTimeUpModal} onClose={() => {}} title="Time's Up!" size="sm">
        <div className="text-center">
          <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-6">Your quiz time has expired. The quiz will be submitted automatically.</p>
          <button onClick={handleSubmit} className="w-full px-4 py-2.5 rounded-lg bg-rozgar-blue text-white font-medium hover:bg-rozgar-blue-dark transition-colors">View Results</button>
        </div>
      </Modal>
    </div>
  )
}

export default QuizPage