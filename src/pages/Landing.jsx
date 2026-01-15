/**
 * File: Landing.jsx
 * Purpose:
 * - Public landing page of StockTradePro
 * - Serves as the marketing and onboarding entry point
 *
 * Flow:
 * - Redirects authenticated users to dashboard
 * - Fetches top-performing stocks for preview
 * - Uses scroll & mouse tracking for parallax animations
 *
 * Key Responsibilities:
 * - Introduce platform features and value proposition
 * - Encourage registration and login
 * - Display live stock movement preview
 *
 * Access:
 * - Public (unauthenticated users only)
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core";
import { FaArrowUp, FaArrowDown, FaChartLine, FaShieldAlt, FaBriefcase, FaChevronRight, FaRocket, FaTrophy, FaUsers } from "react-icons/fa";
import { fetchStocks, selectStocks, selectStocksLoading, selectIsAuthenticated } from "@/features";
import { StockLogo, TableSkeleton } from "@/components";

export default function Landing() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const stocks = useAppSelector(selectStocks);
  const loading = useAppSelector(selectStocksLoading);
  
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchStocks({ limit: 5, sortBy: "changePercent", order: "desc" }));
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 font-sans selection:bg-blue-200 dark:selection:bg-blue-900/50 overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-indigo-400/10 dark:from-blue-500/20 dark:to-indigo-500/20 blur-[120px] rounded-full animate-pulse"
          style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-violet-400/10 to-purple-400/10 dark:from-violet-500/20 dark:to-purple-500/20 blur-[100px] rounded-full animate-pulse"
          style={{ transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 px-6">
        <div className="relative max-w-6xl mx-auto z-10">
          
          {/* Floating Badge (Centered) */}
          <div 
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-700/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-lg shadow-blue-500/10 backdrop-blur-xl mx-auto w-fit hover:scale-105 transition-transform duration-300"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 shadow-lg shadow-blue-500/50"></span>
            </span>
            Live Market Simulation • 100% Risk Free
          </div>
          
          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.05]">
              Master the Market
              <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Without the Risk
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-medium px-4">
              Experience real-time stock trading with <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">₹1,00,000</span> virtual currency. Build your portfolio, track market trends, and refine your strategies in a risk-free environment.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 hover:scale-105 hover:-translate-y-1 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <FaRocket className="w-5 h-5 transition-transform group-hover:translate-y-[-2px]" />
              Start Trading Now
              <FaChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              to="/login"
              className="relative inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              Log In
              <FaChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
            <TrustCard icon={FaUsers} value="10,000+" label="Active Traders" />
            <TrustCard icon={FaTrophy} value="₹50Cr+" label="Virtual Trades" />
            <TrustCard icon={FaChartLine} value="500+" label="Listed Stocks" />
          </div>
        </div>
      </section>

      {/* Market Indices */}
      <section className="py-16 border-y border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Market Overview
            </h2>
            <div className="flex items-center gap-3 text-xs font-bold font-mono text-green-700 dark:text-green-400 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-5 py-2.5 rounded-full border border-green-300 dark:border-green-700 shadow-lg shadow-green-500/10">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 shadow-lg shadow-green-500/50"></span>
              </div>
              MARKET OPEN
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IndexCard name="NIFTY 50" value="22,450.00" change="+120.50" percent="+0.54%" isUp={true} />
            <IndexCard name="SENSEX" value="73,900.00" change="-45.20" percent="-0.06%" isUp={false} />
          </div>
        </div>
      </section>

      {/* Trending Stocks */}
      <section className="py-28 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-950 dark:to-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
                📈 Market Movers
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Trending Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg lg:text-xl leading-relaxed">
              Top movers and highest volume stocks making waves in the market right now.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-gray-200/60 dark:border-gray-800/60 shadow-2xl shadow-gray-900/5 dark:shadow-none bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gradient-to-r from-gray-50/95 to-blue-50/95 dark:from-gray-800/95 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-6 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest">Company</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest hidden sm:table-cell">Sector</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest text-right">Price</th>
                    <th className="px-6 py-6 text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-widest text-right">Change (24h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                  {loading ? (
                    <tr><td colSpan="4" className="p-8"><TableSkeleton rows={5} columns={4} /></td></tr>
                  ) : stocks.length > 0 ? (
                    stocks.slice(0, 5).map((stock, index) => {
                      const isPositive = stock.changePercent >= 0;
                      return (
                        <tr 
                          key={stock._id} 
                          onClick={() => navigate(`/stocks/${stock._id}`)}
                          className="group hover:bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <StockLogo 
                                  symbol={stock.symbol} 
                                  src={stock.logoUrl} 
                                  size="sm" 
                                  className="shadow-md group-hover:shadow-xl group-hover:scale-125 transition-all duration-300 ring-2 ring-white dark:ring-gray-900 group-hover:ring-blue-500/50" 
                                />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <div>
                                <p className="font-black text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stock.symbol}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 group-hover:text-gray-700 dark:group-hover:text-gray-300">{stock.companyName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 hidden sm:table-cell">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-shadow">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-right font-mono font-black text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            ₹{stock.price.toLocaleString()}
                          </td>
                          <td className={`px-6 py-6 text-right font-black text-base ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            <div className={`inline-flex items-center justify-end gap-2 px-3 py-1.5 rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'} group-hover:scale-110 transition-transform duration-300`}>
                              {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                              {Math.abs(stock.changePercent).toFixed(2)}%
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="4" className="px-6 py-16 text-center text-gray-500 text-base">Market data currently unavailable.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/stocks" className="group inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black text-lg transition-all hover:gap-4">
              View All Market Data 
              <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-28 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to become a confident trader
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FaChartLine} 
              title="Real-Time Analysis" 
              desc="Get instant updates on stock prices and market movements with zero latency data feeds and advanced charting tools."
              gradient="from-blue-500 to-indigo-500"
            />
            <FeatureCard 
              icon={FaBriefcase} 
              title="Portfolio Management" 
              desc="Track your holdings, analyze profit & loss, and diversify your investments like a pro with our intuitive dashboard."
              gradient="from-indigo-500 to-violet-500"
            />
            <FeatureCard 
              icon={FaShieldAlt} 
              title="Risk-Free Trading" 
              desc="Practice your trading strategies with ₹1,00,000 virtual currency before entering the real market with confidence."
              gradient="from-violet-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of traders mastering the market with zero risk. Start trading today with ₹1,00,000 virtual currency.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-black text-blue-600 transition-all duration-300 bg-white hover:bg-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 hover:scale-105 hover:-translate-y-1 shadow-2xl shadow-black/20 hover:shadow-black/30"
          >
            <FaRocket className="w-6 h-6 transition-transform group-hover:-translate-y-1 group-hover:rotate-12" />
            Get Started Free
            <FaChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// --- Premium Components ---

function TrustCard({ icon: Icon, value, label }) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 hover:border-blue-300 dark:hover:border-blue-700 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
          <Icon className="text-xl" />
        </div>
        <div>
          <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{label}</p>
        </div>
      </div>
    </div>
  );
}

function IndexCard({ name, value, change, percent, isUp }) {
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200/60 dark:border-gray-800/60 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isUp ? 'bg-gradient-to-b from-green-500 to-emerald-500' : 'bg-gradient-to-b from-red-500 to-rose-500'} transition-all group-hover:w-2`}></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest">{name}</h3>
        <span className={`flex items-center gap-2 text-xs font-black px-3 py-2 rounded-xl border shadow-sm ${isUp ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-400 dark:border-red-900/30'} group-hover:scale-110 transition-transform`}>
          {isUp ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />} {percent}
        </span>
      </div>
      <div className="flex items-baseline gap-4">
        <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{value}</span>
        <span className={`text-base font-black ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
      </div>
      <div className={`mt-4 h-1.5 rounded-full ${isUp ? 'bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40' : 'bg-gradient-to-r from-red-200 to-rose-200 dark:from-red-900/40 dark:to-rose-900/40'} overflow-hidden`}>
        <div className={`h-full ${isUp ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'} w-3/4 rounded-full animate-pulse`}></div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, gradient }) {
  return (
    <div className="group relative p-10 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-transparent transition-all duration-500 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className="relative z-10">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
          <Icon className="text-3xl" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{desc}</p>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </div>
  );
}