/**
 * AdminUsers.jsx
 * 
 * Purpose:
 * - Displays list of all users for Admin management
 * - Admin can view user details, activate/deactivate users, and edit roles
 * 
 * TODO: Fetch users list from backend API
 * TODO: Implement search functionality to filter users
 * TODO: Add activate/deactivate user logic with API call
 * TODO: Add edit role functionality with modal or form
 * TODO: Add pagination for large user lists
 * TODO: Add loading state while fetching data
 * TODO: Add confirmation dialog before activating/deactivating users
 */

import React from 'react';

function AdminUsers() {
  // TODO: Replace with actual data from backend API
  const users = [
    {
      id: 1,
      username: "john_doe",
      email: "john.doe@example.com",
      role: "STUDENT",
      status: "ACTIVE"
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane.smith@example.com",
      role: "STUDENT",
      status: "ACTIVE"
    },
    {
      id: 3,
      username: "admin_user",
      email: "admin@example.com",
      role: "ADMIN",
      status: "ACTIVE"
    },
    {
      id: 4,
      username: "mike_jones",
      email: "mike.jones@example.com",
      role: "STUDENT",
      status: "DISABLED"
    },
    {
      id: 5,
      username: "sarah_williams",
      email: "sarah.williams@example.com",
      role: "STUDENT",
      status: "ACTIVE"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Users</h1>
          <p className="text-lg text-slate-600">View and manage all registered users in the system.</p>
        </div>
        <button 
          className="px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200 shadow-sm"
          aria-label="Add new user"
        >
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-slate-700">{user.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{user.username}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                      aria-label={`View ${user.username}`}
                    >
                      View
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors duration-200"
                      aria-label={`Disable ${user.username}`}
                    >
                      Disable
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;