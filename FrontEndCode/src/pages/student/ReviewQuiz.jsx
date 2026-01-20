import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
                const foundResult = results.find(r => r.rId == rid);
                if (foundResult) {
                    setResult(foundResult);
                    if (foundResult.responses) {
                        setQuestions(JSON.parse(foundResult.responses));
                    }
                } else {
                    setError("Result not found.");
                }
            } catch (err) {
                setError("Failed to load result.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [rid]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-10 text-center">
                <p className="text-lg text-slate-600">Loading your review...</p>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="max-w-5xl mx-auto py-10 text-center">
                <p className="text-lg text-red-600">{error || "Result not found"}</p>
                <Link to="/student/attempts" className="mt-4 inline-block text-indigo-600 hover:underline">Back to My Attempts</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Review: {result.quiz?.title}</h1>
                <div className="flex gap-4 text-slate-600">
                    <p>Score: <span className="font-bold text-indigo-700">{result.marksGot} / {result.quiz?.maxMarks}</span></p>
                    <p>Date: <span className="font-semibold">{new Date(result.submitDate).toLocaleDateString()}</span></p>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((q, index) => {
                    const isCorrect = q.answer === q.givenAnswer;
                    return (
                        <div key={index} className={`bg-white rounded-xl border-2 p-6 shadow-sm ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-sm font-semibold text-slate-500 uppercase">Question {index + 1}</p>
                                {q.givenAnswer ? (
                                    isCorrect ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Correct</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Incorrect</span>
                                    )
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Not Attempted</span>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 mb-6">
                                {q.content || "Question content missing (Legacy attempt)"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                                    if (!opt && !q.content) return null; // Skip empty options in legacy data

                                    const isSelected = q.givenAnswer === opt;
                                    const isRightAnswer = q.answer === opt;

                                    let bgClass = "bg-white border-gray-200";
                                    let borderClass = "border-gray-200";
                                    let textClass = "text-slate-700";

                                    if (isSelected && isRightAnswer) {
                                        bgClass = "bg-green-50";
                                        borderClass = "border-green-500";
                                        textClass = "text-green-800 font-semibold";
                                    } else if (isSelected && !isRightAnswer) {
                                        bgClass = "bg-red-50";
                                        borderClass = "border-red-500";
                                        textClass = "text-red-800 font-semibold";
                                    } else if (isRightAnswer) {
                                        bgClass = "bg-green-50";
                                        borderClass = "border-green-200";
                                        textClass = "text-green-700 font-semibold";
                                    }

                                    return (
                                        <div key={i} className={`p-4 border-2 rounded-lg ${bgClass} ${borderClass} ${textClass}`}>
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                                                </div>
                                                <span>{opt || `Option ${i + 1}`}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm flex flex-col gap-2">
                                <p><span className="font-semibold text-slate-600">Your Answer:</span> <span className={isCorrect ? "text-green-700 font-bold" : "text-red-700 font-bold"}>{q.givenAnswer || 'Not Attempted'}</span></p>
                                <p><span className="font-semibold text-slate-600">Correct Answer:</span> <span className="text-green-700 font-bold">{q.answer || 'N/A'}</span></p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 text-center">
                <Link to="/student/attempts" className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-shadow">
                    Back to All Attempts
                </Link>
            </div>
        </div>
    );
}

export default ReviewQuiz;
