const express = require('express')
const router = express.Router()
const { protect } = require('../middlewares/authMiddleware')
const { getResults, createResult, exportResults } = require('../controllers/resultController')

router.get('/', protect, getResults)
router.post('/', createResult)
router.get('/export', protect, exportResults)

module.exports = router