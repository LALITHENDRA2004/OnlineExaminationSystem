/**
 * Login.jsx
 * 
 * Purpose:
 * - Login page UI for the Online Examination System
 * - Allows users (Admin/Student) to enter credentials and authenticate
 * 
 * TODO: Add form validation (required fields, email format)
 * TODO: Add loading state during login process
 * TODO: Improve error handling and display specific error messages
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, setToken, getCurrentUser, setUser as setLocalUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(credentials);
      // login success, save token
      if (data.token) {
        setToken(data.token);
        // fetch current user details if needed, or just redirect
        const user = await getCurrentUser();
        setLocalUser(user); // Save to local storage
        setUser(user);      // Update context state
        console.log('Logged in user:', user);

        // Redirect based on role
        if (user.authorities[0].authority === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 text-center mb-2">Login</h1>
        <p className="text-center text-slate-600 mb-8">Welcome back! Please login to your account.</p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="nope">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
              Username / Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username or email"
              autoComplete="new-username-field"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:border-transparent transition-all duration-200"
              aria-label="Username or Email"
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
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="new-password-field"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            aria-label="Login"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-700 font-semibold hover:text-indigo-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;