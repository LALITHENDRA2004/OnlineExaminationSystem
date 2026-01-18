/**
 * QuizAttempt.jsx
 * 
 * Purpose:
 * - Quiz attempt screen where students answer questions
 * - Displays questions with multiple-choice options
 * 
 * TODO: Fetch quiz questions from backend API using quiz ID from URL params
 * TODO: Implement timer logic with countdown
 * TODO: Add state management for selected answers
 * TODO: Implement question navigation (previous/next)
 * TODO: Auto-submit quiz when timer expires
 * TODO: Add quiz submission logic and API call
 * TODO: Navigate to result page after submission
 * TODO: Add confirmation dialog before quiz submission
 */

import React from 'react';

function QuizAttempt() {
  // TODO: Get quiz ID from URL params using useParams hook
  // TODO: Fetch quiz and questions from backend API
  // TODO: Manage current question index state
  // TODO: Manage selected answers state

  // TODO: Replace with actual data from backend API
  const quiz = {
    id: 1,
    title: "Java Basics Test",
    totalQuestions: 10
  };

  // TODO: Replace with actual question data from backend
  const currentQuestion = {
    id: 101,
    questionNumber: 1,
    content: "What is the correct syntax to output 'Hello World' in Java?",
    options: [
      "System.out.println('Hello World');",
      "Console.WriteLine('Hello World');",
      "print('Hello World');",
      "echo('Hello World');"
    ]
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{quiz.title}</h1>
        {/* TODO: Implement countdown timer logic */}
        <div className="bg-amber-100 border border-amber-300 px-6 py-3 rounded-lg">
          <p className="text-lg font-bold text-amber-800" aria-label="Time remaining">
            Time Left: 14:35
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-4">
            Question {currentQuestion.questionNumber} of {quiz.totalQuestions}
          </p>
          <h2 className="text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.content}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
              aria-label={`Option ${index + 1}`}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-4">
                  <div className="w-3 h-3 rounded-full bg-transparent"></div>
                </div>
                <span className="text-lg text-slate-700 font-medium">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          className="px-8 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
          disabled
          aria-label="Previous question"
        >
          Previous
        </button>

        <button
          className="px-8 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
          aria-label="Submit quiz"
        >
          Submit Quiz
        </button>

        <button
          className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
          aria-label="Next question"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default QuizAttempt;