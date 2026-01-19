/**
 * QuizDetail.jsx
 * 
 * Purpose:
 * - Displays detailed information about a specific quiz
 * - Shows quiz instructions before student starts the quiz
 * 
 * TODO: Check if student has already attempted this quiz
 * TODO: Display quiz status (active/inactive)
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getQuiz } from '../../services/questionService';

function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuiz(id);
      
      if (!data.active) {
        setError('This quiz is not currently active.');
        return;
      }
      
      setQuiz(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Error: {error}</p>
            <Link
              to="/quizzes"
              className="inline-block px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-3">{quiz.title}</h1>
        <p className="text-lg text-slate-600 leading-relaxed">{quiz.description}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quiz Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Category</span>
            <span className="text-lg font-bold text-indigo-700">{quiz.category?.title || 'N/A'}</span>
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
            <span className="text-lg font-bold text-slate-800">No limit</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Instructions</h3>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>Read each question carefully before selecting your answer.</span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>The quiz contains {quiz.numberOfQuestions} multiple-choice questions.</span>
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

      <div className="flex items-center gap-4">
        <Link
          to={`/quizzes/${quiz.qId}/attempt`}
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