// src/components/layout/Footer.jsx
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              LumiVizStack
            </h2>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Transforming complex data into clear, interactive visualizations.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-white transition-colors">
                <FiTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-white transition-colors">
                <FiGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-white transition-colors">
                <FiLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 col-span-2 lg:col-span-3">
             <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li><Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">Features</Link></li>
                <li><Link to="/visualize" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">Visualizer</Link></li>
                <li><Link to="/history" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">History</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-200 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">About</Link></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-center text-xs text-gray-400">
            © {currentYear} LumiVizStack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;