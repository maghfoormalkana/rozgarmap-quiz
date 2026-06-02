const Question = require('../models/Question')
const Category = require('../models/Category')
const ExcelJS = require('exceljs')

const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, search } = req.query
    const query = {}
    if (categoryId) query.categoryId = categoryId
    if (search) query.$text = { $search: search }
    const questions = await Question.find(query).populate('categoryId', 'name').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit)
    const count = await Question.countDocuments(query)
    res.json({ questions, totalPages: Math.ceil(count / limit), currentPage: page, totalCount: count })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const createQuestion = async (req, res) => {
  try { const question = await Question.create(req.body); const populated = await Question.findById(question._id).populate('categoryId', 'name'); res.status(201).json(populated) }
  catch (error) { res.status(400).json({ message: error.message }) }
}

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('categoryId', 'name')
    if (!question) return res.status(404).json({ message: 'Question not found' })
    res.json(question)
  } catch (error) { res.status(400).json({ message: error.message }) }
}

const deleteQuestion = async (req, res) => {
  try { const question = await Question.findByIdAndDelete(req.params.id); if (!question) return res.status(404).json({ message: 'Question not found' }); res.json({ message: 'Question deleted' }) }
  catch (error) { res.status(500).json({ message: error.message }) }
}

const bulkUpload = async (req, res) => {
  try {
    const { categoryId, questions } = req.body
    if (!categoryId || !Array.isArray(questions) || questions.length === 0) return res.status(400).json({ message: 'Category ID and questions array are required' })
    const validQuestions = [], errors = []
    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || !q.correctAnswer) { errors.push(`Question ${index + 1}: Missing required fields`); return }
      if (!q.options.includes(q.correctAnswer)) { errors.push(`Question ${index + 1}: Correct answer not in options`); return }
      validQuestions.push({ categoryId, question: q.question, options: q.options, correctAnswer: q.correctAnswer })
    })
    if (errors.length > 0 && validQuestions.length === 0) return res.status(400).json({ message: 'Validation errors', errors })
    await Question.insertMany(validQuestions)
    res.status(201).json({ message: `${validQuestions.length} questions uploaded successfully`, errors: errors.length > 0 ? errors : undefined })
  } catch (error) { res.status(400).json({ message: error.message }) }
}

const uploadExcel = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file' })
    const { categoryId } = req.body
    if (!categoryId) return res.status(400).json({ message: 'Category ID is required' })
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(req.file.path)
    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) return res.status(400).json({ message: 'No worksheet found in file' })
    const questions = [], errors = []
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      const cells = row.values
      const question = cells[1], opt1 = cells[2], opt2 = cells[3], opt3 = cells[4], opt4 = cells[5], correct = cells[6]
      if (!question || !opt1 || !opt2 || !correct) { errors.push(`Row ${rowNumber}: Missing required fields`); return }
      const options = [String(opt1).trim(), String(opt2).trim()]
      if (opt3) options.push(String(opt3).trim())
      if (opt4) options.push(String(opt4).trim())
      const correctStr = String(correct).trim()
      if (!options.includes(correctStr)) { errors.push(`Row ${rowNumber}: Correct answer not in options`); return }
      questions.push({ categoryId, question: String(question).trim(), options, correctAnswer: correctStr })
    })
    if (questions.length === 0) return res.status(400).json({ message: 'No valid questions found', errors })
    await Question.insertMany(questions)
    res.status(201).json({ message: `${questions.length} questions uploaded successfully`, errors: errors.length > 0 ? errors : undefined })
  } catch (error) { res.status(400).json({ message: error.message }) }
}

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion, bulkUpload, uploadExcel }