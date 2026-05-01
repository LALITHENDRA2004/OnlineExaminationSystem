import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveQuizzes } from '../../services/quizService';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.category?.title && quiz.category.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveQuizzes();
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
        <div className="spinner w-10 h-10 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="alert alert-error">
          <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold underline mb-1">Error Loading Quizzes</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Available Quizzes</h1>
          <p className="text-lg text-slate-600">Challenge yourself and grow your expert knowledge.</p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search quizzes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 h-11"
          />
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No quizzes found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any quizzes matching your search. Try adjusting your query or check back later.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredQuizzes.map((quiz) => (
            <div
              key={`quiz-${quiz.qid}`}
              className="card-interactive flex flex-col h-full overflow-hidden"
            >
              {/* Card Decoration */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

              <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-primary">{quiz.category?.title || 'Uncategorized'}</span>
                  <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.numberOfQuestions * 2} min
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{quiz.title}</h2>
                <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                  {quiz.description || "Take this quiz to test your knowledge in this subject area."}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Questions</p>
                      <p className="text-sm font-bold text-slate-700">{quiz.numberOfQuestions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Max Marks</p>
                      <p className="text-sm font-bold text-slate-700">{quiz.maxMarks}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Link
                  to={`/quizzes/${quiz.qid}`}
                  className="btn-primary w-full shadow-lg shadow-indigo-100 py-3.5 group-hover:shadow-indigo-200"
                >
                  View Details
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;