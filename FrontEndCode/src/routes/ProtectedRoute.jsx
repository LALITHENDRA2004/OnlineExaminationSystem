/**
 * ProtectedRoute.jsx
 *
 * Purpose:
 * - Guards private routes
 * - Redirects unauthenticated users to /login
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  // While checking auth, don't render routes
  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in → allow access
  return <Outlet />;
}

export default ProtectedRoute;
