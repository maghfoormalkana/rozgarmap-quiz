const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(decoded.id).select('-passwordHash')
    if (!admin) return res.status(401).json({ message: 'Admin account no longer exists' })
    req.admin = { id: admin._id, username: admin.username, role: admin.role }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' })
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token expired, please login again' })
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

module.exports = { protect }