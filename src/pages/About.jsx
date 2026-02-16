import { FiDatabase, FiShield, FiPieChart, FiDownload, FiCode, FiLayout } from "react-icons/fi";

const features = [
  {
    icon: FiDatabase,
    title: "Multiple Data Sources",
    desc: "Import data via raw JSON paste, file uploads, or by connecting directly to public API URLs."
  },
  {
    icon: FiPieChart,
    title: "Smart Visualization",
    desc: "Auto-detects data structures to suggest and render Charts, Tables, or Cards dynamically."
  },
  {
    icon: FiShield,
    title: "Secure Authentication",
    desc: "Robust user system with secure login, registration, and role-based access control."
  },
  {
    icon: FiLayout,
    title: "History Management",
    desc: "Save your visualization configurations. Reload, edit, or delete previous sessions anytime."
  },
  {
    icon: FiDownload,
    title: "Export Capabilities",
    desc: "Download your visualizations as images or export the raw JSON data for external use."
  },
  {
    icon: FiCode,
    title: "Clean Architecture",
    desc: "Built with a modular React frontend and a scalable Node.js/Express backend."
  }
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          About <span className="text-indigo-600">LumiVizStack</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          A full-stack application designed to bridge the gap between raw data and meaningful insights through interactive visualization.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-10 mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Project Overview</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
          LumiVizStack allows users to visualize JSON data interactively. The system validates data, handles errors gracefully, and automatically detects structures to choose suitable formats.
          <br /><br />
          The frontend is built with reusable React components and modern state management, featuring Light/Dark mode support. The backend, developed with Node.js and Express, ensures secure APIs, validation, and centralized error handling.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 mb-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}