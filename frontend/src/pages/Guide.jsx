import React from "react";
import { Link } from "react-router-dom";
import {
  FiCode, FiUploadCloud, FiLink, FiPlay, FiTable, FiGrid, FiBarChart2, FiShare2, FiSave, FiEye, FiEyeOff, FiBookOpen, FiCheckCircle,
} from "react-icons/fi";
import VisualizeButton from "../components/common/Button";
const guideSteps = [
  {
    step: "01",
    title: "Connect Your Data",
    icon: FiCode,
    description:
      "LumiVizStack offers three flexible ways to ingest data. Choose the method that best fits your workflow.",
    options: [
      {
        icon: FiCode,
        title: "Paste JSON",
        desc: "Copy raw JSON data and paste it directly into the editor.",
      },
      {
        icon: FiUploadCloud,
        title: "File Upload",
        desc: "Upload a .json file from your computer.",
      },
      {
        icon: FiLink,
        title: "API URL",
        desc: "Fetch live data from a public API endpoint.",
      },
    ],
  },
  {
    step: "02",
    title: "Visualize",
    icon: FiPlay,
    description:
      "Click the 'Visualize Data' button. Our engine parses your structure and prepares it for interactive viewing.",
    options: null,
  },
  {
    step: "03",
    title: "Choose Your View",
    icon: FiBarChart2,
    description:
      "Switch between visualization modes to find the most insightful representation of your data.",
    options: [
      {
        icon: FiTable,
        title: "Table View",
        desc: "Classic row-column layout for precise data inspection.",
      },
      {
        icon: FiGrid,
        title: "Card View",
        desc: "Visual cards, ideal for profiles or image-heavy data.",
      },
      {
        icon: FiBarChart2,
        title: "Charts",
        desc: "Bar, Line, and Pie charts for numerical analysis.",
      },
      {
        icon: FiShare2,
        title: "Graph & Tree",
        desc: "Hierarchical views for nested JSON structures.",
      },
    ],
  },
  {
    step: "04",
    title: "Save & Share",
    icon: FiSave,
    description:
      "Save your session to your history. Toggle visibility to generate a public link you can share with anyone.",
    options: [
      {
        icon: FiEyeOff,
        title: "Private",
        desc: "Saved sessions are private by default.",
      },
      {
        icon: FiEye,
        title: "Public",
        desc: "Toggle to public to get a shareable link.",
      },
    ],
  },
];

export default function Guide() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

        <div className="absolute top-[-5%] left-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[60px] md:blur-[110px] rounded-full" />

        <div className="absolute top-[30%] right-[-10%] w-[180px] h-[180px] md:w-[450px] md:h-[450px] bg-violet-500/10 dark:bg-violet-600/10 blur-[50px] md:blur-[100px] rounded-full" />

        <div className="absolute top-[60%] left-[-10%] w-[150px] h-[150px] md:w-[400px] md:h-[400px] bg-cyan-500/10 dark:bg-cyan-500/5 blur-[50px] md:blur-[90px] rounded-full" />

        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[250px] h-[200px] md:w-[600px] md:h-[350px] bg-rose-500/5 dark:bg-rose-500/5 blur-[80px] md:blur-[120px] rounded-full" />

      </div>
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-400 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <FiBookOpen className="w-4 h-4" />
            User Guide
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            How to use <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              LumiVizStack
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Follow these four simple steps to transform your raw JSON data into interactive visualizations.
          </p>
        </div>
        <div className="space-y-8">
          {guideSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-indigo-500/10">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Step {step.step}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {step.title}
                    </h2>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                  {step.description}
                </p>
                {step.options && (
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {step.options.map((opt, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm mt-0.5">
                          <opt.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                            {opt.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <FiCheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-indigo-900 dark:text-indigo-200">
              Pro Tip
            </h3>
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            If your JSON is an array of objects, the <strong>Table View</strong>{" "}
            works best. For deeply nested trees, try the{" "}
            <strong>Tree View</strong> to explore the hierarchy.
          </p>
        </div>

        <VisualizeButton text="Start Visualizing" />
      </div>
    </div>
  );
}
