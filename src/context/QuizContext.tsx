"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Type Definitions
export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questionIds: string[]; // IDs of questions belonging to this quiz
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
  timestamp: number;
}

interface QuizContextType {
  questions: Question[];
  quizzes: Quiz[];
  quizAttempts: QuizAttempt[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  addQuiz: (quiz: Omit<Quiz, 'id' | 'questionIds'>, questionIds: string[]) => void;
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  getQuestionsForQuiz: (quizId: string) => Question[];
  getQuizById: (quizId: string) => Quiz | undefined;
  generateAIQuestions: (coursePaperName: string) => Question[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const storedQuestions = localStorage.getItem('quiz_questions');
      if (storedQuestions) setQuestions(JSON.parse(storedQuestions));

      const storedQuizzes = localStorage.getItem('quiz_quizzes');
      if (storedQuizzes) setQuizzes(JSON.parse(storedQuizzes));

      const storedAttempts = localStorage.getItem('quiz_attempts');
      if (storedAttempts) setQuizAttempts(JSON.parse(storedAttempts));
    } catch (error) {
      console.error("Failed to load quiz data from localStorage", error);
      toast.error("Failed to load previous data.");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quiz_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('quiz_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const addQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion: Question = { ...question, id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
    setQuestions((prev) => [...prev, newQuestion]);
    toast.success("Question added successfully!");
  };

  const addQuiz = (quiz: Omit<Quiz, 'id' | 'questionIds'>, questionIds: string[]) => {
    const newQuiz: Quiz = { ...quiz, id: `qz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, questionIds };
    setQuizzes((prev) => [...prev, newQuiz]);
    toast.success("Quiz created successfully!");
  };

  const submitQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => {
    const newAttempt: QuizAttempt = { ...attempt, id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, timestamp: Date.now() };
    setQuizAttempts((prev) => [...prev, newAttempt]);
    toast.success("Quiz submitted successfully!");
  };

  const getQuestionsForQuiz = (quizId: string): Question[] => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return [];
    return questions.filter(q => quiz.questionIds.includes(q.id));
  };

  const getQuizById = (quizId: string): Quiz | undefined => {
    return quizzes.find(q => q.id === quizId);
  };

  // Mock AI Question Generation
  const generateAIQuestions = (coursePaperName: string): Question[] => {
    const generatedQuestions: Question[] = [
      {
        id: `ai-q-${Date.now()}-1`,
        quizId: 'ai-generated', // A placeholder quizId for now
        questionText: `According to the paper "${coursePaperName}", what is the primary hypothesis discussed?`,
        options: ['Hypothesis A', 'Hypothesis B', 'Hypothesis C', 'Hypothesis D'],
        correctAnswer: 'Hypothesis A',
      },
      {
        id: `ai-q-${Date.now()}-2`,
        quizId: 'ai-generated',
        questionText: `Which methodology was predominantly used in the study described in "${coursePaperName}"?`,
        options: ['Qualitative Analysis', 'Quantitative Analysis', 'Mixed Methods', 'Case Study'],
        correctAnswer: 'Quantitative Analysis',
      },
      {
        id: `ai-q-${Date.now()}-3`,
        quizId: 'ai-generated',
        questionText: `What was a key finding highlighted in the conclusion of "${coursePaperName}"?`,
        options: ['Finding X', 'Finding Y', 'Finding Z', 'Finding W'],
        correctAnswer: 'Finding X',
      },
    ];
    toast.info(`Mock AI generated questions for "${coursePaperName}".`);
    return generatedQuestions;
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        quizzes,
        quizAttempts,
        addQuestion,
        addQuiz,
        submitQuizAttempt,
        getQuestionsForQuiz,
        getQuizById,
        generateAIQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};