import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExam } from '../hooks/useExam';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

const ExamInstructionsPage = () => {
  // 1. Catch the hidden state from the Registration Page
  const location = useLocation();
  const navigate = useNavigate();
  const { getStudentDetails } = useExam();
  
  const categoryId = location.state?.categoryId;

  useEffect(() => {
    // Prevent direct access without registration
    if (!getStudentDetails()) {
      navigate('/'); // Sending back to home is safest if they lost their session
    }
  }, [navigate, getStudentDetails]);

  const handleStart = () => {
    // 2. Pass the categoryId forward one last time to the actual Exam Page!
    navigate('/exam/start', { state: { categoryId } });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-rozgar-blue p-6 sm:p-10 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Examination Instructions</h1>
          <p className="text-blue-100">Please read carefully before starting the test</p>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
              <Clock className="w-8 h-8 text-rozgar-blue mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Time Limits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The timer will begin immediately upon clicking "Start Exam". Ensure you have a stable connection. The exam will auto-submit when the time expires.
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800">
              <ShieldAlert className="w-8 h-8 text-red-500 mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Strictly Monitored</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Do not refresh the page or switch browser tabs. Doing so may result in the automatic termination of your examination.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">General Guidelines</h3>
            <ul className="space-y-3">
              {[
                "You must attempt all questions to the best of your ability.",
                "You can navigate between questions using the provided 'Previous' and 'Next' buttons.",
                "You can use the Question Navigator grid to jump to specific questions.",
                "Unanswered questions will be marked as incorrect.",
                "Your final results will not be displayed immediately; they will be sent to the administration for review."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                By clicking start, you agree to abide by all examination rules and verify that the details provided during registration are accurate.
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-rozgar-blue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              I Understand, Start Exam Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructionsPage;