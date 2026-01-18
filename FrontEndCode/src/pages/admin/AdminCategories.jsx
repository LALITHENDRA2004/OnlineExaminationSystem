// src/pages/admin/AdminCategories.jsx

/**
 * AdminCategories.jsx
 * 
 * Purpose:
 * - Allows Admin to manage quiz categories
 * - Admin can add, edit, and delete categories
 * 
 * TODO: Add form validation for category name (required, unique)
 * TODO: Check if category is associated with quizzes before deletion
 * TODO: Add pagination for large category lists
 * TODO: Add search/filter functionality
 */

import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({ cid: null, title: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      setSubmitting(true);
      if (editMode) {
        await updateCategory(formData);
        setSuccessMessage('Category updated successfully!');
      } else {
        await createCategory({ title: formData.title, description: formData.description });
        setSuccessMessage('Category added successfully!');
      }
      setFormData({ cid: null, title: '', description: '' });
      setEditMode(false);
      await fetchCategories();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({ cid: category.cid, title: category.title, description: category.description });
    setEditMode(true);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setFormData({ cid: null, title: '', description: '' });
    setEditMode(false);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      setSuccessMessage('Category deleted successfully!');
      await fetchCategories();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading categories...</p>
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
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Categories</h1>
        <p className="text-lg text-slate-600">Organize quizzes by creating and managing categories.</p>
      </div>

      {/* Add/Edit Category Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {editMode ? 'Edit Category' : 'Add New Category'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter category title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
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
              placeholder="Enter category description"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            ></textarea>
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
              {submitting ? (editMode ? 'Updating...' : 'Adding...') : (editMode ? 'Update Category' : 'Add Category')}
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

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800">Existing Categories</h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-lg text-slate-600">No categories found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.cid} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-slate-700">{category.cid}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{category.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{category.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                        aria-label={`Edit ${category.title}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.cid)}
                        className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                        aria-label={`Delete ${category.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminCategories;