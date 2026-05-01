import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveQuizzes } from '../../services/quizService';
import { getResultsByUser } from '../../services/resultService';
import { getCurrentUser } from '../../services/authService';

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Student");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    quizzesAttempted: 0,
    averageScore: 0
  });
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    // Fetch user name
    getCurrentUser().then(user => {
      if (user) setStudentName(user.firstName || user.username);
    });

    // Fetch stats
    const fetchData = async () => {
      try {
        const [quizzes, results] = await Promise.all([
          getActiveQuizzes(),
          getResultsByUser()
        ]);

        // Calculate average score
        let totalMarks = 0;
        let totalMaxMarks = 0;
        let avgScore = 0;

        if (results && results.length > 0) {
          results.forEach(r => {
            totalMarks += r.marksGot;
            const max = r.quiz ? r.quiz.maxMarks : 100;
            totalMaxMarks += max;
          });

          // Calculate overall percentage
          if (totalMaxMarks > 0) {
            avgScore = ((totalMarks / totalMaxMarks) * 100).toFixed(1);
          }
        }

        setStats({
          totalQuizzes: quizzes.length,
          quizzesAttempted: results.length,
          averageScore: avgScore
        });

        // Get recent 5 attempts
        setRecentAttempts(results.slice(0, 5));

      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Student Dashboard</h1>
        <p className="text-lg text-slate-600">Welcome back, <span className="text-indigo-600 font-semibold">{studentName}</span>! Here's your overview.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Quizzes Card */}
        <div className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Available Quizzes</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalQuizzes}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        {/* Quizzes Attempted Card */}
        <div className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quizzes Attempted</p>
            <p className="text-3xl font-bold text-slate-900">{stats.quizzesAttempted}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Average Score</p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-slate-900">{stats.averageScore}</p>
              <span className="text-slate-500 font-semibold">%</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start New Quiz */}
          <Link
            to="/quizzes"
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900">Start New Quiz</h3>
                <p className="text-slate-500 text-xs">Browse available quizzes</p>
              </div>
            </div>
          </Link>

          {/* My Attempts */}
          <Link
            to="/student/attempts"
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-100 transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-amber-200 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900">My Attempts</h3>
                <p className="text-slate-500 text-xs">View quiz history</p>
              </div>
            </div>
          </Link>

          {/* Update Profile */}
          <Link
            to="/profile"
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal-100 transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-teal-200 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900">Update Profile</h3>
                <p className="text-slate-500 text-xs">Manage account settings</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Attempts</h2>
          <Link to="/student/attempts" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="table-container shadow-soft">
          {recentAttempts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No recent quiz attempts found.</p>
              <Link to="/quizzes" className="text-indigo-600 text-sm font-semibold hover:underline mt-2 inline-block">Start your first quiz</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-th">Quiz Title</th>
                    <th className="table-th">Score Achieved</th>
                    <th className="table-th">Submission Date</th>
                    <th className="table-th text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAttempts.map((r, i) => (
                    <tr key={i} className="table-row">
                      <td className="table-td font-semibold text-slate-900">{r.quiz ? r.quiz.title : 'N/A'}</td>
                      <td className="table-td">
                        <span className={`badge ${r.marksGot >= (r.quiz?.maxMarks || 100) * 0.4 ? 'badge-success' : 'badge-danger'}`}>
                          {r.marksGot} / {r.quiz ? r.quiz.maxMarks : '100'}
                        </span>
                      </td>
                      <td className="table-td text-slate-500 whitespace-nowrap">
                        {r.submitDate ? new Date(r.submitDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="table-td text-right">
                        <Link to={`/results/review/${r.rid}`} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-wider">
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;