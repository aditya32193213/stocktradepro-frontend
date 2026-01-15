/**
 * File: ThemeToggle.jsx
 * Purpose:
 * - Toggle between light and dark themes
 *
 * Flow:
 * - Reads theme from ThemeContext
 * - Toggles theme state on user interaction
 *
 * Key Responsibilities:
 * - Improve accessibility and UX
 * - Persist theme preference across sessions
 */

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/core";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-md p-2 text-gray-700 hover:bg-gray-200 
                 dark:text-gray-300 dark:hover:bg-gray-800 transition"
    >
      {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
};

export default ThemeToggle;
