import { useState, useEffect } from 'react';
import { IoTimeOutline, IoAlertCircle } from 'react-icons/io5';

const Timer = ({ durationMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // Convert to seconds
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) {
        onTimeUp();
      }
      return;
    }

    // Warning when less than 2 minutes left
    if (timeLeft <= 120 && !isWarning) {
      setIsWarning(true);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isWarning, onTimeUp]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = durationMinutes * 60;
    return (timeLeft / totalSeconds) * 100;
  };

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold transition-all ${
        isWarning
          ? 'bg-error-50 text-error-700 border-2 border-error-300'
          : 'bg-primary-50 text-primary-700 border-2 border-primary-200'
      }`}
    >
      {isWarning ? (
        <IoAlertCircle className="w-5 h-5 animate-pulse" />
      ) : (
        <IoTimeOutline className="w-5 h-5" />
      )}
      <span className="text-lg">{formatTime()}</span>
      {isWarning && (
        <span className="text-xs font-normal ml-1">(Hurry!)</span>
      )}
    </div>
  );
};

export default Timer;
