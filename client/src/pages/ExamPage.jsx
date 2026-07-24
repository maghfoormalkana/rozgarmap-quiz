import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useExam } from '../hooks/useExam';
import ExamTimer from '../pages/ExamTimer';
import ExamNavigator from '../pages/ExamNavigator';
import LoadingSpinner from '../components/LoadingSpinner';

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStudentDetails, fetchQuestions, submitFinalExam, loading, error } = useExam();

  // Bulletproof ID extraction: Check route state first, then session storage
  const studentData = getStudentDetails();
  const categoryId = location.state?.categoryId || studentData?.categoryId;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Security Check: If no session exists, kick back to registration
    if (!studentData) {
      navigate('/exam/register');
      return;
    }

    const loadExam = async () => {
      try {
        const qData = await fetchQuestions(categoryId);
        setQuestions(qData);
      } catch (err) {
        console.error("Failed to load questions:", err);
      }
    };
    
    // BULLETPROOF CHECK: Only fetch if we have an ID AND haven't loaded questions yet
    if (categoryId && questions.length === 0) {
       loadExam();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, navigate]); // REMOVED unstable dependencies to stop the loop!

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: option
    }));
  };

  const handleForceSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Format answers exactly as the backend expects: [{ questionId, selectedAnswer }]
    const formattedAnswers = questions.map((q, idx) => ({
      questionId: q._id,
      selectedAnswer: answers[idx] || null
    }));

    try {
      await submitFinalExam(categoryId, formattedAnswers);
      navigate('/exam/success');
    } catch (err) {
      alert("Failed to submit exam. Please try again.");
      setIsSubmitting(false);
    }
  }, [questions, answers, categoryId, submitFinalExam, navigate, isSubmitting]);

  if (loading || !questions.length) return <LoadingSpinner fullScreen />;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Exam Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
            Official Examination
          </h1>
          
          {/* Timer Component */}
          <ExamTimer initialMinutes={60} onTimeUp={handleForceSubmit} />
          
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to finish and submit your exam?')) {
                handleForceSubmit();
              }
            }}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'End Exam'}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Question Area */}
          <div className="flex-grow">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 sm:p-10 border border-gray-100 dark:border-slate-700">
              
              <div className="mb-8">
                <span className="text-sm font-semibold text-rozgar-blue mb-2 block">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <h2 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-rozgar-blue bg-blue-50 dark:bg-slate-700 dark:border-blue-400'
                          : 'border-gray-200 hover:border-blue-300 dark:border-slate-600 dark:hover:border-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-rozgar-blue' : 'border-gray-300 dark:border-slate-500'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-rozgar-blue" />}
                        </div>
                        <span className={`text-lg ${isSelected ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next Controls */}
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-between">
                <button
                  onClick={() => setCurrentIndex(prev => prev - 1)}
                  disabled={currentIndex === 0}
                  className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Previous
                </button>
                
                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={() => {
                      if (window.confirm('You have reached the end. Do you want to submit?')) {
                        handleForceSubmit();
                      }
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-md"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-rozgar-blue hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Navigator */}
          <div className="w-full lg:w-80 shrink-0">
            <ExamNavigator 
              totalQuestions={questions.length}
              currentQuestionIndex={currentIndex}
              answers={answers}
              onNavigate={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;