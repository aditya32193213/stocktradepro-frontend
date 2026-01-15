/**
 * File: Dashboard.jsx
 * Purpose:
 * - Main user landing page after login
 *
 * Flow:
 * - Fetches dashboard summary on mount
 * - Refreshes summary periodically (polling)
 * - Displays portfolio KPIs, market overview, and watchlist preview
 *
 * Key Responsibilities:
 * - Real-time portfolio overview
 * - Quick navigation to core features
 * - Watchlist management from dashboard
 *
 * Access:
 * - Protected (authenticated users only)
 */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/core";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaBox, FaStar, FaArrowUp, FaArrowDown, FaTrash, FaRegChartBar, FaFire } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { fetchDashboardSummary, selectDashboardSummary, selectDashboardLoading, removeFromWatchlist } from "@/features";
import { StockLogo ,DashboardSkeleton} from "@/components";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils";

export default function Dashboard() {
 const dispatch = useAppDispatch(); // ✅ Updated
  const navigate = useNavigate();
  
  const summary = useAppSelector(selectDashboardSummary); // ✅ Updated
  const loading = useAppSelector(selectDashboardLoading); // ✅ Updated

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    const interval = setInterval(() => {
      dispatch(fetchDashboardSummary());
    }, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRemoveFromWatchlist = async (e, stockId, symbol) => {
    e.stopPropagation();
    const toastId = showLoading(`Removing ${symbol}...`);
    
    // Pass the watchlist ID if available, or handle based on API requirement
    const result = await dispatch(removeFromWatchlist(stockId));
    
    dismissToast(toastId);
    if (removeFromWatchlist.fulfilled.match(result)) {
      showSuccess(`${symbol} removed`);
      dispatch(fetchDashboardSummary()); // Refresh preview
    } else {
      showError("Failed to remove");
    }
  };

  if (loading && !summary) {
    return <DashboardSkeleton />;
  }

  const defaultData = { 
    balance: 0, totalPortfolioValue: 0, netInvestedAmount: 0, totalProfitLoss: 0,
    holdingsCount: 0, watchlistCount: 0, watchlistPreview: [] 
  };

  const data = { ...defaultData, ...(summary || {}) };
  const isProfit = (data.totalProfitLoss || 0) >= 0;

  const totalInvested = data.netInvestedAmount || 0;
  const pnlPercent = totalInvested !== 0 
    ? ((data.totalProfitLoss / totalInvested) * 100).toFixed(2) 
    : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto text-gray-900 dark:text-gray-100">
        
        {/* Hero Header Section with Gradient Background */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 lg:p-10 shadow-2xl shadow-blue-500/20">
          {/* Animated Background Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            {/* Left: Title Section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Live Dashboard</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
                Portfolio Overview
              </h1>
              <p className="text-blue-100 text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
                Track your investments in real-time with comprehensive market insights and portfolio analytics.
              </p>
            </div>
            
            {/* Right: Balance Card - Enhanced */}
            <div className="w-full lg:w-auto min-w-[280px]">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <FaWallet className="text-white text-lg" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Trading Balance</p>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">
                  ₹{(data.balance || 0).toLocaleString()}
                </h2>
                <p className="text-xs text-blue-200 font-medium">Available for trading</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Stats Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <SummaryCard
            title="Portfolio Value"
            value={`₹${(data.totalPortfolioValue || 0).toLocaleString()}`}
            icon={FaChartLine}
            color={isProfit ? "green" : "red"}
            subValue={`₹${isProfit ? "+" : ""}${Math.abs(data.totalProfitLoss).toLocaleString()} (${isProfit ? "+" : ""}${pnlPercent}%)`}
            trend={isProfit ? "up" : "down"}
          />
          <SummaryCard
            title="Net Invested"
            value={`₹${(data.netInvestedAmount || 0).toLocaleString()}`}
            icon={FaBox}
            color="blue"
          />
          <SummaryCard
            title="Total Holdings"
            value={data.holdingsCount || 0}
            icon={FaWallet}
            color="purple"
            badge={data.holdingsCount > 5 ? "Active" : null}
          />
          <SummaryCard
            title="Watchlist"
            value={data.watchlistCount || 0}
            icon={FaStar}
            color="yellow"
            badge={data.watchlistCount > 0 ? "Tracking" : null}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Market Overview Widget - Enhanced */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <FaRegChartBar className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800 dark:text-white">Market Indices</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Live market data</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800 flex items-center gap-2 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    LIVE
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <IndexCard name="NIFTY 50" value="22,450.00" change="+120.50" percent="0.54%" isUp={true} />
              <IndexCard name="SENSEX" value="73,900.00" change="-45.20" percent="0.06%" isUp={false} />
              <IndexCard name="BANK NIFTY" value="47,800.00" change="+210.00" percent="0.44%" isUp={true} />
              <IndexCard name="IT INDEX" value="36,200.00" change="-150.00" percent="0.41%" isUp={false} />
            </div>
          </div>

          {/* Watchlist Widget - Enhanced */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-amber-50/50 dark:from-gray-800/50 dark:to-gray-800/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <FaStar className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800 dark:text-white">My Watchlist</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{data.watchlistCount || 0} stocks tracked</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/watchlist')} 
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl transition-all hover:scale-105 border border-blue-100 dark:border-blue-800 shadow-sm"
                >
                  View All →
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent max-h-[500px]">
              {data.watchlistPreview && data.watchlistPreview.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.watchlistPreview.map((stock) => {
                    if (!stock) return null;

                    const currentPrice = Number(stock.price) || 0;
                    const changePercent = Number(stock.changePercent) || 0;
                    const isPositive = changePercent >= 0;
                    const priceChange = (currentPrice * (changePercent / 100)).toFixed(2);

                    return (
                      <div 
                        key={stock._id}
                        onClick={() => navigate(`/stocks/${stock._id}`)}
                        className="group flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/5 transition-all cursor-pointer relative border-l-4 border-transparent hover:border-blue-500"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <StockLogo 
                              symbol={stock.symbol} 
                              src={stock.logoUrl} 
                              size="sm" 
                              className="shadow-md ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-800 transition-all group-hover:scale-110" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-0.5">
                              {stock.symbol}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                              {stock.companyName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right mr-12">
                          <p className="font-mono font-bold text-base text-gray-900 dark:text-gray-100 mb-0.5">
                            ₹{currentPrice.toLocaleString()}
                          </p>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {isPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
                            <span>{Math.abs(priceChange)} ({Math.abs(changePercent).toFixed(2)}%)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleRemoveWatchlist(e, stock.watchlistId)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-110 z-10 hover:shadow-red-500/20"
                          title="Remove from Watchlist"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 p-8 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-full blur-2xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 rounded-full">
                      <FaStar className="text-gray-300 dark:text-gray-600" size={32} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-base font-bold text-gray-600 dark:text-gray-400">Your watchlist is empty</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Start tracking stocks to see them here</p>
                  </div>
                  <button 
                    onClick={() => navigate('/stocks')} 
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105"
                  >
                    <FaFire size={14} />
                    Browse Market
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction 
            icon={FaChartLine} 
            title="View Portfolio" 
            description="Manage holdings"
            onClick={() => navigate('/portfolio')}
            color="blue"
          />
          <QuickAction 
            icon={FaArrowTrendUp} 
            title="Market Analysis" 
            description="Explore stocks"
            onClick={() => navigate('/stocks')}
            color="green"
          />
          <QuickAction 
            icon={FaWallet} 
            title="Add Funds" 
            description="Top up balance"
            onClick={() => navigate('/wallet')}
            color="purple"
          />
          <QuickAction 
            icon={FaStar} 
            title="Watchlist" 
            description="Track favorites"
            onClick={() => navigate('/watchlist')}
            color="yellow"
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, subValue, trend, badge }) {
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
    yellow: {
      bg: "bg-gradient-to-br from-yellow-50 to-amber-100/50 dark:from-yellow-900/20 dark:to-amber-800/10",
      icon: "bg-gradient-to-br from-yellow-500 to-amber-600 text-white",
      border: "border-yellow-200 dark:border-yellow-800"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-rose-100/50 dark:from-red-900/20 dark:to-rose-800/10",
      icon: "bg-gradient-to-br from-red-500 to-rose-600 text-white",
      border: "border-red-200 dark:border-red-800"
    }
  };

  const colorScheme = colors[color];

  return (
    <div  data-testid={`summary-card-${title.toLowerCase().replace(/\s/g, '-')}`} className={`group relative rounded-2xl border ${colorScheme.border} ${colorScheme.bg} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
      {/* Subtle gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">{title}</p>
            {badge && (
              <span className="px-2 py-0.5 bg-white/50 dark:bg-gray-800/50 text-xs font-bold rounded-full text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {badge}
              </span>
            )}
          </div>
          <p className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">{value}</p>
          {subValue && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${color === 'green' ? 'text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' : 'text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
              {trend === 'up' ? <FaArrowUp size={10} /> : trend === 'down' ? <FaArrowDown size={10} /> : null}
              {subValue}
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorScheme.icon} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

function IndexCard({ name, value, change, percent, isUp }) {
  return (
    <div className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden ${
      isUp 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/5 border-green-200 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg hover:shadow-green-500/10' 
        : 'bg-gradient-to-br from-red-50 to-rose-50/50 dark:from-red-900/10 dark:to-rose-900/5 border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg hover:shadow-red-500/10'
    }`}>
      {/* Subtle gradient background */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 ${isUp ? 'bg-green-400' : 'bg-red-400'}`}></div>
      
      <div className="relative z-10 flex-1">
        <p className="font-black text-sm text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          {name}
          <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
        </p>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      </div>
      
      <div className={`relative z-10 text-right ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm mb-1 ${
          isUp 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}>
          {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {change}
        </div>
        <p className="text-xs font-bold opacity-80">{percent}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, onClick, color }) {
  const colors = {
    blue: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
    green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    purple: "from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
    yellow: "from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
  };

  return (
    <button
      onClick={onClick}
      className={`group relative bg-gradient-to-br ${colors[color]} text-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 flex flex-col items-start gap-2">
        <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="font-black text-sm mb-0.5">{title}</p>
          <p className="text-xs opacity-90">{description}</p>
        </div>
      </div>
    </button>
  );
}