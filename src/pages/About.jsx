/**
 * File: About.jsx
 * Purpose:
 * - Public-facing About page describing StockTradePro
 *
 * Flow:
 * - Detects authentication status
 * - Provides contextual back navigation (Dashboard / Home)
 * - Displays platform mission, values, team, and CTA
 *
 * Key Responsibilities:
 * - Brand storytelling
 * - Trust building via stats, values, and team
 * - Marketing + informational role
 *
 * Access:
 * - Public (adapts behavior if user is authenticated)
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/core";
import { selectIsAuthenticated } from "@/features";
import { FaLinkedin, FaTwitter, FaGithub, FaRocket, FaUsers, FaLightbulb, FaArrowLeft, FaShieldAlt, FaBolt, FaChartLine } from "react-icons/fa";

export default function About() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const teamMembers = [
    {
      id: 1,
      name: "Aditya Sharma",
      role: "Co-Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
      bio: "Visionary leader with 10+ years in Fintech. Passionate about democratizing stock trading for everyone.",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      bio: "Tech architect behind our real-time engine. previously led engineering teams at major tech giants.",
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "Head of Product",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      bio: "Product strategist focused on user-centric design and simplifying complex financial data.",
    },
    {
      id: 4,
      name: "Sarah Jenkins",
      role: "Lead Analyst",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Expert market analyst ensuring our data insights are accurate and actionable for traders.",
    },
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Constantly pushing the boundaries of what's possible in fintech with cutting-edge technology.",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    },
    {
      icon: FaUsers,
      title: "Community",
      description: "Building a vibrant community of traders who learn, grow, and succeed together.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    {
      icon: FaRocket,
      title: "Speed",
      description: "Delivering lightning-fast execution and real-time updates so you never miss a beat.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Traders", icon: FaUsers },
    { number: "₹500M+", label: "Trading Volume", icon: FaChartLine },
    { number: "99.9%", label: "Uptime", icon: FaShieldAlt },
    { number: "24/7", label: "Support", icon: FaBolt }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 text-gray-900 dark:text-gray-100">
        
        {/* Hero Section with Back Button */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative text-center space-y-6 py-16 px-6">
            {/* Back Button */}
            <button 
              onClick={handleBack}
              className="absolute left-6 top-6 group p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:scale-110 active:scale-95 shadow-lg"
              title={isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            >
              <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            </button>

            {/* Icon */}
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 shadow-xl">
                <FaRocket size={32} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About StockTradePro
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
              Empowering traders with real-time data, advanced analytics, and a seamless trading experience. We believe financial freedom should be accessible to everyone.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="group p-4 md:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <stat.icon className="text-blue-600 dark:text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" size={24} />
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="group relative overflow-hidden p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Gradient */}
                  <div className="relative inline-block mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                    <div className={`relative p-3 rounded-xl bg-gradient-to-br ${value.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon size={28} />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Passionate experts dedicated to revolutionizing your trading experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Profile Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-6 overflow-hidden">
                  {/* Decorative Blur */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                  
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="relative h-36 w-36 rounded-full border-4 border-white dark:border-gray-800 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" 
                    />
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {member.name}
                  </h3>
                  
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed min-h-[60px]">
                    {member.bio}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-2">
                    <SocialIcon Icon={FaLinkedin} hoverColor="hover:bg-blue-600" />
                    <SocialIcon Icon={FaTwitter} hoverColor="hover:bg-blue-400" />
                    <SocialIcon Icon={FaGithub} hoverColor="hover:bg-gray-800" />
                  </div>
                </div>

                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl text-white shadow-2xl">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative text-center py-16 px-6 space-y-6">
            <div className="inline-block p-4 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <FaRocket size={32} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to start your trading journey?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Join thousands of traders on StockTradePro today and experience the future of investing.
            </p>
            
            <button 
              onClick={() => navigate(isAuthenticated ? "/stocks" : "/register")}
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95"
            >
              <span>{isAuthenticated ? "Explore Market" : "Get Started Now"}</span>
              <FaRocket className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component
function SocialIcon({ Icon, hoverColor }) {
  return (
    <a 
      href="#" 
      className={`p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white ${hoverColor} transition-all duration-200 hover:scale-110 active:scale-95`}
    >
      <Icon size={16} />
    </a>
  );
}
