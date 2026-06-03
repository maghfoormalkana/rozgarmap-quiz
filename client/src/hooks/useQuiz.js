import { useState, useCallback } from 'react'

export const useQuiz = (questions, timeLimit) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const answeredCount = Object.keys(answers).length

  const selectAnswer = useCallback((questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }, [])

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index)
    }
  }, [totalQuestions])

  const nextQuestion = useCallback(() => {
    goToQuestion(currentIndex + 1)
  }, [currentIndex, goToQuestion])

  const prevQuestion = useCallback(() => {
    goToQuestion(currentIndex - 1)
  }, [currentIndex, goToQuestion])

  const calculateScore = useCallback(() => {
    let correct = 0
    let wrong = 0
    questions.forEach(q => {
      if (answers[q._id] === q.correctAnswer) {
        correct++
      } else if (answers[q._id]) {
        wrong++
      }
    })
    return {
      total: totalQuestions,
      correct,
      wrong,
      unanswered: totalQuestions - correct - wrong,
      percentage: Math.round((correct / totalQuestions) * 100)
    }
  }, [questions, answers, totalQuestions])

  const submitQuiz = useCallback(() => {
    setIsSubmitted(true)
    return calculateScore()
  }, [calculateScore])

  return {
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
    calculateScore,
    submitQuiz
  }
}