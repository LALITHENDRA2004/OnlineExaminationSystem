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
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Admin Dashboard</h1>
        <p className="text-lg text-slate-600">Welcome, <span className="text-indigo-600 font-semibold">{adminName}</span>! Manage your examination system from here.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Users Card */}
        <Link to="/admin/users" className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Users</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalUsers}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </Link>

        {/* Total Categories Card */}
        <Link to="/admin/categories" className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Categories</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalCategories}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </Link>

        {/* Total Quizzes Card */}
        <Link to="/admin/quizzes" className="card-elevated p-6 flex items-center justify-between group">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Quizzes</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalQuizzes}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </Link>

        {/* Total Questions Card */}
        <div className="card p-6 flex items-center justify-between group bg-slate-50/50">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Questions</p>
            <p className="text-3xl font-bold text-slate-600">{stats.totalQuestions}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Management Actions */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Management shortcuts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/admin/users" className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Users</h3>
              <p className="text-slate-500 text-xs">View and update user roles</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/quizzes" className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-amber-200 shadow-lg group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Quiz</h3>
              <p className="text-slate-500 text-xs">Design and publish new tests</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/categories" className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-emerald-200 shadow-lg group-hover:rotate-12 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Category</h3>
              <p className="text-slate-500 text-xs">Organize quizzes by topic</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;