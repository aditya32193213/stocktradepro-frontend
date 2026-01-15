/**
 * File: Login.jsx
 * Purpose:
 * - Handles user authentication (login)
 *
 * Flow:
 * - Validates credentials using react-hook-form + Yup
 * - Dispatches loginUser Redux thunk
 * - Stores JWT on success and redirects to dashboard
 *
 * Key Responsibilities:
 * - Secure login experience
 * - Client-side validation
 * - User feedback via toast notifications
 *
 * Access:
 * - Guest only (redirects authenticated users)
 */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core";
import { useEffect, useState } from "react";
import { loginUser } from "@/features";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils";
import { FaEnvelope, FaLock, FaChartLine, FaShieldAlt, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";

// Validation Schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onSubmit = async (data) => {
    const toastId = showLoading("Logging in...");
    
    try {
      const result = await dispatch(loginUser(data));
      
      dismissToast(toastId);
      
      if (loginUser.fulfilled.match(result)) {
        showSuccess(`Welcome back, ${result.payload.user.name}!`);
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        showError(result.payload || "Login failed");
      }
    } catch (error) {
      dismissToast(toastId);
      showError("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Animated Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
        <div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-indigo-400/10 dark:from-blue-500/20 dark:to-indigo-500/20 blur-[100px] rounded-full animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-l from-violet-400/10 to-purple-400/10 dark:from-violet-500/20 dark:to-purple-500/20 blur-[100px] rounded-full animate-pulse"
          style={{ transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)` }}
        ></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center z-10">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          
          {/* Logo & Tagline */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-700/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/10 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Secure Trading Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Master the Market
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Risk-Free
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Practice trading with <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">₹1,00,000</span> virtual currency. Build your portfolio and refine strategies in a safe environment.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <FeatureItem 
              icon={<FaChartLine />}
              title="Real-Time Data"
              desc="Live market updates with zero latency"
            />
            <FeatureItem 
              icon={<FaShieldAlt />}
              title="100% Safe"
              desc="No real money, no risk - just learning"
            />
            <FeatureItem 
              icon={<FaChartLine />}
              title="Portfolio Tracking"
              desc="Monitor your performance and progress"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard value="10K+" label="Active Traders" />
            <StatCard value="₹50Cr+" label="Virtual Trades" />
            <StatCard value="500+" label="Listed Stocks" />
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="relative group">
            
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Main Card */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-800/60 p-8 md:p-10 transition-all duration-500">
              
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-t-3xl"></div>
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-3">
                  Welcome Back
                </h2>
                <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                  Sign in to continue your trading journey
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 group-focus-within/input:text-blue-500 transition-colors duration-300" />
                    </div>
                    <input
                      {...register("email")}
                      className="block w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base font-medium shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="john@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1 animate-pulse">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Password
                    </label>
                    <Link 
                      to="#" 
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within/input:text-blue-500 transition-colors duration-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="block w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base font-medium shadow-sm hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1 animate-pulse">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="login-submit-btn"
                  className="group/btn relative w-full flex justify-center items-center gap-3 py-4 px-6 mt-4 rounded-xl text-base font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transform transition-all duration-300 hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  {loading ? (
                    <span className="flex items-center gap-3 relative z-10">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3 relative z-10">
                      Sign In to Dashboard
                      <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-4 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 font-bold tracking-wider">
                    New to platform?
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link 
                    to="/register" 
                    className="font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-300 dark:hover:to-indigo-300 transition-all inline-flex items-center gap-1 group/link"
                  >
                    Create Account
                    <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaShieldAlt className="text-green-500" />
                  <span className="font-medium">256-bit SSL Encrypted & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, desc }) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 hover:-translate-x-1">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ value, label }) {
  return (
    <div className="text-center p-4 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}