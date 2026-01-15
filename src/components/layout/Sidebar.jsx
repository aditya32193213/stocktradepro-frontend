import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaHome, FaChartLine, FaStar, FaExchangeAlt, FaBriefcase, FaUser, FaInfoCircle,
  FaChevronLeft, FaChevronRight, FaQuestionCircle
} from "react-icons/fa";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome, gradient: "from-blue-500 to-cyan-500" },
  { name: "Stocks", path: "/stocks", icon: FaChartLine, gradient: "from-purple-500 to-pink-500" },
  { name: "Portfolio", path: "/portfolio", icon: FaBriefcase, gradient: "from-green-500 to-emerald-500" },
  { name: "Watchlist", path: "/watchlist", icon: FaStar, gradient: "from-yellow-500 to-orange-500" },
  { name: "Transactions", path: "/transactions", icon: FaExchangeAlt, gradient: "from-red-500 to-pink-500" },
  { name: "About", path: "/about", icon: FaInfoCircle, gradient: "from-indigo-500 to-purple-500" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen border-r transition-all duration-300 flex flex-col sticky top-0 z-40 relative",
        "bg-white/80 backdrop-blur-xl text-gray-800 border-gray-200",
        "dark:bg-gray-900/80 dark:backdrop-blur-xl dark:text-gray-100 dark:border-gray-800",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
      
      <div className="relative flex-1 flex flex-col">
        {/* Collapse Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="group relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200 hover:scale-110 active:scale-95"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            {collapsed ? <FaChevronRight className="relative" /> : <FaChevronLeft className="relative" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex flex-col gap-1.5 flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {navItems.map(({ name, path, icon: Icon, gradient }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                clsx(
                  "group relative flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-gradient-to-r text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-700 dark:hover:text-white hover:scale-102",
                  isActive && gradient
                )
              }
              title={collapsed ? name : ""}
            >
              {({ isActive }) => (
                <>
                  {/* Glow effect for active item */}
                  {isActive && (
                    <div className={clsx("absolute inset-0 bg-gradient-to-r rounded-xl blur-xl opacity-30 -z-10", gradient)}></div>
                  )}
                  
                  {/* Icon with animation */}
                  <div className={clsx(
                    "transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}>
                    <Icon size={20} />
                  </div>
                  
                  {/* Label with smooth transition */}
                  {!collapsed && (
                    <span className="transition-all duration-200">
                      {name}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Spacer */}
          <div className="mt-auto mb-3 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mx-2"></div>

          {/* Help Center */}
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              clsx(
                "group relative flex items-center gap-3 px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 mb-2",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-105"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-700 dark:hover:text-white hover:scale-102"
              )
            }
            title={collapsed ? "Help Center" : ""}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-xl opacity-30 -z-10"></div>
                )}
                <div className={clsx(
                  "transition-transform duration-200",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )}>
                  <FaQuestionCircle size={20} />
                </div>
                {!collapsed && <span>Help Center</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                )}
              </>
            )}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;