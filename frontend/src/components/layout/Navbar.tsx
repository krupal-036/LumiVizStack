import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/customHooks";
import type { IconType } from "react-icons";
import {
  FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser, FiHome,
  FiBarChart2, FiClock, FiInfo, FiBookOpen, FiServer, FiZap, FiChevronRight
} from "react-icons/fi";

type NavLink = {
  path: string;
  label: string;
  icon: IconType;
  protected?: boolean;
};

const baseNavLinks: NavLink[] = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/visualize", label: "Visualize", icon: FiBarChart2, protected: true },
  { path: "/history", label: "History", icon: FiClock, protected: true },
  { path: "/about", label: "About", icon: FiInfo },
  { path: "/guide", label: "Guide", icon: FiBookOpen },
  { path: "/docs/api", label: "API", icon: FiServer },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, credits } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = user?.role === "admin"
    ? [...baseNavLinks, { path: "/admin", label: "Admin", icon: FiUser }]
    : baseNavLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    navLinks.filter(n => n.label !== "Admin");
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-2 sm:py-4"
      }`}>
      <div className={`mx-auto max-w-screen-2xl z-70 px-0 md:px-2 transition-all duration-300`}>
        <div className={`flex items-center justify-between px-4 h-16 rounded-2xl border transition-all duration-300 ${scrolled
          ? menuOpen ? "bg-white/80 dark:bg-slate-900/80 z-70 border-slate-200 dark:border-slate-800 shadow-lg" : "backdrop-blur-md bg-white/80 dark:bg-slate-700/50 z-70 border-slate-200 dark:border-slate-800 shadow-lg"
          : "bg-transparent z-70 border-transparent"
          }`}>

          <Link to="/"
            title="LumiVizStack | Transform complex JSON data into interactive visual architectures"
            className="flex items-center z-70 gap-2 group">
            <div className="relative">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl transition-colors">
                <FiZap size={22} className="fill-current" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Lumi
              <span className="text-indigo-500">Viz</span>
              <span className="font-normal text-gray-500 dark:text-slate-500">Stack</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-300 dark:border-slate-500">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={active ? `Currently viewing ${link.label}` : `Navigate to ${link.label}`}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${active
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300"
                    }`}
                >
                  <link.icon size={16} className={active ? "text-indigo-600 dark:text-indigo-300" : ""} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 z-70 sm:gap-3">
            {(user && credits !== null && user.role !== "admin") && (
              <div
                className={`flex flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-300 ${credits === 0
                  ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 animate-pulse"
                  : "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  }`}
                title={credits === 0 ? "You're out of credits!" : `You've got ${credits || 0} credits left to use today!`}
              >
                <FiZap
                  size={14}
                  className={`shrink-0 ${credits > 0 ? "fill-current animate-bounce duration-2000 delay-500" : "text-slate-400"}`}
                />
                <span className={`flex items-center gap-1 transition-colors duration-300 ${credits === 0
                  ? "text-slate-500"
                  : credits > 5
                    ? "text-emerald-500 dark:text-emerald-400"
                    : credits > 2
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}>
                  {credits ?? 0}
                  <span className={`hidden sm:inline ml-0.5 ${credits === 0 ? "text-slate-400" : "text-indigo-500"}`}>
                    {credits === null ? "No Credits" : "Credits"}
                  </span>
                </span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              title={`Switch theme to ${theme === "dark" ? "light" : "dark"}`}
              className="p-2.5 rounded-xl z-70 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-all"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 ml-2 pl-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <Link to="/profile" className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">
                        {user.name?.[0] || <FiUser />}
                      </div>
                    </Link>

                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-max px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl border border-slate-700">
                      Hello, {user.name}! 👋
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                    </div>
                  </div>

                  <button onClick={handleLogout} title={`See you soon, ${user.name}! Ready to sign out?`} className="text-slate-400 hover:text-red-500 transition-colors">
                    <FiLogOut size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-500 transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 relative z-[70] active:scale-95 transition-transform"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

          </div>
        </div>
      </div>
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-500 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="absolute inset-0 bg-white dark:bg-slate-950 pt-20 px-6">

          <div className="h-px bg-slate-100 dark:bg-slate-800" />
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isActive(link.path)
                    ? "bg-indigo-50 p-4 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={22} />
                    <span className="text-sm font-semibold">{link.label}</span>
                  </div>
                  <FiChevronRight />
                </Link>
              );
            })}
            {user ? (
              <div className="space-y-0">
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-4 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FiUser size={24} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-bold dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500">View Profile</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 font-bold"
                >
                  <FiLogOut /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center font-bold">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="p-4 rounded-2xl bg-indigo-600 text-white text-center font-bold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
