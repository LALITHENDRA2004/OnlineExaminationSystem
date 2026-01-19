// src/pages/admin/AdminQuestions.jsx

/**
 * AdminQuestions.jsx
 * 
 * Purpose:
 * - Allows Admin to manage questions for a specific quiz
 * - Admin can add, edit, and delete questions
 * 
 * TODO: Add form validation (required fields, correct answer selection)
 * TODO: Add pagination for large question lists
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQuestionsForAdmin, createQuestion, updateQuestion, deleteQuestion, getQuiz } from '../../services/questionService';

function AdminQuestions() {
  const { id: quizId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    quesId: null,
    content: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [quizId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizData, questionsData] = await Promise.all([
        getQuiz(quizId),
        getQuestionsForAdmin(quizId)
      ]);
      setQuizTitle(quizData.title);
      setQuestions(questionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      setSubmitting(true);
      const questionPayload = {
        content: formData.content,
        option1: formData.option1,
        option2: formData.option2,
        option3: formData.option3,
        option4: formData.option4,
        answer: formData.answer,
        quiz: {
          qId: parseInt(quizId)
        }
      };

      if (editMode) {
        questionPayload.quesId = formData.quesId;
        const updatedQuestion = await updateQuestion(questionPayload);
        setQuestions(prevQuestions => prevQuestions.map(q => q.quesId === formData.quesId ? updatedQuestion : q));
        setSuccessMessage('Question updated successfully!');
      } else {
        const newQuestion = await createQuestion(questionPayload);
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
        setSuccessMessage('Question created successfully!');
      }

      setFormData({
        quesId: null,
        content: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: ''
      });
      setEditMode(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (question) => {
    setFormData({
      quesId: question.quesId,
      content: question.content,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      answer: question.answer
    });
    setEditMode(true);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleCancelEdit = () => {
    setFormData({
      quesId: null,
      content: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    });
    setEditMode(false);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      setQuestions(prevQuestions => prevQuestions.filter(q => q.quesId !== questionId));
      setSuccessMessage('Question deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading questions...</p>
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
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Questions</h1>
        <p className="text-lg text-slate-600">Quiz: <span className="font-semibold text-indigo-700">{quizTitle}</span></p>
      </div>

      {/* Add/Edit Question Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {editMode ? 'Edit Question' : 'Add New Question'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2">
              Question Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter question text"
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="option1" className="block text-sm font-semibold text-slate-700 mb-2">
                Option 1
              </label>
              <input
                type="text"
                id="option1"
                name="option1"
                value={formData.option1}
                onChange={handleInputChange}
                placeholder="Enter option 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="option2" className="block text-sm font-semibold text-slate-700 mb-2">
                Option 2
              </label>
              <input
                type="text"
                id="option2"
                name="option2"
                value={formData.option2}
                onChange={handleInputChange}
                placeholder="Enter option 2"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="option3" className="block text-sm font-semibold text-slate-700 mb-2">
                Option 3
              </label>
              <input
                type="text"
                id="option3"
                name="option3"
                value={formData.option3}
                onChange={handleInputChange}
                placeholder="Enter option 3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="option4" className="block text-sm font-semibold text-slate-700 mb-2">
                Option 4
              </label>
              <input
                type="text"
                id="option4"
                name="option4"
                value={formData.option4}
                onChange={handleInputChange}
                placeholder="Enter option 4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="answer" className="block text-sm font-semibold text-slate-700 mb-2">
              Correct Answer
            </label>
            <input
              type="text"
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Enter correct answer text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
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
              className={`px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${submitting
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-indigo-700 text-white hover:bg-indigo-800'
                }`}
            >
              {submitting ? (editMode ? 'Updating...' : 'Creating...') : (editMode ? 'Update Question' : 'Create Question')}
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

      {/* Questions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800">Existing Questions</h2>
        </div>

        {questions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-lg text-slate-600">No questions found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[250px]">Question Content</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option 1</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option 2</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option 3</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide min-w-[180px]">Option 4</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Correct</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.map((question) => (
                <tr key={`question-${question.quesId}`} className="hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-slate-700">{question.quesId}</td>
                  <td className="px-6 py-4 text-sm text-slate-800">{question.content}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{question.option1}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{question.option2}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{question.option3}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{question.option4}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                      {question.answer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(question)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                        aria-label={`Edit question ${question.quesId}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(question.quesId)}
                        className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                        aria-label={`Delete question ${question.quesId}`}
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

      {/* Back Link */}
      <div className="mt-6">
        <Link
          to="/admin/quizzes"
          className="inline-block px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
          aria-label="Back to quizzes"
        >
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
}

export default AdminQuestions;