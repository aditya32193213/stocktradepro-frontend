import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "@/app/context/ThemeContext";

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
