/**
 * File: AppLayout.jsx
 * Purpose:
 * - Main application layout for authenticated users
 *
 * Flow:
 * - Renders Sidebar and Header
 * - Displays protected route content via <Outlet />
 *
 * Key Responsibilities:
 * - Provide consistent layout for dashboard pages
 * - Separate layout concerns from page logic
 *
 * Access:
 * - Used only inside ProtectedRoute
 */

import { Outlet } from "react-router-dom";
import { Header, Sidebar } from "@/components";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Route Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AppLayout;