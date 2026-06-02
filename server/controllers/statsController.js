const Category = require('../models/Category')
const Question = require('../models/Question')
const Result = require('../models/Result')

const getStats = async (req, res) => {
  try {
    const [totalCategories, totalQuestions, totalAttempts] = await Promise.all([Category.countDocuments(), Question.countDocuments(), Result.countDocuments()])
    const uniqueStudents = await Result.distinct('studentName')
    const totalStudents = uniqueStudents.length
    const recentAttempts = await Result.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
    const categoryStats = await Result.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }])
    res.json({ totalCategories, totalQuestions, totalStudents, totalAttempts, recentAttempts, categoryStats })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = { getStats }