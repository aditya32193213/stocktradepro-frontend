/**
 * File: GuestRoute.jsx
 * Purpose:
 * - Route guard for guest-only pages
 *
 * Flow:
 * - Checks authentication status from Redux
 * - Redirects authenticated users to Dashboard
 * - Allows unauthenticated users to access child routes
 *
 * Key Responsibilities:
 * - Prevent logged-in users from accessing Login/Register
 */

import { useAppSelector } from "@/core";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "@/features";


export default function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // If user is logged in, send them to Dashboard immediately
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child route (Login/Register)
  return <Outlet />;
}