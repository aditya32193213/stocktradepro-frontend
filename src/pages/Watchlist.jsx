/**
 * File: Watchlist.jsx
 * Purpose:
 * - Displays user-saved favorite stocks
 *
 * Flow:
 * - Fetches watchlist on mount
 * - Allows removal and navigation to stock detail
 *
 * Key Responsibilities:
 * - Track interesting stocks
 * - Quick access to stock insights
 *
 * Access:
 * - Protected
 */

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/core";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowUp, FaArrowDown, FaStar, FaShoppingCart, FaChartLine, FaEye, FaFire } from "react-icons/fa";
import { 
  fetchWatchlist, 
  removeFromWatchlist, 
  selectWatchlistItems, 
  selectWatchlistLoading 
} from "@/features";
import { StockLogo } from "@/components";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils";

export default function Watchlist() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const watchlist = useAppSelector(selectWatchlistItems);
  const loading = useAppSelector(selectWatchlistLoading);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleRemove = async (watchlistId, symbol) => {
    setRemovingId(watchlistId);
    const toastId = showLoading(`Removing ${symbol}...`);
    
    try {
      const result = await dispatch(removeFromWatchlist(watchlistId));
      
      dismissToast(toastId);
      
      if (removeFromWatchlist.fulfilled.match(result)) {
        showSuccess(`${symbol} removed from watchlist`);
      } else {
        showError(result.payload || "Failed to remove from watchlist");
      }
    } catch (error) {
      dismissToast(toastId);
      showError("An error occurred");
    } finally {
      setRemovingId(null);
    }
  };

  const handleRowClick = (stockId) => {
    navigate(`/stocks/${stockId}`);
  };

  // Calculate stats
  const totalValue = watchlist.reduce((sum, item) => sum + (item.stock?.price || 0), 0);
  const gainers = watchlist.filter(item => item.stock?.changePercent >= 0).length;
  const losers = watchlist.filter(item => item.stock?.changePercent < 0).length;

  if (loading && watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400 ml-2">Loading watchlist...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto text-gray-900 dark:text-gray-100">
        
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 p-8 lg:p-10 shadow-2xl shadow-yellow-500/20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-orange-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            {/* Left: Title Section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <FaStar className="text-white" size={12} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Your Watchlist</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
                Tracked Stocks
              </h1>
              <p className="text-yellow-100 text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
                Monitor your favorite stocks and never miss an investment opportunity
              </p>
            </div>
            
            {/* Right: Stats Card */}
            <div className="w-full lg:w-auto min-w-[320px]">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FaEye className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{watchlist.length}</p>
                    <p className="text-xs font-bold text-yellow-100 uppercase tracking-wider">Tracking</p>
                  </div>
                  <div className="text-center border-l border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-green-500/30 rounded-lg">
                        <FaArrowUp className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{gainers}</p>
                    <p className="text-xs font-bold text-yellow-100 uppercase tracking-wider">Gainers</p>
                  </div>
                  <div className="text-center border-l border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-red-500/30 rounded-lg">
                        <FaArrowDown className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{losers}</p>
                    <p className="text-xs font-bold text-yellow-100 uppercase tracking-wider">Losers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
                  <FaStar className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Tracked</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{watchlist.length} Stocks</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-green-200 dark:border-green-800 p-5 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <FaArrowUp className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gainers Today</p>
                  <p className="text-2xl font-black text-green-600 dark:text-green-400">{gainers} Stocks</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-800 p-5 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg">
                  <FaArrowDown className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Losers Today</p>
                  <p className="text-2xl font-black text-red-600 dark:text-red-400">{losers} Stocks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {watchlist.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 lg:p-16 text-center bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-amber-200 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full">
                  <FaStar className="text-gray-400 dark:text-gray-600" size={56} />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-700 dark:text-gray-300">Your Watchlist is Empty</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  Start tracking stocks you're interested in to monitor their performance and get insights
                </p>
              </div>
              <button
                onClick={() => navigate("/stocks")}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-black shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all hover:scale-105 text-base"
              >
                <FaShoppingCart size={18} />
                Browse Stocks
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-yellow-50/50 dark:from-gray-800/50 dark:to-gray-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                    <FaStar className="text-yellow-600 dark:text-yellow-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800 dark:text-white">Your Tracked Stocks</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{watchlist.length} stock{watchlist.length !== 1 ? 's' : ''} in watchlist</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/stocks")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm"
                >
                  <FaFire size={14} />
                  Add More Stocks
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-yellow-50/50 dark:from-gray-800 dark:to-gray-800/50 sticky top-0 z-10 border-b-2 border-yellow-200 dark:border-yellow-800">
                  <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-black">
                    <th className="px-6 py-5 text-center w-20">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          <FaChartLine className="text-yellow-600 dark:text-yellow-400" size={12} />
                        </div>
                      </div>
                    </th>
                    <th className="px-6 py-5 text-left">Symbol</th>
                    <th className="px-6 py-5 text-left">Company Name</th>
                    <th className="px-6 py-5 text-right">Current Price</th>
                    <th className="px-6 py-5 text-right">Today's Change</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {watchlist.map((item, index) => {
                    const stock = item.stock;
                    if (!stock) return null;

                    const isPositive = stock.changePercent >= 0;
                    const changeValue = stock.price * (stock.changePercent / 100);

                    return (
                      <tr
                        key={item._id}
                        className="group hover:bg-gradient-to-r hover:from-yellow-50/50 hover:to-amber-50/30 dark:hover:from-yellow-900/10 dark:hover:to-amber-900/5 transition-all duration-200 border-l-4 border-transparent hover:border-yellow-500"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center">
                            <StockLogo 
                              src={stock.logoUrl}
                              symbol={stock.symbol}
                              alt={stock.companyName}
                              size="sm"
                              className="shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-yellow-200 dark:group-hover:ring-yellow-700 transition-all group-hover:scale-125 group-hover:rotate-3"
                            />
                          </div>
                        </td>
                        <td 
                          className="px-6 py-5 cursor-pointer"
                          data-testid={`watchlist-row-${stock._id}`}
                          onClick={() => handleRowClick(stock._id)}
                        >
                          <span className="font-black text-base text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {stock.symbol}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-5 cursor-pointer"
                          onClick={() => handleRowClick(stock._id)}
                        >
                          <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {stock.companyName}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-5 text-right cursor-pointer"
                          onClick={() => handleRowClick(stock._id)}
                        >
                          <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                            ₹{stock.price.toLocaleString()}
                          </span>
                        </td>
                        <td
                          className="px-6 py-5 text-right cursor-pointer"
                          onClick={() => handleRowClick(stock._id)}
                        >
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-bold shadow-md transition-all group-hover:scale-105 ${
                            isPositive 
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                              : "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                            <span className={`p-1 rounded ${isPositive ? 'bg-green-200 dark:bg-green-800' : 'bg-red-200 dark:bg-red-800'}`}>
                              {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                            </span>
                            <span className="font-mono">{Math.abs(changeValue).toFixed(2)}</span>
                            <span className="opacity-75 text-xs">({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            disabled={removingId === item._id}
                            data-testid={`remove-watchlist-${item._id}`}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md ${
                              removingId === item._id
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 hover:from-red-200 hover:to-rose-200 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 border border-red-200 dark:border-red-800 hover:scale-105 hover:shadow-lg'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item._id, stock.symbol);
                            }}
                          >
                            {removingId === item._id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                Removing...
                              </>
                            ) : (
                              <>
                                <FaTrash size={12} />
                                Remove
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Card */}
        {watchlist.length > 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 bg-gradient-to-br from-yellow-50 to-amber-50/50 dark:from-yellow-900/10 dark:to-amber-900/5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-yellow-500 rounded-xl shadow-lg shrink-0">
                <FaStar className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-yellow-700 dark:text-yellow-400 uppercase tracking-wider mb-2">
                  About Your Watchlist
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Track stocks you're interested in without committing to a purchase. Monitor price movements, performance trends, and market changes to make informed investment decisions when the timing is right.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}