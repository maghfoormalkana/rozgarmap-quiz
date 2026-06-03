import { useState, useCallback } from 'react'

export const useQuiz = (questions, timeLimit) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length

  const progress =
    totalQuestions > 0
      ? ((currentIndex + 1) / totalQuestions) * 100
      : 0

  const answeredCount = Object.keys(answers).length

  const selectAnswer = useCallback((questionId, option) => {
    // Normalize questionId to string for consistent key storage
    const id = String(questionId)

    setAnswers(prev => ({
      ...prev,
      [id]: option
    }))
  }, [])

  const goToQuestion = useCallback(
    (index) => {
      if (index >= 0 && index < totalQuestions) {
        setCurrentIndex(index)
      }
    },
    [totalQuestions]
  )

  const nextQuestion = useCallback(() => {
    goToQuestion(currentIndex + 1)
  }, [currentIndex, goToQuestion])

  const prevQuestion = useCallback(() => {
    goToQuestion(currentIndex - 1)
  }, [currentIndex, goToQuestion])

  const calculateScore = useCallback(() => {
    let correct = 0
    let wrong = 0

    questions.forEach(question => {
      // Normalize question._id to string to match answers keys
      const questionId = String(question._id)
      const selectedAnswer = answers[questionId]

      // Skip unanswered questions
      if (!selectedAnswer || selectedAnswer.trim() === '') return

      // Get correct answer with fallback for different field names
      const correctAnswer = question.correctAnswer || question._correctAnswer || question.answer || ''

      if (
        selectedAnswer.trim().toLowerCase() ===
        correctAnswer.trim().toLowerCase()
      ) {
        correct++
      } else {
        wrong++
      }
    })

    const unanswered = totalQuestions - correct - wrong

    return {
      total: totalQuestions,
      correct,
      wrong,
      unanswered,
      percentage:
        totalQuestions > 0
          ? Math.round((correct / totalQuestions) * 100)
          : 0
    }
  }, [questions, answers, totalQuestions])

  const submitQuiz = useCallback(() => {
    setIsSubmitted(true)
    const result = calculateScore()
    return result
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