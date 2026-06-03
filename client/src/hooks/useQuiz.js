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
    const id = String(questionId).trim()
    const cleanOption = String(option).trim()
    console.log('📝 selectAnswer:', { id, cleanOption })
    setAnswers(prev => {
      const updated = { ...prev, [id]: cleanOption }
      console.log('📝 answers state:', updated)
      return updated
    })
  }, [])

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) setCurrentIndex(index)
  }, [totalQuestions])

  const nextQuestion = useCallback(() => goToQuestion(currentIndex + 1), [currentIndex, goToQuestion])
  const prevQuestion = useCallback(() => goToQuestion(currentIndex - 1), [currentIndex, goToQuestion])

  const getCorrectAnswer = (question) => {
    // Check all possible field names for correct answer
    const possibleFields = [
      'correctAnswer',
      'correct_answer',
      '_correctAnswer',
      'answer',
      'correct',
      'correct_option',
      'rightAnswer',
      'right_answer',
      'solution'
    ]
    
    let rawCorrect = null
    for (const field of possibleFields) {
      if (question[field] !== undefined && question[field] !== null && question[field] !== '') {
        rawCorrect = question[field]
        break
      }
    }
    
    console.log('🔍 getCorrectAnswer:', { 
      questionId: String(question._id),
      rawCorrect, 
      options: question.options
    })
    
    if (rawCorrect === null || rawCorrect === undefined) return null
    
    const options = question.options || []
    if (!Array.isArray(options) || options.length === 0) return String(rawCorrect).trim()
    
    const stringOptions = options.map(opt => String(opt).trim())
    
    if (typeof rawCorrect === 'number') {
      return stringOptions[rawCorrect] || null
    }
    
    if (/^\d+$/.test(String(rawCorrect))) {
      const idx = parseInt(rawCorrect, 10)
      return stringOptions[idx] || null
    }
    
    const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 }
    const strRaw = String(rawCorrect).trim()
    if (letterMap.hasOwnProperty(strRaw) && stringOptions.length > letterMap[strRaw]) {
      return stringOptions[letterMap[strRaw]]
    }
    
    const lowerRaw = strRaw.toLowerCase()
    const match = stringOptions.find(opt => opt.toLowerCase() === lowerRaw)
    if (match) return match
    
    return strRaw
  }

  const calculateScore = useCallback(() => {
    let correct = 0
    let wrong = 0
    let unanswered = 0

    console.log('🧮 calculateScore called')
    console.log('🧮 answers keys:', Object.keys(answers))
    console.log('🧮 questions count:', questions.length)

    questions.forEach((question, idx) => {
      const qId = String(question._id)
      
      // Look up answer
      let selectedAnswer = answers[qId] || null
      
      // Fallback: try all keys
      if (!selectedAnswer) {
        const allKeys = Object.keys(answers)
        const matchingKey = allKeys.find(k => String(k) === qId)
        if (matchingKey) selectedAnswer = answers[matchingKey]
      }

      const correctAnswer = getCorrectAnswer(question)

      console.log(`🔎 Q${idx + 1} (id: ${qId}): selected="${selectedAnswer}", correct="${correctAnswer}"`)

      if (!selectedAnswer || selectedAnswer.trim() === '') {
        unanswered++
        console.log(`   → UNANSWERED`)
        return
      }
      
      if (!correctAnswer) {
        console.error(`   → ERROR: No correct answer found!`)
        unanswered++
        return
      }

      const selectedClean = selectedAnswer.trim().toLowerCase()
      const correctClean = correctAnswer.trim().toLowerCase()

      if (selectedClean === correctClean) {
        correct++
        console.log(`   → ✅ CORRECT`)
      } else {
        wrong++
        console.log(`   → ❌ WRONG`)
      }
    })

    const result = {
      total: totalQuestions,
      correct,
      wrong,
      unanswered,
      percentage: totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0
    }
    
    console.log('🏆 Final Result:', result)
    return result
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