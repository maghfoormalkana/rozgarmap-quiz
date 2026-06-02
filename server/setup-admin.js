const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const readline = require('readline')
const Admin = require('./models/Admin')
require('dotenv').config()

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve))

const setupAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not found in .env file'); process.exit(1) }
    console.log('Connecting to MongoDB Atlas...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')
    const existingAdmin = await Admin.findOne()
    if (existingAdmin) { console.log('Admin already exists in database.'); console.log(`Username: ${existingAdmin.username}`); process.exit(0) }
    console.log('\nRozgar Map Quiz Admin Setup')
    console.log('========================\n')
    const username = await question('Enter admin username: ')
    if (!username || username.length < 3) { console.log('Username must be at least 3 characters'); process.exit(1) }
    const password = await question('Enter admin password (min 8 chars): ')
    if (!password || password.length < 8) { console.log('Password must be at least 8 characters'); process.exit(1) }
    const confirmPassword = await question('Confirm password: ')
    if (password !== confirmPassword) { console.log('Passwords do not match'); process.exit(1) }
    console.log('Creating admin account...')
    const passwordHash = await bcrypt.hash(password, 12)
    const admin = await Admin.create({ username, passwordHash })
    console.log('Admin created successfully!')
    console.log(`Username: ${admin.username}`)
    console.log('You can now login at: http://localhost:3000/admin/login')
  } catch (error) {
    console.error('Setup failed:', error.message)
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('MongoDB Connection Troubleshooting:')
      console.error('1. Check your MONGODB_URI in server/.env')
      console.error('2. Whitelist your IP: MongoDB Atlas -> Network Access -> Add IP Address -> 0.0.0.0/0')
      console.error('3. If in Pakistan/Asia: Use a VPN or mobile hotspot')
      console.error('4. Try direct connection string (mongodb:// instead of mongodb+srv://)')
    }
    process.exit(1)
  } finally { rl.close(); await mongoose.disconnect(); process.exit(0) }
}

setupAdmin()