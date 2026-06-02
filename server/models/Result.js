const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: [true, 'Student name is required'], trim: true },
  batchName: { type: String, required: [true, 'Batch name is required'], trim: true },
  category: { type: String, required: [true, 'Category is required'], trim: true },
  totalQuestions: { type: Number, required: true, min: 0 },
  correctAnswers: { type: Number, required: true, min: 0 },
  wrongAnswers: { type: Number, required: true, min: 0 },
  score: { type: Number, required: true, min: 0, max: 100 }
}, { timestamps: true })

resultSchema.index({ studentName: 'text', batchName: 'text' })
resultSchema.index({ category: 1 })
resultSchema.index({ batchName: 1 })
resultSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Result', resultSchema)