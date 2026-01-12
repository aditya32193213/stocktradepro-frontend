import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowUp, FaArrowDown, FaStar } from "react-icons/fa";
import { fetchStockById, selectSelectedStock, selectStocksLoading } from "@/features/stocks";
import { buyStock, sellStock } from "@/features/transactions";
import { addToWatchlist } from "@/features/watchlist";
import { fetchDashboardSummary } from "@/features/dashboard";
import { fetchPortfolio } from "@/features/portfolio";
import toast from "@/utils/toast";

export default function StockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stock = useSelector(selectSelectedStock);
  const loading = useSelector(selectStocksLoading);

  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("BUY");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchStockById(id));
    }
  }, [dispatch, id]);

  const totalAmount = useMemo(
    () => stock ? quantity * stock.price : 0,
    [quantity, stock]
  );

  const handleSubmit = async () => {
    if (!stock) return;
    
    setIsSubmitting(true);
    
    const thunk = type === "BUY" ? buyStock : sellStock;
    const toastId = toast.loading(`Processing ${type} order...`);
    
    try {
      const result = await dispatch(thunk({ 
        stockId: stock._id, 
        quantity,
        notes: notes.trim()
      }));

      if (thunk.fulfilled.match(result)) {
        toast.dismiss(toastId);
        toast.success(`${type} order placed successfully! ${quantity} shares of ${stock.symbol}`);
        
        // ✅ Auto-refresh dashboard and portfolio
        await Promise.all([
          dispatch(fetchDashboardSummary()),
          dispatch(fetchPortfolio())
        ]);
        
        // Reset form
        setQuantity(1);
        setNotes("");
        
        // Navigate to portfolio
        setTimeout(() => navigate("/portfolio"), 1000);
      } else {
        toast.dismiss(toastId);
        toast.error(result.payload || `${type} failed`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(`${type} failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!stock) return;
    
    const toastId = toast.loading("Adding to watchlist...");
    
    try {
      const result = await dispatch(addToWatchlist(stock._id));
      
      toast.dismiss(toastId);
      
      if (addToWatchlist.fulfilled.match(result)) {
        toast.success(`${stock.symbol} added to watchlist!`);
      } else {
        toast.error(result.payload || "Failed to add to watchlist");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to add to watchlist");
    }
  };

  if (loading || !stock) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading stock details...
        </div>
      </div>
    );
  }

  const isPositive = stock.changePercent >= 0;

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {stock.symbol}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stock.companyName}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-semibold">
              ₹{stock.price.toLocaleString()}
            </div>
            <div
              className={`flex items-center justify-end gap-1 text-sm ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              {stock.changePercent.toFixed(2)}%
            </div>
          </div>

          <button
            onClick={handleAddToWatchlist}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       inline-flex items-center gap-2 transition-colors"
          >
            <FaStar />
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <InfoCard label="Sector" value={stock.sector} />
        <InfoCard label="Market Cap" value={`₹${(stock.marketCap / 1e9).toFixed(2)}B`} />
        <InfoCard label="P/E Ratio" value={stock.peRatio?.toFixed(2) || "N/A"} />
        <InfoCard label="Volume" value={`${(stock.volume / 1e6).toFixed(2)}M`} />
      </div>

      {/* Buy / Sell Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Box */}
        <div className="lg:col-span-2 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="font-medium mb-4">Place Order</h2>

          {/* Buy / Sell Toggle */}
          <div className="flex gap-2 mb-4">
            {["BUY", "SELL"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  type === t
                    ? t === "BUY"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                    : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes (NEW) */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">
              Notes <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Add any notes about this transaction..."
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-gray-900 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         resize-none"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {notes.length}/500
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between text-sm mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <span className="font-medium">Total Amount</span>
            <span className="font-semibold text-lg">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || quantity < 1}
            className={`w-full py-3 rounded-md font-medium text-white 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all transform active:scale-95 ${
              type === "BUY"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </span>
            ) : (
              `${type} STOCK`
            )}
          </button>
        </div>

        {/* Info Panel */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <h2 className="font-medium mb-4">Company Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Symbol:</span>
              <span className="font-medium">{stock.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Sector:</span>
              <span className="font-medium">{stock.sector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Current Price:</span>
              <span className="font-medium">₹{stock.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Info Card Component */
function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:shadow-md transition-shadow">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}