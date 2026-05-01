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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/userService';

function Register() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [notification, setNotification] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.username.trim() === '' || user.password.trim() === '') {
      setNotification({ type: 'error', message: 'Username and Password are required' });
      return;
    }

    try {
      const data = await registerUser(user);
      console.log(data);
      setNotification({ type: 'success', message: 'User is registered successfully !!' });
      // Redirect to login after short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.log(error);
      // Display the actual error message from backend
      setNotification({
        type: 'error',
        message: error.message || 'Something went wrong !!'
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 text-center mb-2">Register</h1>
        <p className="text-center text-slate-600 mb-8">Create your account to get started.</p>

        {notification.message && (
          <div className={`p-4 mb-6 text-sm rounded-lg border flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`} role="alert">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              {notification.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleChange}
              value={user.username}
              placeholder="Enter your username"
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:border-transparent transition-all duration-200"
              required
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
              onChange={handleChange}
              value={user.password}
              placeholder="Enter your password"
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              value={user.firstName}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              value={user.lastName}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              onChange={handleChange}
              value={user.email}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="number"
              id="phone"
              name="phone"
              onChange={handleChange}
              value={user.phone}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
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