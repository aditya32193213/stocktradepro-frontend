/**
 * File: AppRoutes.jsx
 * Purpose:
 * - Centralized routing configuration for the application
 *
 * Flow:
 * - Defines public, guest-only, and protected routes
 * - Loads layouts based on authentication state
 * - Fetches user profile on page refresh if token exists
 *
 * Why this file exists:
 * - Keeps routing logic isolated and scalable
 * - Aligns with real-world enterprise routing patterns
 */
import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core";
import { selectIsAuthenticated, selectAuthUser, fetchUserProfile } from "@/features";
import { AppLayout, PublicLayout, ProtectedRoute, GuestRoute} from "@/components";

import {
  Landing,
  Login,
  Register,
  Dashboard,
  StockMarket,
  StockDetail,
  Transactions,
  Portfolio,
  Profile,
  About,
  Watchlist,
  NotFound,
  FAQ
} from "@/pages";

const PageLoader = () => (
  <div data-testid="page-loader" className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
);

export default function AppRoutes() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);

  // Fetch user profile on reload if token exists
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        
        {/* Public Layout (Header + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />

          {/* ✅ WRAP LOGIN & REGISTER IN GUEST ROUTE */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Protected App Layout (Sidebar + Header) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks" element={<StockMarket />} />
          <Route path="/stocks/:id" element={<StockDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </Suspense>
  );
}