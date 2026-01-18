/**
 * Result.jsx
 * 
 * Purpose:
 * - Displays quiz result after student submits the quiz
 * - Shows score summary and performance feedback
 * 
 * TODO: Fetch result data from backend API using result ID from URL params
 * TODO: Display detailed answer breakdown (correct/incorrect questions)
 * TODO: Add logic to show dynamic feedback message based on score percentage
 * TODO: Add option to review answers with correct solutions
 * TODO: Store result in student's history
 */

import React from 'react';
import { Link } from 'react-router-dom';

function Result() {
  // TODO: Get result ID from URL params using useParams hook
  // TODO: Fetch result data from backend API

  // TODO: Replace with actual data from backend API
  const result = {
    quizTitle: "Java Basics Test",
    score: 75,
    totalMarks: 100,
    percentage: 75,
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Quiz Result</h1>
        <p className="text-lg text-slate-600">{result.quizTitle}</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-10 mb-8 text-center">
        <div className="mb-6">
          <div className="inline-block bg-indigo-100 rounded-full p-8 mb-4">
            <p className="text-6xl font-bold text-indigo-700">{result.percentage}%</p>
          </div>
          <p className="text-2xl font-semibold text-slate-700">
            {result.score} / {result.totalMarks}
          </p>
        </div>

        <div className="inline-block bg-green-100 border border-green-300 px-6 py-3 rounded-lg">
          <p className="text-lg font-semibold text-green-800">Great job! Keep up the good work.</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Total Questions</p>
            <p className="text-4xl font-bold text-slate-800">{result.totalQuestions}</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">Correct Answers</p>
            <p className="text-4xl font-bold text-green-700">{result.correctAnswers}</p>
          </div>

          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Incorrect Answers</p>
            <p className="text-4xl font-bold text-red-700">{result.incorrectAnswers}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/dashboard"
          className="px-8 py-4 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200 shadow-sm"
          aria-label="Back to dashboard"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/quizzes"
          className="px-8 py-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors duration-200 shadow-sm"
          aria-label="View quiz list"
        >
          View Quizzes
        </Link>
      </div>
    </div>
  );
}

export default Result;