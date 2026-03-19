import React from "react";
import {
  FiDatabase, FiShield, FiPieChart, FiDownload, FiCode, FiLayout, FiCpu, FiServer, FiCheck,
} from "react-icons/fi";

const features = [
  {
    icon: FiDatabase,
    title: "Multiple Data Sources",
    desc: "Import data via raw JSON paste, file uploads, or by connecting directly to public API URLs.",
  },
  {
    icon: FiPieChart,
    title: "Smart Visualization",
    desc: "Auto-detects data structures to suggest and render Charts, Tables, or Cards dynamically.",
  },
  {
    icon: FiShield,
    title: "Secure Authentication",
    desc: "Robust user system with secure login, registration, and role-based access control.",
  },
  {
    icon: FiLayout,
    title: "History Management",
    desc: "Save your visualization configurations. Reload, edit, or delete previous sessions anytime.",
  },
  {
    icon: FiDownload,
    title: "Export Capabilities",
    desc: "Download your visualizations as images or export the raw JSON data for external use.",
  },
  {
    icon: FiCode,
    title: "Clean Architecture",
    desc: "Built with a modular React frontend and a scalable Node.js/Express backend.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[200px] h-[200px] md:w-[600px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[60px] md:blur-[120px] rounded-full" />
        <div className="absolute top-[25%] left-[-10%] w-[180px] h-[180px] md:w-[500px] md:h-[500px] bg-violet-500/10 dark:bg-violet-600/10 blur-[50px] md:blur-[110px] rounded-full" />
        <div className="absolute bottom-[15%] right-[-5%] w-[150px] h-[150px] md:w-[450px] md:h-[450px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[50px] md:blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[250px] h-[150px] md:w-[700px] md:h-[400px] bg-emerald-500/5 dark:bg-emerald-500/5 blur-[80px] md:blur-[100px] rounded-full" />

      </div>
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8 sm:pt-4 xs:pt-4 pb-10">
        <div className="text-center max-w-3xl mx-auto mb-10 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-400 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Platform Overview
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            &nbsp;Transforming Data into <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              &nbsp;LumiVizStack&nbsp;
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            A full-stack application designed to bridge the gap between raw data and meaningful insights through interactive, real-time visualization.
          </p>
        </div>
        <div className="mb-10">
          <div className="bg-white dark:bg-gray-900/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none overflow-hidden">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-8 p-8 sm:p-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <FiCpu className="text-indigo-500" />
                  Project Architecture
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">
                  LumiVizStack allows users to visualize JSON data interactively. The system data, handles errors gracefully, and automatically detects structures to choose suitable formats.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-1">
                      <span className="flex items-center justify-center w-4 h-4 text-indigo-600 dark:text-indigo-400">
                        <FiCheck />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Frontend Excellence
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reusable React components with modern state management and Light/Dark mode support.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mt-1">
                      <span className="flex items-center justify-center w-4 h-4 text-indigo-600 dark:text-indigo-400">
                        <FiCheck />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Backend Reliability
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Node.js & Express backend ensuring secure APIs, strict
                        validation, and centralized error handling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-gray-50 dark:bg-gray-800/50 p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-gray-300 dark:border-gray-700 flex flex-col justify-center">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-400 uppercase tracking-wider mb-6">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["React", "Node.js", "Express", "Tailwind", "Chart.js", "JSON",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700">
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    "Clean code architecture ensures scalability and ease of
                    maintenance."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Core Features
            </h2>
            <div className="h-px flex-1 ml-6 bg-gray-300 dark:bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-300 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-trangray-y-1">
                <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

                <div className="w-14 h-14 mb-6 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
