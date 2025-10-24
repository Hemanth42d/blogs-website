import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">MV Hemanth</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdminRoute && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/blog"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
                <Link
                  to="/newsletter"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Newsletter
                </Link>
              </>
            )}

            {isAdminRoute && isAuthenticated && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/create"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Create Blog
                </Link>
              </>
            )}

            {/* Auth Actions - Only show logout when authenticated on admin routes */}
            {isAuthenticated && isAdminRoute && (
              <Button variant="ghost" onClick={handleLogout} size="sm">
                Logout
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
