const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: 'Please provide username and password' })

    const admin = await Admin.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    if (admin.isLocked()) {
      const remainingTime = Math.ceil((admin.lockUntil - Date.now()) / 60000)
      return res.status(423).json({ message: `Account locked. Try again in ${remainingTime} minutes.` })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      await admin.incLoginAttempts()
      const attemptsLeft = 5 - (admin.loginAttempts + 1)
      if (attemptsLeft <= 0) return res.status(423).json({ message: 'Too many failed attempts. Account locked for 2 hours.' })
      return res.status(401).json({ message: `Invalid credentials. ${attemptsLeft} attempts remaining.` })
    }

    if (admin.loginAttempts > 0) await admin.updateOne({ $set: { loginAttempts: 0 }, $unset: { lockUntil: 1 }, lastLogin: new Date() })
    else await admin.updateOne({ lastLogin: new Date() })

    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, admin: { username: admin.username, role: admin.role, lastLogin: admin.lastLogin } })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash -loginAttempts -lockUntil')
    if (!admin) return res.status(401).json({ message: 'Admin not found' })
    res.json({ admin })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const createAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne()
    if (existingAdmin) return res.status(403).json({ message: 'Admin already exists' })
    const { username, password } = req.body
    if (!username || !password || password.length < 8) return res.status(400).json({ message: 'Username and password (min 8 chars) required' })
    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await Admin.create({ username, passwordHash })
    res.status(201).json({ message: 'Admin created successfully', username: admin.username })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ message: 'Current password and new password (min 8 chars) required' })
    const admin = await Admin.findById(req.admin.id)
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' })
    admin.passwordHash = await bcrypt.hash(newPassword, 12)
    await admin.save()
    res.json({ message: 'Password changed successfully' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = { login, verify, createAdmin, changePassword }