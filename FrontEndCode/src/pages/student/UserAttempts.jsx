/**
 * UserAttempts.jsx
 * 
 * Purpose:
 * - Displays a list of all quiz attempts by the logged-in student.
 * - Shows Quiz Title, Marks Scored, Max Marks, Date, and Active Status.
 */

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
                setError("Failed to load your attempts.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-slate-600">Loading attempts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <p className="text-lg text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-2">My Attempts</h1>
                <p className="text-lg text-slate-600">Review your past performance and scores.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {results.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-lg text-slate-600">No attempts found yet. Go take a quiz!</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Quiz Title</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Marks Obtained</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Max Marks</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Date</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {results.map((result, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{result.quiz ? result.quiz.title : 'Unknown Quiz'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{result.quiz?.category ? result.quiz.category.title : 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-indigo-700">{result.marksGot}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{result.quiz ? result.quiz.maxMarks : 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {result.submitDate ? new Date(result.submitDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <Link
                                            to={`/results/review/${result.rId}`}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                        >
                                            Review
                                        </Link>
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

export default UserAttempts;
