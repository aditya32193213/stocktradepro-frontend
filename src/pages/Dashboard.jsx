import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaBox, FaStar, FaArrowUp, FaArrowDown, FaTrash } from "react-icons/fa";
import { fetchDashboardSummary, selectDashboardSummary, selectDashboardLoading } from "@/features/dashboard";
import { removeFromWatchlist } from "@/features/watchlist"; 
import { DashboardSkeleton } from "@/components/common/SkeletonLoader";
import { StockLogo } from "@/components";
import toast from "@/utils/toast";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const summary = useSelector(selectDashboardSummary);
  const loading = useSelector(selectDashboardLoading);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    const interval = setInterval(() => {
      dispatch(fetchDashboardSummary());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRemoveWatchlist = async (e, watchlistId) => {
    e.stopPropagation(); 
    e.preventDefault();  
    
    const result = await dispatch(removeFromWatchlist(watchlistId));
    
    if (removeFromWatchlist.fulfilled.match(result)) {
      toast.success("Removed from watchlist");
      dispatch(fetchDashboardSummary()); 
    } else {
      toast.error("Failed to remove. Please try again.");
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

  // ✅ Calculate Total P&L Percentage
  const totalInvested = data.netInvestedAmount || 0;
  const pnlPercent = totalInvested !== 0 
    ? ((data.totalProfitLoss / totalInvested) * 100).toFixed(2) 
    : "0.00";

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      
      {/* Header & Balance */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your portfolio and market activity
          </p>
        </div>
        <div className="text-right bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-xl border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Trading Balance</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{(data.balance || 0).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Portfolio Value"
          value={`₹${(data.totalPortfolioValue || 0).toLocaleString()}`}
          icon={FaChartLine}
          color={isProfit ? "green" : "red"}
          // ✅ FIX: Showing Price AND % Change for P&L
          subValue={`₹${isProfit ? "+" : ""}${Math.abs(data.totalProfitLoss).toLocaleString()} (${isProfit ? "+" : ""}${pnlPercent}%)`}
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
        />
        <SummaryCard
          title="Watchlist"
          value={data.watchlistCount || 0}
          icon={FaStar}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-lg">Market Overview</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <IndexCard name="NIFTY 50" value="22,450.00" change="+120.50" percent="0.54%" isUp={true} />
            <IndexCard name="SENSEX" value="73,900.00" change="-45.20" percent="0.06%" isUp={false} />
            <IndexCard name="BANK NIFTY" value="47,800.00" change="+210.00" percent="0.44%" isUp={true} />
            <IndexCard name="IT INDEX" value="36,200.00" change="-150.00" percent="0.41%" isUp={false} />
          </div>
        </div>

        {/* Watchlist Widget */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-lg">My Watchlist</h3>
            <button onClick={() => navigate('/watchlist')} className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {data.watchlistPreview && data.watchlistPreview.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {data.watchlistPreview.map((stock) => {
                  if (!stock) return null;

                  const currentPrice = Number(stock.price) || 0;
                  const changePercent = Number(stock.changePercent) || 0;
                  const isPositive = changePercent >= 0;

                  // Calculate approximate price change if not provided
                  const priceChange = (currentPrice * (changePercent / 100)).toFixed(2);

                  return (
                    <div 
                      key={stock._id}
                      onClick={() => navigate(`/stocks/${stock._id}`)}
                      className="group flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer relative"
                    >
                      <div className="flex items-center gap-3">
                        <StockLogo symbol={stock.symbol} src={stock.logoUrl} size="sm" />
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{stock.symbol}</p>
                          <p className="text-xs text-gray-500">{stock.companyName}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-sm">₹{currentPrice.toLocaleString()}</p>
                        <p className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                          {/* Showing both values here slightly smaller to fit */}
                          <span>{Math.abs(priceChange)} ({Math.abs(changePercent).toFixed(2)}%)</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveWatchlist(e, stock.watchlistId)} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-700 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/30 z-50"
                        title="Remove from Watchlist"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center justify-center h-full">
                <FaStar className="text-gray-300 mb-2" size={24} />
                <p>Your watchlist is empty.</p>
                <button onClick={() => navigate('/stocks')} className="text-blue-600 hover:underline mt-1 font-medium">
                  Add stocks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---
function SummaryCard({ title, value, icon: Icon, color, subValue }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    yellow: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20",
  };
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-full ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-bold">{value}</p>
        {subValue && (
          <p className={`text-xs font-medium mt-0.5 ${color === 'green' ? 'text-green-500' : 'text-red-500'}`}>
            {subValue} P&L
          </p>
        )}
      </div>
    </div>
  );
}

function IndexCard({ name, value, change, percent, isUp }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${isUp ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-red-500 bg-red-50/50 dark:bg-red-900/10'}`}>
      <div>
        <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{name}</p>
        <p className="text-lg font-bold mt-1">{value}</p>
      </div>
      <div className={`text-right ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        <p className="text-sm font-bold flex items-center gap-1 justify-end">
          {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {change}
        </p>
        <p className="text-xs font-medium">{percent}</p>
      </div>
    </div>
  );
}