import React from 'react';

const ExamNavigator = ({ totalQuestions, currentQuestionIndex, answers, onNavigate }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-100 dark:border-slate-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Question Navigator</h3>
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isAttempted = !!answers[idx];
          const isCurrent = currentQuestionIndex === idx;
          
          let btnClass = "w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ";
          
          if (isCurrent) {
            btnClass += "ring-2 ring-rozgar-blue ring-offset-2 bg-blue-100 text-rozgar-blue dark:bg-slate-700 dark:text-white";
          } else if (isAttempted) {
            btnClass += "bg-green-500 text-white";
          } else {
            btnClass += "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600";
          }

          return (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={btnClass}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div> Attempted
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-slate-700"></div> Unattempted
        </div>
      </div>
    </div>
  );
};

export default ExamNavigator;