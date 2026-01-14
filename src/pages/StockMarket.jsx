import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { 
  FaSearch, FaArrowUp, FaArrowDown, FaSort, FaSortUp, FaSortDown, 
  FaExclamationTriangle, FaRedo 
} from "react-icons/fa";
import { 
  fetchStocks, 
  fetchSectors, 
  selectStocks, 
  selectStocksLoading, 
  selectStocksError, 
  selectPaginationMeta,
  selectStockSectors 
} from "@/features/stocks";
import { StockLogo } from "@/components";
import { TableSkeleton } from "@/components/common/SkeletonLoader";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function StockMarket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const stocks = useSelector(selectStocks);
  const loading = useSelector(selectStocksLoading);
  const error = useSelector(selectStocksError);
  const sectorsList = useSelector(selectStockSectors);
  const { page, totalPages, totalRecords } = useSelector(selectPaginationMeta);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sector, setSector] = useState("");
  const [sortBy, setSortBy] = useState("symbol");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    dispatch(fetchSectors()); 
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStocks({ 
      page: 1, 
      limit: 10, 
      search: debouncedSearch, 
      sector: sector === "All Sectors" ? "" : sector,
      sortBy,
      order
    }));
  }, [debouncedSearch, sector, sortBy, order, dispatch]);

  const fetchMoreData = () => {
    if (page < totalPages) {
      dispatch(fetchStocks({ 
        page: page + 1, 
        limit: 10, 
        search: debouncedSearch, 
        sector: sector === "All Sectors" ? "" : sector,
        sortBy,
        order
      }));
    }
  };

  const handleRetry = () => {
    dispatch(fetchStocks({ 
      page: 1, 
      limit: 10, 
      search: debouncedSearch, 
      sector: sector === "All Sectors" ? "" : sector,
      sortBy,
      order
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" size={10} />;
    return order === "asc" ? <FaSortUp size={10} /> : <FaSortDown size={10} />;
  };

  // ✅ ERROR STATE UI
  if (error && stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full text-red-500">
          <FaExclamationTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Unable to load stocks</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          We encountered an issue connecting to the market data service. This might be due to high traffic.
        </p>
        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaRedo size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-semibold">Stock Market</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time quotes and market analysis
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="All Sectors">All Sectors</option>
          {sectorsList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div id="scrollableDiv" className="overflow-auto h-[600px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <InfiniteScroll
          dataLength={stocks.length}
          next={fetchMoreData}
          hasMore={page < totalPages}
          loader={<div className="py-4 text-center text-sm text-gray-500">Loading more stocks...</div>}
          scrollableTarget="scrollableDiv"
          endMessage={
            stocks.length > 0 && (
              <div className="py-4 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
                End of list ({totalRecords} stocks)
              </div>
            )
          }
        >
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold w-16">Logo</th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-600" onClick={() => handleSort("symbol")}>
                  <div className="flex items-center gap-1">Symbol {getSortIcon("symbol")}</div>
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer hover:text-blue-600" onClick={() => handleSort("companyName")}>
                  <div className="flex items-center gap-1">Company {getSortIcon("companyName")}</div>
                </th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Sector</th>
                <th className="px-4 py-3 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort("price")}>
                  <div className="flex items-center justify-end gap-1">Price {getSortIcon("price")}</div>
                </th>
                <th className="px-4 py-3 font-semibold text-right cursor-pointer hover:text-blue-600" onClick={() => handleSort("changePercent")}>
                  <div className="flex items-center justify-end gap-1">Change {getSortIcon("changePercent")}</div>
                </th>
                <th className="px-4 py-3 font-semibold text-right hidden lg:table-cell">Volume</th>
                <th className="px-4 py-3 font-semibold text-right hidden lg:table-cell">P/E</th>
                <th className="px-4 py-3 font-semibold text-right hidden sm:table-cell">Mkt Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading && stocks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4"><TableSkeleton columns={9} /></td>
                </tr>
              ) : (
                stocks.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  
                  // ✅ Calculate exact Price Change: Current - (Current / (1 + %/100))
                  const changeValue = stock.changePercent 
                    ? (stock.price - (stock.price / (1 + stock.changePercent / 100)))
                    : 0;

                  return (
                    <tr 
                      key={stock._id} 
                      onClick={() => navigate(`/stocks/${stock._id}`)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <StockLogo symbol={stock.symbol} src={stock.logoUrl} size="sm" />
                      </td>
                      <td className="px-4 py-3 font-medium">{stock.symbol}</td>
                      <td className="px-4 py-3">{stock.companyName}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {stock.sector}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{stock.price.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                        <span className="inline-flex items-center gap-1 justify-end">
                          {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                          {/* ✅ Show BOTH Price Change and Percentage */}
                          <span>
                            {Math.abs(changeValue).toFixed(2)} 
                            <span className="text-xs opacity-80 ml-1">({Math.abs(stock.changePercent).toFixed(2)}%)</span>
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell text-gray-500">
                        {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell text-gray-500">
                        {stock.peRatio || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell text-gray-600 dark:text-gray-400">
                        {stock.marketCap ? `₹${(stock.marketCap / 1e9).toFixed(2)}B` : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}