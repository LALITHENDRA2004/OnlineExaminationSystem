/**
 * Register.jsx
 * 
 * Purpose:
 * - Registration page UI for the Online Examination System
 * - Allows new users to create an account
 * 
 * TODO: Add registration logic and API call to backend
 * TODO: Add form validation (required fields, email format, password strength)
 * TODO: Add error handling and display error messages
 * TODO: Add success message and redirect to login after registration
 * TODO: Add loading state during registration process
 */

import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Register</h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Password"
            />
          </div>

          <button
            type="button"
            className="w-full bg-indigo-700 text-white font-semibold py-3 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
            aria-label="Register"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-700 font-semibold hover:text-indigo-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;