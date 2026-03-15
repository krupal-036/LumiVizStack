import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/customHooks";

import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiBarChart2,
  FiClock,
  FiInfo,
  FiBookOpen,
  FiServer,
} from "react-icons/fi";

const navLinks = [
  { path: "/", label: "Home", icon: FiHome },
  {
    path: "/visualize",
    label: "Visualize",
    icon: FiBarChart2,
    protected: true,
  },
  { path: "/history", label: "History", icon: FiClock, protected: true },
  { path: "/about", label: "About", icon: FiInfo },
  { path: "/guide", label: "Guide", icon: FiBookOpen },
  { path: "/docs/api", label: "API Docs", icon: FiServer },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0B0F19]/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
            <FiBarChart2 size={18} />
          </div>

          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            LumiVizStack
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition
                ${
                  isActive(link.path)
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition
              ${
                isActive("/admin")
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <FiUser size={16} />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                  <FiUser size={16} />
                  <span className="max-w-[90px] truncate">
                    {user.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0B0F19]">
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive(link.path)
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiUser size={18} />
                Admin
              </Link>
            )}

            <div className="border-t border-gray-200 dark:border-gray-800 my-2" />

            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <FiUser size={18} />
                  {user.name || "User"}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-center"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg bg-indigo-600 text-white text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
