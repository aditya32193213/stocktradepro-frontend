import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp, FaArrowDown, FaChartLine, FaShieldAlt, FaBriefcase } from "react-icons/fa";
import { fetchStocks, selectStocks, selectStocksLoading } from "@/features/stocks";
import { selectIsAuthenticated } from "@/features/auth"; // ✅ Import auth selector
import { StockLogo } from "@/components/index";
import { TableSkeleton } from "@/components/common/SkeletonLoader";

export default function Landing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const stocks = useSelector(selectStocks);
  const loading = useSelector(selectStocksLoading);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch Trending Stocks
  useEffect(() => {
    dispatch(fetchStocks({ limit: 5, sortBy: "changePercent", order: "desc" }));
  }, [dispatch]);

  // Prevent flash of landing page content while redirecting
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex flex-col">
      
      {/* 1. Hero / Banner Section */}
      <section className="relative bg-white dark:bg-gray-900 pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Live Market Simulation
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
            Master the Market <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Without the Risk</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Experience real-time stock trading with virtual currency. Build your portfolio, 
            track market trends, and learn trading strategies in a safe environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
            >
              Start Trading Now
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Log In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stock Market Indices Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-950/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Market Overview</h2>
            <span className="text-xs font-mono text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> MARKET OPEN
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IndexCard 
              name="NIFTY 50" 
              value="22,450.00" 
              change="+120.50" 
              percent="+0.54%" 
              isUp={true} 
            />
            <IndexCard 
              name="SENSEX" 
              value="73,900.00" 
              change="-45.20" 
              percent="-0.06%" 
              isUp={false} 
            />
          </div>
        </div>
      </section>

      {/* 3. Trending Stocks Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trending Stocks</h2>
            <p className="text-gray-600 dark:text-gray-400">Top movers and highest volume stocks in the market today.</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Sector</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Change (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                {loading ? (
                  <tr><td colSpan="4" className="p-4"><TableSkeleton rows={5} columns={4} /></td></tr>
                ) : stocks.length > 0 ? (
                  stocks.slice(0, 5).map((stock) => {
                    const isPositive = stock.changePercent >= 0;
                    return (
                      <tr 
                        key={stock._id} 
                        onClick={() => navigate(`/stocks/${stock._id}`)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <StockLogo symbol={stock.symbol} src={stock.logoUrl} size="sm" />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{stock.symbol}</p>
                              <p className="text-xs text-gray-500">{stock.companyName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                          ₹{stock.price.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                          <div className="flex items-center justify-end gap-1">
                            {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Market data currently unavailable.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/stocks" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              View All Market Data →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FaChartLine} 
              title="Real-Time Analysis" 
              desc="Get instant updates on stock prices and market movements with zero latency."
            />
            <FeatureCard 
              icon={FaBriefcase} 
              title="Portfolio Management" 
              desc="Track your holdings, analyze profit & loss, and diversify your investments."
            />
            <FeatureCard 
              icon={FaShieldAlt} 
              title="Risk-Free Trading" 
              desc="Practice your trading strategies with ₹1,00,000 virtual currency."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sub Components ---

function IndexCard({ name, value, change, percent, isUp }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`} />
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">{name}</h3>
        {isUp ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        <span className={`font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {change} ({percent})
        </span>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}