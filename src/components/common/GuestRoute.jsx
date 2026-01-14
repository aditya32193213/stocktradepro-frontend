import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "@/features/auth";


export default function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If user is logged in, send them to Dashboard immediately
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child route (Login/Register)
  return <Outlet />;
}