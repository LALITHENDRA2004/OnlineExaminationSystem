import { Link, useNavigate } from 'react-router-dom';
import { doLogout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    doLogout(() => {
      setUser(null);
      navigate('/login');
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to={user && user?.authorities?.[0]?.authority === 'ADMIN' ? "/admin/dashboard" : "/student/dashboard"}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              aria-label="Home"
            >
              Online Examination System
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {user && user?.authorities?.[0]?.authority === 'ADMIN' ? (
              // Admin Links - mostly handled by sidebar, but could have top-level shortcuts
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Admin Home
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              // Student Links
              <>
                <Link
                  to="/student/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/quizzes"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Quizzes
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Register</Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;