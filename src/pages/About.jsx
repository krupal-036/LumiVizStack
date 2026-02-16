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


// import React from "react";
// import { 
//   FiCode, FiPieChart, FiLayout, FiSave, 
//   FiShield, FiZap, FiGithub, FiTwitter, FiLinkedin 
// } from "react-icons/fi";

// const About = () => {
//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300">
      
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         {/* Background Gradient Orbs */}
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>

//         <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center relative z-10">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
//             </span>
//             Version 1.0 Released
//           </div>
          
//           <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
//             Transform Data into <br />
//             <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
//               Visual Insights
//             </span>
//           </h1>
          
//           <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
//             LumiVizStack is a powerful, privacy-first data visualization tool. 
//             Convert raw JSON, APIs, or CSVs into beautiful charts and tables instantly in your browser.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <a 
//               href="/visualize" 
//               className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
//             >
//               Start Visualizing
//             </a>
//             <a 
//               href="#features" 
//               className="px-8 py-3.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
//             >
//               Learn More
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Features Grid Section */}
//       <div id="features" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Built for Modern Data</h2>
//           <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
//             No complex setup required. Simply paste your data and watch it transform.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Feature 1 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-5">
//               <FiCode size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Universal Input</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               Support for raw JSON strings, file uploads, and direct API URL fetching with CORS handling.
//             </p>
//           </div>

//           {/* Feature 2 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mb-5">
//               <FiPieChart size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Dynamic Charts</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               Auto-generated Bar, Line, and Pie charts. Visualize numeric data instantly without configuration.
//             </p>
//           </div>

//           {/* Feature 3 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-pink-200 dark:hover:border-pink-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 mb-5">
//               <FiLayout size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Smart Tables</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               N-level nested object support, image previews, and expandable data modals for complex structures.
//             </p>
//           </div>

//           {/* Feature 4 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-cyan-200 dark:hover:border-cyan-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 mb-5">
//               <FiSave size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Persistent History</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               Save your visualization sessions locally. Reload previous configurations instantly with one click.
//             </p>
//           </div>

//           {/* Feature 5 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-green-200 dark:hover:border-green-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mb-5">
//               <FiZap size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Zero Backend</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               Runs entirely in your browser. No server uploads, no latency. Your data stays on your device.
//             </p>
//           </div>

//           {/* Feature 6 */}
//           <div className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900 transition-all hover:shadow-xl">
//             <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 mb-5">
//               <FiShield size={24} />
//             </div>
//             <h3 className="text-lg font-bold mb-2 dark:text-white">Privacy First</h3>
//             <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
//               We don't store your data on external servers. Everything is saved in your browser's local storage.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Tech Stack / Footer Area */}
//       <div className="border-t border-slate-100 dark:border-zinc-800 py-12 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
//         <div className="max-w-6xl mx-auto px-4 text-center">
//           <h3 className="text-xs uppercase font-bold text-slate-400 dark:text-zinc-500 tracking-widest mb-6">
//             Powered By
//           </h3>
//           <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 dark:text-zinc-400">
//             <div className="flex flex-col items-center gap-1 hover:text-indigo-500 transition-colors cursor-pointer">
//               <span className="text-2xl font-bold">React</span>
//             </div>
//             <div className="flex flex-col items-center gap-1 hover:text-cyan-500 transition-colors cursor-pointer">
//               <span className="text-2xl font-bold">Tailwind CSS</span>
//             </div>
//             <div className="flex flex-col items-center gap-1 hover:text-green-500 transition-colors cursor-pointer">
//               <span className="text-2xl font-bold">Vite</span>
//             </div>
//           </div>

//           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-slate-400 dark:text-zinc-500">
//               © {new Date().getFullYear()} LumiVizStack. All rights reserved.
//             </p>
//             <div className="flex items-center gap-6 text-slate-400 dark:text-zinc-500">
//               <a href="#" className="hover:text-indigo-500 transition-colors"><FiGithub size={20} /></a>
//               <a href="#" className="hover:text-indigo-500 transition-colors"><FiTwitter size={20} /></a>
//               <a href="#" className="hover:text-indigo-500 transition-colors"><FiLinkedin size={20} /></a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;