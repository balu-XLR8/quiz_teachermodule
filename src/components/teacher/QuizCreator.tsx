"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/context/QuizContext';

interface QuizCreatorProps {
  quizTitle: string;
  setQuizTitle: (title: string) => void;
  quizTimeLimit: number;
  setQuizTimeLimit: (limit: number) => void;
  negativeMarking: boolean;
  setNegativeMarking: (checked: boolean) => void;
  competitionMode: boolean;
  setCompetitionMode: (checked: boolean) => void;
  questions: Question[];
  selectedQuestionIds: string[];
  handleToggleQuestionSelection: (questionId: string) => void;
  handleAddQuiz: () => void;
}

const QuizCreator = ({
  quizTitle,
  setQuizTitle,
  quizTimeLimit,
  setQuizTimeLimit,
  negativeMarking,
  setNegativeMarking,
  competitionMode,
  setCompetitionMode,
  questions,
  selectedQuestionIds,
  handleToggleQuestionSelection,
  handleAddQuiz,
}: QuizCreatorProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ListChecks className="h-6 w-6" /> Create New Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quizTitle">Quiz Title</Label>
          <Input
            id="quizTitle"
            placeholder="e.g., 'Midterm Exam - Chapter 1'"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="quizTimeLimit">Time Limit (minutes)</Label>
          <Input
            id="quizTimeLimit"
            type="number"
            min="1"
            value={quizTimeLimit}
            onChange={(e) => setQuizTimeLimit(parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="negativeMarking">Enable Negative Marking</Label>
          <Switch
            id="negativeMarking"
            checked={negativeMarking}
            onCheckedChange={setNegativeMarking}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="competitionMode">Enable Competition Mode</Label>
          <Switch
            id="competitionMode"
            checked={competitionMode}
            onCheckedChange={setCompetitionMode}
          />
        </div>
        <div>
          <Label>Select Questions for Quiz ({selectedQuestionIds.length} selected)</Label>
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md bg-gray-50">
            {questions.length === 0 ? (
              <p className="text-gray-500">No questions available. Create some first!</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`question-${q.id}`}
                    checked={selectedQuestionIds.includes(q.id)}
                    onCheckedChange={() => handleToggleQuestionSelection(q.id)}
                  />
                  <Label htmlFor={`question-${q.id}`} className="text-sm font-normal">
                    {q.questionText} ({q.marks} marks)
                  </Label>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddQuiz} className="w-full bg-blue-600 hover:bg-blue-700">Create Quiz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCreator;