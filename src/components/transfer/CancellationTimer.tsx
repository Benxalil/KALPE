import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

interface CancellationTimerProps {
  duration: number; // in milliseconds
  onTimeout: () => void;
}

export default function CancellationTimer({ duration, onTimeout }: CancellationTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeout]);

  useEffect(() => {
    if (timeLeft <= 60000) { // Show warning when less than 1 minute remains
      setIsWarning(true);
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative h-6 w-6">
        <Timer className={`h-6 w-6 ${isWarning ? 'text-amber-500' : 'text-gray-500'}`} />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: `conic-gradient(${isWarning ? '#f59e0b' : '#6366f1'} ${progress}%, transparent ${progress}%)`,
            mask: 'radial-gradient(transparent 55%, black 55%)',
            WebkitMask: 'radial-gradient(transparent 55%, black 55%)'
          }}
        />
      </div>
      <span className={`font-medium ${isWarning ? 'text-amber-500' : 'text-gray-600'}`}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
      {isWarning && (
        <div className="flex items-center text-amber-500">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Délai d'annulation bientôt expiré</span>
        </div>
      )}
    </div>
  );
}