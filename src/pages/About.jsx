import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";
import { FaLinkedin, FaTwitter, FaGithub, FaRocket, FaUsers, FaLightbulb, FaArrowLeft } from "react-icons/fa";

export default function About() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

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

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12 text-gray-900 dark:text-gray-100">
      
      {/* 1. Hero Section (With Integrated Back Arrow) */}
      <div className="relative text-center space-y-4 py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        
        {/* ✅ Back Arrow Integrated directly into Page Header */}
        <button 
          onClick={handleBack}
          className="absolute left-6 top-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 group"
          title={isAuthenticated ? "Back to Dashboard" : "Back to Home"}
        >
          <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-2">
          <FaRocket size={24} />
        </div>
        <h1 className="text-4xl font-bold">About StockTradePro</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Empowering traders with real-time data, advanced analytics, and a seamless trading experience. We believe financial freedom should be accessible to everyone.
        </p>
      </div>

      {/* 2. Our Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <FaLightbulb className="text-yellow-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Innovation</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Constantly pushing the boundaries of what's possible in fintech with cutting-edge technology.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <FaUsers className="text-green-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Community</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Building a vibrant community of traders who learn, grow, and succeed together.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <FaRocket className="text-purple-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">Speed</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Delivering lightning-fast execution and real-time updates so you never miss a beat.
          </p>
        </div>
      </div>

      {/* 3. Our Team & Co-Founders */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Profile Image */}
              <div className="h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-700 shadow-md group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              
              {/* Details */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {member.bio}
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center gap-4 text-gray-400">
                  <a href="#" className="hover:text-blue-600 transition-colors"><FaLinkedin size={18} /></a>
                  <a href="#" className="hover:text-blue-400 transition-colors"><FaTwitter size={18} /></a>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors"><FaGithub size={18} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to start your trading journey?</h2>
        <p className="mb-6 opacity-90">Join thousands of traders on StockTradePro today.</p>
        <button 
          onClick={() => navigate(isAuthenticated ? "/stocks" : "/register")}
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
        >
          {isAuthenticated ? "Explore Market" : "Get Started Now"}
        </button>
      </div>

    </div>
  );
}