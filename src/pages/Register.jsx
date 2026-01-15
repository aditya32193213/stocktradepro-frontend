/**
 * File: Register.jsx
 * Purpose:
 * - New user registration page
 *
 * Flow:
 * - Validates user input using Yup schema
 * - Tracks password strength in real-time
 * - Dispatches registerUser Redux thunk
 * - Redirects to login after successful registration
 *
 * Key Responsibilities:
 * - Enforce strong password & PAN validation
 * - Improve UX with visual feedback
 * - Prevent invalid registrations
 *
 * Access:
 * - Public (unauthenticated users)
 */

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core";
import { registerUser } from "@/features";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils";
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

// Validation Schema
const schema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").max(100).required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  mobile: yup.string().matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits").required("Mobile is required"),
  pan: yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format").required("PAN is required"),
  password: yup.string().min(8, "Min 8 characters")
    .matches(/[A-Z]/, "One uppercase")
    .matches(/[a-z]/, "One lowercase")
    .matches(/[0-9]/, "One number")
    .matches(/[@$!%*?&#]/, "One special char")
    .required("Password is required"),
});

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch("password", "");

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&#]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const onSubmit = async (data) => {
    const toastId = showLoading("Creating account...");
    const result = await dispatch(registerUser(data));
    dismissToast(toastId);
    
    if (registerUser.fulfilled.match(result)) {
      showSuccess("Account created! Please login.");
      navigate("/login");
    } else {
      showError(typeof result.payload === "string" ? result.payload : "Registration failed");
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    if (passwordStrength <= 4) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/30 px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Theme Toggle Positioned Absolute */}
      <div className="absolute top-6 right-6 z-20">
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 dark:from-blue-600/20 dark:to-indigo-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/30 to-pink-500/30 dark:from-purple-600/20 dark:to-pink-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/10 dark:to-blue-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />

      {/* Main Card Container */}
      <div className="w-full max-w-2xl relative z-10">
        
        {/* Glassmorphism Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 p-8 md:p-12 relative overflow-hidden">
          
          {/* Card Glow Effect */}
          <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          
          {/* Header Section */}
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6 transform hover:scale-110 transition-transform duration-300">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-3 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-medium">
              Join <span className="text-blue-600 dark:text-blue-400 font-bold">thousands of traders</span> and start your journey today
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-indigo-500 rounded-full" />
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                  <FaUser className="w-3 h-3" />
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'name' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                    <FaUser className="w-4 h-4" />
                  </div>
                  <input
                    {...register("name")}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <FaTimesCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
                    <FaTimesCircle className="w-3 h-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                  <FaEnvelope className="w-3 h-3" />
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    {...register("email")}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <FaTimesCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
                    <FaTimesCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Mobile & PAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobile */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                  <FaPhone className="w-3 h-3" />
                  Mobile Number
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'mobile' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                    <FaPhone className="w-4 h-4" />
                  </div>
                  <input
                    {...register("mobile")}
                    onFocus={() => setFocusedField('mobile')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                    placeholder="9876543210"
                  />
                  {errors.mobile && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <FaTimesCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.mobile && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
                    <FaTimesCircle className="w-3 h-3" />
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              {/* PAN */}
              <div className="space-y-2 group">
                <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                  <FaIdCard className="w-3 h-3" />
                  PAN Card
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'pan' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                    <FaIdCard className="w-4 h-4" />
                  </div>
                  <input
                    {...register("pan")}
                    onFocus={() => setFocusedField('pan')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md uppercase"
                    placeholder="ABCDE1234F"
                  />
                  {errors.pan && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <FaTimesCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.pan && (
                  <p className="text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
                    <FaTimesCircle className="w-3 h-3" />
                    {errors.pan.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Password */}
            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 tracking-wider ml-1 flex items-center gap-2">
                <FaLock className="w-3 h-3" />
                Password
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-blue-500 scale-110' : 'text-gray-400'}`}>
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      Password Strength
                    </span>
                    <span className={`text-xs font-bold ${
                      passwordStrength <= 2 ? 'text-red-500' :
                      passwordStrength <= 3 ? 'text-yellow-500' :
                      passwordStrength <= 4 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center gap-2 text-xs ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {password.length >= 8 ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {/[A-Z]/.test(password) ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${/[a-z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {/[a-z]/.test(password) ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {/[0-9]/.test(password) ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-2 text-xs col-span-2 ${/[@$!%*?&#]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                      {/[@$!%*?&#]/.test(password) ? <FaCheckCircle className="w-3 h-3" /> : <FaTimesCircle className="w-3 h-3" />}
                      <span>Special character (@$!%*?&#)</span>
                    </div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
                  <FaTimesCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold text-sm uppercase tracking-wide shadow-xl shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/50 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 font-medium backdrop-blur-sm">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <button
            type="button"
            onClick={() => toast.error("Google Auth requires backend configuration (Coming Soon)")}
            className="group w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 group-hover:scale-110 transition-transform" alt="Google" />
            <span>Sign up with Google</span>
          </button>
          
          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all duration-300 inline-flex items-center gap-1 group"
              >
                Log in
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}