/**
 * AdminRoute.jsx
 *
 * Purpose:
 * - Allows access only to ADMIN users
 * - Blocks non-admin users from admin routes
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.authorities?.some(
    (auth) => auth.authority === 'ADMIN'
  );

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
