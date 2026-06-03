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

  // Store answer with guaranteed string key
  const selectAnswer = useCallback((questionId, option) => {
    const id = String(questionId).trim()
    const cleanOption = String(option).trim()
    console.log('📝 selectAnswer:', { id, cleanOption })
    setAnswers(prev => ({ ...prev, [id]: cleanOption }))
  }, [])

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) setCurrentIndex(index)
  }, [totalQuestions])

  const nextQuestion = useCallback(() => goToQuestion(currentIndex + 1), [currentIndex, goToQuestion])
  const prevQuestion = useCallback(() => goToQuestion(currentIndex - 1), [currentIndex, goToQuestion])

  // Extract correct answer from question - handles ALL backend formats
  const getCorrectAnswer = (question) => {
    // Check all possible field names
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
    
    console.log('🔍 getCorrectAnswer debug:', { 
      questionId: String(question._id),
      rawCorrect, 
      options: question.options,
      allFields: possibleFields.reduce((acc, f) => ({ ...acc, [f]: question[f] }), {})
    })
    
    if (rawCorrect === null || rawCorrect === undefined) return null
    
    const options = question.options || []
    
    // If options array is empty, return raw as string
    if (!Array.isArray(options) || options.length === 0) return String(rawCorrect).trim()
    
    // Normalize options to strings
    const stringOptions = options.map(opt => 
      typeof opt === 'object' && opt !== null 
        ? String(opt.text || opt.option || opt.label || opt.value || JSON.stringify(opt)).trim()
        : String(opt).trim()
    )
    
    // Case 1: rawCorrect is a number (index)
    if (typeof rawCorrect === 'number') {
      return stringOptions[rawCorrect] || null
    }
    
    // Case 2: rawCorrect is numeric string
    if (/^\d+$/.test(String(rawCorrect))) {
      const idx = parseInt(rawCorrect, 10)
      return stringOptions[idx] || null
    }
    
    // Case 3: rawCorrect is letter A/B/C/D
    const letterMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4 }
    const strRaw = String(rawCorrect).trim()
    if (letterMap.hasOwnProperty(strRaw) && stringOptions.length > letterMap[strRaw]) {
      return stringOptions[letterMap[strRaw]]
    }
    
    // Case 4: rawCorrect is full text - find matching option
    const lowerRaw = strRaw.toLowerCase()
    const match = stringOptions.find(opt => opt.toLowerCase() === lowerRaw)
    if (match) return match
    
    // Case 5: rawCorrect might be option._id
    const idMatch = options.find(opt => 
      typeof opt === 'object' && opt !== null && String(opt._id) === strRaw
    )
    if (idMatch) {
      return String(idMatch.text || idMatch.option || idMatch.label || idMatch.value || JSON.stringify(idMatch)).trim()
    }
    
    // Return raw as fallback
    return strRaw
  }

  const calculateScore = useCallback(() => {
    let correct = 0
    let wrong = 0
    let unanswered = 0

    console.log('🧮 calculateScore called with answers:', answers)
    console.log('🧮 questions count:', questions.length)

    questions.forEach((question, idx) => {
      // Normalize question ID - try multiple formats
      const qId = String(question._id)
      const qIdStr = question._id?.toString ? question._id.toString() : String(question._id)
      
      // Try to find answer with different key formats
      let selectedAnswer = answers[qId] || answers[qIdStr] || null
      
      // Also try if the key was stored as the raw _id object
      const allKeys = Object.keys(answers)
      if (!selectedAnswer) {
        const matchingKey = allKeys.find(k => String(k) === qId || String(k) === qIdStr)
        if (matchingKey) selectedAnswer = answers[matchingKey]
      }
      
      console.log(`🔎 Q${idx + 1} (id: ${qId}): selected = "${selectedAnswer}"`)

      const correctAnswer = getCorrectAnswer(question)
      
      console.log(`🔎 Q${idx + 1}: correct = "${correctAnswer}"`)

      // Count unanswered
      if (!selectedAnswer || selectedAnswer.trim() === '') {
        unanswered++
        console.log(`   → UNANSWERED`)
        return
      }
      
      // Guard against missing correct answer
      if (!correctAnswer) {
        console.error(`   → ERROR: No correct answer found for question ${qId}!`)
        unanswered++ // Don't count as wrong if we can't verify
        return
      }

      const selectedClean = selectedAnswer.trim().toLowerCase()
      const correctClean = correctAnswer.trim().toLowerCase()

      if (selectedClean === correctClean) {
        correct++
        console.log(`   → ✅ CORRECT`)
      } else {
        wrong++
        console.log(`   → ❌ WRONG ("${selectedAnswer}" !== "${correctAnswer}")`)
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