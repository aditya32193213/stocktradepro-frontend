/**
 * File: NotFound.jsx
 * Purpose:
 * - 404 error page for unmatched routes
 *
 * Flow:
 * - Displays animated error UI
 * - Allows navigation back to home
 *
 * Key Responsibilities:
 * - Improve UX for invalid routes
 * - Maintain visual consistency with app theme
 *
 * Access:
 * - Public
 */

import { useNavigate } from "react-router-dom";
import { FaHome, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: "transform 0.3s ease-out",
            animationDelay: "1s",
          }}
        ></div>
        
        {/* Floating Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center p-4 sm:p-6 lg:p-8">
        
        {/* Icon Container with Enhanced Animation */}
        <div className="relative mb-8 sm:mb-12">
          {/* Pulsing Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-4 border-blue-500/20 dark:border-blue-400/20 rounded-full animate-ping"></div>
            <div className="absolute w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-4 border-purple-500/20 dark:border-purple-400/20 rounded-full animate-ping" style={{ animationDelay: "0.5s" }}></div>
          </div>
          
          {/* Glowing Background */}
          <div className="absolute -inset-8 sm:-inset-12 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
          
          {/* Icon with Bounce Interaction */}
          <div 
            className="relative transform transition-transform duration-300 hover:scale-110 cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <FaExclamationTriangle 
              className={`relative text-blue-600 dark:text-blue-400 text-7xl sm:text-8xl lg:text-9xl drop-shadow-2xl transition-all duration-300 ${
                isHovering ? "animate-bounce" : ""
              }`} 
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 sm:space-y-6 z-10 max-w-3xl mx-auto px-4">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient bg-[length:200%_auto] drop-shadow-sm">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              Page Not Found
            </h2>
          </div>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed px-4">
            Oops! The page you're looking for seems to have wandered off into the digital void. It might have been removed, renamed, or is temporarily unavailable.
          </p>

          {/* Quick Actions Tags */}
          <div className="pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Here's what you can do</p>
            <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
              <span className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">Check the URL</span>
              <span className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">Go back home</span>
              <span className="px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">Use search</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 z-10 mt-6 sm:mt-8 w-full max-w-md px-4">
          <button
            onClick={() => navigate("/")}
            className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 dark:shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden flex-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <FaHome className="text-lg sm:text-xl relative z-10" />
            <span className="relative z-10 text-sm sm:text-base">Go Home</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Go Back</span>
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="mt-12 sm:mt-16 z-10 w-full max-w-md px-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <input
                id="notfound-search"
                name="notfoundSearch"
                autoComplete="off"
                type="text"
                placeholder="Search for pages..."
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    console.log('Search:', e.target.value);
                  }
                }}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-600 font-mono tracking-widest">
            ERROR_CODE: 404_NOT_FOUND | REQUEST_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}