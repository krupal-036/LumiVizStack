import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiCopy, FiCheck, FiLink, FiFileText, FiCode } from "react-icons/fi";
import Alert from "../components/common/Alert";

// Demo JSON Data Variable
const copyjsondata = JSON.stringify(
  {
    employees: [
      { id: 1, name: "Alice Johnson", department: "HR", salary: 50000 },
      { id: 2, name: "Bob Smith", department: "Engineering", salary: 85000 },
      { id: 3, name: "Charlie Brown", department: "Marketing", salary: 60000 },
      { id: 4, name: "Diana Prince", department: "Engineering", salary: 92000 },
    ],
    fiscalYear: 2023,
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

  const handleCopy = () => {
    navigator.clipboard.writeText(copyjsondata);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleVisualizeClick = () => {
    if (user) {
      navigate("/visualize");
    } else {
      setError("You must be logged in to visualize your data.");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <section className="flex flex-col items-center bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBg.svg')] bg-cover dark:bg-none dark:bg-gradient-to-b dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100 pb-16 text-sm pt-2">

      <div className="flex flex-wrap items-center justify-center p-4 mt-10 rounded-full border border-indigo-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
        <div className="flex items-center gap-2 px-2">
          <FiLink className="text-indigo-500" />
          <FiCode className="text-indigo-500" />
          <FiFileText className="text-indigo-500" />
        </div>
        <p className="pr-2 text-gray-600 dark:text-gray-300">Supports data input via file upload, raw JSON paste, and API URLs</p>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl text-center font-medium max-w-5xl mt-5 bg-gradient-to-r from-black to-[#748298] dark:from-white dark:to-gray-400 text-transparent bg-clip-text p-7">
        Transform your data into insights. Simple, Secure & Powerful.
      </h1>
      <p className="text-slate-600 dark:text-gray-400 md:text-base max-md:px-2 text-center max-w-xl mt-3">
        A scalable full-stack platform that transforms JSON data into clear, interactive visualizations.
      </p>

      {/* CTA Button */}
      <button
        onClick={handleVisualizeClick}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-8 py-3 mt-7 rounded-full transition"
      >
        <span>Visualize your data now</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.166 10h11.667m0 0L9.999 4.167M15.833 10l-5.834 5.834" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Error Message Area */}
      <div className="mt-2 p-4 max-w-5xl flex items-center justify-center">
        {error && <Alert message={error} type="error" />}
      </div>

      {/* Copy JSON Box */}
      <div className="">
        <div className="flex p-4 mt-2 items-center gap-4 bg-white  dark:bg-gray-900 rounded-full px-4 py-3 border border-gray-400 dark:border-gray-700">
          <span className="bg-gray-800 rounded-full p-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.166 10h11.667m0 0L9.999 4.167M15.833 10l-5.834 5.834" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span id="copy-text" className="flex-1 text-gray-800 dark:text-gray-200 text-lg overflow-hidden whitespace-nowrap text-ellipsis">

            {!isCopied ?
              <p className="text-indigo-500 font-semibold">
                Copy Demo JSON Data
              </p> : ""}
          </span>
          <button id="copy-button" onClick={handleCopy} className="text-gray-600 text-lg hover:text-gray-800 dark:hover:text-white transition">
            {isCopied ?
              <p className="text-green-600 font-semibold">
                <span> Copied... <FiCheck className="text-green-500 font-semibold" /></span>
              </p> : <FiCopy />}
          </button>
        </div>
      </div>

    </section>
  );
}