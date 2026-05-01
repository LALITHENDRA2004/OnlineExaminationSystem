import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/userService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
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
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Manage Users</h1>
          <p className="text-lg text-slate-600">Administrative control over system participants.</p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 h-11"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="spinner w-10 h-10 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading users...</p>
        </div>
      ) : (
        <div className="table-container shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-th w-20 text-center">ID</th>
                  <th className="table-th text-left">Account Info</th>
                  <th className="table-th text-left">Contact Metadata</th>
                  <th className="table-th text-center">Status</th>
                  <th className="table-th text-right">Administrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <p className="text-slate-400 font-medium">No system participants match your current query.</p>
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="mt-2 text-indigo-600 font-bold hover:underline">
                          Clear search constraints
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="table-row group">
                      <td className="table-td text-center font-mono text-xs text-slate-400">
                        #{user.id}
                      </td>
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            {user.profile ? (
                              <span className="text-xs font-bold text-slate-400">IMG</span>
                            ) : (
                              <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{user.firstName} {user.lastName}</p>
                            <p className="text-xs font-semibold text-slate-400 tracking-wider">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {user.email}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {user.phone || 'No contact number'}
                          </p>
                        </div>
                      </td>
                      <td className="table-td text-center">
                        <span className={`badge ${user.enabled ? 'badge-success' : 'badge-danger'}`}>
                          {user.enabled ? 'Live' : 'Decoupled'}
                        </span>
                      </td>
                      <td className="table-td text-right">
                        <button
                          onClick={() => handleView(user)}
                          className="btn-ghost btn-sm text-indigo-600 font-bold hover:bg-indigo-50"
                        >
                          Review Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-indigo-600 p-8 text-white relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-indigo-700/50 flex items-center justify-center hover:bg-indigo-800 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black">{selectedUser.firstName} {selectedUser.lastName}</h2>
                  <p className="text-indigo-100 font-bold tracking-widest text-xs uppercase">System ID: #{selectedUser.id}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Username</label>
                  <p className="font-bold text-slate-800">@{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact Metadata</label>
                  <p className="font-bold text-slate-800">{selectedUser.phone || 'Not available'}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Directive</label>
                <p className="font-bold text-slate-800 underline decoration-indigo-100 decoration-2 underline-offset-4">{selectedUser.email}</p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedUser.enabled ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'} shadow-lg`}></div>
                    <span className="font-black text-slate-900 tracking-tight">{selectedUser.enabled ? 'LIVE AND SECURE' : 'ACCESS REVOKED'}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="btn-primary"
                >
                  Finalize Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;