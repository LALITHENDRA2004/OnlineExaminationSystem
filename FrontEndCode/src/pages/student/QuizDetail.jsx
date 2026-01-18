/**
 * QuizDetail.jsx
 * 
 * Purpose:
 * - Displays detailed information about a specific quiz
 * - Shows quiz instructions before student starts the quiz
 * 
 * TODO: Fetch quiz details from backend API using quiz ID from URL params
 * TODO: Add navigation logic to start quiz (redirect to QuizAttempt page)
 * TODO: Check if student has already attempted this quiz
 * TODO: Display quiz status (active/inactive)
 * TODO: Add loading state while fetching quiz data
 */

import React from 'react';
import { Link } from 'react-router-dom';

function QuizDetail() {
  // TODO: Get quiz ID from URL params using useParams hook
  // TODO: Fetch quiz details from backend API using the quiz ID

  // TODO: Replace with actual data from backend API
  const quiz = {
    id: 1,
    title: "Java Basics Test",
    description: "This quiz covers fundamental concepts of Java programming including data types, control structures, object-oriented programming principles, and basic syntax. Test your understanding of core Java concepts.",
    category: "Programming",
    numberOfQuestions: 10,
    maxMarks: 100,
    timeLimit: 15
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">{quiz.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed">{quiz.description}</p>
      </div>

      {/* Quiz Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quiz Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Category</span>
            <span className="text-lg font-bold text-indigo-700">{quiz.category}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Questions</span>
            <span className="text-lg font-bold text-slate-800">{quiz.numberOfQuestions}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Max Marks</span>
            <span className="text-lg font-bold text-slate-800">{quiz.maxMarks}</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Time Limit</span>
            <span className="text-lg font-bold text-slate-800">{quiz.timeLimit} minutes</span>
          </div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Instructions</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>Read each question carefully before selecting your answer.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>You have {quiz.timeLimit} minutes to complete all {quiz.numberOfQuestions} questions.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>Each question carries equal marks with no negative marking.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>Once submitted, you cannot reattempt this quiz.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>Ensure you have a stable internet connection before starting.</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to={`/quizzes/${quiz.id}/attempt`}
          className="flex-1 bg-indigo-700 text-white text-center font-bold text-lg py-4 rounded-lg hover:bg-indigo-800 transition-colors duration-200 shadow-md"
          aria-label="Start quiz"
        >
          Start Quiz
        </Link>
        <Link
          to="/quizzes"
          className="px-8 py-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
          aria-label="Back to quiz list"
        >
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
}

export default QuizDetail;