import { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectAuthUser, fetchUserProfile } from "@/features/auth";

import AppLayout from "@/components/layout/AppLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import GuestRoute from "@/components/common/GuestRoute";

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
  <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">
    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  </div>
);

export default function AppRoutes() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectAuthUser);

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