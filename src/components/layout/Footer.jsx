// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiHeart, FiCode } from "react-icons/fi";

// Keep footer links in sync with Navbar
const footerLinks = [
  { path: "/", label: "Home" },
  { path: "/visualize", label: "Visualize" },
  { path: "/history", label: "History" },
  { path: "/about", label: "About" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Column 1: Brand (Spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 w-fit hover:opacity-80 transition-opacity"
            >
              LumiVizStack
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Bridging the gap between raw data and meaningful insights through interactive visualization.
            </p>
          </div>

          {/* Column 2: Navigation (Spans 6 cols, centered) */}
          <div className="md:col-span-6 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 w-full">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Developer & Social (Spans 3 cols) */}
          <div className="md:col-span-3 flex flex-col space-y-6">

            {/* GitHub Link */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Source Code
              </h3>
              <a
                href="https://github.com/Krupal-036/lumivizstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group"
              >
                <FiGithub className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">View on GitHub</span>
              </a>
            </div>

            {/* Developer Credit Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-1 flex items-center gap-1">
                <FiCode className="w-3 h-3" /> Developed by
              </p>
              <a
                href="https://krupal.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2"
              >
                Krupal
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>&copy; {currentYear} LumiVizStack. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Made with <FiHeart className="w-3.5 h-3.5 text-red-500 animate-pulse" /> for developers.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;