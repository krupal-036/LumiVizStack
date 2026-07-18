import {
  FiCode,
  FiServer,
  FiLock,
  FiAlertCircle,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useTitle } from "../hooks/customHooks";

type MethodBadgeProps = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};

const MethodBadge = ({ method }: MethodBadgeProps) => {
  const colors: Record<MethodBadgeProps["method"], string> = {
    GET: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700",
    POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-700",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-700",
    DELETE:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-700",
    PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 border-purple-200 dark:border-purple-700",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${colors[method]}`}
    >
      {method}
    </span>
  );
};

type EndpointRowProps = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
};

const EndpointRow = ({ method, path, description }: EndpointRowProps) => {
  return (
    <div className="group relative flex flex-col md:flex-row md:items-center gap-4 p-4 mb-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-indigo-500/40 transition-all duration-200">

      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0 md:min-w-[320px]">
        <MethodBadge method={method} />

        <div className="flex flex-col min-w-0">
          <code className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 truncate">
            {path}
          </code>
          <span className="text-xs text-gray-400 md:hidden">
            {method} endpoint
          </span>
        </div>
      </div>

      {/* Divider (desktop only) */}
      <div className="hidden md:block h-8 w-px bg-gray-200 dark:bg-gray-800" />

      {/* Right Section */}
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </div>

      {/* Hover Indicator */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-indigo-500/20 pointer-events-none" />
    </div>
  );
};

export default function ApiDocs() {
  const apiData: Record<string, EndpointRowProps[]> = {
    auth: [
      { method: "POST", path: "/auth/register", description: "Registers a new user and returns a JWT access token." },
      { method: "POST", path: "/auth/login", description: "Authenticates credentials and returns a secure session token." }
    ],
    history: [
      { method: "POST", path: "/history/save", description: "Saves a new visualization configuration to the database. (Max 10 per each user)" },
      { method: "PUT", path: "/history/:id/toggle", description: "Toggles the public/private visibility of a saved visualization." },
      { method: "GET", path: "/history/user", description: "Retrieves all saved visualization sessions for the authenticated user." },
      { method: "DELETE", path: "/history/:id", description: "Deletes a specific visualization entry from history." },
      { method: "DELETE", path: "/history/delete-all", description: "Delete all history items." },
      { method: "PUT", path: "/history/delete-all", description: "Mark all history as deleted (Soft Delete)" },
      { method: "GET", path: "/history/public/:shareId", description: "Get Access to saved public history by Share ID (accessible by anyone)" },
    ],
    admin: [
      { method: "GET", path: "/admin/settings", description: "Get System Setting data" },
      { method: "PATCH", path: "/admin/settings/auth", description: "Modify System Setting Data admin only" },
      { method: "GET", path: "/admin/stats", description: "Get all document counts (User and History)" },
      { method: "GET", path: "/admin/users", description: "Get All Users with selected fields" },
      { method: "GET", path: "/admin/history", description: "Get All istory collection data at Admin panel" },
      { method: "PUT", path: "/admin/user/:id", description: "Desable User / Soft Delete User" },
      { method: "DELETE", path: "/admin/user/:id", description: "Delete User and all associated history of User" },
      { method: "DELETE", path: "/admin/history", description: "Delete all visualization history of History Collection at Admin Panel" },
      { method: "DELETE", path: "/admin/users/history/:id", description: "Delete all history of specific User at Admin Panel" },
    ],
    user: [
      { method: "PUT", path: "/profile/update", description: "Update Username and Password" },
      { method: "PUT", path: "/profile/delete", description: "Delete all visualization data and disable User" },
    ]
  };
  useTitle("API Docs");
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white pt-14">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[80px] md:blur-[130px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] bg-blue-500/10 dark:bg-blue-600/10 blur-[70px] md:blur-[110px] rounded-full" />
        <div className="absolute top-[50%] left-[-10%] w-[180px] h-[180px] md:w-[450px] md:h-[450px] bg-emerald-500/5 dark:bg-emerald-600/5 blur-[60px] md:blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[90px] md:blur-[140px] rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-10 sm:px-6 lg:px-8 pb-10">

        <div className="flex flex-col items-center justify-center mb-10 sm:mb-12 lg:mb-16 text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-400 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <FiServer className="w-4 h-4" />
            API Reference
          </div>

          <h1 className="flex flex-wrap items-center justify-center text-center text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-5 sm:mb-6">

            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              LumiVizStack&nbsp;
            </span>

            <span className="text-gray-900 dark:text-white">
              API Docs
            </span>

          </h1>

          <p className="max-w-xl sm:max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            This document provides detailed information about the REST API
            endpoints available in LumiVizStack. The API allows you to manage
            authentication, history, and data visualization configurations
            programmatically.
          </p>

        </div>


        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-10 text-sm text-blue-700 dark:text-blue-300 flex gap-3 items-start">
          <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Information Only:</strong> This page is for reference
            purposes. To interact with the API, use tools like Postman, cURL, or
            integrate with your frontend application using the Base URL:{" "}
            <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 font-mono text-xs">
              /api
            </code>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-800 dark:text-white">
            <FiLock className="text-indigo-500" /> Authentication
          </h2>
          {apiData.auth.map((item, index) => (
            <EndpointRow
              key={index + 11}
              method={item.method}
              path={item.path}
              description={item.description}
            />
          ))}
        </section>
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-800 dark:text-white">
            <FiCode className="text-indigo-500" /> Visualization History
          </h2>
          {apiData.history.map((item, index) => (
            <EndpointRow
              key={index + 12}
              method={item.method}
              path={item.path}
              description={item.description}
            />
          ))}
        </section>
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-800 dark:text-white">
            <FiShield className="text-indigo-500" /> Administration
          </h2>
          {apiData.admin.map((item, index) => (
            <EndpointRow
              key={index + 12}
              method={item.method}
              path={item.path}
              description={item.description}
            />
          ))}
        </section>
        <section></section>
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-lg font-bold mb-6 text-gray-800 dark:text-white">
            <FiUser className="text-indigo-500" /> User Profile
          </h2>
          {apiData.user.map((item, index) => (
            <EndpointRow
              key={index + 12}
              method={item.method}
              path={item.path}
              description={item.description}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
