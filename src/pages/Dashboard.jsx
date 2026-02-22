import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiCopy, FiCheck, FiLink, FiFileText, FiCode } from "react-icons/fi";
import Alert from "../components/common/Alert";

const copyjsondata = JSON.stringify(
  {
    employees: [
      { id: 1, name: "Alice Johnson", department: "HR", salary: 50000, avatar: "https://picsum.photos/seed/alice/40/40.jpg" },
      { id: 2, name: "Bob Smith", department: "Engineering", salary: 85000, avatar: "https://picsum.photos/seed/bob/40/40.jpg" },
      { id: 3, name: "Charlie Brown", department: "Marketing", salary: 60000, avatar: "https://picsum.photos/seed/charlie/40/40.jpg" },
    ],
    company: "LumiVizStack",
  },
  null,
  2
);

export default function Dashboard() {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyjsondata);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      setError("Copy failed. Please try again.");
    }
  };

  const handleVisualizeClick = () => {
    if (user) {
      navigate("/visualize");
    } else {
      setError("You must be logged in to visualize your data.");
      setTimeout(() => navigate("/login", { state: { error: "Please login to continue" } }), 1500);
    }
  };
  // min-h-[calc(100vh-45px)]
  return (
    <section aria-labelledby="dashboard-hero" className="min-h-[calc(90vh-45px)] flex flex-col items-center bg-[url('./gradientBg.svg')] bg-cover dark:bg-none dark:bg-linear-to-b dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100 pb-20 text-sm pt-2 px-4">

      {/* Feature Pills - Responsive Scroll */}
      <div className="flex items-center justify-center p-2 mt-6 rounded-full border border-indigo-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs overflow-x-auto max-w-full whitespace-nowrap">
        <div className="flex items-center gap-2 px-3 text-indigo-500">
          <FiLink /> <FiCode /> <FiFileText />
        </div>
        <p className="pr-4 text-gray-600 dark:text-gray-300 text-xs">File upload, raw JSON, API URLs</p>
      </div>

      {/* Headline */}
      <h1 aria-labelledby="dashboard-hero" className="text-3xl sm:text-4xl md:text-6xl text-center font-medium max-w-5xl mt-8 leading-tight">
        Transform your data into insights. Simple, Secure & Powerful.
      </h1>
      <p className="text-slate-600 dark:text-gray-400 text-base max-md:px-2 text-center max-w-xl mt-4">
        A scalable full-stack platform that transforms JSON data into clear, interactive visualizations.
      </p>

      {/* CTA Button */}
      <button
        onClick={handleVisualizeClick}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-6 sm:px-8 py-3 mt-8 rounded-full transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <span>Visualize your data now</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.166 10h11.667m0 0L9.999 4.167M15.833 10l-5.834 5.834" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Error Message */}
      <div className="mt-4 h-8">
        {error && <Alert message={error} type="error" />}
      </div>

      {/* Copy JSON Box - Improved for mobile */}
      <div className="w-full max-w-md mt-2 flex justify-center">
        <div className="flex items-center max-w-fit gap-3 bg-white dark:bg-gray-900 rounded-full px-4 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">

          <div className="bg-gray-800 rounded-full p-2 shrink-0">
            <FiCode color="white" size={16} />
          </div>

          <div className="flex-1 overflow-hidden">
            {!isCopied ? (
              <p className="text-indigo-600 font-semibold text-sm truncate">
                Copy Demo JSON Data
              </p>
            ) : (
              <p className="text-green-600 font-semibold text-sm flex items-center gap-1">
                Copied...!
              </p>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition p-2"
          >
            {isCopied ? <FiCheck className="text-green-600" /> : <FiCopy />}
          </button>

        </div>
      </div>

    </section>
  );
}