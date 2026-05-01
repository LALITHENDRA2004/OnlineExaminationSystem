import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultsByUser } from '../../services/resultService';

function ReviewQuiz() {
    const { rid } = useParams();
    const [result, setResult] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const results = await getResultsByUser();
                const foundResult = results.find(r => r.rid == rid);
                if (foundResult) {
                    setResult(foundResult);
                    if (foundResult.responses) {
                        setQuestions(JSON.parse(foundResult.responses));
                    }
                } else {
                    setError("Failed to load the quiz result.");
                }
            } catch (err) {
                setError("Failed to load quiz data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [rid]);

    if (loading) return (
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <div className="spinner w-12 h-12 mb-6"></div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Quiz Details...</p>
        </div>
    );

    if (error || !result) return (
        <div className="max-w-2xl mx-auto py-20 text-center px-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Error</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">{error || "The requested quiz result does not exist."}</p>
            <Link to="/student/attempts" className="btn-primary inline-flex items-center gap-2 px-8">
                Return to Attempts
            </Link>
        </div>
    );

    const scorePercentage = Math.round((result.marksGot / (result.quiz?.maxMarks || 100)) * 100);

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4">
            {/* Header / Report Overview */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Link to="/student/attempts" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Past Quizzes</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Result Details</span>
                </div>

                <div className="card p-10 overflow-hidden relative border-slate-100 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Quiz Review</h1>
                            <p className="text-indigo-600 font-bold text-xl mb-2">{result.quiz?.title}</p>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Date Attempted</p>
                                    <p className="text-xs font-black text-slate-700">{new Date(result.submitDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                                <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Total Marks</p>
                                    <p className="text-xs font-black text-slate-700">{result.quiz?.maxMarks} Marks</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className={`${scorePercentage >= 50 ? 'text-indigo-600' : 'text-amber-500'}`} strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * scorePercentage) / 100} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-900 leading-none">{scorePercentage}%</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Score</span>
                                </div>
                            </div>
                            <p className="mt-4 font-black text-slate-800 tracking-tight">{result.marksGot} / {result.quiz?.maxMarks} Marks Earned</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <div className="space-y-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                    Questions Review
                    <div className="h-px flex-grow bg-slate-100"></div>
                </h3>

                {questions.map((q, index) => {
                    const isCorrect = q.answer === q.givenAnswer;
                    return (
                        <div key={index} className="card p-8 border-slate-100 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${!q.givenAnswer ? 'bg-amber-400' : isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                            <div className="flex justify-between items-start mb-8">
                                <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg">
                                    {index + 1}
                                </span>
                                <div>
                                    {!q.givenAnswer ? (
                                        <span className="badge badge-warning">NOT ANSWERED</span>
                                    ) : isCorrect ? (
                                        <span className="badge badge-success flex items-center gap-1.5">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            CORRECT
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger flex items-center gap-1.5">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            INCORRECT
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed max-w-2xl">
                                {q.content || "Missing question content."}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                                    if (!opt && !q.content) return null;

                                    const isSelected = q.givenAnswer === opt;
                                    const isRightAnswer = q.answer === opt;

                                    let stateStyle = "bg-slate-50 border-transparent text-slate-500 opacity-60";
                                    let icon = null;

                                    if (isSelected && isRightAnswer) {
                                        stateStyle = "bg-emerald-50 border-emerald-200 text-emerald-800 opacity-100 ring-2 ring-emerald-100";
                                        icon = <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
                                    } else if (isSelected && !isRightAnswer) {
                                        stateStyle = "bg-red-50 border-red-200 text-red-800 opacity-100 ring-2 ring-red-100";
                                        icon = <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
                                    } else if (isRightAnswer) {
                                        stateStyle = "bg-emerald-100/50 border-emerald-200 text-emerald-900 opacity-100 border-dashed";
                                        icon = <div className="text-[8px] font-black text-emerald-600 uppercase border border-emerald-200 px-1 rounded">Correct Answer</div>;
                                    }

                                    return (
                                        <div key={i} className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${stateStyle}`}>
                                            <span className={`text-[10px] font-black uppercase ${isSelected || isRightAnswer ? 'text-current' : 'text-slate-300'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="text-sm font-bold flex-grow">{opt || `Option ${i + 1}`}</span>
                                            {icon}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                                <div className="bg-white p-6 flex flex-col items-center">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Your Answer</p>
                                    <p className={`text-lg font-black ${!q.givenAnswer ? 'text-amber-600' : isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {q.givenAnswer || 'Not Answered'}
                                    </p>
                                </div>
                                <div className="bg-white p-6 flex flex-col items-center">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Correct Answer</p>
                                    <p className="text-lg font-black text-emerald-600">
                                        {q.answer || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 flex justify-center">
                <Link to="/student/attempts" className="btn-primary px-12 h-14 flex items-center justify-center gap-3 group shadow-indigo-200 shadow-2xl">
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 19l-7-7 7-7" />
                    </svg>
                    Back to Past Quizzes
                </Link>
            </div>
        </div>
    );
}

export default ReviewQuiz;
