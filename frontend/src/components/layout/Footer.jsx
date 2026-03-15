// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiHeart,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0B0F19] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Brand & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
                <FiBarChart2 className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                LumiVizStack
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Transforming complex JSON data into interactive, actionable visual
              insights.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="GitHub"
              >
                <FiGithub size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="Twitter"
              >
                <FiTwitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-white hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors border border-gray-200 dark:border-gray-700"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Visualizer", path: "/visualize" },
                { name: "History", path: "/history" },
                { name: "Guide", path: "/guide" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources & Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", path: "/about" },
                { name: "API Documentation", path: "/docs/api" },
                { name: "System Status", path: "/api/health" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact  */}
            <div className="mt-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 inline-block">
              <Link
                to="https://krupal.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <FiExternalLink className="text-indigo-500" />
                <span>krupal.vercel.app</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} LumiVizStack. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              Built with{" "}
              <FiHeart
                className="text-red-500 fill-red-500 animate-pulse"
                size={14}
              />{" "}
              using React & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
