"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface QuizHeaderProps {
  quizTitle: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  isMobile: boolean;
}

const QuizHeader = ({ quizTitle, currentQuestionIndex, totalQuestions, timeLeft, isMobile }: QuizHeaderProps) => {
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full bg-white shadow-md p-4 border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center sm:text-left">{quizTitle}</h1>
        <div className="flex items-center gap-4">
          <div className="text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div className={`flex items-center gap-1 font-semibold ${timeLeft <= 60 ? 'text-red-500' : 'text-gray-700'}`}>
            <Clock className="h-5 w-5" /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-2">
        <Progress value={progress} className="w-full" />
      </div>
    </header>
  );
};

export default QuizHeader;