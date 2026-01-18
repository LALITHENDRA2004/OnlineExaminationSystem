/**
 * AdminSidebar.jsx
 * 
 * Purpose:
 * - Sidebar navigation for Admin role
 * - Provides quick access to admin management pages
 * 
 * TODO: Add active link highlighting based on current route
 * TODO: Show/hide sidebar based on authentication and role
 * TODO: Add collapse/expand functionality for mobile responsiveness
 */

import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full" aria-label="Admin navigation">
      <div className="py-6 px-4">
        <h2 className="text-xl font-bold text-indigo-700 px-4 mb-6">Admin Panel</h2>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin/dashboard" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="Go to admin dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/users" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="Manage users"
              >
                Users
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/categories" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="Manage categories"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/quizzes" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="Manage quizzes"
              >
                Quizzes
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default AdminSidebar;