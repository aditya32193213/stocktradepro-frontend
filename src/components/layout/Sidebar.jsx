import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaHome, FaChartLine, FaStar, FaExchangeAlt, FaBriefcase, FaUser, FaInfoCircle,
  FaChevronLeft, FaChevronRight, FaQuestionCircle
} from "react-icons/fa";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome },
  { name: "Stocks", path: "/stocks", icon: FaChartLine },
  { name: "Portfolio", path: "/portfolio", icon: FaBriefcase },
  { name: "Watchlist", path: "/watchlist", icon: FaStar },
  { name: "Transactions", path: "/transactions", icon: FaExchangeAlt },
  { name: "About", path: "/about", icon: FaInfoCircle },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen border-r transition-all duration-300 flex flex-col sticky top-0 z-40",
        "bg-white text-gray-800 border-gray-200",
        "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Collapse Button */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white 
                     p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md mx-2 transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              )
            }
            title={collapsed ? name : ""}
          >
            <Icon size={20} />
            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}

        {/* Spacer */}
        <div className="mt-auto mb-2 border-t border-gray-100 dark:border-gray-800 mx-4 pt-2"></div>

        {/* Help Center (Navigates to FAQ Page) */}
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md mx-2 transition-colors mb-4",
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            )
          }
          title={collapsed ? "Help Center" : ""}
        >
          <FaQuestionCircle size={20} />
          {!collapsed && <span>Help Center</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;