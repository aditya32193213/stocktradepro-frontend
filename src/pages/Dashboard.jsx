import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaBox, FaStar } from "react-icons/fa";
import { fetchDashboardSummary, selectDashboardSummary, selectDashboardLoading } from "@/features/dashboard";
import { DashboardSkeleton } from "@/components/common/SkeletonLoader";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const summary = useSelector(selectDashboardSummary);
  const loading = useSelector(selectDashboardLoading);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Overview of your portfolio and market activity
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Available Balance"
          value={`₹${summary.balance.toLocaleString()}`}
          icon={<FaWallet />}
          color="blue"
        />
        <SummaryCard
          title="Invested Amount"
          value={`₹${summary.netInvestedAmount.toLocaleString()}`}
          icon={<FaChartLine />}
          color="green"
        />
        <SummaryCard
          title="Total Holdings"
          value={summary.holdingsCount}
          icon={<FaBox />}
          color="purple"
        />
        <SummaryCard
          title="Watchlist"
          value={summary.watchlistCount}
          icon={<FaStar />}
          color="yellow"
        />
      </div>

      {/* Lower Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h2 className="font-medium mb-4">Portfolio Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
              <span className="font-medium">₹{summary.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Invested Amount:</span>
              <span className="font-medium">₹{summary.netInvestedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
              <span className="text-gray-600 dark:text-gray-400">Holdings:</span>
              <span className="font-medium">{summary.holdingsCount} stocks</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h2 className="font-medium mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate("/stocks")}
              className="block w-full px-4 py-2 text-center text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Browse Stocks
            </button>
            <button
              onClick={() => navigate("/portfolio")}
              className="block w-full px-4 py-2 text-center text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View Portfolio
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="block w-full px-4 py-2 text-center text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Summary Card Component */
function SummaryCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <span className={`text-lg p-2 rounded-md ${colorClasses[color]}`}>
          {icon}
        </span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}