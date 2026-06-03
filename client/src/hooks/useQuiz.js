import { useState, useCallback } from 'react'

export const useQuiz = (questions, timeLimit) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0
  const answeredCount = Object.keys(answers).length

  const selectAnswer = useCallback((questionId, option) => {
    console.log('Selected Answer:', questionId, option)

    setAnswers(prev => ({
      ...prev,
      [String(questionId)]: option
    }))
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
    let unanswered = 0

    console.log('========================')
    console.log('ALL ANSWERS:', answers)
    console.log('ALL QUESTIONS:', questions)
    console.log('========================')

    questions.forEach((q, index) => {
      const questionId = String(q._id)
      const userAnswer = answers[questionId]

      console.log(`Question ${index + 1}`)
      console.log('ID:', questionId)
      console.log('User Answer:', userAnswer)
      console.log('Correct Answer:', q.correctAnswer)

      if (!userAnswer) {
        unanswered++
      } else if (
        String(userAnswer).trim() === String(q.correctAnswer).trim()
      ) {
        correct++
      } else {
        wrong++
      }
    })

    const percentage =
      totalQuestions > 0
        ? Math.round((correct / totalQuestions) * 100)
        : 0

    console.log('RESULT:', {
      correct,
      wrong,
      unanswered,
      percentage
    })

    return {
      total: totalQuestions,
      correct,
      wrong,
      unanswered,
      percentage
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