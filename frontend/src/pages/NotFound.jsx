
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";


const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] w-full text-center px-4">
      
      <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 tracking-widest">
        404
      </h1>
      
      <div className="absolute">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            <Home size={18} />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;