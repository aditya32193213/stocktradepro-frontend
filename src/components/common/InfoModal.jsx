/**
 * File: InfoModal.jsx
 * Purpose:
 * - Reusable modal for legal and informational content
 *
 * Flow:
 * - Displays dynamic content based on `type` prop
 * - Supports Terms, Privacy Policy, and Cookie Policy
 * - Closes via backdrop or close button
 *
 * Key Responsibilities:
 * - Legal compliance UI
 * - Centralized informational modals
 */

import { FaTimes } from "react-icons/fa";

export default function InfoModal({ type, onClose }) {
  const content = {
    terms: {
      title: "Terms of Service",
      body: (
        <>
          <p className="mb-2"><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
          <p className="mb-4">Welcome to StockTradePro. By using our platform, you agree to the following terms:</p>
          <h4 className="font-semibold mb-1">1. General Usage</h4>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>This is a simulation platform for educational purposes only.</li>
            <li>No real money is involved in any transaction.</li>
          </ul>
          <h4 className="font-semibold mb-1">2. User Account</h4>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>You are responsible for maintaining the confidentiality of your account.</li>
          </ul>
        </>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <>
          <p className="mb-4">Your privacy is important to us. This policy explains how we handle your data.</p>
          <h4 className="font-semibold mb-1">1. Data Collection</h4>
          <p className="mb-4">We only collect necessary information (name, email) to create your account and track your portfolio performance.</p>
          <h4 className="font-semibold mb-1">2. Data Usage</h4>
          <p className="mb-4">Your data is used solely for providing the trading simulation service. We do not sell your data to third parties.</p>
        </>
      )
    },
    cookies: {
      title: "Cookie Policy",
      body: (
        <>
          <p className="mb-4">We use cookies to enhance your experience.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for login and authentication.</li>
            <li><strong>Preference Cookies:</strong> Used to remember your theme (Dark/Light mode) settings.</li>
          </ul>
        </>
      )
    }
  };

  const currentContent = content[type] || content.terms;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentContent.title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 transition-colors p-1"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="prose dark:prose-invert text-sm max-h-[60vh] overflow-y-auto mb-6 text-gray-600 dark:text-gray-300 pr-2">
          {currentContent.body}
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}