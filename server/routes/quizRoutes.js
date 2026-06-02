const express = require('express')
const router = express.Router()
const { getQuizQuestions } = require('../controllers/quizController')

router.get('/:categoryId', getQuizQuestions)

module.exports = router