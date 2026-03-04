
import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiHeart, FiCode } from "react-icons/fi";

const footerLinks = [
  { path: "/", label: "Home" },
  { path: "/visualize", label: "Visualize" },
  { path: "/history", label: "History" },
  { path: "/about", label: "About" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t-2 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          <div className="md:col-span-3 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 w-fit hover:opacity-80 transition-opacity"
            >
              LumiVizStack
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Bridging the gap between raw data and meaningful insights through interactive visualization.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col items-start">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 w-full">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 flex flex-col space-y-6">

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white uppercase tracking-wider mb-4">
                Source Code
              </h3>
              <a
                href="https://github.com/Krupal-036/lumivizstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800  text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 group border border-gray-300 dark:border-gray-700"
              >
                <FiGithub className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">View on GitHub</span>
              </a>
            </div>

            <div className="flex flex-inline items-center justify-start md:justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 gap-2">
              <p className="text-xs text-gray-500 dark:text-gray-500 font-bold flex items-center gap-1">
                <FiCode className="w-4 h-4" /> Developed by
              </p>
              <a
                href="https://krupal.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Krupal Fataniya
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
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