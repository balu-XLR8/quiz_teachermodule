"use client";

import React, { useState } from 'react';
import { useQuiz, Question } from '@/context/QuizContext';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import QuestionCreator from '@/components/teacher/QuestionCreator';
import QuizCreator from '@/components/teacher/QuizCreator';
import AvailableQuizzesList from '@/components/teacher/AvailableQuizzesList';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

const TeacherDashboard = () => {
  const { questions, quizzes, addQuestion } = useQuiz();
  const isMobile = useIsMobile();

  // State for active view in sidebar
  const [activeView, setActiveView] = useState<string>('create-question');

  // Question Creation State
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionMarks, setQuestionMarks] = useState<number>(1);

  // AI Question Generation State (removed from here, now handled in QuizCreator)

  const handleAddQuestion = () => {
    if (!questionText || options.some(opt => !opt) || !correctAnswer || questionMarks <= 0) {
      toast.error("Please fill all question fields, select a correct answer, and set valid marks.");
      return;
    }
    if (!options.includes(correctAnswer)) {
      toast.error("Correct answer must be one of the provided options.");
      return;
    }

    addQuestion({
      quizId: 'unassigned',
      questionText,
      options,
      correctAnswer,
      marks: questionMarks,
    });

    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setQuestionMarks(1);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'create-question':
        return (
          <QuestionCreator
            questionText={questionText}
            setQuestionText={setQuestionText}
            options={options}
            setOptions={setOptions}
            correctAnswer={correctAnswer}
            setCorrectAnswer={setCorrectAnswer}
            questionMarks={questionMarks}
            setQuestionMarks={setQuestionMarks}
            handleAddQuestion={handleAddQuestion}
          />
        );
      case 'create-quiz':
        return <QuizCreator />; // QuizCreator now handles its own state and AI generation
      case 'available-quizzes':
        return <AvailableQuizzesList quizzes={quizzes} />;
      default:
        return <QuestionCreator
          questionText={questionText}
          setQuestionText={setQuestionText}
          options={options}
          setOptions={setOptions}
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
          questionMarks={questionMarks}
          setQuestionMarks={setQuestionMarks}
          handleAddQuestion={handleAddQuestion}
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b bg-white shadow-sm lg:hidden">
        <TeacherSidebar activeView={activeView} setActiveView={setActiveView} isMobile={isMobile} />
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
      </header>

      <div className="flex flex-1">
        {!isMobile && (
          <ResizablePanelGroup direction="horizontal" className="min-h-screen max-w-full">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <TeacherSidebar activeView={activeView} setActiveView={setActiveView} isMobile={isMobile} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              <main className="flex-1 p-8 overflow-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8 hidden lg:block">Teacher Dashboard</h1>
                {renderContent()}
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        {isMobile && (
          <main className="flex-1 p-4 overflow-auto">
            {renderContent()}
          </main>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;