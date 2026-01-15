/**
 * File: BackButton.jsx
 * Purpose:
 * - Reusable back navigation button
 *
 * Flow:
 * - Navigates to a specific route if `to` prop is provided
 * - Falls back to browser history navigation (-1)
 *
 * Key Responsibilities:
 * - Provide consistent back navigation UX
 * - Reduce repeated navigation logic
 */

import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton({ to, label = "Back" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                 text-gray-700 dark:text-gray-300
                 hover:text-blue-600 dark:hover:text-blue-400
                 transition-colors"
    >
      <FaArrowLeft size={14} />
      <span>{label}</span>
    </button>
  );
}