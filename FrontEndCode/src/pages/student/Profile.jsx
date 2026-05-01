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
    const localUser = getUser();
    if (localUser) {
      setUser(localUser);
      setFormData(localUser);
    }

    getCurrentUser().then(serverUser => {
      setUser(serverUser);
      setFormData(serverUser);
      updateLocalUser(serverUser);
    }).catch(error => {
      console.error("Profile synchronization failure", error);
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

    try {
      const payload = {
        id: formData.id,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profile: formData.profile
      };

      await updateUser(payload);
      const freshUser = await getCurrentUser();

      setUser(freshUser);
      updateLocalUser(freshUser);
      setEditMode(false);
    } catch (error) {
      console.error("Profile update failure", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="spinner w-10 h-10 mb-4"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Profile Information...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in px-4">
      {/* Profile Header Card */}
      <div className="card p-10 mb-10 overflow-hidden relative border-slate-100 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full -mr-40 -mt-40 opacity-40"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-105">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase">@{user.username}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="badge badge-primary scale-90">{user.authorities ? user.authorities[0].authority : 'Standard User'}</span>
            </div>

            {!editMode && (
              <div className="mt-8">
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-primary h-11 px-8 shadow-indigo-100 shadow-xl"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="card p-8 border-slate-100 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-8 border-b border-slate-50 pb-4">
            {editMode ? 'Edit Account Details' : 'Account Information'}
          </h2>

          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest mb-2 block">First Name</label>
                  <input
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    className="input-field h-12"
                    placeholder="e.g. John"
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest mb-2 block">Last Name</label>
                  <input
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    className="input-field h-12"
                    placeholder="e.g. Doe"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest mb-2 block">Email Address</label>
                  <input
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="input-field h-12"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="label text-[10px] font-black uppercase tracking-widest mb-2 block">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="input-field h-12"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-14 flex-grow font-black text-sm uppercase tracking-widest"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setFormData(user); }}
                  className="btn-ghost h-14 px-8 text-slate-400 font-bold hover:text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User ID</p>
                  <p className="font-mono text-sm font-bold text-slate-900 tracking-tight">#{user.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Username</p>
                  <p className="text-sm font-bold text-slate-900 tracking-tight">@{user.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-lg font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-bold text-slate-900 underline decoration-indigo-100 decoration-2 underline-offset-4">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-sm font-bold text-slate-900">{user.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
