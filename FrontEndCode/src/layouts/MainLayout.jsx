/**
 * MainLayout.jsx
 *
 * Purpose:
 * - Main layout wrapper for the application
 * - Includes sidebar navigation based on user role
 *
 * TODO: Replace static userRole with actual authentication and role logic
 * TODO: Hide sidebar on public pages (login, register)
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';

function MainLayout() {
  const userRole = "STUDENT"; // TEMP

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      {userRole === "ADMIN" ? <AdminSidebar /> : <StudentSidebar />}

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
