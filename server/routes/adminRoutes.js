const express = require('express')
const router = express.Router()
const { login, verify, createAdmin, changePassword } = require('../controllers/adminController')
const { protect } = require('../middlewares/authMiddleware')

router.post('/login', login)
router.get('/verify', protect, verify)
router.post('/setup', createAdmin)
router.put('/password', protect, changePassword)

module.exports = router