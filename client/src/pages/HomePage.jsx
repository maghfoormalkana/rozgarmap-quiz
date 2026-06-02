import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, BookOpen, Trophy, Clock, ArrowRight, CheckCircle,
  Sparkles, Zap, Target, TrendingUp, Star, Users, Award, Brain,
  ChevronRight, Play, Shield, BarChart3
} from 'lucide-react'

const HomePage = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'Skill Assessment',
      description: 'Comprehensive quizzes across 7 professional categories to validate your expertise.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500'
    },
    {
      icon: Clock,
      title: 'Timed Challenges',
      description: 'Set your own quiz duration. Practice under realistic time constraints.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500'
    },
    {
      icon: Target,
      title: 'Instant Feedback',
      description: 'Get immediate results with detailed score breakdowns and pass/fail status.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement over time with comprehensive result analytics.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-500'
    }
  ]

  const categories = [
    { name: 'Data Entry Operator', icon: '💻', color: 'from-blue-400 to-blue-600', count: '50+ Questions' },
    { name: 'Digital Marketing', icon: '📱', color: 'from-orange-400 to-orange-600', count: '75+ Questions' },
    { name: 'Web Development', icon: '🌐', color: 'from-green-400 to-green-600', count: '100+ Questions' },
    { name: 'Graphic Designing', icon: '🎨', color: 'from-pink-400 to-pink-600', count: '60+ Questions' },
    { name: 'MS Office', icon: '📊', color: 'from-yellow-400 to-yellow-600', count: '40+ Questions' },
    { name: 'Python', icon: '🐍', color: 'from-blue-500 to-indigo-600', count: '80+ Questions' },
    { name: 'Data Analytics', icon: '📈', color: 'from-teal-400 to-teal-600', count: '65+ Questions' }
  ]

  const stats = [
    { number: '7+', label: 'Categories', icon: BookOpen },
    { number: '500+', label: 'Questions', icon: Brain },
    { number: '1000+', label: 'Students', icon: Users },
    { number: '50+', label: 'Batches', icon: Award }
  ]

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          ref={heroRef}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80" 
            alt="Students learning"
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-rozgar-blue/95 via-rozgar-blue/90 to-rozgar-red/80" />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rozgar-red/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-slide-down">
            <Sparkles className="w-4 h-4" />
            Free Professional Skill Assessment
            <span className="px-2 py-0.5 rounded-full bg-rozgar-red text-xs font-bold">NEW</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-display">
            Master Your Skills with
            <span className="block mt-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              RozgarMap Quiz Portal
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Test your knowledge across multiple professional categories. 
            No login required — just enter your details and start your journey to success!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/quiz-setup"
              className="group flex items-center gap-3 bg-white text-rozgar-blue font-bold py-4 px-10 rounded-2xl hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Quiz Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-white font-semibold py-4 px-8 rounded-2xl border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="glass-card p-4 text-center hover:bg-white/20 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="w-6 h-6 text-white/80 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rozgar-blue/5 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rozgar-blue/10 dark:bg-rozgar-blue/20 text-rozgar-blue text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
              Everything You Need to
              <span className="gradient-text"> Excel</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive platform designed to help you evaluate and improve your professional skills with ease.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-slate-700 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-rozgar-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center text-rozgar-blue font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section with Image */}
      <section className="py-24 bg-gray-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" 
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left Content */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rozgar-red/10 dark:bg-rozgar-red/20 text-rozgar-red text-sm font-semibold mb-4">
                <BookOpen className="w-4 h-4" />
                Available Categories
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-display">
                Choose Your
                <span className="gradient-text"> Path</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Select from a wide range of professional skill categories. Each category contains carefully curated questions designed by industry experts.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-soft hover:shadow-soft-lg border border-gray-100 dark:border-slate-700 hover:border-rozgar-blue/30 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-rozgar-blue transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{cat.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                  alt="Team collaboration"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rozgar-blue/40 to-transparent" />

                {/* Floating card */}
                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Ready to Start?</p>
                    <p className="text-sm text-blue-100">Join thousands of students today</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-rozgar-red/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rozgar-blue/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 text-sm font-semibold mb-4">
              <Star className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Details',
                desc: 'Fill in your name, batch name, and set your preferred quiz duration.',
                icon: Users,
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80'
              },
              {
                step: '02',
                title: 'Pick Category',
                desc: 'Choose from our diverse range of professional skill categories.',
                icon: Target,
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'
              },
              {
                step: '03',
                title: 'Get Results',
                desc: 'Answer questions, submit your quiz, and receive instant detailed results.',
                icon: Trophy,
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="group relative">
                  <div className="card overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-5xl font-bold text-white/20 font-display">{item.step}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rozgar-blue/10 dark:bg-rozgar-blue/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-rozgar-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-rozgar-blue/30" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-24 bg-gradient-to-br from-rozgar-blue to-rozgar-blue-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80" 
            alt="Students"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-semibold mb-8">
            <BarChart3 className="w-4 h-4" />
            Trusted by Students
          </div>

          <blockquote className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight font-display">
            "RozgarMap Quiz Portal helped me identify my weak areas and improve my skills significantly. The instant feedback is incredibly valuable!"
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
              alt="Student"
              className="w-14 h-14 rounded-full object-cover border-2 border-white/30"
            />
            <div className="text-left">
              <p className="font-bold text-white">Ahmed Khan</p>
              <p className="text-blue-200 text-sm">Digital Marketing Batch 08</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80" 
              alt="Ready to start"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-rozgar-blue/95 to-rozgar-blue-dark/90" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-display">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Join thousands of students who are already improving their skills with RozgarMap Quiz Portal.
              </p>
              <Link
                to="/quiz-setup"
                className="group inline-flex items-center gap-3 bg-white text-rozgar-blue font-bold py-4 px-10 rounded-2xl hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/20 hover:-translate-y-1"
              >
                <GraduationCap className="w-6 h-6" />
                Start Your Quiz Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage