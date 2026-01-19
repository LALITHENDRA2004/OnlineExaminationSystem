/**
 * QuizList.jsx
 * 
 * Purpose:
 * - Displays list of available quizzes for students
 * - Shows quiz details like title, category, questions count, and marks
 * 
 * TODO: Implement search functionality to filter quizzes by title
 * TODO: Implement category filter logic
 * TODO: Add pagination if quiz list is large
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveQuizzes } from '../../services/quizService';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveQuizzes();
      console.log(data);
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Available Quizzes</h1>
        <p className="text-lg text-slate-600">Choose a quiz to test your knowledge and skills.</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <p className="text-lg text-slate-600">No active quizzes available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={`quiz-${quiz.qId}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-3">{quiz.title}</h2>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Category</span>
                  <span className="text-sm font-semibold text-indigo-700">{quiz.category?.title || 'N/A'}</span>
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
                to={`/quizzes/${quiz.qId}`}
                className="block w-full bg-indigo-700 text-white text-center font-semibold py-3 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
                aria-label={`View details of ${quiz.title}`}
              >
                View Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;