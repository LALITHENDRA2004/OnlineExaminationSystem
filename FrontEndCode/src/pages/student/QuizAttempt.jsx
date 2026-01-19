/**
 * QuizAttempt.jsx
 * 
 * Purpose:
 * - Quiz attempt screen where students answer questions
 * - Displays questions with multiple-choice options
 * 
 * TODO: Implement timer logic with countdown
 * TODO: Auto-submit quiz when timer expires
 * TODO: Add confirmation dialog before quiz submission
 */

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchQuizData();
  }, [id]);

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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit the quiz? You cannot change your answers after submission.')) {
      return;
    }

    try {
      setSubmitting(true);

      // Prepare questions with given answers
      const questionsWithAnswers = questions.map(q => ({
        quesId: q.quesId,
        givenAnswer: answers[q.quesId] || null,
        quiz: { qId: parseInt(id) }
      }));

      // Call eval-quiz API
      const response = await fetch(`${BASE_URL}/question/eval-quiz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionsWithAnswers)
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();

      // Navigate to result page with result data
      // Inject maxMarks from quiz object into the result or state
      const resultWithMaxMarks = { ...result, totalMarks: quiz.maxMarks };
      navigate(`/results/${id}`, { state: { result: resultWithMaxMarks, quizTitle: quiz.title } });
    } catch (err) {
      alert('Failed to submit quiz: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">No questions available for this quiz.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.quesId];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{quiz.title}</h1>
        {/* TODO: Implement countdown timer */}
        <div className="bg-amber-100 border border-amber-300 px-6 py-3 rounded-lg">
          <p className="text-lg font-bold text-amber-800" aria-label="Time remaining">
            No time limit
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-slate-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-sm font-semibold text-slate-600">
            Answered: {Object.keys(answers).length} / {questions.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 mb-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h2 className="text-2xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.content}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-4">
          {[
            { key: 'option1', value: currentQuestion.option1 },
            { key: 'option2', value: currentQuestion.option2 },
            { key: 'option3', value: currentQuestion.option3 },
            { key: 'option4', value: currentQuestion.option4 }
          ].map((option, index) => (
            <div
              key={option.key}
              onClick={() => handleAnswerSelect(option.value)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedAnswer === option.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              aria-label={`Option ${index + 1}`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${selectedAnswer === option.value
                  ? 'border-indigo-700 bg-indigo-700'
                  : 'border-gray-300'
                  }`}>
                  {selectedAnswer === option.value && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-lg text-slate-700 font-medium">{option.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 ${currentQuestionIndex === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          aria-label="Previous question"
        >
          Previous
        </button>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 ${submitting
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          aria-label="Submit quiz"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors duration-200 ${currentQuestionIndex === questions.length - 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-700 text-white hover:bg-indigo-800'
            }`}
          aria-label="Next question"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default QuizAttempt;