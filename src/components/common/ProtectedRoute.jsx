/**
 * File: ProtectedRoute.jsx
 * Purpose:
 * - Route guard for authenticated pages
 *
 * Flow:
 * - Checks authentication status from Redux
 * - Redirects unauthenticated users to Login
 * - Renders protected content when authenticated
 *
 * Security:
 * - Prevents unauthorized access to protected routes
 */

import { useAppSelector } from "@/core";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "@/features";

/**
 * Protected Route Wrapper
 * Redirects to /login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}