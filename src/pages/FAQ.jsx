// ============================================
// FAQ.JSX - Ultra Premium FAQ Page
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";
import { 
  FaChevronDown, FaSearch, FaUserShield, FaWallet, 
  FaChartLine, FaLightbulb, FaArrowLeft, FaArrowRight, FaEnvelope, 
  FaHeadset, FaCheckCircle, FaClock, FaBook
} from "react-icons/fa";

export default function FAQ() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [openIndex, setOpenIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const tips = [
    { 
      id: 1, 
      title: "Diversify Your Portfolio", 
      desc: "Don't put all your eggs in one basket. Spread investments across sectors to minimize risk.", 
      icon: FaChartLine,
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      id: 2, 
      title: "Secure Your Account", 
      desc: "Enable Two-Factor Authentication (2FA) in your profile settings for maximum security.", 
      icon: FaUserShield,
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      id: 3, 
      title: "Track Market Trends", 
      desc: "Use our real-time dashboard to spot trends before making your next move.", 
      icon: FaLightbulb,
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const categories = [
    { 
      title: "Getting Started", 
      icon: FaLightbulb, 
      color: "text-yellow-500",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      count: "12 articles"
    },
    { 
      title: "Account & Security", 
      icon: FaUserShield, 
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      count: "8 articles"
    },
    { 
      title: "Billing & Plans", 
      icon: FaWallet, 
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      count: "6 articles"
    }
  ];

  const faqs = [
    { question: "How do I start trading on StockTradePro?", answer: "Simply sign up for an account, verify your email, and you will get virtual currency to practice trading immediately. No real money is required." },
    { question: "Is my personal data safe?", answer: "Yes, we use industry-standard encryption to protect your personal information. We never share your data with third parties without consent." },
    { question: "Can I withdraw the virtual money?", answer: "No, the trading balance is virtual and for educational purposes only. It cannot be withdrawn or converted to real currency." },
    { question: "How are stock prices updated?", answer: "Our system simulates real-time market fluctuations based on live market data feeds, updated every few seconds for a realistic experience." },
    { question: "What happens if I forget my password?", answer: "Click on 'Forgot Password' at the login screen. We will send you a secure link to reset it via your registered email." }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [tips.length]);

  const toggleAccordion = (index) => setOpenIndex(openIndex === index ? null : index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % tips.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + tips.length) % tips.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-gray-900 dark:text-gray-100 pb-16">
        
        {/* Hero Section with Search */}
        <div className="relative overflow-hidden pt-8 pb-12">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="group mb-8 p-3 rounded-xl bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:scale-110 active:scale-95 shadow-lg border border-gray-200 dark:border-gray-800"
            title={isAuthenticated ? "Back to Dashboard" : "Back to Home"}
          >
            <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
          </button>

          {/* Title Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-30"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl inline-block">
                <FaBook className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Help Center
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Search our knowledge base or browse frequently asked questions
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <FaSearch className="absolute left-6 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200 z-10" size={20} />
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Trading Tips Carousel */}
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 md:p-12 overflow-hidden border border-blue-200 dark:border-blue-800/50 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Trading Tips of the Day
              </h2>
            </div>

            <div className="flex items-center justify-between gap-6">
              <button 
                onClick={prevSlide} 
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
              >
                <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
              </button>

              <div className="flex-1 text-center space-y-6 px-4">
                <div className="inline-block relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${tips[currentSlide].gradient} rounded-2xl blur-xl opacity-50`}></div>
                  <div className={`relative p-4 bg-gradient-to-br ${tips[currentSlide].gradient} text-white rounded-2xl shadow-xl inline-block`}>
                    {React.createElement(tips[currentSlide].icon, { size: 40 })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {tips[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                    {tips[currentSlide].desc}
                  </p>
                </div>
              </div>

              <button 
                onClick={nextSlide} 
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
              >
                <FaArrowRight className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {tips.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentSlide(idx)} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx 
                      ? "w-12 bg-gradient-to-r from-blue-600 to-purple-600" 
                      : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="group relative overflow-hidden p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${cat.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  <div className={`relative p-3 bg-gradient-to-br ${cat.gradient} text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon size={32} />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Manage your settings and learn the basics
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaBook size={14} />
                  <span>{cat.count}</span>
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.gradient} opacity-5 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} found` : 'Quick answers to common questions'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`group border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                    openIndex === idx 
                      ? "border-blue-500 dark:border-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 shadow-xl" 
                      : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg"
                  }`}
                >
                  <button 
                    onClick={() => toggleAccordion(idx)} 
                    className="w-full flex items-start justify-between p-6 md:p-7 text-left focus:outline-none gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`mt-1 p-2 rounded-lg transition-all duration-300 ${
                        openIndex === idx 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        <FaCheckCircle size={16} />
                      </div>
                      <span className={`font-semibold text-lg ${
                        openIndex === idx 
                          ? "text-gray-900 dark:text-white" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`mt-1 p-2 rounded-lg transition-all duration-300 ${
                      openIndex === idx 
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rotate-180" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}>
                      <FaChevronDown size={16} />
                    </div>
                  </button>
                  
                  <div className={`grid transition-all duration-300 ease-out ${
                    openIndex === idx 
                      ? "grid-rows-[1fr] opacity-100" 
                      : "grid-rows-[0fr] opacity-0"
                  }`}>
                    <div className="overflow-hidden">
                      <div className="px-6 md:px-7 pb-6 md:pb-7 pt-2">
                        <div className="pl-12 pr-12 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <FaSearch className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={48} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800/50 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

          <div className="relative text-center space-y-6">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl">
                <FaHeadset size={32} />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
              If you couldn't find the answer above, our support team is here to help you with your trading journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
              <a 
                href="mailto:support@stocktradepro.com"
                className="group relative overflow-hidden flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <FaEnvelope size={24} />
                </div>
                <div className="relative text-left flex-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Support</p>
                  <p className="font-semibold text-blue-600 dark:text-blue-400 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    support@stocktradepro.com
                  </p>
                </div>
              </a>

              <div className="group relative overflow-hidden flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                <div className="relative p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-600 dark:text-green-400 rounded-xl">
                  <FaClock size={24} />
                </div>
                <div className="relative text-left flex-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Response Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}