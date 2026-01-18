import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/dashboard" 
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              aria-label="Home"
            >
              Online Examination System
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              aria-label="Dashboard"
            >
              Dashboard
            </Link>
            <Link 
              to="/quizzes" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              aria-label="Quizzes"
            >
              Quizzes
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              aria-label="Profile"
            >
              Profile
            </Link>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            <button 
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;