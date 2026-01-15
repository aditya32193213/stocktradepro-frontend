import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, selectAuthUser, selectIsAuthenticated } from "@/features/auth";
import ThemeToggle from "@/components/common/ThemeToggle";
import InfoModal from "@/components/common/InfoModal"; 
import { FaUser, FaSignOutAlt, FaChevronDown, FaShieldAlt, FaCookieBite, FaQuestionCircle, FaFileContract, FaBolt } from "react-icons/fa";
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
      <header className="relative flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl dark:border-gray-800 shadow-sm sticky top-0 z-50">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
        
        <div className="relative flex items-center gap-6 flex-1">
          {/* Enhanced Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <FaBolt className="text-white text-sm" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              StockTradePro
            </h1>
          </div>
          
          {/* Public Navigation */}
          {!isAuthenticated && (
            <nav className="hidden md:flex ml-4 gap-1 text-sm font-medium">
              <NavButton onClick={() => navigate('/')}>Home</NavButton>
              <NavButton onClick={() => navigate('/about')}>About</NavButton>
            </nav>
          )}
        </div>

        <div className="relative flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center ring-2 ring-blue-200 dark:ring-blue-800">
                    <FaUser size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-none">
                    {user?.name || 'User'}
                  </p>
                </div>
                <FaChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>

                  {/* Account Links */}
                  <div className="py-2">
                    <DropdownItem 
                      icon={FaUser} 
                      onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                    >
                      My Profile
                    </DropdownItem>
                    <DropdownItem 
                      icon={FaQuestionCircle} 
                      onClick={() => { navigate("/faq"); setIsDropdownOpen(false); }}
                    >
                      Help Center
                    </DropdownItem>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />

                  {/* Legal Links */}
                  <div className="py-2">
                    <DropdownItem 
                      icon={FaFileContract} 
                      onClick={() => { setModalType("terms"); setIsDropdownOpen(false); }}
                    >
                      Terms of Service
                    </DropdownItem>
                    <DropdownItem 
                      icon={FaShieldAlt} 
                      onClick={() => { setModalType("privacy"); setIsDropdownOpen(false); }}
                    >
                      Privacy Policy
                    </DropdownItem>
                    <DropdownItem 
                      icon={FaCookieBite} 
                      onClick={() => { setModalType("cookies"); setIsDropdownOpen(false); }}
                    >
                      Cookie Policy
                    </DropdownItem>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />

                  {/* Logout */}
                  <div className="py-2">
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors duration-200 group"
                    >
                      <FaSignOutAlt size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="relative px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </header>

      {modalType && <InfoModal type={modalType} onClose={() => setModalType(null)} />}
    </>
  );
};

// Helper Components
const NavButton = ({ onClick, children }) => (
  <button 
    onClick={onClick} 
    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium"
  >
    {children}
  </button>
);

const DropdownItem = ({ icon: Icon, onClick, children }) => (
  <button 
    onClick={onClick} 
    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors duration-200 group"
  >
    <Icon size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
    <span>{children}</span>
  </button>
);

export default Header;
