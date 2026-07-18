import { Link, useNavigate } from "react-router-dom";
import { FiHome, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useTitle } from "../hooks/customHooks";

const NotFound = () => {
  const navigate = useNavigate();
  useTitle("404");

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 px-4">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-red-500/10 dark:bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto pt-1">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm">
          <FiAlertCircle className="w-10 h-10" />
        </div>

        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-slate-600 to-slate-200 dark:from-slate-200 dark:to-slate-900 select-none">
          404
        </h1>

        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL or the page has been moved.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5"
          >
            <FiHome className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
