const Question = require('../models/Question')
const Category = require('../models/Category')

const getQuizQuestions = async (req, res) => {
  try {
    const { categoryId } = req.params
    const category = await Category.findById(categoryId)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    let questions = await Question.find({ categoryId }).select('-correctAnswer')
    if (questions.length === 0) return res.status(404).json({ message: 'No questions found for this category' })
    questions = questions.sort(() => Math.random() - 0.5)
    questions = questions.map(q => {
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5)
      return { _id: q._id, question: q.question, options: shuffledOptions }
    })
    res.json(questions)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = { getQuizQuestions }