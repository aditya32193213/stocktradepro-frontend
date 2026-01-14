import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import InfoModal from "@/components/common/InfoModal"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState(null); 

  return (
    <>
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-blue-600">⚡</span> StockTradePro
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Empowering the next generation of investors with risk-free trading simulations and real-time market data.
              </p>
              <div className="flex gap-4">
                <SocialLink href="#" icon={FaTwitter} />
                <SocialLink href="#" icon={FaFacebook} />
                <SocialLink href="#" icon={FaInstagram} />
                <SocialLink href="#" icon={FaLinkedin} />
                <SocialLink href="#" icon={FaGithub} />
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/stocks" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Market</Link></li>
                <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Join Now</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                {/* 1. Help Center: Covers FAQs and Guides */}
                <li>
                  <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Help Center
                  </Link>
                </li>
                {/* 2. Contact Us: Specific intent for reaching support */}
                <li>
                  <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => setModalType("privacy")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType("cookies")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType("terms")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} StockTradePro Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Generic Info Modal */}
      {modalType && <InfoModal type={modalType} onClose={() => setModalType(null)} />}
    </>
  );
}

function SocialLink({ href, icon: Icon }) {
  return (
    <a 
      href={href} 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-all"
    >
      <Icon size={14} />
    </a>
  );
}