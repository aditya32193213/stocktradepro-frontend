
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaChartLine, FaWallet, FaBox, FaChartPie, FaShoppingCart } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  fetchPortfolio,
  selectPortfolioHoldings,
  selectPortfolioSummary,
  selectPortfolioLoading,
} from "@/features/portfolio";
import { StockLogo } from "@/components";
import { DashboardSkeleton } from "@/components/common/SkeletonLoader";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'];

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

  const chartData = holdings.map((holding, index) => ({
    name: holding.stock.symbol,
    value: holding.currentValue,
    fill: COLORS[index % COLORS.length]
  }));

  const isProfitable = summary.totalPnL >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto text-gray-900 dark:text-gray-100">
        
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 lg:p-10 shadow-2xl shadow-purple-500/20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            {/* Left: Title Section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <FaWallet className="text-white" size={12} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Your Portfolio</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
                Portfolio Overview
              </h1>
              <p className="text-blue-100 text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
                Track your investments, analyze returns, and monitor portfolio performance in real-time
              </p>
            </div>
            
            {/* Right: Total P&L Card */}
            <div className="w-full lg:w-auto min-w-[320px]">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-xl ${isProfitable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <FaArrowTrendUp className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Total P&L</p>
                    <p className={`text-sm font-bold ${isProfitable ? 'text-green-300' : 'text-red-300'}`}>
                      {isProfitable ? '+' : ''}{summary.totalPnLPercent}% Returns
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isProfitable ? <FaArrowUp className="text-green-300" /> : <FaArrowDown className="text-red-300" />}
                  <h2 className={`text-4xl lg:text-5xl font-black tracking-tight ${isProfitable ? 'text-green-300' : 'text-red-300'}`}>
                    ₹{Math.abs(summary.totalPnL).toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <SummaryCard
            title="Total Holdings"
            value={summary.totalHoldings}
            icon={FaBox}
            color="purple"
            trend="neutral"
          />
          <SummaryCard
            title="Total Invested"
            value={`₹${summary.totalInvested.toLocaleString()}`}
            icon={FaWallet}
            color="blue"
            trend="neutral"
          />
          <SummaryCard
            title="Current Value"
            value={`₹${summary.totalCurrentValue.toLocaleString()}`}
            icon={FaChartLine}
            color="green"
            trend="up"
            change={`+${((summary.totalCurrentValue - summary.totalInvested) / summary.totalInvested * 100).toFixed(2)}%`}
          />
          <SummaryCard
            title="Net Returns"
            value={`₹${summary.totalPnL.toLocaleString()}`}
            icon={FaArrowTrendUp}
            color={isProfitable ? "green" : "red"}
            trend={isProfitable ? "up" : "down"}
            badge={`${isProfitable ? '+' : ''}${summary.totalPnLPercent}%`}
          />
        </div>

        {/* P&L Breakdown & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* P&L Breakdown Cards */}
          <div className="space-y-4">
            <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 rounded-full blur-3xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <FaChartLine className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Unrealized P&L
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Current holdings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {summary.totalUnrealizedPnL >= 0 ? (
                    <FaArrowUp className="text-green-600 dark:text-green-400" />
                  ) : (
                    <FaArrowDown className="text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-3xl font-black ${
                    summary.totalUnrealizedPnL >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    ₹{Math.abs(summary.totalUnrealizedPnL).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Potential gain/loss if you sell now
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/10 rounded-full blur-3xl opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FaWallet className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Realized P&L
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">From sold stocks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {summary.totalRealizedPnL >= 0 ? (
                    <FaArrowUp className="text-green-600 dark:text-green-400" />
                  ) : (
                    <FaArrowDown className="text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-3xl font-black ${
                    summary.totalRealizedPnL >= 0 
                      ? "text-green-600 dark:text-green-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    ₹{Math.abs(summary.totalRealizedPnL).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Actual profit/loss booked
                </p>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <FaChartPie className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800 dark:text-white">Portfolio Distribution</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Holdings by current value</p>
              </div>
            </div>
            
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${((entry.value / summary.totalCurrentValue) * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm font-semibold">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <div className="text-center space-y-2">
                  <FaChartPie size={48} className="mx-auto opacity-30" />
                  <p className="text-sm font-medium">No data to display</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        {holdings.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full">
                  <FaBox className="text-gray-400 dark:text-gray-600" size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Holdings Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Start building your portfolio by exploring stocks and making your first investment
                </p>
              </div>
              <button
                onClick={() => navigate("/stocks")}
                className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                <FaShoppingCart size={16} />
                Browse Stocks
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-800/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FaBox className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-800 dark:text-white">Your Holdings</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{holdings.length} active position{holdings.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50 sticky top-0 z-10 border-b-2 border-blue-200 dark:border-blue-800">
                  <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-black">
                    <th className="px-6 py-5 text-left">Stock</th>
                    <th className="px-6 py-5 text-right">Quantity</th>
                    <th className="px-6 py-5 text-right">Avg Price</th>
                    <th className="px-6 py-5 text-right">Current Price</th>
                    <th className="px-6 py-5 text-right">Invested</th>
                    <th className="px-6 py-5 text-right">Current Value</th>
                    <th className="px-6 py-5 text-right">P&L</th>
                    <th className="px-6 py-5 text-right">Returns</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {holdings.map((holding, index) => {
                    const isHoldingProfitable = holding.totalPnL >= 0;

                    return (
                      <tr
                        key={holding.stock._id}
                        onClick={() => navigate(`/stocks/${holding.stock._id}`)}
                        className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/5 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <StockLogo
                              src={holding.stock.logoUrl}
                              symbol={holding.stock.symbol}
                              alt={holding.stock.companyName}
                              size="sm"
                              className="shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-700 transition-all group-hover:scale-110"
                            />
                            <div>
                              <div className="font-black text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {holding.stock.symbol}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {holding.stock.companyName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm border border-gray-200 dark:border-gray-700">
                            {holding.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-mono font-medium text-gray-700 dark:text-gray-300">
                          ₹{holding.avgBuyPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-right font-mono font-bold text-gray-900 dark:text-white">
                          ₹{holding.stock.currentPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-right font-mono font-medium text-gray-700 dark:text-gray-300">
                          ₹{holding.currentInvestment.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-right font-mono font-bold text-gray-900 dark:text-white">
                          ₹{holding.currentValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-bold shadow-md transition-all group-hover:scale-105 ${
                            isHoldingProfitable 
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                              : "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                            <span className={`p-1 rounded ${isHoldingProfitable ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'}`}>
                              {isHoldingProfitable ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                            </span>
                            ₹{Math.abs(holding.totalPnL).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-black text-sm ${
                            isHoldingProfitable
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                            {isHoldingProfitable ? "+" : ""}
                            {((holding.totalPnL / holding.currentInvestment) * 100).toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                <FaChartLine className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">
                  Unrealized P&L
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Represents potential profit or loss on stocks you currently hold. This value changes with market prices and is only realized when you sell.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/5 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                <FaWallet className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
                  Realized P&L
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Actual profit or loss from stocks you've already sold. This is your booked gain or loss and directly impacts your portfolio returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, trend, change, badge }) {
  const colors = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      icon: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      border: "border-blue-200 dark:border-blue-800"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-800/10",
      icon: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
      border: "border-green-200 dark:border-green-800"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-violet-100/50 dark:from-purple-900/20 dark:to-violet-800/10",
      icon: "bg-gradient-to-br from-purple-500 to-violet-600 text-white",
      border: "border-purple-200 dark:border-purple-800"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-rose-100/50 dark:from-red-900/20 dark:to-rose-800/10",
      icon: "bg-gradient-to-br from-red-500 to-rose-600 text-white",
      border: "border-red-200 dark:border-red-800"
    }
  };

  const colorScheme = colors[color];

  return (
    <div className={`group relative rounded-2xl border ${colorScheme.border} ${colorScheme.bg} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
            {title}
          </p>
          <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          <div className="flex items-center gap-2">
            {change && (
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                {change}
              </span>
            )}
            {badge && (
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                color === 'green' 
                  ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' 
                  : color === 'red'
                  ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className={`p-4 rounded-xl ${colorScheme.icon} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}