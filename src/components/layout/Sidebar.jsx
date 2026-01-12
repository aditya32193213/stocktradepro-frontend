// import { NavLink } from "react-router-dom";
// import { useState } from "react";
// import {
//   FaHome,
//   FaChartLine,
//   FaStar,
//   FaExchangeAlt,
//   FaBriefcase,
//   FaChevronLeft,
//   FaChevronRight,
// } from "react-icons/fa";
// import clsx from "clsx";

// const navItems = [
//   { name: "Dashboard", path: "/dashboard", icon: FaHome },
//   { name: "Stocks", path: "/stocks", icon: FaChartLine },
//   { name: "Portfolio", path: "/portfolio", icon: FaBriefcase },
//   { name: "Watchlist", path: "/watchlist", icon: FaStar },
//   { name: "Transactions", path: "/transactions", icon: FaExchangeAlt },
// ];

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={clsx(
//         "h-screen border-r transition-all duration-300",
//         // 🌞 Light mode
//         "bg-white text-gray-800 border-gray-200",
//         // 🌙 Dark mode
//         "dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800",
//         collapsed ? "w-16" : "w-60"
//       )}
//     >
//       {/* Collapse Button */}
//       <div className="flex justify-end p-3">
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
//         >
//           {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-4 flex flex-col gap-1">
//         {navItems.map(({ name, path, icon: Icon }) => (
//           <NavLink
//             key={name}
//             to={path}
//             className={({ isActive }) =>
//               clsx(
//                 "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md mx-2 transition-colors",
//                 // Active
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : [
//                       // Light mode
//                       "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
//                       // Dark mode
//                       "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
//                     ]
//               )
//             }
//           >
//             <Icon size={18} />
//             {!collapsed && <span>{name}</span>}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;









import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaChartLine,
  FaStar,
  FaExchangeAlt,
  FaBriefcase,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: FaHome },
  { name: "Stocks", path: "/stocks", icon: FaChartLine },
  { name: "Portfolio", path: "/portfolio", icon: FaBriefcase },
  { name: "Watchlist", path: "/watchlist", icon: FaStar },
  { name: "Transactions", path: "/transactions", icon: FaExchangeAlt },
  { name: "Profile", path: "/profile", icon: FaUser },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "h-screen border-r transition-all duration-300",
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
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md mx-2 transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : [
                      "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                    ]
              )
            }
          >
            <Icon size={18} />
            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;