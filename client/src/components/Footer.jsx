const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rozgar-blue to-rozgar-blue-dark text-white py-8 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80" 
          alt="Footer background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-sm">RM</span>
            </div>
            <div>
              <span className="font-bold text-lg font-display">RozgarMap</span>
              <span className="text-xs text-blue-200 block">Road to Success</span>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-sm text-blue-100">
              Made By <span className="font-bold text-white">Maghfoor Ahmad</span>
            </p>
            <p className="text-xs text-blue-300 mt-1">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer