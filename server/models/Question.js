const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'Category is required'] },
  question: { type: String, required: [true, 'Question text is required'], trim: true, maxlength: [500, 'Question cannot exceed 500 characters'] },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: { validator: function(v) { return v.length >= 2 && v.length <= 6 }, message: 'Questions must have 2-6 options' }
  },
  correctAnswer: { type: String, required: [true, 'Correct answer is required'], trim: true }
}, { timestamps: true })

questionSchema.index({ categoryId: 1 })
questionSchema.index({ question: 'text' })

questionSchema.pre('save', function(next) {
  if (!this.options.includes(this.correctAnswer)) {
    return next(new Error('Correct answer must be one of the options'))
  }
  next()
})

module.exports = mongoose.model('Question', questionSchema)