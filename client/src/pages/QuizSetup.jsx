import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  User, Users, Clock, ArrowRight, BookOpen, AlertCircle,
  Sparkles, ChevronRight, GraduationCap, Zap, Target
} from 'lucide-react'
import { getCategories } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const QuizSetup = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    studentName: '',
    batchName: '',
    quizTime: 30,
  })
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data)
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSetupSubmit = (e) => {
    e.preventDefault()
    if (!formData.studentName.trim() || !formData.batchName.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    setStep(2)
  }

  const startQuiz = (category) => {
    setSelectedCategory(category)
    sessionStorage.setItem('quizSetup', JSON.stringify({
      ...formData,
      categoryId: category._id,
      categoryName: category.name
    }))
    navigate(`/quiz/${category._id}`)
  }

  if (loading) return <LoadingSpinner fullScreen text="Loading categories..." />

  const categoryImages = [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
  ]

  return (
    <div className="min-h-[calc(100vh-64px-80px)] bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80" 
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-50 dark:to-slate-950" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                step >= 1 ? 'bg-rozgar-blue text-white shadow-lg' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
              }`}>
                1
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Your Details</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Name & Batch</p>
              </div>
            </div>

            <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light rounded-full transition-all duration-700" 
                style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                step >= 2 ? 'bg-rozgar-blue text-white shadow-lg' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
              }`}>
                2
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Select Category</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pick your quiz</p>
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="animate-slide-up">
            <div className="glass-card p-8 sm:p-12 max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 font-display">
                  Let's Get Started
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your details to begin your assessment
                </p>
              </div>

              <form onSubmit={handleSetupSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-rozgar-blue" />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ahmed Khan"
                    className="input-field"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-rozgar-blue" />
                      Batch Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="batchName"
                    value={formData.batchName}
                    onChange={handleInputChange}
                    placeholder="e.g. DM Batch 08"
                    className="input-field"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-rozgar-blue" />
                      Quiz Duration
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="quizTime"
                      value={formData.quizTime}
                      onChange={handleInputChange}
                      min="5"
                      max="120"
                      step="5"
                      className="flex-1 h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-rozgar-blue"
                    />
                    <div className="w-24 px-4 py-2 bg-rozgar-blue/10 dark:bg-rozgar-blue/20 rounded-xl text-center">
                      <span className="text-2xl font-bold text-rozgar-blue">{formData.quizTime}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">min</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recommended: 30-60 minutes for best results
                  </p>
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg">
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rozgar-red to-rozgar-red-light flex items-center justify-center mx-auto mb-6 shadow-glow-red">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 font-display">
                Select a Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                Choose the skill category you want to be tested on. Each category contains carefully curated questions.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No categories available yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Please check back later</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <button
                    key={category._id}
                    onClick={() => startQuiz(category)}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-2 text-left border border-gray-100 dark:border-slate-700"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={categoryImages[index % categoryImages.length]} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white font-semibold text-sm">{category.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span>Click to start</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-rozgar-blue/10 dark:bg-rozgar-blue/20 flex items-center justify-center group-hover:bg-rozgar-blue transition-colors">
                          <ChevronRight className="w-4 h-4 text-rozgar-blue group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              className="mt-8 mx-auto block text-sm text-gray-500 dark:text-gray-400 hover:text-rozgar-blue dark:hover:text-rozgar-blue transition-colors flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizSetup