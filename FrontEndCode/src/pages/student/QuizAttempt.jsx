import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsForStudent, getQuiz } from '../../services/questionService';
import { BASE_URL } from '../../services/helper';

function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    fetchQuizData();
  }, [id]);

  useEffect(() => {
    if (quiz) {
      const totalSeconds = (quiz.timer && quiz.timer > 0)
        ? quiz.timer * 60
        : (quiz.numberOfQuestions * 2 * 60);
      setTimer(totalSeconds);
    }
  }, [quiz]);

  useEffect(() => {
    if (timer > 0 && !submitting) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timer, submitting]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [quizData, questionsData] = await Promise.all([
        getQuiz(id),
        getQuestionsForStudent(id)
      ]);

      if (!quizData.active) {
        setError('This quiz is not currently active.');
        return;
      }

      setQuiz(quizData);
      setQuestions(questionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].quesId]: answer
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const autoSubmit = () => {
    console.log("Time up! Auto-submitting...");
    handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm('Ready to finalize? You cannot change your answers after submission.')) {
      return;
    }

    try {
      setSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const questionsWithAnswers = questions.map(q => ({
        quesId: q.quesId,
        givenAnswer: answers[q.quesId] || null,
        quiz: { qid: parseInt(id) }
      }));

      const response = await fetch(`${BASE_URL}/question/eval-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionsWithAnswers)
      });

      if (!response.ok) throw new Error('Submission failed at server');

      const result = await response.json();
      const resultWithMaxMarks = { ...result, totalMarks: quiz.maxMarks };

      navigate(`/results/${id}`, {
        state: {
          result: resultWithMaxMarks,
          quizTitle: quiz.title,
          isAutoSubmit: isAuto
        }
      });
    } catch (err) {
      alert('Error submitting: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-screen -mt-20">
      <div className="spinner w-12 h-12 mb-4"></div>
      <p className="text-xl font-bold text-slate-700">Initializing secure environment...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="alert alert-error">
        <p className="font-bold">Access Terminated: {error}</p>
      </div>
      <button onClick={() => navigate('/quizzes')} className="btn-secondary mt-6">Return to Safe Area</button>
    </div>
  );

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.quesId];
  const progress = ((Object.keys(answers).length) / questions.length) * 100;

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-120px)] animate-fade-in flex flex-col">
      {/* Top sticky bar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-primary">{quiz.category?.title}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">In Progress</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-none">{quiz.title}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-slate-900">{Math.round(progress)}%</span>
                <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-xl border-2 flex items-center gap-3 shadow-sm ${timer < 60 ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-50 border-slate-100'}`}>
              <svg className={`w-6 h-6 ${timer < 60 ? 'text-red-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest leading-none mb-0.5 ${timer < 60 ? 'text-red-700' : 'text-slate-400'}`}>Remaining</p>
                <p className={`text-xl font-black font-mono leading-none ${timer < 60 ? 'text-red-600' : 'text-slate-900'}`}>{formatTime(timer)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start flex-grow">
        {/* Left: Question Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="card shadow-elevated p-10 border-indigo-100 bg-white min-h-[400px] flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
                {currentQuestionIndex + 1}
              </span>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
              {currentQuestion.content}
            </h2>

            <div className="grid grid-cols-1 gap-4 mt-auto">
              {[1, 2, 3, 4].map((i) => {
                const optVal = currentQuestion[`option${i}`];
                const isSelected = selectedAnswer === optVal;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(optVal)}
                    className={`
                      group relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-4 ring-indigo-50'
                        : 'border-slate-100 bg-slate-50/30 hover:border-indigo-200 hover:bg-white hover:shadow-lg'
                      }
                    `}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`
                        w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all
                        ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'}
                      `}>
                        {String.fromCharCode(64 + i)}
                      </div>
                      <span className={`text-lg transition-colors ${isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                        {optVal}
                      </span>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="btn-secondary h-14 px-8 disabled:opacity-30 flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn-secondary h-14 px-8 disabled:opacity-30 flex items-center gap-3"
            >
              <span>Next Question</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Question Navigator */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="card shadow-lg p-6 bg-slate-50/50 border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest flex items-center justify-between">
              Question Palette
              <span className="text-[10px] text-slate-400">Total {questions.length}</span>
            </h3>

            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const isAnswered = answers[q.quesId] !== undefined;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.quesId}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`
                      w-full aspect-square rounded-xl text-sm font-extrabold transition-all border-2
                      ${isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110 z-10'
                        : isAnswered
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600'
                      }
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <div className="w-4 h-4 rounded bg-indigo-600"></div> Current Question
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <div className="w-4 h-4 rounded-md border-2 border-emerald-100 bg-emerald-50"></div> Answered
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <div className="w-4 h-4 rounded-md border-2 border-slate-200 bg-white"></div> Unanswered
              </div>
            </div>
          </div>

          <div className="card shadow-lg p-6 bg-indigo-600 border-indigo-700 text-white">
            <h4 className="font-bold mb-2">Finish Quiz</h4>
            <p className="text-xs text-indigo-100 mb-6 leading-relaxed">Ensure you have reviewed all questions before final submission.</p>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn-success w-full h-14 !bg-white !text-indigo-600 hover:!bg-indigo-50 border-none shadow-xl shadow-indigo-800/20"
            >
              {submitting ? 'Processing...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;