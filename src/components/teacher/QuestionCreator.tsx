"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionCreatorProps {
  questionText: string;
  setQuestionText: (text: string) => void;
  options: string[];
  setOptions: (options: string[]) => void;
  correctAnswer: string;
  setCorrectAnswer: (answer: string) => void;
  questionMarks: number;
  setQuestionMarks: (marks: number) => void;
  handleAddQuestion: () => void;
}

const QuestionCreator = ({
  questionText,
  setQuestionText,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
  questionMarks,
  setQuestionMarks,
  handleAddQuestion,
}: QuestionCreatorProps) => {
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <PlusCircle className="h-6 w-6" /> Create New Question
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="questionText">Question Text</Label>
          <Textarea
            id="questionText"
            placeholder="Enter your question here..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="mt-1"
          />
        </div>
        {options.map((option, index) => (
          <div key={index}>
            <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
            <Input
              id={`option-${index}`}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
        <div>
          <Label>Correct Answer</Label>
          <RadioGroup onValueChange={setCorrectAnswer} value={correctAnswer} className="flex flex-col space-y-1 mt-2">
            {options.filter(opt => opt).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`correct-option-${index}`} />
                <Label htmlFor={`correct-option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="questionMarks">Marks for this Question</Label>
          <Input
            id="questionMarks"
            type="number"
            min="1"
            value={questionMarks}
            onChange={(e) => setQuestionMarks(parseInt(e.target.value) || 1)}
            className="mt-1"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddQuestion} className="w-full bg-green-600 hover:bg-green-700">Add Question to Pool</Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCreator;