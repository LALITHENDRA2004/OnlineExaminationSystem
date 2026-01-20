/**
 * StudentDashboard.jsx
 * 
 * Purpose:
 * - Main dashboard page for Student role
 * - Displays summary statistics and quick action links
 * 
 * TODO: Fetch student data and quiz statistics from backend API
 * TODO: Display actual user name from authenticated session
 * TODO: Add dynamic data for total quizzes, attempted quizzes, and average score
 * TODO: Add navigation logic to quick action buttons
 * TODO: Add recent quiz history section
 */

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
            // Assuming we want average percentage per quiz or overall. 
            // Ideally Result should store maxMarks too, but we have Quiz reference.
            // Let's use simple average of percentages if possible, or just raw calc.
            // Wait, Result entity has link to Quiz, so we can get maxMarks from r.quiz.maxMarks
            const max = r.quiz ? r.quiz.maxMarks : 100;
            totalMaxMarks += max;
          });

          // Calculate overall percentage: (Total Got / Total Max) * 100
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
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Student Dashboard</h1>
        <p className="text-lg text-slate-600">Welcome back, {studentName}! Here's your overview.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Quizzes Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Available Quizzes</p>
          <p className="text-4xl font-bold text-indigo-700">{stats.totalQuizzes}</p>
        </div>

        {/* Quizzes Attempted Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Quizzes Attempted</p>
          <p className="text-4xl font-bold text-teal-700">{stats.quizzesAttempted}</p>
        </div>

        {/* Average Score Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Average Score</p>
          <p className="text-4xl font-bold text-amber-600">{stats.averageScore}%</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Recent Attempts</h2>
            <Link to="/student/attempts" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">View All</Link>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {recentAttempts.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No recent activity.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Quiz</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Score</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentAttempts.map((r, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3 text-sm font-medium text-slate-800">{r.quiz ? r.quiz.title : 'N/A'}</td>
                      <td className="px-6 py-3 text-sm font-bold text-indigo-700">{r.marksGot} / {r.quiz ? r.quiz.maxMarks : '100'}</td>
                      <td className="px-6 py-3 text-sm text-slate-500">{r.submitDate ? new Date(r.submitDate).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions (Moved to right column) */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-4">
            <Link
              to="/quizzes"
              className="bg-indigo-700 text-white rounded-lg p-6 text-center font-semibold text-lg hover:bg-indigo-800 transition-colors duration-200 shadow-sm"
            >
              Start New Quiz
            </Link>
            <Link
              to="/profile"
              className="bg-teal-700 text-white rounded-lg p-6 text-center font-semibold text-lg hover:bg-teal-800 transition-colors duration-200 shadow-sm"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;