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

import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/userService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      // Ensure data is array before setting
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid users data received:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };




  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Manage Users</h1>
        <p className="text-lg text-slate-600">View all registered users in the system.</p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Username</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wide">Email</th>
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
                  <button
                    onClick={() => handleView(user)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200"
                    aria-label={`View ${user.username}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-indigo-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-indigo-800 rounded-lg p-2 transition-colors duration-200"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">User ID</label>
                  <p className="text-lg text-slate-800">{selectedUser.id}</p>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Username</label>
                  <p className="text-lg text-slate-800">{selectedUser.username}</p>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">First Name</label>
                  <p className="text-lg text-slate-800">{selectedUser.firstName || 'N/A'}</p>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Last Name</label>
                  <p className="text-lg text-slate-800">{selectedUser.lastName || 'N/A'}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                  <p className="text-lg text-slate-800">{selectedUser.email}</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Phone</label>
                  <p className="text-lg text-slate-800">{selectedUser.phone || 'N/A'}</p>
                </div>

                {/* Profile */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Profile Picture</label>
                  <p className="text-lg text-slate-800">{selectedUser.profile || 'default.png'}</p>
                </div>

                {/* Enabled Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">Account Status</label>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${selectedUser.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedUser.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;