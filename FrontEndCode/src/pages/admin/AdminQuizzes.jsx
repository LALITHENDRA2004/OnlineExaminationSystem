import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz } from '../../services/quizService';
import { getAllCategories } from '../../services/categoryService';

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    qid: null,
    title: '',
    description: '',
    maxMarks: '',
    numberOfQuestions: '',
    category: '',
    active: true,
    timer: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.category?.title && quiz.category.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizzesData, categoriesData] = await Promise.all([
        getAllQuizzes(),
        getAllCategories()
      ]);
      setQuizzes(quizzesData);
      setFilteredQuizzes(quizzesData);
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
        timer: formData.timer ? parseInt(formData.timer) : null,
        category: { cid: parseInt(formData.category) }
      };

      if (editMode) {
        quizPayload.qid = formData.qid;
        const updatedQuiz = await updateQuiz(quizPayload);
        const categoryDetails = categories.find(cat => cat.cid === parseInt(formData.category));
        if (categoryDetails) updatedQuiz.category = categoryDetails;
        setQuizzes(prev => prev.map(q => q.qid === formData.qid ? updatedQuiz : q));
        setSuccessMessage('Quiz updated successfully.');
      } else {
        const newQuiz = await createQuiz(quizPayload);
        const categoryDetails = categories.find(cat => cat.cid === parseInt(formData.category));
        if (categoryDetails) newQuiz.category = categoryDetails;
        setQuizzes(prev => [...prev, newQuiz]);
        setSuccessMessage('New quiz added successfully.');
      }

      setFormData({
        qid: null,
        title: '',
        description: '',
        maxMarks: '',
        numberOfQuestions: '',
        category: '',
        active: true,
        timer: ''
      });
      setEditMode(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (quiz) => {
    setFormData({
      qid: quiz.qid,
      title: quiz.title,
      description: quiz.description,
      maxMarks: quiz.maxMarks,
      numberOfQuestions: quiz.numberOfQuestions,
      category: quiz.category?.cid || '',
      active: quiz.active,
      timer: quiz.timer || ''
    });
    setEditMode(true);
    setSubmitError(null);
    setSuccessMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (qid) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This cannot be undone.')) return;

    try {
      await deleteQuiz(qid);
      setQuizzes(prev => prev.filter(q => q.qid !== qid));
      setSuccessMessage('Quiz deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-slate-500 font-medium">Loading quizzes...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">All Quizzes</h1>
          <p className="text-lg text-slate-600">Manage all quizzes in the system.</p>
        </div>
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
            {editMode ? 'Update Quiz' : 'Add New Quiz'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="label text-[10px] tracking-widest uppercase font-bold">Quiz Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Finite Automata Theory Final"
                    className="input-field h-12"
                    required
                  />
                </div>
                <div>
                  <label className="label text-[10px] tracking-widest uppercase font-bold">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the quiz..."
                    rows="3"
                    className="input-field resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label text-[10px] tracking-widest uppercase font-bold">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field h-12 bg-white"
                    required
                  >
                    <option value="">Choose Class...</option>
                    {categories.map((cat) => (
                      <option key={cat.cid} value={cat.cid}>{cat.title}</option>
                    ))}
                  </select>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-400 text-xs leading-relaxed">
                  Select a category for this quiz.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
              <div>
                <label className="label text-[10px] tracking-widest uppercase font-bold">Max Marks</label>
                <input
                  type="number"
                  name="maxMarks"
                  value={formData.maxMarks}
                  onChange={handleInputChange}
                  placeholder="100"
                  className="input-field h-12"
                  required
                />
              </div>
              <div>
                <label className="label text-[10px] tracking-widest uppercase font-bold">Number of Questions</label>
                <input
                  type="number"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="input-field h-12"
                  required
                />
              </div>
              <div>
                <label className="label text-[10px] tracking-widest uppercase font-bold">Time Limit (Min)</label>
                <input
                  type="number"
                  name="timer"
                  value={formData.timer}
                  onChange={handleInputChange}
                  placeholder="Auto-calc"
                  className="input-field h-12"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-14 h-8 transition-colors rounded-full shadow-inner ${formData.active ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${formData.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-4 text-xs font-black uppercase text-slate-600 tracking-widest">{formData.active ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>

            {(submitError || successMessage) && (
              <div className={`alert ${submitError ? 'alert-error' : 'alert-success'} animate-fade-in`}>
                <p className="font-bold">{submitError ? 'SYNC FAILURE:' : 'SYNC SUCCESS:'} {submitError || successMessage}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 h-14 min-w-[180px]"
              >
                {submitting ? 'Processing...' : editMode ? 'Save Changes' : 'Add Quiz'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn-ghost text-slate-400 font-bold hover:text-slate-900"
                >
                  Discard Parameters
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Registry List Area */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 leading-none">Quiz List</h2>
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 h-10 text-sm bg-slate-50 border-transparent focus:bg-white"
          />
        </div>
      </div>

      <div className="table-container shadow-2xl border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-th text-left">Title & Category</th>
                <th className="table-th text-center">Details</th>
                <th className="table-th text-center">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-medium">No quizzes found.</p>
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz.qid} className="table-row group">
                    <td className="table-td">
                      <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900 leading-tight">{quiz.title}</p>
                          <span className="badge badge-primary scale-75 origin-left">{quiz.category?.title || 'Uncategorized'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-1">{quiz.description}</p>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-center gap-4 text-center">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Marks</p>
                          <p className="text-sm font-black text-slate-800 leading-none">{quiz.maxMarks}</p>
                        </div>
                        <div className="h-4 w-px bg-slate-100"></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Questions</p>
                          <p className="text-sm font-black text-slate-800 leading-none">{quiz.numberOfQuestions}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td text-center">
                      <span className={`badge ${quiz.active ? 'badge-success' : 'badge-danger'}`}>
                        {quiz.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => handleEdit(quiz)}
                          className="btn-ghost btn-sm text-indigo-600 font-bold hover:bg-indigo-50"
                          title="Edit"
                        >
                          Edit
                        </button>
                        <Link
                          to={`/admin/quizzes/${quiz.qid}/questions`}
                          className="btn-ghost btn-sm text-emerald-600 font-bold hover:bg-emerald-50"
                          title="Questions"
                        >
                          Questions
                        </Link>
                        <button
                          onClick={() => handleDelete(quiz.qid)}
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

export default AdminQuizzes;