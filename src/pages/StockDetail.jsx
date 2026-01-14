import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp, FaArrowDown, FaStar, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import { fetchStockById, selectSelectedStock, selectStocksLoading, selectStocksError } from "@/features/stocks";
import { buyStock, sellStock } from "@/features/transactions";
import { addToWatchlist } from "@/features/watchlist";
import { StockLogo } from "@/components";
import { StockDetailSkeleton } from "@/components/common/SkeletonLoader";
import StockChart from "@/components/common/StockChart"; 
import toast from "@/utils/toast";

export default function StockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stock = useSelector(selectSelectedStock);
  const loading = useSelector(selectStocksLoading);
  const error = useSelector(selectStocksError);

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
    const toastId = toast.loading(`Processing ${type} order...`);

    try {
      const action = type === "BUY" ? buyStock : sellStock;
      const result = await dispatch(action({ 
        stockId: stock._id, 
        quantity: Number(quantity),
        notes 
      }));

      if (action.fulfilled.match(result)) {
        toast.dismiss(toastId);
        toast.success(`Successfully ${type === "BUY" ? "bought" : "sold"} ${quantity} shares`);
        navigate("/portfolio");
      } else {
        toast.dismiss(toastId);
        toast.error(result.payload || "Transaction failed");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!stock) return;
    const toastId = toast.loading("Adding to watchlist...");
    const result = await dispatch(addToWatchlist(stock._id));
    toast.dismiss(toastId);
    
    if (addToWatchlist.fulfilled.match(result)) {
      toast.success("Added to watchlist");
    } else {
      toast.error(result.payload || "Failed to add");
    }
  };

  if (error) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <FaExclamationTriangle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load stock</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go Back</button>
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Back Button + Stock Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        
        <div className="flex items-center gap-4">
          {/* Back Arrow Integrated Here */}
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors mr-2"
            title="Go Back"
          >
            <FaArrowLeft size={20} />
          </button>

          <StockLogo symbol={stock.symbol} src={stock.logoUrl} size="lg" />
          
          <div>
            <h1 className="text-2xl font-bold">{stock.companyName}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{stock.symbol}</p>
          </div>
        </div>

        <div className="text-right pl-14 md:pl-0"> {/* Padding added for mobile alignment */}
          <p className="text-3xl font-bold">₹{stock.price.toLocaleString()}</p>
          <div className={`flex items-center justify-end gap-2 font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}>
            <span>{isPositive ? "+" : ""}{changeValue}</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
              {Math.abs(stock.changePercent).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chart & Trading */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">Price Trend</h3>
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
                {["1D", "1W", "1M", "ALL"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setChartRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      chartRange === range
                        ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <StockChart data={chartData} color={chartColor} />
          </div>

          {/* Trade Box */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex gap-4 mb-6">
              <button onClick={() => setType("BUY")} className={`flex-1 py-2 font-semibold rounded-md transition-colors ${type === "BUY" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>Buy</button>
              <button onClick={() => setType("SELL")} className={`flex-1 py-2 font-semibold rounded-md transition-colors ${type === "SELL" ? "bg-red-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}>Sell</button>
            </div>
            <form onSubmit={handleTrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent" rows="2" placeholder="Strategy notes..." />
              </div>
              <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-xl font-bold">₹{totalAmount.toLocaleString()}</span>
              </div>
              <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-md font-bold text-white transition-opacity ${type === "BUY" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>
                {isSubmitting ? "Processing..." : `${type} ${stock.symbol}`}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <button onClick={handleAddToWatchlist} className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md text-gray-500 hover:text-yellow-500 hover:border-yellow-500 transition-colors">
              <FaStar /> Add to Watchlist
            </button>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <h2 className="font-medium mb-4">Company Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Symbol:</span><span className="font-medium">{stock.symbol}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Sector:</span><span className="font-medium">{stock.sector}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Current Price:</span><span className="font-medium">₹{stock.price.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">P/E Ratio:</span><span className="font-medium">{stock.peRatio || "N/A"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Market Cap:</span><span className="font-medium">{stock.marketCap ? `₹${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A"}</span></div>
            </div>
          </div>
           <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
             <h3 className="font-medium mb-2">About</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{stock.description || "No description available for this stock."}</p>
           </div>
           <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <h3 className="font-medium mb-3">Latest News</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                  <p className="text-xs text-gray-400 mb-1">2 hours ago • Financial Times</p>
                  <p className="text-sm font-medium hover:text-blue-600 cursor-pointer">{stock.companyName} announces quarterly results exceeding market expectations.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}