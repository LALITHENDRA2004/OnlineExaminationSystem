import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getResultsByUser } from '../../services/resultService';

function UserAttempts() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getResultsByUser();
                setResults(data);
            } catch (err) {
                setError("Failed to load your past quiz attempts.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
            <div className="spinner w-10 h-10 mb-4"></div>
            <p className="text-slate-500 font-medium italic">Synchronizing audit logs...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Past Quizzes</h1>
                    <p className="text-lg text-slate-600">View your past quiz attempts and results.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/student/quizzes" className="btn-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Take a Quiz
                    </Link>
                </div>
            </div>

            <div className="table-container shadow-2xl border-slate-100 mb-10 overflow-hidden">
                {results.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">No History Detected</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">You have not attempted any quizzes yet. Complete a quiz to see results here.</p>
                        <Link to="/student/quizzes" className="btn-ghost text-indigo-600 font-bold hover:bg-indigo-50">Browse Quizzes</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th text-left">Quiz Title</th>
                                    <th className="table-th text-center">Record Index</th>
                                    <th className="table-th text-center">Performance Data</th>
                                    <th className="table-th text-center">Temporal Marker</th>
                                    <th className="table-th text-right">Administrative</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results.map((result, index) => {
                                    const percentage = Math.round((result.marksGot / (result.quiz?.maxMarks || 100)) * 100);
                                    let statusColor = "badge-primary";
                                    if (percentage >= 80) statusColor = "badge-success";
                                    else if (percentage < 40) statusColor = "badge-danger";
                                    else if (percentage < 60) statusColor = "badge-warning";

                                    return (
                                        <tr key={index} className="table-row group">
                                            <td className="table-td">
                                                <div className="flex flex-col">
                                                    <p className="font-bold text-slate-900 mb-0.5">{result.quiz ? result.quiz.title : 'Unknown Quiz'}</p>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.quiz?.category?.title || 'UNCATEGORIZED'}</span>
                                                </div>
                                            </td>
                                            <td className="table-td text-center font-mono text-[10px] text-slate-400">
                                                #{result.rid || '0000'}
                                            </td>
                                            <td className="table-td">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-black text-slate-800">{result.marksGot} / {result.quiz?.maxMarks}</span>
                                                        <span className={`badge ${statusColor} scale-90`}>{percentage}%</span>
                                                    </div>
                                                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 40 ? 'bg-indigo-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="table-td text-center">
                                                <p className="text-sm font-bold text-slate-700">{result.submitDate ? new Date(result.submitDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</p>
                                                <p className="text-[10px] font-bold text-slate-400 leading-none mt-1">{result.submitDate ? new Date(result.submitDate).toLocaleTimeString(undefined, { timeStyle: 'short' }) : ''}</p>
                                            </td>
                                            <td className="table-td text-right">
                                                <Link
                                                    to={`/results/review/${result.rid}`}
                                                    className="btn-ghost btn-sm text-indigo-600 font-bold hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    Review Audit
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Insight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 bg-indigo-600 text-white shadow-indigo-200">
                    <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest mb-2">Total Quizzes</p>
                    <p className="text-3xl font-black">{results.length}</p>
                </div>
                <div className="card p-6 border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Average Accuracy</p>
                    <p className="text-3xl font-black text-slate-900">
                        {results.length > 0
                            ? Math.round(results.reduce((acc, r) => acc + (r.marksGot / (r.quiz?.maxMarks || 100)), 0) / results.length * 100)
                            : 0}%
                    </p>
                </div>
                <div className="card p-6 border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verification</p>
                    <p className="text-xl font-bold text-emerald-500 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .3l7.834 4.6a1 1 0 01.5.866v7.468a1 1 0 01-.5.866L10 18.7l-7.834-4.6a1 1 0 01-.5-.866V5.766a1 1 0 01.5-.866zM9 11l3-3 1.5 1.5L9 14l-2.5-2.5L8 10l1 1z" clipRule="evenodd" /></svg>
                        SECURE
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserAttempts;
