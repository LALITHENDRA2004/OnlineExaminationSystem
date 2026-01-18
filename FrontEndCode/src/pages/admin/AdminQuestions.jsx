/**
 * AdminQuestions.jsx
 * 
 * Purpose:
 * - Allows Admin to manage questions for a specific quiz
 * - Admin can add, edit, and delete questions
 * 
 * TODO: Get quiz ID from URL params using useParams hook
 * TODO: Fetch quiz details and questions from backend API
 * TODO: Implement add question logic with API call
 * TODO: Implement edit question logic with modal or form
 * TODO: Implement delete question logic with confirmation dialog
 * TODO: Add form validation (required fields, correct answer selection)
 * TODO: Add loading state while fetching data
 * TODO: Display quiz title at the top
 */

import React from 'react';
import { Link } from 'react-router-dom';

function AdminQuestions() {
  // TODO: Get quiz ID from URL params
  // TODO: Fetch quiz details and questions from backend API

  // TODO: Replace with actual data from backend API
  const quizTitle = "Introduction to React";

  // TODO: Replace with actual questions from backend API
  const questions = [
    {
      id: 101,
      content: "What is React?",
      optionA: "A JavaScript library for building user interfaces",
      optionB: "A database management system",
      optionC: "A programming language",
      optionD: "An operating system",
      correctAnswer: "A"
    },
    {
      id: 102,
      content: "What is JSX?",
      optionA: "A CSS framework",
      optionB: "A syntax extension for JavaScript",
      optionC: "A database query language",
      optionD: "A testing library",
      correctAnswer: "B"
    },
    {
      id: 103,
      content: "Which hook is used to manage state in functional components?",
      optionA: "useEffect",
      optionB: "useContext",
      optionC: "useState",
      optionD: "useReducer",
      correctAnswer: "C"
    },
    {
      id: 104,
      content: "What does the virtual DOM do in React?",
      optionA: "Stores user data",
      optionB: "Optimizes rendering by updating only changed elements",
      optionC: "Manages routing",
      optionD: "Handles API calls",
      correctAnswer: "B"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Questions</h1>
          <p className="text-lg text-slate-600">Quiz: <span className="font-semibold text-indigo-700">{quizTitle}</span></p>
        </div>
        <button 
          className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200 shadow-sm"
          aria-label="Add new question"
        >
          Add Question
        </button>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[250px]">Question Content</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option A</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option B</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option C</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option D</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Correct</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-slate-700">{question.id}</td>
                <td className="px-6 py-4 text-sm text-slate-800">{question.content}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{question.optionA}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{question.optionB}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{question.optionC}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{question.optionD}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                    {question.correctAnswer}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                      aria-label={`Edit question ${question.id}`}
                    >
                      Edit
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                      aria-label={`Delete question ${question.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Back Link */}
      <div className="mt-6">
        <Link 
          to="/admin/quizzes"
          className="inline-block px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
          aria-label="Back to quizzes"
        >
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
}

export default AdminQuestions;