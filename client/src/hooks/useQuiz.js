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
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
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

  const nextQuestion = useCallback(
    () => goToQuestion(currentIndex + 1),
    [currentIndex, goToQuestion]
  )

  const prevQuestion = useCallback(
    () => goToQuestion(currentIndex - 1),
    [currentIndex, goToQuestion]
  )

  const calculateScore = useCallback(() => {
    let correct = 0
    let wrong = 0
    let unanswered = 0

    questions.forEach(q => {
      const selectedAnswer = answers[q._id]

      if (!selectedAnswer) {
        unanswered++
      } else if (
        selectedAnswer.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
      ) {
        correct++
      } else {
        wrong++
      }
    })

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