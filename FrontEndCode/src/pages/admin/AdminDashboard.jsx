/**
 * AdminDashboard.jsx
 * 
 * Purpose:
 * - Main dashboard page for Admin role
 * - Displays summary statistics and management options
 * 
 * TODO: Fetch admin dashboard statistics from backend API
 * TODO: Display actual admin name from authenticated session
 * TODO: Add dynamic data for users, categories, quizzes, and questions counts
 * TODO: Add navigation logic to management action buttons
 * TODO: Add recent activity section (recently created quizzes, new users)
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../services/categoryService';
import { getAllQuizzes } from '../../services/quizService';
import { getAllUsers } from '../../services/userService';
import { getUser } from '../../services/authService';
import { getTotalQuestionCount } from '../../services/questionService';

function AdminDashboard() {
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCategories: 0,
    totalQuizzes: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    const user = getUser();
    if (user) setAdminName(user.firstName || user.username);

    Promise.all([
      getAllCategories(),
      getAllQuizzes(),
      getAllUsers(),
      getTotalQuestionCount()
    ]).then(([categories, quizzes, users, questionCount]) => {
      setStats({
        totalCategories: categories.length,
        totalQuizzes: quizzes.length,
        totalUsers: users.length,
        totalQuestions: questionCount
      });
    }).catch(err => console.error("Failed to load admin stats", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-slate-600">Welcome, {adminName}! Manage your examination system from here.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <Link to="/admin/users" className="block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Users</p>
            <p className="text-4xl font-bold text-indigo-700">{stats.totalUsers}</p>
          </div>
        </Link>

        {/* Total Categories Card */}
        <Link to="/admin/categories" className="block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Categories</p>
            <p className="text-4xl font-bold text-teal-700">{stats.totalCategories}</p>
          </div>
        </Link>

        {/* Total Quizzes Card */}
        <Link to="/admin/quizzes" className="block">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Quizzes</p>
            <p className="text-4xl font-bold text-amber-600">{stats.totalQuizzes}</p>
          </div>
        </Link>

        {/* Total Questions Card - No direct link as questions are per quiz */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200 h-full">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Total Questions</p>
          <p className="text-4xl font-bold text-purple-700">{stats.totalQuestions}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;