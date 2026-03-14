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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16">
      <div className="absolute inset-0 bg-white/30 dark:bg-[#0B0F15]/70 backdrop-blur-xl border-b border-gray-300 dark:border-gray-700/50"></div>

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={handleLinkClick}
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <FiBarChart2 className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
              LumiVizStack
            </span>
          </Link>

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
                    ${
                      isActive(link.path)
                        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                >
                  <link.icon
                    size={16}
                    className={
                      isActive(link.path)
                        ? "text-indigo-600 dark:text-indigo-400"
                        : ""
                    }
                  />
                  {link.label}
                </Link>
              );
            })}
            {user?.role === "admin" ? (
              <Link
                key={"alladmin"}
                to={"/admin"}
                onClick={handleLinkClick}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${
                      isActive("/admin")
                        ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
              >
                <FiUser
                  size={16}
                  className={
                    isActive("admin")
                      ? "text-indigo-600 dark:text-indigo-400"
                      : ""
                  }
                />
                {"Admin"}
              </Link>
            ) : (
              ""
            )}
          </nav>

          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 
               hover:text-indigo-600 dark:hover:text-indigo-400 
               hover:bg-indigo-50 dark:hover:bg-gray-800 
               transition-colors duration-200 border border-gray-300 dark:border-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-full 
                        border border-gray-300 dark:border-gray-700
                        text-gray-600 dark:text-gray-300 bg-indigo-100 dark:bg-indigo-500/20 transition-all duration-200 truncate"
                  >
                    <FiUser size={18} className="text-indigo-400" />
                    <span className="text-sm text-indigo-500 font-medium max-w-[90px] truncate">
                      {user.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center rounded-full px-3 py-1 gap-1 text-red-500 dark:text-red-300
                     hover:text-red-600 dark:hover:text-red-400 bg-red-100 dark:bg-red-900 hover:bg-red-400
                   dark:hover:bg-red-900/20
                     transition-colors duration-200 border border-red-300 dark:border-red-700"
                    title="Logout"
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-1.5 text-sm font-medium rounded-full
                     border border-gray-300 dark:border-gray-700
                     text-gray-600 dark:text-gray-300
                     hover:text-indigo-600 dark:hover:text-indigo-400
                     hover:bg-indigo-50 dark:hover:bg-gray-800
                     transition-colors duration-200"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    className="px-4 py-1.5 text-sm font-medium rounded-full
                     border border-gray-300 dark:border-gray-700
                     text-gray-600 dark:text-gray-300
                     hover:text-indigo-600 dark:hover:text-indigo-400
                     hover:bg-indigo-50 dark:hover:bg-gray-800
                     transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full text-gray-600 dark:text-gray-300
               hover:bg-gray-100 dark:hover:bg-gray-800
               transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
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
                  flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                  ${
                    isActive(link.path)
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }
                `}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
          {user?.role === "admin" ? (
            <Link
              key={"alladmin"}
              to={"/admin"}
              onClick={handleLinkClick}
              className={`
                  flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                  ${
                    isActive("/admin")
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }
                `}
            >
              <FiUser size={20} />
              {"Admin"}
            </Link>
          ) : (
            ""
          )}

          <div className="my-2 border-t border-gray-200 dark:border-gray-800"></div>

          {user ? (
            <div className="flex items-center justify-center pt-2 gap-2">
              <div className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 transition-all duration-200 font-medium">
                <FiUser size={20} className="" />
                <span className="font-medium">{user.name || "User"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 dark:text-red-100 bg-red-200 dark:bg-red-600 transition-all duration-200 font-medium"
              >
                <FiLogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center pt-2 gap-2">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 transition-all duration-200 font-medium"
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
