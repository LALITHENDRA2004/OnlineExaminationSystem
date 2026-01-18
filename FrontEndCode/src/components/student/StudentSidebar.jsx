/**
 * StudentSidebar.jsx
 * 
 * Purpose:
 * - Sidebar navigation for Student role
 * - Provides quick access to student-specific pages
 * 
 * TODO: Add active link highlighting based on current route
 * TODO: Show/hide sidebar based on authentication and role
 * TODO: Add collapse/expand functionality for mobile responsiveness
 */

import React from 'react';
import { Link } from 'react-router-dom';

function StudentSidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full" aria-label="Student navigation">
      <div className="py-6 px-4">
        <h2 className="text-xl font-bold text-slate-800 px-4 mb-6">Student Menu</h2>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="Go to dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/quizzes" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="View quizzes"
              >
                Quizzes
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className="block px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                aria-label="View profile"
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default StudentSidebar;