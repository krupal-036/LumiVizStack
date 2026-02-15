import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Helper to trigger re-renders on route change

  // Load user from localStorage whenever location changes
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]); // Dependency added to re-check login status on navigation

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 z-20 w-full h-16 border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full ">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold text-gray-900 dark:text-white"
        >
          LumiVizStack
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-300">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link to="/visualize" className="hover:text-blue-500">
            Visualize
          </Link>
          <Link to="/about" className="hover:text-blue-500">
            About
          </Link>
          <Link to="/history" className="hover:text-blue-500">
            History
          </Link>

          {/* Auth Section */}
          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="flex items-center font-bold rounded-lg text-sm w-24 h-8 bg-[#05720f] text-[#ffffff] justify-center hover:opacity-90 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center font-bold rounded-lg text-sm w-24 h-8 bg-[#003a96] text-[#ffffff] justify-center hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <FiUser className="text-lg" />
              <span className="font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-600 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <FiSun className="text-yellow-400 text-xl" />
            ) : (
              <FiMoon className="text-gray-800 text-xl" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-slate-300 dark:border-slate-700">
          <div className="flex flex-col p-4 gap-4 text-gray-700 dark:text-gray-300">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/visualize" onClick={() => setMenuOpen(false)}>
              Visualize
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/history" onClick={() => setMenuOpen(false)}>
              History
            </Link>

            {!user ? (
              <div className="flex flex-col gap-3 mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#05720f] text-white text-center py-2 rounded font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#003a96] text-white text-center py-2 rounded font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 font-semibold">
                  <FiUser /> {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-semibold"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}