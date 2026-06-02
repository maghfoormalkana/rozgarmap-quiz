const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')

router.get('/', getCategories)
router.post('/', protect, createCategory)
router.put('/:id', protect, updateCategory)
router.delete('/:id', protect, deleteCategory)

module.exports = router