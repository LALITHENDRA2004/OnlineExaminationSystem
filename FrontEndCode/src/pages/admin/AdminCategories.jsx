import React, { useState, useEffect } from 'react';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({ cid: null, title: '', description: '' });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
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
        setSuccessMessage('Category updated successfully.');
      } else {
        await createCategory({ title: formData.title, description: formData.description });
        setSuccessMessage('Category added successfully.');
      }
      setFormData({ cid: null, title: '', description: '' });
      setEditMode(false);
      await fetchCategories();
      setTimeout(() => setSuccessMessage(null), 4000);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ cid: null, title: '', description: '' });
    setEditMode(false);
    setSubmitError(null);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category? Associated quizzes may be affected.')) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      setSuccessMessage('Category deleted successfully.');
      await fetchCategories();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-slate-500 font-medium tracking-wide">Loading categories...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Categories</h1>
        <p className="text-lg text-slate-600">Manage categories for your quizzes.</p>
      </div>

      {/* Management Form Area */}
      <div className={`card overflow-hidden transition-all duration-300 mb-10 ${editMode ? 'border-indigo-200 ring-4 ring-indigo-50 shadow-2xl' : 'border-slate-100 shadow-lg'}`}>
            <div className={`h-1.5 ${editMode ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            <div className="p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editMode ? 'bg-indigo-600' : 'bg-slate-900'} text-white shadow-lg`}>
                  {editMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                {editMode ? 'Update Category' : 'Add Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="label text-[10px] uppercase tracking-widest font-bold">Category Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Applied Cryptography"
                    className="input-field h-12"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="label text-[10px] uppercase tracking-widest font-bold">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a brief structural overview..."
                    rows="4"
                    className="input-field resize-none"
                    required
                  ></textarea>
                </div>

                {submitError && (
                  <div className="alert alert-error p-3 text-xs leading-relaxed">
                    <strong>Update Failure:</strong> {submitError}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success p-3 text-xs leading-relaxed">
                    <strong>Success:</strong> {successMessage}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-8 h-14 min-w-[180px]"
                  >
                    {submitting ? 'Processing...' : editMode ? 'Save Changes' : 'Add Category'}
                  </button>
                  {editMode && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-ghost text-slate-400 font-bold hover:text-slate-900"
                    >
                      Discard Edits
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

        {/* List Area */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 leading-none">All Categories</h2>
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Find category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="table-container shadow-2xl border-slate-100">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-th w-16 text-center">ID</th>
                  <th className="table-th text-left">Category & Description</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-medium">No results match your search filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.cid} className="table-row group">
                      <td className="table-td text-center font-mono text-xs text-slate-400">
                        #{category.cid}
                      </td>
                      <td className="table-td">
                        <div className="max-w-md">
                          <p className="font-bold text-slate-900 mb-1">{category.title}</p>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{category.description}</p>
                        </div>
                      </td>
                      <td className="table-td text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => handleEdit(category)}
                            className="btn-ghost btn-sm text-indigo-600 font-bold hover:bg-indigo-50"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.cid)}
                            className="btn-ghost btn-sm text-red-600 font-bold hover:bg-red-50"
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
    </div>
  );
}

export default AdminCategories;