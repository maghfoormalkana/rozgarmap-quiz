const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Category name is required'], trim: true, unique: true, maxlength: [100, 'Name cannot exceed 100 characters'] }
}, { timestamps: true })

categorySchema.index({ name: 'text' })
module.exports = mongoose.model('Category', categorySchema)