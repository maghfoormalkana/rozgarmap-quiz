import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Clock, ChevronLeft, ChevronRight, Flag, Send, AlertTriangle,
  CheckCircle2, Circle, Timer, BookOpen, BarChart3
} from 'lucide-react'
import { getQuizQuestions } from '../services/api'
import { useQuiz } from '../hooks/useQuiz'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import toast from 'react-hot-toast'

const QuizPage = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showTimeUpModal, setShowTimeUpModal] = useState(false)

  const quizSetup = JSON.parse(sessionStorage.getItem('quizSetup') || '{}')

  const {
    currentIndex,
    currentQuestion,
    answers,
    timeLeft,
    setTimeLeft,
    isSubmitted,
    progress,
    answeredCount,
    totalQuestions,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitQuiz
  } = useQuiz(questions, quizSetup.quizTime || 30)

  useEffect(() => {
    if (!quizSetup.studentName) {
      navigate('/quiz-setup')
      return
    }
    fetchQuestions()
  }, [categoryId])

  useEffect(() => {
    if (loading || isSubmitted || questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeUpModal(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, isSubmitted, questions.length])

  const fetchQuestions = async () => {
    try {
      const res = await getQuizQuestions(categoryId)
      setQuestions(res.data)
      setTimeLeft((quizSetup.quizTime || 30) * 60)
    } catch (err) {
      toast.error('Failed to load questions')
      navigate('/quiz-setup')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = useCallback(() => {
    const score = submitQuiz()
    const resultData = {
      ...quizSetup,
      category: quizSetup.categoryName,
      totalQuestions: score.total,
      correctAnswers: score.correct,
      wrongAnswers: score.wrong,
      score: score.percentage,
      answers: answers
    }
    sessionStorage.setItem('quizResult', JSON.stringify(resultData))
    navigate('/result')
  }, [submitQuiz, quizSetup, answers, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    const total = (quizSetup.quizTime || 30) * 60
    const percentage = (timeLeft / total) * 100
    if (percentage <= 10) return 'text-red-500 animate-pulse'
    if (percentage <= 25) return 'text-orange-500'
    return 'text-rozgar-blue'
  }

  if (loading) return <LoadingSpinner fullScreen text="Preparing your quiz..." />

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
        <div className="text-center glass-card p-12">
          <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-400">No questions available for this category</p>
          <button onClick={() => navigate('/quiz-setup')} className="mt-6 btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white">
                {quizSetup.categoryName}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Question {currentIndex + 1} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-3 w-40">
              <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-700 font-mono font-bold ${getTimerColor()}`}>
              <Timer className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rozgar-red to-rozgar-red-light text-white rounded-xl hover:shadow-lg transition-all text-sm font-semibold active:scale-95"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* Question Panel */}
        <div className="flex-1">
          <div className="glass-card p-8 sm:p-10">
            {/* Question */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light text-white text-xs font-bold shadow-glow">
                  Question {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {answeredCount} of {totalQuestions} answered
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                {currentQuestion?.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options?.map((option, idx) => {
                const isSelected = answers[currentQuestion._id] === option
                const letters = ['A', 'B', 'C', 'D', 'E', 'F']
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(currentQuestion._id, option)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 group ${
                      isSelected
                        ? 'border-rozgar-blue bg-gradient-to-r from-rozgar-blue/5 to-rozgar-blue/10 dark:from-rozgar-blue/10 dark:to-rozgar-blue/20 shadow-glow'
                        : 'border-gray-200 dark:border-slate-600 hover:border-rozgar-blue/30 dark:hover:border-rozgar-blue/30 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 font-bold text-sm transition-all ${
                      isSelected
                        ? 'border-rozgar-blue bg-rozgar-blue text-white shadow-lg'
                        : 'border-gray-300 dark:border-slate-500 text-gray-500 dark:text-gray-400 group-hover:border-rozgar-blue/50'
                    }`}>
                      {isSelected ? <CheckCircle2 className="w-5 h-5" /> : letters[idx]}
                    </div>
                    <span className={`text-base ${isSelected ? 'font-semibold text-rozgar-blue' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {questions.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-rozgar-blue' : 
                      idx < currentIndex ? 'bg-rozgar-blue/40' : 'bg-gray-200 dark:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextQuestion}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light text-white font-semibold hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigator (Desktop) */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="glass-card p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-rozgar-blue" />
              <h3 className="font-bold text-gray-900 dark:text-white">
                Navigator
              </h3>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q._id]
                const isCurrent = idx === currentIndex
                return (
                  <button
                    key={q._id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light text-white shadow-glow scale-110'
                        : isAnswered
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light" />
                <span className="text-gray-600 dark:text-gray-400">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300" />
                <span className="text-gray-600 dark:text-gray-400">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-100 dark:bg-slate-700" />
                <span className="text-gray-600 dark:text-gray-400">Not Answered</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-rozgar-blue/10 to-rozgar-blue/5 dark:from-rozgar-blue/20 dark:to-rozgar-blue/10 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                <span className="text-sm font-bold text-rozgar-blue">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light rounded-full transition-all"
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Question Navigator */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-slate-700 p-3 z-20">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q._id]
            const isCurrent = idx === currentIndex
            return (
              <button
                key={q._id}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-xl text-sm font-bold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light text-white shadow-glow'
                    : isAnswered
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Quiz?"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Flag className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-2 text-lg font-semibold">
            You have answered <span className="text-rozgar-blue font-bold">{answeredCount}</span> out of <span className="font-bold">{totalQuestions}</span> questions.
          </p>
          {answeredCount < totalQuestions && (
            <p className="text-sm text-orange-500 mb-6 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl">
              ⚠️ {totalQuestions - answeredCount} question(s) remaining. Unanswered questions will be marked as wrong.
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              Continue Quiz
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rozgar-red to-rozgar-red-light text-white font-semibold hover:shadow-lg transition-all active:scale-95"
            >
              Submit Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Time Up Modal */}
      <Modal
        isOpen={showTimeUpModal}
        onClose={() => {}}
        title="Time's Up! ⏰"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
            Your time has expired!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            The quiz will be submitted automatically with your current answers.
          </p>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light text-white font-semibold hover:shadow-lg transition-all"
          >
            View Results
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default QuizPage