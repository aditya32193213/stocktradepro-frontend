/**
 * File: StockDetail.jsx
 * Purpose:
 * - Displays detailed information of a single stock
 *
 * Flow:
 * - Fetches stock data by ID
 * - Displays price, performance, and historical chart
 * - Allows buy, sell, and add-to-watchlist actions
 *
 * Key Responsibilities:
 * - Trading execution (BUY / SELL)
 * - Data visualization
 * - Portfolio navigation
 *
 * Access:
 * - Protected
 */

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/core";
import { FaArrowUp, FaArrowDown, FaStar, FaExclamationTriangle, FaArrowLeft, FaChartLine, FaNewspaper, FaInfoCircle } from "react-icons/fa";
import { fetchStockById, selectSelectedStock, selectStocksLoading, selectStocksError, buyStock, sellStock, addToWatchlist } from "@/features";
import { StockLogo, StockChart, StockDetailSkeleton} from "@/components";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils";

export default function StockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const stock = useAppSelector(selectSelectedStock);
  const loading = useAppSelector(selectStocksLoading);
  const error = useAppSelector(selectStocksError);

  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("BUY");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chartRange, setChartRange] = useState("1D");

  useEffect(() => {
    if (id) {
      dispatch(fetchStockById(id));
    }
  }, [dispatch, id]);

  const totalAmount = useMemo(
    () => stock ? quantity * stock.price : 0,
    [stock, quantity]
  );

  const chartData = useMemo(() => {
    if (!stock || !stock.history) return [];
    
    const now = new Date();
    const cutoff = new Date();

    switch (chartRange) {
      case "1D": cutoff.setHours(now.getHours() - 24); break;
      case "1W": cutoff.setDate(now.getDate() - 7); break;
      case "1M": cutoff.setMonth(now.getMonth() - 1); break;
      case "ALL": default: return stock.history;
    }

    return stock.history.filter(point => new Date(point.timestamp) >= cutoff);
  }, [stock, chartRange]);

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!stock) return;

    setIsSubmitting(true);
    const toastId = showLoading(`Processing ${type} order...`);

    try {
      const action = type === "BUY" ? buyStock : sellStock;
      const result = await dispatch(action({ 
        stockId: stock._id, 
        quantity: Number(quantity),
        notes 
      }));

      if (action.fulfilled.match(result)) {
        dismissToast(toastId);
        showSuccess(`Successfully ${type === "BUY" ? "bought" : "sold"} ${quantity} shares`);
        navigate("/portfolio");
      } else {
        dismissToast(toastId);
        showError(result.payload || "Transaction failed");
      }
    } catch (error) {
      dismissToast(toastId);
      showError("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!stock) return;
    const toastId = toast.loading("Adding to watchlist...");
    const result = await dispatch(addToWatchlist(stock._id));
    dismissToast(toastId);
    
    if (addToWatchlist.fulfilled.match(result)) {
      showSuccess("Added to watchlist");
    } else {
      showError(result.payload || "Failed to add");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Failed to Load Stock</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading || !stock) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <StockDetailSkeleton />
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;
  const previousClose = stock.previousClose || (stock.price / (1 + stock.changePercent / 100));
  const changeValue = (stock.price - previousClose).toFixed(2);
  const chartColor = isPositive ? "#10B981" : "#EF4444"; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header with Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              
              {/* Left Section: Back Button + Stock Info */}
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="group p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 mt-1"
                  title="Go Back"
                >
                  <FaArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <StockLogo symbol={stock.symbol} src={stock.logoUrl} size="lg" className="relative" />
                  </div>
                  
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 bg-clip-text">
                      {stock.companyName}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                        {stock.symbol}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                        {stock.sector}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Price Info */}
              <div className="text-left lg:text-right pl-16 lg:pl-0">
                <div className="inline-block">
                  <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    ₹{stock.price.toLocaleString()}
                  </p>
                  <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl font-semibold ${
                    isPositive 
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}>
                    <span className="text-lg">{isPositive ? "+" : ""}{changeValue}</span>
                    <span className="flex items-center gap-1.5 text-sm">
                      {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Chart & Trading */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Enhanced Chart Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FaChartLine className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Price Trend</h3>
                  </div>
                  <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl">
                    {["1D", "1W", "1M", "ALL"].map((range) => (
                      <button
                        key={range}
                        onClick={() => setChartRange(range)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                          chartRange === range
                            ? "bg-white dark:bg-gray-700 shadow-md text-blue-600 dark:text-blue-400 scale-105"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <StockChart data={chartData} color={chartColor} />
              </div>
            </div>

            {/* Enhanced Trade Box */}
            <div data-testid="trade-box" className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Buy/Sell Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <button 
                    onClick={() => setType("BUY")} 
                    className={`py-3 px-4 font-bold rounded-lg transition-all duration-200 ${
                      type === "BUY" 
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105" 
                        : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    Buy Stock
                  </button>
                  <button 
                    onClick={() => setType("SELL")} 
                    className={`py-3 px-4 font-bold rounded-lg transition-all duration-200 ${
                      type === "SELL" 
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 scale-105" 
                        : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    Sell Stock
                  </button>
                </div>

                <form onSubmit={handleTrade} className="space-y-5">
                  {/* Quantity Input */}
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Quantity
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 font-medium" 
                        required 
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        shares
                      </div>
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Notes <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none" 
                      rows="3" 
                      placeholder="Add your trading strategy notes here..."
                    />
                  </div>

                  {/* Total Amount */}
                  <div className="flex justify-between items-center py-5 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</span>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg ${
                      type === "BUY" 
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/30" 
                        : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-500/30"
                    } ${
                      isSubmitting 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:scale-105 active:scale-95"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `${type} ${stock.symbol}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Watchlist Button */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-5 hover:shadow-xl transition-all duration-300">
              <button 
                onClick={handleAddToWatchlist} 
                className="w-full group relative overflow-hidden flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all duration-200 font-semibold"
              >
                <FaStar className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-200" />
                Add to Watchlist
              </button>
            </div>

            {/* Company Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaInfoCircle className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Company Info</h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: "Symbol", value: stock.symbol, color: "text-blue-600 dark:text-blue-400" },
                  { label: "Sector", value: stock.sector, color: "text-purple-600 dark:text-purple-400" },
                  { label: "Current Price", value: `₹${stock.price.toLocaleString()}`, color: "text-green-600 dark:text-green-400" },
                  { label: "P/E Ratio", value: stock.peRatio || "N/A", color: "text-orange-600 dark:text-orange-400" },
                  { label: "Market Cap", value: stock.marketCap ? `₹${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A", color: "text-pink-600 dark:text-pink-400" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">About</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {stock.description || "No description available for this stock."}
                </p>
              </div>
            </div>

            {/* Latest News Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FaNewspaper className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest News</h3>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      2 hours ago • Financial Times
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {stock.companyName} announces quarterly results exceeding market expectations.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}