import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser,
  FiHome, FiBarChart2, FiClock, FiInfo
} from "react-icons/fi";

// Scalable Navigation Links Configuration
const navLinks = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/visualize", label: "Visualize", icon: FiBarChart2, protected: true },
  { path: "/history", label: "History", icon: FiClock, protected: true },
  { path: "/about", label: "About", icon: FiInfo },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b-2 border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
          >
            <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <span className="sm:block">LumiVizStack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              // If link is protected and user isn't logged in, don't render it (optional, or render as disabled)
              // For this UX, we render it but the ProtectedRoute handles the logic.
              if (link.protected && !user) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-2 mx-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isActive(link.path)
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border-indigo-500 dark:border-indigo-600 border-b-4"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 border-b-4 dark:hover:text-white border-transparent  hover:border-gray-400 dark:hover:border-gray-600"
                    }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-2 ml-2 rounded-lg px-3 py-1.5">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border-2 border-gray-300 dark:border-gray-600 font-semibold">
                    <FiUser size={14} />
                    <span className="max-w-25 truncate">{user.name || "User"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-600 rounded-full hover:bg-red-100 border-2 border-red-300 dark:border-red-400 dark:hover:bg-red-900/40 transition-colors text-sm font-semibold"
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-green-700 hover:bg-green-300 hover:dark:bg-green-600 dark:hover:text-green-800 border-2 border-gray-300 hover:border-green-600 dark:hover:border-green-800 dark:border-gray-600 rounded-lg text-sm transition-colors font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-800 hover:bg-indigo-300 shadow-sm text-indigo-200 hover:text-indigo-900 dark:text-indigo-300  hover:dark:bg-indigo-300 dark:hover:text-indigo-800 border-2 border-indigo-300 hover:border-indigo-800 dark:hover:border-indigo-800 dark:border-gray-600 rounded-lg text-sm transition-colors font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {/* This creates a smooth slide-down effect on mobile */}
      <div
        className={`md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-900 border-b-2 border-gray-300 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${isActive(link.path)
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          {/* Auth Section Mobile */}
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 w-full px-4 py-3 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FiUser size={20} />
                <span className="font-semibold">{user.name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-base font-semibold"
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-base font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-base font-semibold shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;