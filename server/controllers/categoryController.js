const Category = require('../models/Category')

const getCategories = async (req, res) => {
  try { const categories = await Category.find().sort({ createdAt: -1 }); res.json(categories) }
  catch (error) { res.status(500).json({ message: error.message }) }
}

const createCategory = async (req, res) => {
  try { const { name } = req.body; const category = await Category.create({ name }); res.status(201).json(category) }
  catch (error) { res.status(400).json({ message: error.message }) }
}

const updateCategory = async (req, res) => {
  try {
    // Dynamically check what frontend is trying to update (name or status)
    const updateFields = {};
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.isActive !== undefined) updateFields.isActive = req.body.isActive;

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      updateFields, 
      { new: true, runValidators: true }
    )
    
    if (!category) return res.status(404).json({ message: 'Category not found' })
    res.json(category)
  } catch (error) { res.status(400).json({ message: error.message }) }
}

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category not found' })
    await require('../models/Question').deleteMany({ categoryId: req.params.id })
    res.json({ message: 'Category and associated questions deleted' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory }