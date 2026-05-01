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
        quiz: { qid: parseInt(quizId) }
      };

      if (editMode) {
        questionPayload.quesId = formData.quesId;
        const updatedQuestion = await updateQuestion(questionPayload);
        setQuestions(prev => prev.map(q => q.quesId === formData.quesId ? updatedQuestion : q));
        setSuccessMessage('Question data synchronized.');
      } else {
        const newQuestion = await createQuestion(questionPayload);
        setQuestions(prev => [...prev, newQuestion]);
        setSuccessMessage('New question integrated into dataset.');
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
      setTimeout(() => setSuccessMessage(null), 4000);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;

    try {
      await deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.quesId !== questionId));
      setSuccessMessage('Question deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-slate-500 font-medium">Loading questions...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/admin/quizzes" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Questions
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-400 capitalize">{quizTitle}</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Question Dataset</h1>
        <p className="text-lg text-slate-600">Manage questions for this quiz.</p>
      </div>

      {/* Management Form Area */}
      <div className={`card overflow-hidden transition-all duration-300 mb-10 ${editMode ? 'border-indigo-200 ring-4 ring-indigo-50 shadow-2xl' : 'border-slate-100 shadow-lg'}`}>
        <div className={`h-1.5 ${editMode ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${editMode ? 'bg-indigo-600' : 'bg-slate-900'} text-white shadow-lg`}>
              {editMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
            {editMode ? 'Update Question' : 'Add New Question'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label htmlFor="content" className="label text-[10px] uppercase tracking-widest font-bold">Question</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter your question here..."
                  rows="14"
                  className="input-field resize-none h-full min-h-[300px]"
                  required
                ></textarea>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="label text-[10px] uppercase tracking-widest font-bold">Options</label>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="relative group">
                      <span className="absolute left-3 top-3.5 text-[10px] font-black text-slate-300 group-hover:text-indigo-600 transition-colors">{String.fromCharCode(64 + i)}</span>
                      <input
                        type="text"
                        name={`option${i}`}
                        value={formData[`option${i}`]}
                        onChange={handleInputChange}
                        placeholder={`Option ${String.fromCharCode(64 + i)}`}
                        className="input-field h-11 pl-8 text-sm"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label htmlFor="answer" className="label text-[10px] uppercase tracking-widest font-bold">Correct Answer</label>
                  <input
                    type="text"
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    placeholder="Must exactly match one option above"
                    className="input-field h-12 border-emerald-100 bg-emerald-50/20"
                    required
                  />
                </div>
              </div>
            </div>

            {(submitError || successMessage) && (
              <div className={`alert ${submitError ? 'alert-error' : 'alert-success'} p-4 animate-fade-in`}>
                <p className="text-xs font-bold">{submitError ? 'ERROR:' : 'SUCCESS:'} {submitError || successMessage}</p>
              </div>
            )}

            <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8 h-14 min-w-[180px]"
              >
                {submitting ? 'Processing...' : editMode ? 'Update Question' : 'Add Question'}
              </button>
              {editMode && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-ghost text-slate-400 font-bold hover:text-slate-900"
                >
                  Discard Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* List Area */}
      <div className="flex flex-col gap-6">
        <div className="px-6 py-4 flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 leading-none">Question List</h2>
          <span className="badge badge-primary">{questions.length} Items Total</span>
        </div>

        {questions.length === 0 ? (
          <div className="p-20 text-center card bg-white border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No questions found for this quiz.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, idx) => (
              <div key={question.quesId} className="card p-8 group hover:border-indigo-100 transition-all duration-300">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                      {idx + 1}
                    </span>
                    <div className="max-w-2xl">
                      <p className="text-lg font-bold text-slate-900 mb-4 leading-relaxed">{question.content}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {[1, 2, 3, 4].map(opt => {
                          const val = question[`option${opt}`];
                          const isCorrect = val === question.answer;
                          return (
                            <div key={opt} className={`flex items-center gap-3 p-3 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-50/50 border-transparent text-slate-500'}`}>
                              <span className={`text-[10px] font-black uppercase ${isCorrect ? 'text-emerald-400' : 'text-slate-300'}`}>{String.fromCharCode(64 + opt)}</span>
                              <span className={`text-sm ${isCorrect ? 'font-bold' : 'font-medium'}`}>{val}</span>
                              {isCorrect && (
                                <svg className="w-4 h-4 ml-auto text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(question)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(question.quesId)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminQuestions;