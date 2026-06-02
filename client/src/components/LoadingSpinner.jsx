import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rozgar-blue to-rozgar-blue-light flex items-center justify-center mb-6 shadow-glow animate-pulse">
          <Loader2 className={`${sizeClasses.xl} text-white animate-spin`} />
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">{text}</p>
        <div className="mt-4 w-32 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rozgar-blue to-rozgar-blue-light rounded-full animate-shimmer" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rozgar-blue/20 to-rozgar-blue-light/20 flex items-center justify-center mb-3">
        <Loader2 className={`${sizeClasses[size]} text-rozgar-blue animate-spin`} />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{text}</p>
    </div>
  )
}

export default LoadingSpinner