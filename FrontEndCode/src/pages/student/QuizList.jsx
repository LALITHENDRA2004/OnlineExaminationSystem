/**
 * QuizList.jsx
 * 
 * Purpose:
 * - Displays list of available quizzes for students
 * - Shows quiz details like title, category, questions count, and marks
 * 
 * TODO: Fetch quizzes from backend API
 * TODO: Implement search functionality to filter quizzes by title
 * TODO: Implement category filter logic
 * TODO: Add navigation to quiz detail page on "View Quiz" click
 * TODO: Add pagination if quiz list is large
 * TODO: Show loading state while fetching data
 */

import React from 'react';
import { Link } from 'react-router-dom';

function QuizList() {
  // TODO: Replace with actual data from backend API
  const quizzes = [
    {
      id: 1,
      title: "Introduction to React",
      category: "Programming",
      numberOfQuestions: 10,
      maxMarks: 50
    },
    {
      id: 2,
      title: "Java Basics",
      category: "Programming",
      numberOfQuestions: 15,
      maxMarks: 75
    },
    {
      id: 3,
      title: "Database Management",
      category: "Database",
      numberOfQuestions: 12,
      maxMarks: 60
    },
    {
      id: 4,
      title: "Web Development Fundamentals",
      category: "Web Development",
      numberOfQuestions: 20,
      maxMarks: 100
    },
    {
      id: 5,
      title: "Python Programming",
      category: "Programming",
      numberOfQuestions: 18,
      maxMarks: 90
    },
    {
      id: 6,
      title: "SQL Mastery",
      category: "Database",
      numberOfQuestions: 14,
      maxMarks: 70
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Available Quizzes</h1>
        <p className="text-lg text-slate-600">Choose a quiz to test your knowledge and skills.</p>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div 
            key={quiz.id} 
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-3">{quiz.title}</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Category</span>
                <span className="text-sm font-semibold text-indigo-700">{quiz.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Questions</span>
                <span className="text-sm font-semibold text-slate-700">{quiz.numberOfQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Max Marks</span>
                <span className="text-sm font-semibold text-slate-700">{quiz.maxMarks}</span>
              </div>
            </div>

            <Link
              to={`/quizzes/${quiz.id}`}
              className="block w-full bg-indigo-700 text-white text-center font-semibold py-3 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
              aria-label={`View details of ${quiz.title}`}
            >
              View Quiz
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;