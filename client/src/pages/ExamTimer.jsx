import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const ExamTimer = ({ initialMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
      isWarning 
        ? 'bg-red-100 text-red-600 animate-pulse' 
        : 'bg-blue-100 text-rozgar-blue dark:bg-slate-700 dark:text-white'
    }`}>
      <Clock className="w-5 h-5" />
      {formatTime(timeLeft)}
    </div>
  );
};

export default ExamTimer;