/**
 * File: Footer.jsx
 * Purpose:
 * - Global footer component for public pages
 *
 * Flow:
 * - Displays brand info, navigation links, and social icons
 * - Opens legal documents in modal dialogs
 *
 * Key Responsibilities:
 * - Branding and trust signals
 * - Legal compliance (privacy, terms, cookies)
 *
 * Access:
 * - Public layout only
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaBolt, FaHeart } from "react-icons/fa";
import { InfoModal } from "@/components/common";
import clsx from "clsx";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState(null); 

  return (
    <>
      <footer className="relative border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-16 pb-8 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FaBolt className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StockTradePro
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Empowering the next generation of investors with risk-free trading simulations and real-time market data.
              </p>
              <div className="flex gap-3">
                <SocialLink href="#" icon={FaTwitter} color="hover:bg-blue-500" />
                <SocialLink href="#" icon={FaFacebook} color="hover:bg-blue-600" />
                <SocialLink href="#" icon={FaInstagram} color="hover:bg-pink-500" />
                <SocialLink href="#" icon={FaLinkedin} color="hover:bg-blue-700" />
                <SocialLink href="#" icon={FaGithub} color="hover:bg-gray-800" />
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                Platform
              </h4>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/stocks">Market</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/register">Join Now</FooterLink>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                Support
              </h4>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/faq">Help Center</FooterLink>
                <FooterLink to="/faq">Contact Us</FooterLink>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-pink-600 to-red-600 rounded-full"></div>
                Legal
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button 
                    onClick={() => setModalType("privacy")} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType("cookies")} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType("terms")} 
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                © {currentYear} StockTradePro Inc. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                Made with <FaHeart className="text-red-500 animate-pulse" /> for investors
              </p>
            </div>
          </div>
        </div>
      </footer>

       {modalType && (<div data-testid="info-modal"><InfoModal type={modalType} onClose={() => setModalType(null)} /></div>)}
    </>
  );
}

// Helper Components
function SocialLink({ href, icon: Icon, color }) {
  return (
    <a 
      href={href} 
      className={clsx(
        "group relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all duration-200 hover:text-white hover:scale-110 active:scale-95",
        color
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
      <Icon size={16} className="relative z-10" />
    </a>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1 inline-block font-medium"
      >
        {children}
      </Link>
    </li>
  );
}