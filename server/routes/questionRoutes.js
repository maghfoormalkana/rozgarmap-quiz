const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/uploadMiddleware')
const { getQuestions, createQuestion, updateQuestion, deleteQuestion, bulkUpload, uploadExcel } = require('../controllers/questionController')

router.get('/', getQuestions)
router.post('/', protect, createQuestion)
router.put('/:id', protect, updateQuestion)
router.delete('/:id', protect, deleteQuestion)
router.post('/bulk', protect, bulkUpload)
router.post('/upload', protect, upload.single('file'), uploadExcel)

module.exports = router