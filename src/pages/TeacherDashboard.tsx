"use client";

import React, { useState } from 'react';
import { useQuiz, Question } from '@/context/QuizContext';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import QuestionCreator from '@/components/teacher/QuestionCreator';
import AIQuestionGenerator from '@/components/teacher/AIQuestionGenerator';
import QuizCreator from '@/components/teacher/QuizCreator';
import AvailableQuizzesList from '@/components/teacher/AvailableQuizzesList';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

const TeacherDashboard = () => {
  const { questions, quizzes, addQuestion, addQuiz, generateAIQuestions } = useQuiz();
  const isMobile = useIsMobile();

  // State for active view in sidebar
  const [activeView, setActiveView] = useState<string>('create-question');

  // Question Creation State
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [questionMarks, setQuestionMarks] = useState<number>(1);

  // AI Question Generation State
  const [aiCoursePaperName, setAiCoursePaperName] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [aiNumQuestions, setAiNumQuestions] = useState<number>(3);
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<Question[]>([]);

  // Quiz Creation State
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [quizTimeLimit, setQuizTimeLimit] = useState<number>(30);
  const [negativeMarking, setNegativeMarking] = useState<boolean>(false);
  const [competitionMode, setCompetitionMode] = useState<boolean>(false);

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

  const handleAddQuiz = () => {
    if (!quizTitle || selectedQuestionIds.length === 0 || quizTimeLimit <= 0) {
      toast.error("Please provide a quiz title, select at least one question, and set a valid time limit.");
      return;
    }

    addQuiz({
      title: quizTitle,
      timeLimitMinutes: quizTimeLimit,
      negativeMarking: negativeMarking,
      competitionMode: competitionMode,
    }, selectedQuestionIds);
    setQuizTitle('');
    setSelectedQuestionIds([]);
    setQuizTimeLimit(30);
    setNegativeMarking(false);
    setCompetitionMode(false);
  };

  const handleToggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleGenerateAIQuestions = () => {
    if (!aiCoursePaperName) {
      toast.error("Please enter a course paper name for AI generation.");
      return;
    }
    if (aiNumQuestions <= 0) {
      toast.error("Please enter a valid number of questions to generate.");
      return;
    }
    const generated = generateAIQuestions(aiCoursePaperName, aiDifficulty, aiNumQuestions);
    setAiGeneratedQuestions(generated);
  };

  const handleAddAIGeneratedQuestionsToPool = () => {
    if (aiGeneratedQuestions.length === 0) {
      toast.error("No AI generated questions to add.");
      return;
    }
    aiGeneratedQuestions.forEach(q => {
      if (!q.questionText || q.options.some(opt => !opt) || !q.correctAnswer || q.marks <= 0 || !q.options.includes(q.correctAnswer)) {
        toast.error(`Question "${q.questionText.substring(0, 30)}..." is incomplete or invalid and was not added.`);
        return;
      }
      addQuestion({
        quizId: q.quizId,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
      });
    });
    setAiGeneratedQuestions([]);
    toast.success("Selected AI generated questions added to the question pool!");
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
      case 'ai-generator':
        return (
          <AIQuestionGenerator
            aiCoursePaperName={aiCoursePaperName}
            setAiCoursePaperName={setAiCoursePaperName}
            aiDifficulty={aiDifficulty}
            setAiDifficulty={setAiDifficulty}
            aiNumQuestions={aiNumQuestions}
            setAiNumQuestions={setAiNumQuestions}
            aiGeneratedQuestions={aiGeneratedQuestions}
            setAiGeneratedQuestions={setAiGeneratedQuestions}
            handleGenerateAIQuestions={handleGenerateAIQuestions}
            handleAddAIGeneratedQuestionsToPool={handleAddAIGeneratedQuestionsToPool}
          />
        );
      case 'create-quiz':
        return (
          <QuizCreator
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
            quizTimeLimit={quizTimeLimit}
            setQuizTimeLimit={setQuizTimeLimit}
            negativeMarking={negativeMarking}
            setNegativeMarking={setNegativeMarking}
            competitionMode={competitionMode}
            setCompetitionMode={setCompetitionMode}
            questions={questions}
            selectedQuestionIds={selectedQuestionIds}
            handleToggleQuestionSelection={handleToggleQuestionSelection}
            handleAddQuiz={handleAddQuiz}
          />
        );
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