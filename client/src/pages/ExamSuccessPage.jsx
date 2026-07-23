import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const ExamSuccessPage = () => {
  const navigate = useNavigate();

  // Clear any residual browser history so they can't hit "Back" to re-enter the exam
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Submission Successful
        </h1>
        
        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg mb-8">
          <p>Your exam has been submitted successfully.</p>
          <p>Thank you for participating.</p>
          <p>We wish you the very best.</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-rozgar-blue hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ExamSuccessPage;