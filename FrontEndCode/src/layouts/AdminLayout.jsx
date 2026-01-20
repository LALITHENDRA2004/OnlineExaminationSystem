import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Navbar from '../components/common/Navbar';

const AdminLayout = () => {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar at the top */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar on the left */}
                <div className="hidden md:block">
                    <AdminSidebar />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-gray-50 p-6 md:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
