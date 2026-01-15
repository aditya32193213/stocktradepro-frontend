/**
 * File: ThemeContext.jsx
 * Purpose:
 * - Global theme (Dark / Light mode) provider
 *
 * Flow:
 * - Reads theme preference from localStorage
 * - Applies theme class to document root
 * - Persists user preference across sessions
 *
 * Key Responsibilities:
 * - Centralize theme management
 * - Provide theme toggle functionality
 */

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
