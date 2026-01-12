// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser, selectAuthUser, selectIsAuthenticated } from "@/features/auth";
// import ThemeToggle from "@/components/common/ThemeToggle";

// const Header = () => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectAuthUser);
//   const isAuthenticated = useSelector(selectIsAuthenticated);

//   const handleLogout = () => {
//     dispatch(logoutUser());
//   };

//   return (
//     <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800">
//       {/* Logo */}
//       <h1 className="text-xl font-bold text-gray-900 dark:text-white">
//         StockTradePro
//       </h1>

//       {/* Right Section */}
//       <div className="flex items-center gap-4">
//         {/* Theme Toggle (always visible) */}
//         <ThemeToggle />

//         {isAuthenticated && (
//           <>
//             <span className="text-sm text-gray-700 dark:text-gray-300">
//               Hi, {user?.name}
//             </span>

//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;
















import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, selectAuthUser, selectIsAuthenticated } from "@/features/auth";
import ThemeToggle from "@/components/common/ThemeToggle";
import { FaUser } from "react-icons/fa";
import toast from "@/utils/toast";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    await dispatch(logoutUser());
    toast.dismiss(toastId);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      {/* Logo */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        StockTradePro
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {isAuthenticated && (
          <>
            {/* User Info */}
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span>Hi, <span className="font-semibold">{user?.name || 'User'}</span></span>
            </div>

            {/* Profile Button */}
            <button
              onClick={() => navigate("/profile")}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 
                         hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="View Profile"
            >
              <FaUser size={18} />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-md bg-red-600 text-white 
                         hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;