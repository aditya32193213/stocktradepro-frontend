import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, selectAuthUser, selectIsAuthenticated } from "@/features/auth";
import ThemeToggle from "@/components/common/ThemeToggle";
import InfoModal from "@/components/common/InfoModal"; 
import { FaUser, FaSignOutAlt, FaChevronDown, FaShieldAlt, FaCookieBite, FaQuestionCircle, FaFileContract } from "react-icons/fa";
import toast from "@/utils/toast";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [modalType, setModalType] = useState(null); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    const toastId = toast.loading("Logging out...");
    await dispatch(logoutUser());
    toast.dismiss(toastId);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <h1 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            <span className="text-blue-600">⚡</span> StockTradePro
          </h1>
          
          {/* ✅ PUBLIC NAV: Clean & High-Value Links Only */}
          {!isAuthenticated && (
            <nav className="hidden md:flex ml-8 gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition-colors">About</button>
              {/* Removed FAQ & Terms from here. Users will find them in the Footer. */}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <FaUser size={14} />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-none">
                    {user?.name || 'User'}
                  </p>
                </div>
                <FaChevronDown size={12} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                  
                  {/* Account Links */}
                  <button onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <FaUser size={14} className="text-gray-400" /> My Profile
                  </button>

                  <button onClick={() => { navigate("/faq"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <FaQuestionCircle size={14} className="text-gray-400" /> Help Center
                  </button>

                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />

                  {/* Legal Links (Hidden in Dropdown for Logged In Users) */}
                  <button onClick={() => { setModalType("terms"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <FaFileContract size={14} className="text-gray-400" /> Terms of Service
                  </button>
                  <button onClick={() => { setModalType("privacy"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <FaShieldAlt size={14} className="text-gray-400" /> Privacy Policy
                  </button>
                  <button onClick={() => { setModalType("cookies"); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                    <FaCookieBite size={14} className="text-gray-400" /> Cookie Policy
                  </button>

                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />

                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <FaSignOutAlt size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
               <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Login</button>
               <button onClick={() => navigate('/register')} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30">Sign Up</button>
            </div>
          )}
        </div>
      </header>

      {modalType && <InfoModal type={modalType} onClose={() => setModalType(null)} />}
    </>
  );
};

export default Header;