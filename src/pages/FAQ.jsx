import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";
import { 
  FaChevronDown, FaChevronUp, FaSearch, FaUserShield, FaWallet, 
  FaChartLine, FaLightbulb, FaArrowLeft, FaArrowRight, FaEnvelope, FaHeadset 
} from "react-icons/fa";

export default function FAQ() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [openIndex, setOpenIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const tips = [
    { id: 1, title: "Diversify Your Portfolio", desc: "Don't put all your eggs in one basket. Spread investments across sectors to minimize risk.", icon: <FaChartLine size={40} className="text-blue-500" /> },
    { id: 2, title: "Secure Your Account", desc: "Enable Two-Factor Authentication (2FA) in your profile settings for maximum security.", icon: <FaUserShield size={40} className="text-green-500" /> },
    { id: 3, title: "Track Market Trends", desc: "Use our real-time dashboard to spot trends before making your next move.", icon: <FaLightbulb size={40} className="text-yellow-500" /> }
  ];

  const faqs = [
    { question: "How do I start trading on StockTradePro?", answer: "Simply sign up for an account, verify your email, and you will get virtual currency to practice trading immediately. No real money is required." },
    { question: "Is my personal data safe?", answer: "Yes, we use industry-standard encryption to protect your personal information. We never share your data with third parties without consent." },
    { question: "Can I withdraw the virtual money?", answer: "No, the trading balance is virtual and for educational purposes only. It cannot be withdrawn or converted to real currency." },
    { question: "How are stock prices updated?", answer: "Our system simulates real-time market fluctuations based on live market data feeds, updated every few seconds for a realistic experience." },
    { question: "What happens if I forget my password?", answer: "Click on 'Forgot Password' at the login screen. We will send you a secure link to reset it via your registered email." }
  ];

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
    <div className="space-y-12 text-gray-900 dark:text-gray-100 pb-10">
      
      {/* 1. Hero Section with Back Button */}
      <div className="relative text-center space-y-4 py-8">
        
        {/* ✅ Integrated Back Arrow */}
        <button 
          onClick={handleBack}
          className="absolute left-0 top-8 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 group"
          title={isAuthenticated ? "Back to Dashboard" : "Back to Home"}
        >
          <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Help Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Search our knowledge base or browse frequently asked questions.
        </p>
        <div className="relative max-w-lg mx-auto">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search for answers..." className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
        </div>
      </div>

      {/* 2. Carousel Section */}
      <div className="relative bg-blue-50 dark:bg-gray-800/50 rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">Trading Tips of the Day</h2>
        <div className="flex items-center justify-between">
          <button onClick={prevSlide} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><FaArrowLeft /></button>
          <div className="text-center space-y-3 max-w-2xl px-4 animate-fadeIn">
            <div className="flex justify-center mb-2">{tips[currentSlide].icon}</div>
            <h3 className="text-2xl font-bold">{tips[currentSlide].title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{tips[currentSlide].desc}</p>
          </div>
          <button onClick={nextSlide} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"><FaArrowRight /></button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {tips.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-8 bg-blue-600" : "w-2 bg-gray-300 dark:bg-gray-600"}`} />
          ))}
        </div>
      </div>

      {/* 3. Hover Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Getting Started", icon: <FaLightbulb />, color: "text-yellow-500" },
          { title: "Account & Security", icon: <FaUserShield />, color: "text-green-500" },
          { title: "Billing & Plans", icon: <FaWallet />, color: "text-purple-500" }
        ].map((cat, idx) => (
          <div key={idx} className="group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className={`text-4xl ${cat.color} mb-4 group-hover:scale-110 transition-transform`}>{cat.icon}</div>
            <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{cat.title}</h3>
            <p className="text-sm text-gray-500 mt-2">Manage your settings and learn the basics.</p>
          </div>
        ))}
      </div>

      {/* 4. Accordion */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`border rounded-lg overflow-hidden transition-all duration-300 ${openIndex === idx ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"}`}>
              <button onClick={() => toggleAccordion(idx)} className="w-full flex items-center justify-between p-5 text-left font-medium focus:outline-none">
                <span>{faq.question}</span>
                {openIndex === idx ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">{faq.answer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Contact Us Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 mt-12 text-center border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <FaHeadset className="text-blue-600" /> Still need help?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto">
          If you couldn't find the answer above, our support team is here to help you with your trading journey.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a 
            href="mailto:support@stocktradepro.com"
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 group"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
              <FaEnvelope />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Email Support</p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">support@stocktradepro.com</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  );
}