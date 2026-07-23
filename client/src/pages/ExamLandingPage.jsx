import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, ArrowRight } from 'lucide-react';

const ExamLandingPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-rozgar-blue p-8 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Official Examination Portal
            </h1>
            <p className="text-blue-100">
              Strictly monitored online assessment platform
            </p>
          </div>
          
          <div className="p-8">
            <div className="prose dark:prose-invert max-w-none mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                About this Examination
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You are about to enter the secure examination environment. This test is designed to accurately evaluate your proficiency and understanding. Once started, you must complete the examination in a single sitting.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-rozgar-blue mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-rozgar-blue dark:text-blue-400">Important Notice</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Results for this examination are not displayed immediately upon completion. They will be recorded securely and reviewed by the administration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/exam/register/${categoryId}`)}
              className="w-full flex items-center justify-center gap-2 bg-rozgar-blue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
            >
              Proceed to Registration
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamLandingPage;