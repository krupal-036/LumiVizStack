import React from "react";
import {
  FiCode,
  FiKey,
  FiServer,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const MethodBadge = ({ method }) => {
  const colors = {
    GET: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-700",
    POST: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-700",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-700",
    DELETE:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-700",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-bold rounded-md border ${colors[method]}`}
    >
      {method}
    </span>
  );
};

const ApiBlock = ({ title, content }) => (
  <div className="mt-3">
    <h4 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
      {title === "Headers" ? (
        <FiKey size={12} />
      ) : title === "Request Body" ? (
        <FiCode size={12} />
      ) : (
        <FiCheckCircle size={12} />
      )}
      {title}
    </h4>
    <div className="bg-gray-50 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-gray-800 overflow-x-auto">
      <pre className="p-3 text-xs text-gray-800 dark:text-gray-200 font-mono">
        <code>{JSON.stringify(content, null, 2)}</code>
      </pre>
    </div>
  </div>
);

const EndpointCard = ({
  method,
  path,
  description,
  headers,
  body,
  response,
}) => (
  <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl mb-5 overflow-hidden shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors">
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50/50 dark:bg-gray-900/30">
      <MethodBadge method={method} />
      <code className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
        {path}
      </code>
    </div>
    <div className="p-4">
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
        {description}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {headers && <ApiBlock title="Headers" content={headers} />}
        {body && <ApiBlock title="Request Body" content={body} />}
      </div>

      {response && (
        <ApiBlock title="Success Response (200 OK)" content={response} />
      )}
    </div>
  </div>
);

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 pt-24 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-400 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <FiServer className="w-4 h-4" />
            API Reference
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            LumiVizStack API Docs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            This document provides detailed information about the REST API
            endpoints available in LumiVizStack. The API allows you to manage
            authentication, history, and data visualization configurations
            programmatically.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-10 text-sm text-blue-700 dark:text-blue-300 flex gap-3 items-start">
          <FiAlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Information Only:</strong> This page is for reference
            purposes. To interact with the API, use tools like Postman, cURL, or
            integrate with your frontend application using the Base URL:{" "}
            <code className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 font-mono text-xs">
              /api
            </code>
            .
          </div>
        </div>

        {/* Authentication Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            <FiLock className="text-indigo-500" />
            Authentication
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Authentication is handled via JSON Web Tokens (JWT). Include the
            token in the{" "}
            <code className="text-indigo-500 font-mono text-xs">
              x-auth-token
            </code>{" "}
            header for protected routes.
          </p>

          <EndpointCard
            method="POST"
            path="/api/auth/register"
            description="Registers a new user account and returns an authentication token."
            body={{
              name: "John Doe",
              email: "john@example.com",
              password: "securePassword123",
            }}
            response={{
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              user: {
                id: "64b...",
                name: "John Doe",
                email: "john@example.com",
              },
            }}
          />

          <EndpointCard
            method="POST"
            path="/api/auth/login"
            description="Authenticates an existing user and returns a token."
            body={{
              email: "john@example.com",
              password: "securePassword123",
            }}
            response={{
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            }}
          />
        </section>

        {/* History Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            <FiCode className="text-indigo-500" />
            Visualization History
          </h2>

          <EndpointCard
            method="GET"
            path="/api/history/user"
            description="Retrieves all saved visualization sessions for the authenticated user."
            headers={{ "x-auth-token": "your_jwt_token" }}
            response={[
              {
                _id: "64c...",
                title: "Q3 Sales Report",
                type: "chart",
                dataLength: 150,
                isPublic: false,
                createdAt: "2023-10-01T10:00:00Z",
              },
            ]}
          />

          <EndpointCard
            method="POST"
            path="/api/history/save"
            description="Saves a new visualization configuration to the database."
            headers={{ "x-auth-token": "your_jwt_token" }}
            body={{
              title: "Employee Data 2024",
              type: "table",
              data: [{ id: 1, name: "Alice", role: "Admin" }],
              rawInput: "[{...}]",
              inputType: "paste",
              isPublic: true,
            }}
            response={{
              msg: "Visualization saved successfully",
              item: { _id: "new_id", data: "...data" },
            }}
          />

          <EndpointCard
            method="PUT"
            path="/api/history/:id/toggle"
            description="Toggles the public/private visibility of a saved visualization."
            headers={{ "x-auth-token": "your_jwt_token" }}
            response={{
              msg: "Visibility toggled",
              isPublic: true,
            }}
          />

          <EndpointCard
            method="DELETE"
            path="/api/history/:id"
            description="Deletes a specific visualization entry from history."
            headers={{ "x-auth-token": "your_jwt_token" }}
            response={{
              msg: "Visualization removed successfully",
            }}
          />
        </section>

        {/* Admin Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center gap-2">
            <FiServer className="text-indigo-500" />
            Administration
          </h2>

          <EndpointCard
            method="GET"
            path="/api/admin/users"
            description="Retrieves a list of all registered users. (Requires Admin Role)"
            headers={{ "x-auth-token": "admin_jwt_token" }}
            response={[
              {
                _id: "user_id",
                name: "User A",
                email: "a@test.com",
                role: "user",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
