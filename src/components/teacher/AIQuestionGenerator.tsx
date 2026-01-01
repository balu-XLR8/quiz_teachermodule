"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Question } from '@/context/QuizContext';

interface AIQuestionGeneratorProps {
  aiCoursePaperName: string;
  setAiCoursePaperName: (name: string) => void;
  aiDifficulty: 'Easy' | 'Medium' | 'Hard';
  setAiDifficulty: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  aiNumQuestions: number;
  setAiNumQuestions: (num: number) => void;
  aiGeneratedQuestions: Question[];
  setAiGeneratedQuestions: (questions: Question[]) => void;
  handleGenerateAIQuestions: () => void;
  handleAddAIGeneratedQuestionsToPool: () => void;
}

const AIQuestionGenerator = ({
  aiCoursePaperName,
  setAiCoursePaperName,
  aiDifficulty,
  setAiDifficulty,
  aiNumQuestions,
  setAiNumQuestions,
  aiGeneratedQuestions,
  setAiGeneratedQuestions,
  handleGenerateAIQuestions,
  handleAddAIGeneratedQuestionsToPool,
}: AIQuestionGeneratorProps) => {

  const handleEditAIGeneratedQuestion = (
    questionId: string,
    field: 'questionText' | 'correctAnswer' | 'marks',
    value: string | number
  ) => {
    setAiGeneratedQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, [field]: value }
          : q
      )
    );
  };

  const handleEditAIGeneratedOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setAiGeneratedQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
            }
          : q
      )
    );
  };

  const handleDeleteAIGeneratedQuestion = (questionId: string) => {
    setAiGeneratedQuestions((prev) => prev.filter((q) => q.id !== questionId));
    toast.info("AI generated question deleted.");
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="h-6 w-6" /> AI Question Generation (Mock)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="aiCoursePaperName">Course / Paper Name</Label>
          <Input
            id="aiCoursePaperName"
            placeholder="e.g., 'Introduction to Quantum Physics'"
            value={aiCoursePaperName}
            onChange={(e) => setAiCoursePaperName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="aiNumQuestions">Number of Questions</Label>
          <Input
            id="aiNumQuestions"
            type="number"
            min="1"
            value={aiNumQuestions}
            onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="aiDifficulty">Difficulty</Label>
          <Select onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setAiDifficulty(value)} value={aiDifficulty}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerateAIQuestions} className="w-full bg-purple-600 hover:bg-purple-700">Generate Questions</Button>
        {aiGeneratedQuestions.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold mb-4">Generated Questions:</h3>
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {aiGeneratedQuestions.map((q, index) => (
                <Card key={q.id} className="p-4 border rounded-md bg-white shadow-sm relative">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleDeleteAIGeneratedQuestion(q.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`ai-q-text-${q.id}`}>Question Text</Label>
                      <Textarea
                        id={`ai-q-text-${q.id}`}
                        value={q.questionText}
                        onChange={(e) => handleEditAIGeneratedQuestion(q.id, 'questionText', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex}>
                        <Label htmlFor={`ai-q-option-${q.id}-${optIndex}`}>Option {optIndex + 1}</Label>
                        <Input
                          id={`ai-q-option-${q.id}-${optIndex}`}
                          value={option}
                          onChange={(e) => handleEditAIGeneratedOption(q.id, optIndex, e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    ))}
                    <div>
                      <Label>Correct Answer</Label>
                      <RadioGroup
                        onValueChange={(value) => handleEditAIGeneratedQuestion(q.id, 'correctAnswer', value)}
                        value={q.correctAnswer}
                        className="flex flex-col space-y-1 mt-2"
                      >
                        {q.options.filter(opt => opt).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`ai-q-correct-${q.id}-${optIndex}`} />
                            <Label htmlFor={`ai-q-correct-${q.id}-${optIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor={`ai-q-marks-${q.id}`}>Marks</Label>
                      <Input
                        id={`ai-q-marks-${q.id}`}
                        type="number"
                        min="1"
                        value={q.marks}
                        onChange={(e) => handleEditAIGeneratedQuestion(q.id, 'marks', parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <Button onClick={handleAddAIGeneratedQuestionsToPool} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Add to Question Pool</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIQuestionGenerator;