/**
 * Profile.jsx
 * 
 * Purpose:
 * - Displays profile information of the logged-in user
 * - Allows user to edit their profile details
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getCurrentUser, doLogout, setUser as updateLocalUser } from '../../services/authService';
import { updateUser } from '../../services/userService';

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load from local storage first for speed
    const localUser = getUser();
    if (localUser) {
      setUser(localUser);
      setFormData(localUser);
    }

    // Always fetch fresh data from server to ensure we have ID and latest details
    getCurrentUser().then(serverUser => {
      setUser(serverUser);
      setFormData(serverUser);
      updateLocalUser(serverUser); // Update local storage
    }).catch(error => {
      console.error("Failed to load user profile", error);
    });
  }, []);

  const handleLogout = () => {
    doLogout(() => {
      navigate('/login');
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // DEBUG: Check if we have ID
    if (!formData.id) {
      alert("Error: User ID is missing in form data! Update might fail.");
      console.error("Missing ID", formData);
    } else {
      console.log("Updating User ID:", formData.id);
    }

    try {
      // Create a clean payload with only updatable fields + ID
      // This prevents sending authorities/roles which cause backend deserialization errors
      const payload = {
        id: formData.id,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profile: formData.profile
      };

      const result = await updateUser(payload);
      if (!result) {
        throw new Error("Update failed: Server returned no data. User ID might be incorrect.");
      }

      // Fetch fresh data from server to ensure we have complete object
      const freshUser = await getCurrentUser();

      setUser(freshUser);
      updateLocalUser(freshUser); // Update local storage
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-lg text-slate-600">View and manage your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {editMode ? 'Edit Profile' : 'Account Details'}
        </h2>

        {!editMode ? (
          // View Mode
          <div className="space-y-5">
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Username</span>
              <span className="text-lg font-medium text-slate-800">{user.username}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">First Name</span>
              <span className="text-lg font-medium text-slate-800">{user.firstName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Last Name</span>
              <span className="text-lg font-medium text-slate-800">{user.lastName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Email</span>
              <span className="text-lg font-medium text-slate-800">{user.email}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Phone</span>
              <span className="text-lg font-medium text-slate-800">{user.phone}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center">
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Role</span>
              <span className="inline-block px-4 py-2 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-lg w-fit">
                {user.authorities ? user.authorities[0].authority : 'User'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
                aria-label="Edit profile"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          // Edit Mode Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                <input name="firstName" value={formData.firstName || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                <input name="lastName" value={formData.lastName || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
              <input name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setEditMode(false); setFormData(user); }}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Profile;
