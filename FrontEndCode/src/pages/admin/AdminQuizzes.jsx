// src/pages/admin/AdminQuizzes.jsx

/**
 * AdminQuizzes.jsx
 * 
 * Purpose:
 * - Allows Admin to manage quizzes
 * - Admin can create, edit, and delete quizzes
 * 
 * TODO: Add form validation (required fields, positive numbers)
 * TODO: Add search and filter functionality
 * TODO: Add pagination for large quiz lists
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../../services/quizService';
import { getAllCategories } from '../../services/categoryService';

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    qid: null,
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    category: '',
    active: true
  });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizzesData, categoriesData] = await Promise.all([
        getAllQuizzes(),
        getAllCategories()
      ]);
      setQuizzes(quizzesData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      setSubmitting(true);
      const quizPayload = {
        title: formData.title,
        description: formData.description,
        maxMarks: parseInt(formData.maxMarks),
        numberOfQuestions: parseInt(formData.numberOfQuestions),
        active: formData.active,
        category: {
          cid: parseInt(formData.category)
        }
      };

      if (editMode) {
        quizPayload.qid = formData.qid;
        const updatedQuiz = await updateQuiz(quizPayload);
        setQuizzes(prevQuizzes => prevQuizzes.map(q => q.qid === formData.qid ? updatedQuiz : q));
        setSuccessMessage('Quiz updated successfully!');
      } else {
        const newQuiz = await createQuiz(quizPayload);
        setQuizzes(prevQuizzes => [...prevQuizzes, newQuiz]);
        setSuccessMessage('Quiz created successfully!');
      }

      setFormData({
        qid: null,
        title: '',
        description: '',
        maxMarks: '',
        numberOfQuestions: '',
        category: '',
        active: true
      });
      setEditMode(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      qid: quiz.qId,
      title: quiz.title,
      description: quiz.description,
      maxMarks: quiz.maxMarks,
      numberOfQuestions: quiz.numberOfQuestions,
      category: quiz.category?.cid || '',
      active: quiz.active
    });
    setEditMode(true);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setFormData({
      qid: null,
      title: '',
      description: '',
      maxMarks: '',
      numberOfQuestions: '',
      category: '',
      active: true
    });
    setEditMode(false);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (qid) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    try {
      await deleteQuiz(qid);
      setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.qId !== qid));
      setSuccessMessage('Quiz deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Quizzes</h1>
        <p className="text-lg text-slate-600">Create, edit, and manage all quizzes in the system.</p>
      </div>

      {/* Add/Edit Quiz Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {editMode ? 'Edit Quiz' : 'Add New Quiz'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter quiz title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={`cat-${cat.cid}`} value={cat.cid}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter quiz description"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxMarks" className="block text-sm font-semibold text-slate-700 mb-2">
                Max Marks
              </label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                placeholder="Enter max marks"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                min="1"
              />
            </div>

            <div>
              <label htmlFor="numberOfQuestions" className="block text-sm font-semibold text-slate-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                id="numberOfQuestions"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleInputChange}
                placeholder="Enter number of questions"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4 text-indigo-700 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="active" className="ml-2 text-sm font-semibold text-slate-700">
              Active
            </label>
          </div>

          {submitError && (
            <p className="text-sm text-red-600 font-medium">{submitError}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-600 font-medium">{successMessage}</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                submitting
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-indigo-700 text-white hover:bg-indigo-800'
              }`}
            >
              {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Quiz' : 'Create Quiz')}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={submitting}
                className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800">Existing Quizzes</h2>
        </div>

        {quizzes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-lg text-slate-600">No quizzes found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Quiz Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Questions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Max Marks</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Active</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map((quiz) => {
                return (
                <tr key={`quiz-${quiz.qId}`} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{quiz.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{quiz.category?.title || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{quiz.numberOfQuestions}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{quiz.maxMarks}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      quiz.active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {quiz.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                        aria-label={`Edit ${quiz.title}`}
                      >
                        Edit
                      </button>
                      <Link 
                        to={`/admin/quizzes/${quiz.qId}/questions`}
                        className="px-4 py-2 bg-teal-100 text-teal-700 text-sm font-medium rounded-lg hover:bg-teal-200 transition-colors duration-200"
                        aria-label={`Manage questions for ${quiz.title}`}
                      >
                        Questions
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.qId)}
                        className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                        aria-label={`Delete ${quiz.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminQuizzes;