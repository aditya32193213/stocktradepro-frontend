/**
 * File: PublicLayout.jsx
 * Purpose:
 * - Layout wrapper for public-facing pages
 *
 * Flow:
 * - Renders Header at top
 * - Renders Footer at bottom
 * - Displays route content via <Outlet />
 *
 * Key Responsibilities:
 * - Maintain consistent public UI
 * - Separate public and authenticated layouts
 */

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}