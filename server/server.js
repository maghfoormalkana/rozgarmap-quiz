const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

app.use(compression())

// CORS - Allow Netlify frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8888',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/admin/login', authLimiter)

// Static files for uploads
app.use('/uploads', express.static('uploads'))

// ============================================
// DATABASE CONNECTION - SERVERLESS SAFE
// ============================================

let cachedDb = null
let isConnecting = false

async function connectDB() {
  // Return cached connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    // Wait for existing connection attempt to finish
    let attempts = 0
    while (isConnecting && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100))
      attempts++
    }
    if (cachedDb && mongoose.connection.readyState === 1) {
      return cachedDb
    }
  }

  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  try {
    isConnecting = true
    console.log('Connecting to MongoDB Atlas...')

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    cachedDb = mongoose.connection
    isConnecting = false
    console.log('MongoDB connected successfully')
    return cachedDb
  } catch (error) {
    isConnecting = false
    console.error('MongoDB connection error:', error.message)
    throw error
  }
}

// ============================================
// DB CONNECTION MIDDLEWARE - Runs BEFORE routes
// ============================================
// This ensures DB is connected before any route handler executes

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('Database middleware error:', error.message)
    res.status(503).json({
      message: 'Database connection failed: ' + error.message,
      dbState: mongoose.connection.readyState,
      dbStates: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }
    })
  }
})

// ============================================
// ROUTES
// ============================================

app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/questions', require('./routes/questionRoutes'))
app.use('/api/results', require('./routes/resultRoutes'))
app.use('/api/stats', require('./routes/statsRoutes'))
app.use('/api/quiz', require('./routes/quizRoutes'))

// Health check - also tests DB connection
app.get('/api/health', async (req, res) => {
  try {
    await connectDB()
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      dbConnected: mongoose.connection.readyState === 1,
      dbState: mongoose.connection.readyState,
      dbStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    })
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: error.message,
      dbConnected: false,
      dbState: mongoose.connection.readyState
    })
  }
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ============================================
// LOCAL DEVELOPMENT ONLY
// ============================================

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/api/health`)
    })
  }).catch(err => {
    console.error('Failed to start server:', err.message)
  })
}

module.exports = app