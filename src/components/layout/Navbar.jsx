import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/customHooks";
import {
  FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser,
  FiHome, FiBarChart2, FiClock, FiInfo
} from "react-icons/fi";

const navLinks = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/visualize", label: "Visualize", icon: FiBarChart2, protected: true },
  { path: "/history", label: "History", icon: FiClock, protected: true },
  { path: "/about", label: "About", icon: FiInfo },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
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

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={handleLinkClick}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              LumiVizStack
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive(link.path)
                      ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    }
                  `}
                >
                  <link.icon size={16} className={isActive(link.path) ? "text-indigo-600 dark:text-indigo-400" : ""} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Theme + Auth) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun size={20} className="rotate-0 transition-transform" /> : <FiMoon size={20} />}
            </button>

            {/* Desktop Auth Buttons / User Profile */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {/* User Pill */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                      <FiUser size={14} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                      {user.name || "User"}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    title="Logout"
                  >
                    <FiLogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="flex flex-col p-4 space-y-1">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }
                `}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}

          <div className="my-2 border-t border-slate-200 dark:border-slate-800"></div>

          {user ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <FiUser size={20} className="text-slate-400" />
                <span className="font-medium">{user.name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
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
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all duration-200"
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