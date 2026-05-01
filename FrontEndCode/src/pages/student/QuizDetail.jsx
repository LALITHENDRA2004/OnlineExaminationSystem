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
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
        <div className="spinner w-10 h-10 mb-4"></div>
        <p className="text-lg font-medium text-slate-600">Loading quiz details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="alert alert-error mb-6">
          <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold mb-1">Access Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <Link to="/quizzes" className="btn-secondary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Quizzes
        </Link>
      </div>
    );
  }

  if (!quiz) return null;

  const timeLimit = quiz.timer && quiz.timer > 0 ? quiz.timer : quiz.numberOfQuestions * 2;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Quiz Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/quizzes" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quizzes
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-400 capitalize">{quiz.category?.title}</span>
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{quiz.title}</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">{quiz.description || "Take this quiz to test your knowledge."}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Left Column: Metrics */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card-elevated p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Questions</p>
              <p className="text-lg font-bold text-slate-900">{quiz.numberOfQuestions} Items</p>
            </div>
          </div>

          <div className="card-elevated p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Max Marks</p>
              <p className="text-lg font-bold text-slate-900">{quiz.maxMarks} Points</p>
            </div>
          </div>

          <div className="card-elevated p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Time Limit</p>
              <p className="text-lg font-bold text-slate-900">{timeLimit} Minutes</p>
            </div>
          </div>
        </div>

        {/* Right Column: Instructions */}
        <div className="lg:col-span-2">
          <div className="card p-8 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quiz Instructions
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">1</div>
                <p className="text-sm text-slate-600">This quiz contains <span className="font-bold text-slate-900">{quiz.numberOfQuestions} multiple choice questions</span>. Each question carries a specific weight toward your total score.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">2</div>
                <p className="text-sm text-slate-600">You will have <span className="font-bold text-slate-900">{timeLimit} minutes</span> to complete the quiz. The timer starts immediately after clicking "Start Quiz".</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">3</div>
                <p className="text-sm text-slate-600">Each question has 4 options. Select the best possible answer. There is <span className="font-bold text-emerald-600 uppercase tracking-tighter">no negative marking</span> for incorrect answers.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">4</div>
                <p className="text-sm text-slate-600">Ensure you have a stable internet connection. Do not refresh or exit the browser tab while the quiz is in progress as your progress may be lost.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 mt-0.5">5</div>
                <p className="text-sm text-slate-600 italic">Click the "Start Quiz" button below when you are ready to begin. Good luck!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          to={`/quizzes/${quiz.qid}/attempt`}
          className="btn-primary btn-lg w-full sm:w-auto min-w-[200px] shadow-xl shadow-indigo-200"
        >
          Start Quiz Now
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </Link>
        <Link
          to="/quizzes"
          className="btn-secondary btn-lg w-full sm:w-auto"
        >
          Return to List
        </Link>
      </div>
    </div>
  );
}

export default QuizDetail;