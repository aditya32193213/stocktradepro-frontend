import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { 
  fetchWatchlist, 
  removeFromWatchlist, 
  selectWatchlistItems, 
  selectWatchlistLoading 
} from "@/features/watchlist";
import { StockLogo } from "@/components";
import toast from "@/utils/toast";

export default function Watchlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const watchlist = useSelector(selectWatchlistItems);
  const loading = useSelector(selectWatchlistLoading);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleRemove = async (watchlistId, symbol) => {
    const toastId = toast.loading(`Removing ${symbol}...`);
    
    try {
      const result = await dispatch(removeFromWatchlist(watchlistId));
      
      toast.dismiss(toastId);
      
      if (removeFromWatchlist.fulfilled.match(result)) {
        toast.success(`${symbol} removed from watchlist`);
      } else {
        toast.error(result.payload || "Failed to remove from watchlist");
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("An error occurred");
    }
  };

  const handleRowClick = (stockId) => {
    navigate(`/stocks/${stockId}`);
  };

  if (loading && watchlist.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading watchlist...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-semibold">Watchlist</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stocks you're tracking for future trades
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Your watchlist is empty.
          </p>
          <button
            onClick={() => navigate("/stocks")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            Browse Stocks
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Logo</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Change</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {watchlist.map((item) => {
                const stock = item.stock;
                if (!stock) return null;

                const isPositive = stock.changePercent >= 0;

                return (
                  <tr
                    key={item._id}
                    className="border-t border-gray-200 dark:border-gray-800
                               hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <StockLogo 
                        src={stock.logoUrl}
                        symbol={stock.symbol}
                        alt={stock.companyName}
                        size="sm"
                      />
                    </td>
                    <td 
                      className="px-4 py-3 font-medium cursor-pointer hover:text-blue-600"
                      onClick={() => handleRowClick(stock._id)}
                    >
                      {stock.symbol}
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleRowClick(stock._id)}
                    >
                      {stock.companyName}
                    </td>
                    <td 
                      className="px-4 py-3 text-right cursor-pointer"
                      onClick={() => handleRowClick(stock._id)}
                    >
                      ₹{stock.price.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium cursor-pointer ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                      onClick={() => handleRowClick(stock._id)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="inline-flex items-center gap-1
                                   text-red-500 hover:text-red-600
                                   px-3 py-1 rounded-md
                                   hover:bg-red-50 dark:hover:bg-red-900/20
                                   transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item._id, stock.symbol);
                        }}
                      >
                        <FaTrash size={12} />
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}












