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
import { getCurrentUser } from '../../services/authService';

function StudentDashboard() {
  const [studentName, setStudentName] = useState("Student");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    quizzesAttempted: "N/A", // Backend does not store attempts
    averageScore: "N/A"      // Backend does not store results
  });

  useEffect(() => {
    // Fetch user name
    getCurrentUser().then(user => {
      if (user) setStudentName(user.firstName || user.username);
    });

    // Fetch stats
    getActiveQuizzes().then(quizzes => {
      setStats(prev => ({ ...prev, totalQuizzes: quizzes.length }));
    }).catch(err => console.error("Failed to load stats", err));
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

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/quizzes"
            className="bg-indigo-700 text-white rounded-lg p-6 text-center font-semibold text-lg hover:bg-indigo-800 transition-colors duration-200 shadow-sm"
            aria-label="View all quizzes"
          >
            View Quizzes
          </Link>
          <Link
            to="/profile"
            className="bg-teal-700 text-white rounded-lg p-6 text-center font-semibold text-lg hover:bg-teal-800 transition-colors duration-200 shadow-sm"
            aria-label="View profile"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;