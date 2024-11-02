import { Timer } from 'lucide-react';

export default function ExamHeader({ 
  title, 
  duration, 
  positiveScore, 
  negativeScore, 
  className 
}) {
  return (
    <header className={`
      fixed top-0 left-0 right-0 
      bg-white border-b 
      h-16 
      flex items-center justify-between 
      px-6 
      shadow-sm
      z-50
      ${className}
    `}>
      {/* Left side - Title */}
      <div className="font-semibold text-lg">
        {title}
      </div>

      {/* Center - Scoring Info */}
      <div className="flex gap-6">
        <div className="text-green-600">
          Correct: +{positiveScore}
        </div>
        <div className="text-red-600">
          Incorrect: -{negativeScore}
        </div>
      </div>

      {/* Right side - Timer */}
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5" />
        <span className="font-mono text-lg">
          {duration} min
        </span>
      </div>
    </header>
  );
} 