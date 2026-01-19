/**
 * Profile.jsx
 * 
 * Purpose:
 * - Displays profile information of the logged-in user
 * - Shows user details like username, email, and role
 * 
 * TODO: Fetch user data from backend API or authentication context
 * TODO: Add edit profile functionality with form
 * TODO: Implement logout logic to clear session and redirect to login
 * TODO: Add password change option
 * TODO: Display additional user statistics (quizzes attempted, average score)
 */

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    // Always fetch fresh data
    getCurrentUser().then(data => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    }).catch(err => {
      console.error("Failed to fetch user profile", err);
    });
  }, []);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-lg text-slate-600">View and manage your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Account Details</h2>

        <div className="space-y-5">
          {/* Username */}
          <div className="grid grid-cols-[140px_1fr] items-center">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Username</span>
            <span className="text-lg font-medium text-slate-800">{user.username}</span>
          </div>

          {/* Email */}
          <div className="grid grid-cols-[140px_1fr] items-center">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Email</span>
            <span className="text-lg font-medium text-slate-800">{user.email}</span>
          </div>

          {/* Role */}
          <div className="grid grid-cols-[140px_1fr] items-center">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Role</span>
            <span className="inline-block px-4 py-2 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-lg w-fit">
              {user.authorities ? user.authorities[0].authority : 'User'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            className="flex-1 px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
            aria-label="Edit profile"
          >
            Edit Profile
          </button>
          <button
            className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;