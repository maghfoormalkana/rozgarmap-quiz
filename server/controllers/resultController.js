const Result = require('../models/Result')
const ExcelJS = require('exceljs')

const getResults = async (req, res) => {
  try {
    const { page = 1, limit = 15, search, batch, category, dateFrom, dateTo } = req.query
    const query = {}
    if (search) { query.$or = [{ studentName: { $regex: search, $options: 'i' } }, { batchName: { $regex: search, $options: 'i' } }] }
    if (batch) query.batchName = { $regex: batch, $options: 'i' }
    if (category) query.category = category
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom)
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
    }
    const results = await Result.find(query).sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit)
    const count = await Result.countDocuments(query)
    res.json({ results, totalPages: Math.ceil(count / limit), currentPage: page, totalCount: count })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const createResult = async (req, res) => {
  try {
    const result = await Result.create(req.body)
    res.status(201).json(result)
  } catch (error) { res.status(400).json({ message: error.message }) }
}

const exportResults = async (req, res) => {
  try {
    const { format = 'excel', batch, category, dateFrom, dateTo } = req.query
    const query = {}
    if (batch) query.batchName = { $regex: batch, $options: 'i' }
    if (category) query.category = category
    if (dateFrom || dateTo) {
      query.createdAt = {}
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom)
      if (dateTo) query.createdAt.$lte = new Date(dateTo + 'T23:59:59.999Z')
    }
    const results = await Result.find(query).sort({ createdAt: -1 })
    const data = results.map(r => ({ 'Student Name': r.studentName, 'Batch Name': r.batchName, 'Category': r.category, 'Total Questions': r.totalQuestions, 'Correct Answers': r.correctAnswers, 'Wrong Answers': r.wrongAnswers, 'Score (%)': r.score, 'Date': r.createdAt.toISOString().split('T')[0], 'Time': r.createdAt.toTimeString().split(' ')[0] }))
    if (format === 'csv') {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Results')
      if (data.length > 0) { worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key })); data.forEach(row => worksheet.addRow(row)) }
      const buffer = await workbook.csv.writeBuffer()
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename=results-${Date.now()}.csv`)
      res.send(buffer)
    } else {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Quiz Results')
      if (data.length > 0) {
        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key, width: Math.max(key.length + 5, 15) }))
        data.forEach(row => worksheet.addRow(row))
        worksheet.getRow(1).eachCell(cell => { cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B4F9E' } }; cell.alignment = { horizontal: 'center', vertical: 'middle' } })
        worksheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: worksheet.columns.length } }
      }
      const buffer = await workbook.xlsx.writeBuffer()
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', `attachment; filename=results-${Date.now()}.xlsx`)
      res.send(buffer)
    }
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = { getResults, createResult, exportResults }