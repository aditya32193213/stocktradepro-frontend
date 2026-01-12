import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSearch, FaArrowUp, FaArrowDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { fetchStocks, selectStocks, selectStocksLoading, selectPaginationMeta } from "@/features/stocks";
import { TableSkeleton } from "@/components/common/SkeletonLoader";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

const SECTORS = [
  "All Sectors",
  "Technology",
  "Finance",
  "Healthcare",
  "Energy",
  "Consumer",
  "Industrial",
  "Utilities",
  "Real Estate",
  "Materials",
  "Telecom"
];

export default function StockMarket() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const stocks = useSelector(selectStocks);
  const loading = useSelector(selectStocksLoading);
  const { page, totalPages } = useSelector(selectPaginationMeta);

  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All Sectors");
  const [sortBy, setSortBy] = useState("marketCap");
  const [order, setOrder] = useState("desc");
  const [localStocks, setLocalStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const debouncedSearch = useDebounce(search);

  // Initial load
  useEffect(() => {
    loadInitialStocks();
  }, [debouncedSearch, sector, sortBy, order]);

  const loadInitialStocks = () => {
    setCurrentPage(1);
    setLocalStocks([]);
    dispatch(fetchStocks({ 
      search: debouncedSearch, 
      page: 1,
      limit: 20,
      sortBy,
      order,
      ...(sector !== "All Sectors" && { sector })
    })).then((result) => {
      if (result.payload) {
        setLocalStocks(result.payload.data);
        setHasMore(result.payload.page < result.payload.totalPages);
      }
    });
  };

  const loadMoreStocks = useCallback(() => {
    const nextPage = currentPage + 1;
    
    dispatch(fetchStocks({ 
      search: debouncedSearch, 
      page: nextPage,
      limit: 20,
      sortBy,
      order,
      ...(sector !== "All Sectors" && { sector })
    })).then((result) => {
      if (result.payload) {
        setLocalStocks(prev => [...prev, ...result.payload.data]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < result.payload.totalPages);
      }
    });
  }, [currentPage, debouncedSearch, sector, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const handleRowClick = (stockId) => {
    navigate(`/stocks/${stockId}`);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="text-gray-400" />;
    return order === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading && localStocks.length === 0) {
    return (
      <div className="space-y-6 text-gray-900 dark:text-gray-100">
        <div>
          <h1 className="text-2xl font-semibold">Stock Market</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Search and explore live stock data
          </p>
        </div>
        <TableSkeleton rows={10} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Stock Market</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Search and explore live stock data
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or symbol"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-900
                       py-2 pl-10 pr-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-md border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900
                     px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Table with Infinite Scroll */}
      {localStocks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No stocks found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={localStocks.length}
          next={loadMoreStocks}
          hasMore={hasMore}
          loader={<div className="text-center py-4 text-gray-500">Loading more stocks...</div>}
          endMessage={<div className="text-center py-4 text-gray-500">No more stocks to load</div>}
        >
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Logo</th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort("symbol")}
                  >
                    <div className="flex items-center gap-2">
                      Symbol
                      {getSortIcon("symbol")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort("companyName")}
                  >
                    <div className="flex items-center gap-2">
                      Company
                      {getSortIcon("companyName")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">Sector</th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Price
                      {getSortIcon("price")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort("changePercent")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Change
                      {getSortIcon("changePercent")}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => handleSort("marketCap")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Market Cap
                      {getSortIcon("marketCap")}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {localStocks.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  
                  return (
                    <tr
                      key={stock._id}
                      onClick={() => handleRowClick(stock._id)}
                      className="border-t border-gray-200 dark:border-gray-800
                                 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        {stock.logoUrl ? (
                          <img 
                            src={stock.logoUrl} 
                            alt={stock.symbol}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/32x32.png?text=${stock.symbol.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                            {stock.symbol.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">{stock.symbol}</td>
                      <td className="px-4 py-3">{stock.companyName}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {stock.sector}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₹{stock.price.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}>
                        <span className="inline-flex items-center gap-1">
                          {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                        {stock.marketCap 
                          ? `₹${(stock.marketCap / 1e9).toFixed(2)}B`
                          : "N/A"
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}