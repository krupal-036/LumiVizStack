// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { FiGithub } from "react-icons/fi";

// Keep footer links in sync with Navbar (single source of truth)
const footerLinks = [
  { path: "/", label: "Home" },
  { path: "/visualize", label: "Visualize" },
  { path: "/history", label: "History" },
  { path: "/about", label: "About" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <Link
            to="/"
            className="text-lg font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
          >
            LumiVizStack
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* GitHub Icon */}
          <a
            href="https://github.com/Krupal-036/lumivizstack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <FiGithub size={20} />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {currentYear} LumiVizStack. All rights reserved.</p>
          
          {/* Developer Credit */}
          <p>
            Developed by{" "}
            <a 
              href="https://krupal.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              Krupal
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
