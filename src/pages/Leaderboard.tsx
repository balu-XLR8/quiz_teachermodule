"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '@/context/QuizContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  const { quizAttempts, quizzes } = useQuiz();

  // Group attempts by quiz and then sort by score
  const groupedAttempts: { [quizId: string]: typeof quizAttempts } = {};
  quizAttempts.forEach(attempt => {
    if (!groupedAttempts[attempt.quizId]) {
      groupedAttempts[attempt.quizId] = [];
    }
    groupedAttempts[attempt.quizId].push(attempt);
  });

  // Sort each group by score (descending)
  Object.keys(groupedAttempts).forEach(quizId => {
    groupedAttempts[quizId].sort((a, b) => b.score - a.score);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Leaderboard</h1>
        <nav className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/student" className="text-blue-600 hover:underline">Student Dashboard</Link>
          <Link to="/teacher" className="text-blue-600 hover:underline">Teacher Dashboard</Link>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {Object.keys(groupedAttempts).length === 0 ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6" /> No Quiz Results Yet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Students need to complete quizzes for results to appear here.</p>
            </CardContent>
          </Card>
        ) : (
          Object.keys(groupedAttempts).map(quizId => {
            const quiz = quizzes.find(q => q.id === quizId);
            if (!quiz) return null; // Should not happen if data is consistent

            return (
              <Card key={quizId} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Trophy className="h-6 w-6 text-yellow-500" /> Leaderboard for: {quiz.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Rank</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedAttempts[quizId].map((attempt, index) => (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{attempt.studentName}</TableCell>
                          <TableCell className="text-right">{attempt.score} / {attempt.totalQuestions}</TableCell>
                          <TableCell className="text-right">{new Date(attempt.timestamp).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;