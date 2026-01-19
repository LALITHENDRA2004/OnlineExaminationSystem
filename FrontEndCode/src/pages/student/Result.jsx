/**
 * Result.jsx
 * 
 * Purpose:
 * - Displays quiz result after student submits the quiz
 * - Shows score summary and performance feedback
 * 
 * TODO: Add option to review answers with correct solutions
 * TODO: Store result in student's history
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const { result, quizTitle } = location.state || {};

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">No result data available</p>
            <Link
              to="/quizzes"
              className="inline-block px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const percentage = ((result.marksGot / result.totalMarks) * 100).toFixed(2);

  const getPerformanceMessage = (percent) => {
    if (percent >= 90) return { text: 'Excellent! Outstanding performance!', color: 'green' };
    if (percent >= 75) return { text: 'Great job! Well done!', color: 'green' };
    if (percent >= 60) return { text: 'Good effort! Keep learning.', color: 'blue' };
    if (percent >= 40) return { text: 'Fair attempt. Practice more.', color: 'amber' };
    return { text: 'Keep trying. Don\'t give up!', color: 'red' };
  };

  const performanceMessage = getPerformanceMessage(percentage);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Quiz Result</h1>
        <p className="text-lg text-slate-600">{quizTitle || 'Quiz Completed'}</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-10 mb-8 text-center">
        <div className="mb-6">
          <div className="inline-block bg-indigo-100 rounded-full p-8 mb-4">
            <p className="text-6xl font-bold text-indigo-700">{percentage}%</p>
          </div>
          <p className="text-2xl font-semibold text-slate-700">
            {result.marksGot} / {result.totalMarks || 100} marks
          </p>
        </div>

        <div className={`inline-block bg-${performanceMessage.color}-100 border border-${performanceMessage.color}-300 px-6 py-3 rounded-lg`}>
          <p className={`text-lg font-semibold text-${performanceMessage.color}-800`}>
            {performanceMessage.text}
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">Questions Attempted</p>
            <p className="text-4xl font-bold text-slate-800">{result.attempted}</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">Correct Answers</p>
            <p className="text-4xl font-bold text-green-700">{result.correctAnswers}</p>
          </div>

          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Incorrect Answers</p>
            <p className="text-4xl font-bold text-red-700">{result.attempted - result.correctAnswers}</p>
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