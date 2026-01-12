import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  fetchPortfolio,
  selectPortfolioHoldings,
  selectPortfolioSummary,
  selectPortfolioLoading,
} from "@/features/portfolio";
import { DashboardSkeleton } from "@/components/common/SkeletonLoader";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Portfolio() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const holdings = useSelector(selectPortfolioHoldings);
  const summary = useSelector(selectPortfolioSummary);
  const loading = useSelector(selectPortfolioLoading);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  if (loading && holdings.length === 0) {
    return <DashboardSkeleton />;
  }

  // Prepare pie chart data
  const chartData = holdings.map((holding, index) => ({
    name: holding.stock.symbol,
    value: holding.currentValue,
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your stock holdings and profit/loss analysis
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Holdings"
          value={summary.totalHoldings}
          icon={<FaChartLine />}
        />
        <SummaryCard
          title="Total Invested"
          value={`₹${summary.totalInvested.toLocaleString()}`}
        />
        <SummaryCard
          title="Current Value"
          value={`₹${summary.totalCurrentValue.toLocaleString()}`}
        />
        <SummaryCard
          title="Total P&L"
          value={`₹${summary.totalPnL.toLocaleString()}`}
          valueClass={summary.totalPnL >= 0 ? "text-green-600" : "text-red-600"}
          badge={
            <span
              className={`text-sm font-medium ${
                summary.totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {summary.totalPnLPercent >= 0 ? "+" : ""}
              {summary.totalPnLPercent}%
            </span>
          }
        />
      </div>

      {/* P&L Breakdown & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Breakdown */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Unrealized P&L
            </h3>
            <div className="flex items-center justify-between">
              <span
                className={`text-2xl font-semibold ${
                  summary.totalUnrealizedPnL >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{summary.totalUnrealizedPnL.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (on current holdings)
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Realized P&L
            </h3>
            <div className="flex items-center justify-between">
              <span
                className={`text-2xl font-semibold ${
                  summary.totalRealizedPnL >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{summary.totalRealizedPnL.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (from sold stocks)
              </span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        {chartData.length > 0 && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Portfolio Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You don't have any holdings yet.
          </p>
          <button
            onClick={() => navigate("/stocks")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            Browse Stocks
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Avg Price</th>
                <th className="px-4 py-3 text-right">Current Price</th>
                <th className="px-4 py-3 text-right">Invested</th>
                <th className="px-4 py-3 text-right">Current Value</th>
                <th className="px-4 py-3 text-right">P&L</th>
                <th className="px-4 py-3 text-right">Returns</th>
              </tr>
            </thead>

            <tbody>
              {holdings.map((holding) => {
                const isProfitable = holding.totalPnL >= 0;

                return (
                  <tr
                    key={holding.stock._id}
                    onClick={() => navigate(`/stocks/${holding.stock._id}`)}
                    className="border-t border-gray-200 dark:border-gray-800
                               hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {holding.stock.logoUrl ? (
                          <img
                            src={holding.stock.logoUrl}
                            alt={holding.stock.symbol}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/32x32.png?text=${holding.stock.symbol.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                            {holding.stock.symbol.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium">
                            {holding.stock.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {holding.stock.companyName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {holding.quantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{holding.avgBuyPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{holding.stock.currentPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ₹{holding.currentInvestment.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{holding.currentValue.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        isProfitable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {isProfitable ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        ₹{Math.abs(holding.totalPnL).toLocaleString()}
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        isProfitable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isProfitable ? "+" : ""}
                      {((holding.totalPnL / holding.currentInvestment) * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
        <h3 className="text-sm font-medium mb-3">Understanding P&L</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-green-600">Unrealized P&L:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Profit/loss on stocks you currently hold
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-600">Realized P&L:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Profit/loss from stocks you've sold
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, valueClass = "", badge }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {icon && (
          <span className="text-lg text-gray-500 dark:text-gray-400">
            {icon}
          </span>
        )}
      </div>
      <div className={`text-xl font-semibold ${valueClass}`}>
        {value}
      </div>
      {badge && <div className="mt-1">{badge}</div>}
    </div>
  );
}