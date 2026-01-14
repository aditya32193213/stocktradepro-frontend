import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      
      {/* Icon / Illustration */}
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <FaExclamationTriangle className="relative text-blue-600 dark:text-blue-500 text-9xl drop-shadow-lg" />
      </div>

      {/* Text Content */}
      <div className="space-y-2 z-10">
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-blue-500/30"
        >
          <FaHome /> Go Home
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-full transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}