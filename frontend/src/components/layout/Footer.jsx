import React from "react";
import { Link, Links } from "react-router-dom";
import {
  FiBarChart2,
  FiGithub,
  FiMail,
  FiExternalLink,
  FiArrowRight
} from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Home", path: "/" },
      { name: "Visualizer", path: "/visualize" },
      { name: "History", path: "/history" },
      { name: "Guide", path: "/guide" },
    ],
    resources: [
      { name: "About Us", path: "/about" },
      { name: "API Documentation", path: "/docs/api" },
      { name: "System Status", path: "/api/health" },
    ],
    legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
    ]
  };

  return (
    <footer className="w-full bg-white dark:bg-[#030712] border-t border-gray-200 dark:border-gray-800/60 transition-colors duration-300 bottom-0">
      <div className="max-w-full mx-auto px-6 lg:px-16 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2 md:col-span-3">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <FiBarChart2 className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                LumiViz<span className="text-indigo-500">Stack</span>
              </span>
            </Link>
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mb-8">
              The professional standard for transforming complex JSON data into
              beautiful, interactive visual architectures.
            </p>
            <div className="flex items-center gap-3">
              <Link to="https://github.com/krupal-036/LumiVizStack" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 p-3 rounded-xl 
             bg-gray-50 dark:bg-white/5 
             hover:bg-indigo-600 dark:hover:bg-indigo-600 
             border border-gray-200 dark:border-white/10 
             transition-all duration-300" aria-label="Github">
                <FiGithub size={18} className="text-indigo-600 dark:text-indigo-400 
               group-hover:text-white group-hover:scale-110 
               transition-all duration-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 
                   group-hover:text-white transition-colors duration-300">
                  / LumiVizStack
                </span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Product
            </h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <FiArrowRight size={18} className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <FiArrowRight size={18} className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">
              Support
            </h3>
            <div className="space-y-4">
              <Link href="mailto:krupalfataniya007@gmail.com" className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-500/50 transition-colors group w-30 mx-2 font-bold">
                <FiMail className="text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
              </Link>
              <Link href="https://krupal.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700/50 hover:border-indigo-500/50 transition-colors group w-30 mx-2 font-bold">
                <FiExternalLink className="text-indigo-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="py-4 border-t border-gray-200 dark:border-gray-800/60 flex flex-col md:flex-row justify-center items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            © {currentYear} LumiVizStack.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium"> Built with precision for developers. </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;