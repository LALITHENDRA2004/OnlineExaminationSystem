import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const { result, quizTitle, isAutoSubmit } = location.state || {};

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Result Data Available</h2>
        <p className="text-slate-500 mb-8">We couldn't retrieve your recent quiz scores. Please try again.</p>
        <Link to="/quizzes" className="btn-primary">Browse Quizzes</Link>
      </div>
    );
  }

  const percentage = ((result.marksGot / result.totalMarks) * 100).toFixed(1);

  const getPerformanceConfig = (percent) => {
    if (percent >= 80) return {
      text: 'Exceptional Performance!',
      description: 'You have demonstrated a profound understanding of the subject matter.',
      colorClass: 'text-emerald-600',
      bgColorClass: 'bg-emerald-50',
      borderColorClass: 'border-emerald-100',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
        </svg>
      )
    };
    if (percent >= 60) return {
      text: 'Commendable Effort!',
      description: 'Good grasp of the concepts. A bit more focus on details will lead to mastery.',
      colorClass: 'text-indigo-600',
      bgColorClass: 'bg-indigo-50',
      borderColorClass: 'border-indigo-100',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    if (percent >= 40) return {
      text: 'Steady Progress!',
      description: 'You are on the right track. Review the missed areas to strengthen your foundation.',
      colorClass: 'text-amber-600',
      bgColorClass: 'bg-amber-50',
      borderColorClass: 'border-amber-100',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    };
    return {
      text: 'Foundation Building!',
      description: 'Don\'t be discouraged. Review the study materials and attempt again for improvement.',
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-50',
      borderColorClass: 'border-red-100',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
  };

  const config = getPerformanceConfig(percentage);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in py-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Performance Summary</h1>
        <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-slate-600 font-bold text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {quizTitle || 'Quiz Results'}
        </div>
        {isAutoSubmit && (
          <div className="mt-4 inline-block bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-200">
            Auto-Submitted due to Time Limit
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Main Score Visual */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="card shadow-elevated p-10 w-full flex flex-col items-center text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${config.bgColorClass.replace('bg-', 'bg-').split('-')[0] === 'bg' ? 'bg-indigo-600' : 'bg-indigo-600'}`}></div>

            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Overall Achievement</p>

            <div className="relative w-48 h-48 mb-8">
              {/* SVG Circle Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * percentage) / 100}
                  className="text-indigo-600 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{Math.round(percentage)}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase">Correct</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-black text-slate-900">{result.marksGot} / {result.totalMarks}</p>
              <p className="text-sm font-bold text-slate-400">Total Points Earned</p>
            </div>
          </div>
        </div>

        {/* Performance & Metrics */}
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Message */}
          <div className={`card p-8 border-2 ${config.borderColorClass} ${config.bgColorClass} flex gap-6 items-center shadow-lg shadow-indigo-50`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm ${config.colorClass}`}>
              {config.icon}
            </div>
            <div>
              <h2 className={`text-2xl font-black mb-1 ${config.colorClass}`}>{config.text}</h2>
              <p className="text-slate-600 line-height-relaxed">{config.description}</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-elevated p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Attempted</p>
              <p className="text-2xl font-black text-slate-900">{result.attempted} Qs</p>
            </div>

            <div className="card-elevated p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Success</p>
              <p className="text-2xl font-black text-emerald-600">{result.correctAnswers} Correct</p>
            </div>

            <div className="card-elevated p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">Incorrect</p>
              <p className="text-2xl font-black text-red-600">{result.attempted - result.correctAnswers} Wrong</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 pt-10 border-t border-slate-100">
        {result.rid && (
          <Link
            to={`/results/review/${result.rid}`}
            className="btn-primary btn-lg w-full md:w-auto min-w-[200px] shadow-xl shadow-indigo-100"
          >
            Review Detailed Solutions
          </Link>
        )}
        <Link
          to="/student/dashboard"
          className="btn-secondary btn-lg w-full md:w-auto min-w-[200px]"
        >
          Return to Dashboard
        </Link>
        <Link
          to="/quizzes"
          className="btn-ghost btn-lg w-full md:w-auto font-bold !text-indigo-600 hover:underline"
        >
          Try Another Quiz
        </Link>
      </div>
    </div>
  );
}

export default Result;