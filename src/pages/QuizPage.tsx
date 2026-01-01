"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuiz, Question } from '@/context/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { studentName } = (location.state || {}) as { studentName?: string };

  const { getQuizById, getQuestionsForQuiz, submitQuizAttempt } = useQuiz();
  const quiz = quizId ? getQuizById(quizId) : undefined;
  const questions = quizId ? getQuestionsForQuiz(quizId) : [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedAnswer: string; isCorrect: boolean }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStudentName, setQuizStudentName] = useState(studentName || '');

  useEffect(() => {
    if (!quizId || !quiz) {
      toast.error("Quiz not found.");
      navigate('/student');
    }
    if (questions.length === 0 && quiz) {
      toast.info(`Quiz "${quiz.title}" has no questions yet.`);
      navigate('/student');
    }
  }, [quizId, quiz, questions.length, navigate]);

  if (!quizId || !quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <Alert className="max-w-md">
          <Info className="h-4 w-4" />
          <AlertTitle>Loading Quiz...</AlertTitle>
          <AlertDescription>
            Please wait while the quiz loads, or navigate back to the student dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + (showResults ? 1 : 0)) / questions.length) * 100;

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer before proceeding.");
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedAnswer, isCorrect },
    ]);

    setSelectedAnswer(null); // Reset selected answer for next question

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // End of quiz
      const score = answers.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0); // Include current question's answer
      if (!quizStudentName.trim()) {
        toast.error("Please enter your name to submit your results.");
        return;
      }
      submitQuizAttempt({
        quizId: quiz.id,
        studentName: quizStudentName,
        score: score,
        totalQuestions: questions.length,
        answers: [...answers, { questionId: currentQuestion.id, selectedAnswer, isCorrect }],
      });
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.filter(a => a.isCorrect).length;
  };

  if (showResults) {
    const finalScore = calculateScore();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-8">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-green-700">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-2xl text-gray-800">Congratulations, <span className="font-semibold">{quizStudentName}</span>!</p>
            <p className="text-5xl font-extrabold text-blue-600">Your Score: {finalScore} / {questions.length}</p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Review Your Answers:</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto p-4 border rounded-md bg-gray-50">
                {answers.map((answer, index) => (
                  <div key={index} className={`p-3 rounded-md ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'} flex items-center space-x-3`}>
                    {answer.isCorrect ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-600" />}
                    <div>
                      <p className="font-medium text-gray-800">{questions[index]?.questionText}</p>
                      <p className="text-sm text-gray-700">Your Answer: <span className="font-semibold">{answer.selectedAnswer}</span></p>
                      {!answer.isCorrect && (
                        <p className="text-sm text-gray-700">Correct Answer: <span className="font-semibold">{questions[index]?.correctAnswer}</span></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 mt-6">
            <Button onClick={() => navigate('/student')} className="bg-blue-600 hover:bg-blue-700">
              Back to Student Dashboard
            </Button>
            <Button onClick={() => navigate('/leaderboard')} variant="outline">
              View Leaderboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">{quiz.title}</CardTitle>
          <div className="text-center text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <Progress value={progress} className="w-full mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {!studentName && (
            <div className="mb-4">
              <Label htmlFor="quizStudentName" className="text-lg font-semibold">Your Name</Label>
              <Input
                id="quizStudentName"
                placeholder="Enter your name"
                value={quizStudentName}
                onChange={(e) => setQuizStudentName(e.target.value)}
                className="mt-2 p-3 text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">This name will be used for the leaderboard.</p>
            </div>
          )}
          <h2 className="text-2xl font-semibold text-gray-900">{currentQuestion.questionText}</h2>
          <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-100 cursor-pointer">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg font-normal flex-grow cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNextQuestion} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPage;