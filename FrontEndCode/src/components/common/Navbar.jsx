import { Link, useNavigate, useLocation } from 'react-router-dom';
import { doLogout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    doLogout(() => {
      setUser(null);
      navigate('/login');
    });
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinkClass = (path) => `
    text-sm font-medium transition-all duration-200 relative pb-1
    ${isActive(path)
      ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-indigo-600'
      : 'text-slate-600 hover:text-indigo-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all after:duration-200 hover:after:w-full'
    }
  `;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to={user && user?.authorities?.[0]?.authority === 'ADMIN' ? "/admin/dashboard" : "/student/dashboard"}
              className="flex items-center gap-2 group"
              aria-label="Home"
            >
              {/* Logo Icon */}
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              {/* Brand Text */}
              <span className="text-xl font-bold text-gradient-primary">
                QuizMaster
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {user && user?.authorities?.[0]?.authority === 'ADMIN' ? (
              // Admin Links
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  Profile
                </Link>
              </>
            ) : (
              // Student Links
              <>
                <Link to="/student/dashboard" className={navLinkClass('/student/dashboard')}>
                  Dashboard
                </Link>
                <Link to="/quizzes" className={navLinkClass('/quizzes')}>
                  Quizzes
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-slate-700">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500">{user.authorities?.[0]?.authority}</p>
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn-danger btn-sm"
                  aria-label="Logout"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
