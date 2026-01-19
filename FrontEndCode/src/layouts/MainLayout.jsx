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

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/student/StudentSidebar';
import AdminSidebar from '../components/admin/AdminSidebar';
import { getUserRole } from '../services/authService';

function MainLayout() {
  const [role, setRole] = useState(getUserRole());

  useEffect(() => {
    // Optional: listen for storage events or auth changes if needed
    // For now, initial load is sufficient as layout unmounts on logout
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      {role === "ADMIN" ? <AdminSidebar /> : <StudentSidebar />}

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
