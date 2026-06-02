const mongoose = require('mongoose')
const Category = require('../models/Category')
const Question = require('../models/Question')
require('dotenv').config()

const seedData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) { console.error('ERROR: MONGODB_URI not found in .env file'); process.exit(1) }
    console.log('Connecting to MongoDB Atlas...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')
    await Category.deleteMany({})
    await Question.deleteMany({})
    console.log('Cleared existing categories and questions')
    const categories = await Category.insertMany([
      { name: 'Data Entry Operator' }, { name: 'Digital Marketing' }, { name: 'Web Development' },
      { name: 'Graphic Designing' }, { name: 'MS Office' }, { name: 'Python' }, { name: 'Data Analytics' }
    ])
    console.log(`Created ${categories.length} categories`)
    const sampleQuestions = []
    const dmQuestions = [
      { question: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Social Engine Optimization', 'Search Engine Operator', 'None'], correctAnswer: 'Search Engine Optimization' },
      { question: 'Which platform is best for B2B marketing?', options: ['Instagram', 'LinkedIn', 'TikTok', 'Snapchat'], correctAnswer: 'LinkedIn' },
      { question: 'What is CPC in digital marketing?', options: ['Cost Per Click', 'Click Per Cost', 'Cost Per Conversion', 'Customer Per Click'], correctAnswer: 'Cost Per Click' },
      { question: 'Which metric measures website engagement?', options: ['Bounce Rate', 'Click Rate', 'Open Rate', 'Conversion Rate'], correctAnswer: 'Bounce Rate' },
      { question: 'What is the primary goal of content marketing?', options: ['Direct Sales', 'Brand Awareness', 'Immediate Profit', 'Product Launch'], correctAnswer: 'Brand Awareness' }
    ]
    const webDevQuestions = [
      { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language' },
      { question: 'Which CSS property controls text size?', options: ['font-style', 'text-size', 'font-size', 'text-style'], correctAnswer: 'font-size' },
      { question: 'What is ReactJS primarily used for?', options: ['Database Management', 'Building User Interfaces', 'Server Configuration', 'Network Security'], correctAnswer: 'Building User Interfaces' },
      { question: 'Which HTTP method is used to update data?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 'PUT' },
      { question: 'What is the purpose of Git?', options: ['Web Hosting', 'Version Control', 'Database Management', 'Email Service'], correctAnswer: 'Version Control' }
    ]
    const pythonQuestions = [
      { question: 'What is the output of print(2**3)?', options: ['6', '8', '9', 'Error'], correctAnswer: '8' },
      { question: 'Which function is used to get user input in Python?', options: ['scan()', 'input()', 'read()', 'get()'], correctAnswer: 'input()' },
      { question: 'What data type is [1, 2, 3] in Python?', options: ['Tuple', 'List', 'Dictionary', 'Set'], correctAnswer: 'List' },
      { question: 'Which library is used for data analysis in Python?', options: ['NumPy', 'Pandas', 'Matplotlib', 'All of the above'], correctAnswer: 'All of the above' },
      { question: 'What does PEP 8 refer to?', options: ['Python Enhancement Proposal', 'Python Error Protocol', 'Python Execution Process', 'Python Environment Package'], correctAnswer: 'Python Enhancement Proposal' }
    ]
    const dmCat = categories.find(c => c.name === 'Digital Marketing')
    const webCat = categories.find(c => c.name === 'Web Development')
    const pyCat = categories.find(c => c.name === 'Python')
    dmQuestions.forEach(q => sampleQuestions.push({ ...q, categoryId: dmCat._id }))
    webDevQuestions.forEach(q => sampleQuestions.push({ ...q, categoryId: webCat._id }))
    pythonQuestions.forEach(q => sampleQuestions.push({ ...q, categoryId: pyCat._id }))
    await Question.insertMany(sampleQuestions)
    console.log(`Created ${sampleQuestions.length} sample questions`)
    console.log('Seed completed successfully!')
    console.log(`Summary: ${categories.length} categories, ${sampleQuestions.length} questions`)
    console.log('Next step: Run "npm run setup" to create your admin account')
    process.exit(0)
  } catch (error) {
    console.error('Seed failed:', error.message)
    if (error.message.includes('ECONNREFUSED') || error.message.includes('querySrv')) {
      console.error('MongoDB Connection Troubleshooting:')
      console.error('1. Check your MONGODB_URI in server/.env')
      console.error('2. Whitelist your IP: MongoDB Atlas -> Network Access -> Add IP Address -> 0.0.0.0/0')
      console.error('3. If in Pakistan/Asia: Use a VPN or mobile hotspot')
      console.error('4. Try direct connection string (mongodb:// instead of mongodb+srv://)')
    }
    process.exit(1)
  } finally { await mongoose.disconnect() }
}

seedData()