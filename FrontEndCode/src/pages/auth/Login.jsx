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

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-slate-800 text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-700 text-white font-semibold py-3 rounded-lg hover:bg-indigo-800 transition-colors duration-200"
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