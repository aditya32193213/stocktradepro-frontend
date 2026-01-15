/**
 * File: App.jsx
 * Purpose:
 * - Root application component for the frontend
 *
 * Flow:
 * - Acts as a thin wrapper that renders the centralized route configuration
 * - Delegates all routing logic to AppRoutes
 *
 * Why this file exists:
 * - Keeps the entry component minimal and readable
 * - Makes routing scalable and easier to maintain
 */
import { AppRoutes } from "@/routes";

const App = () => {
  return <AppRoutes />;
};

export default App;
