import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const StudentLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Navbar at the top */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
                <Outlet />
            </main>

            {/* Optional Footer can go here */}
            <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} Online Examination System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default StudentLayout;
