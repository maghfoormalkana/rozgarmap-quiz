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

// ============================================
// CORS - Multiple Origins Support
// Supports both localhost and deployed frontend
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',  // Vite default port
  'http://localhost:8888',  // Netlify dev
  process.env.CLIENT_URL,
].filter(Boolean)

// Also add any additional deployed URLs from env
if (process.env.CLIENT_URL_PRODUCTION) {
  allowedOrigins.push(process.env.CLIENT_URL_PRODUCTION)
}

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(null, true) // Allow all for now, restrict in production if needed
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Routes
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/questions', require('./routes/questionRoutes'))
app.use('/api/results', require('./routes/resultRoutes'))
app.use('/api/stats', require('./routes/statsRoutes'))
app.use('/api/quiz', require('./routes/quizRoutes'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Database connection with caching for serverless
let cachedDb = null

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb
  }

  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  try {
    await mongoose.connect(MONGODB_URI)
    cachedDb = mongoose.connection
    console.log('Connected to MongoDB Atlas')
    return cachedDb
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    throw error
  }
}

// Connect DB middleware for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed: ' + error.message })
  }
})

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/api/health`)
      console.log(`Allowed CORS origins:`, allowedOrigins)
    })
  }).catch(err => {
    console.error('Failed to start server:', err.message)
  })
}

app.get('/api/debug', async (req, res) => {
  res.json({
    envVars: {
      hasMongoURI: !!process.env.MONGODB_URI,
      hasJWT: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      mongoURILength: process.env.MONGODB_URI?.length || 0
    },
    dbState: mongoose.connection.readyState,
    dbStates: ['disconnected', 'connected', 'connecting', 'disconnecting']
  })
})

module.exports = app