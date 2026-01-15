import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { 
  FaSearch, FaArrowUp, FaArrowDown, FaSort, FaSortUp, FaSortDown, 
  FaExclamationTriangle, FaRedo, FaFilter, FaChartLine, FaTimes 
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
    if (sortBy !== field) return <FaSort className="text-gray-400 opacity-40" size={11} />;
    return order === "asc" ? <FaSortUp className="text-blue-600 dark:text-blue-400" size={11} /> : <FaSortDown className="text-blue-600 dark:text-blue-400" size={11} />;
  };

  const clearSearch = () => setSearch("");
  const clearFilters = () => {
    setSearch("");
    setSector("");
  };

  const hasActiveFilters = search || (sector && sector !== "All Sectors");

  if (error && stocks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-rose-200 dark:from-red-900/20 dark:to-rose-900/20 rounded-full blur-3xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 p-8 rounded-full border border-red-200 dark:border-red-800">
              <FaExclamationTriangle className="text-red-500 dark:text-red-400" size={48} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">Connection Error</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We're having trouble connecting to the market data service. Please check your connection and try again.
            </p>
          </div>
          <button 
            onClick={handleRetry} 
            className="flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
          >
            <FaRedo size={16} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto text-gray-900 dark:text-gray-100">
        
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 lg:p-10 shadow-2xl shadow-blue-500/20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 space-y-6">
            {/* Title Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Market Data</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
                  Stock Market
                </h1>
                <p className="text-blue-100 text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
                  Real-time quotes, market analysis, and comprehensive stock data at your fingertips
                </p>
              </div>

              {/* Stats Badge */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-wider">Total Stocks</p>
                    <p className="text-3xl font-black text-white">{totalRecords || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Filters Section */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="Search by symbol or company name..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all shadow-lg font-medium"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-white/60 hover:text-white" size={14} />
                  </button>
                )}
              </div>
              
              {/* Sector Filter */}
              <div className="relative lg:w-72">
                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10" size={14} />
                <select 
                  value={sector} 
                  onChange={(e) => setSector(e.target.value)} 
                  className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none appearance-none cursor-pointer shadow-lg font-medium"
                >
                  <option value="" className="bg-gray-900 text-white">All Sectors</option>
                  {sectorsList.map((s) => <option key={s} value={s} className="bg-gray-900 text-white">{s}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60">
                  <FaSortDown size={14} />
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-xl transition-all border border-white/30 flex items-center gap-2 shadow-lg hover:scale-105"
                >
                  <FaTimes size={12} /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Data Table Container */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
          
          <div 
            id="scrollableDiv" 
            className="overflow-auto h-[calc(100vh-400px)] min-h-[500px] scrollbar-thin scrollbar-thumb-blue-500/50 hover:scrollbar-thumb-blue-500 dark:scrollbar-thumb-blue-600/50 dark:hover:scrollbar-thumb-blue-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
          >
            <InfiniteScroll
              dataLength={stocks.length}
              next={fetchMoreData}
              hasMore={page < totalPages}
              loader={
                <div className="py-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400 ml-2">Loading more stocks...</span>
                  </div>
                </div>
              }
              scrollableTarget="scrollableDiv"
              endMessage={
                stocks.length > 0 && (
                  <div className="py-8 text-center border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        End of list • {totalRecords} stocks
                      </span>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                )
              }
            >
              <table className="w-full text-left text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50 sticky top-0 z-20 backdrop-blur-xl border-b-2 border-blue-200 dark:border-blue-800 shadow-sm">
                  <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-black">
                    <th className="px-6 py-5 w-20 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaChartLine className="text-blue-600 dark:text-blue-400" size={12} />
                        </div>
                      </div>
                    </th>
                    
                    <th className="px-6 py-5 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all group" onClick={() => handleSort("symbol")}>
                      <div className="flex items-center gap-2">
                        Symbol 
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">{getSortIcon("symbol")}</span>
                      </div>
                    </th>
                    
                    <th className="px-6 py-5 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all group" onClick={() => handleSort("companyName")}>
                      <div className="flex items-center gap-2">
                        Company 
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">{getSortIcon("companyName")}</span>
                      </div>
                    </th>
                    
                    <th className="px-6 py-5 hidden md:table-cell">Sector</th>
                    
                    <th className="px-6 py-5 text-right cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all group" onClick={() => handleSort("price")}>
                      <div className="flex items-center justify-end gap-2">
                        Price 
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">{getSortIcon("price")}</span>
                      </div>
                    </th>
                    
                    <th className="px-6 py-5 text-right cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all group" onClick={() => handleSort("changePercent")}>
                      <div className="flex items-center justify-end gap-2">
                        Change 
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">{getSortIcon("changePercent")}</span>
                      </div>
                    </th>
                    
                    <th className="px-6 py-5 text-right hidden lg:table-cell">Volume</th>
                    <th className="px-6 py-5 text-right hidden lg:table-cell">P/E Ratio</th>
                    <th className="px-6 py-5 text-right hidden xl:table-cell">Market Cap</th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading && stocks.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8">
                        <TableSkeleton columns={9} rows={10} />
                      </td>
                    </tr>
                  ) : stocks.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <FaSearch className="text-gray-400 dark:text-gray-600" size={32} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">No stocks found</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stocks.map((stock, index) => {
                      const isPositive = stock.changePercent >= 0;
                      const changeValue = stock.changePercent 
                        ? (stock.price - (stock.price / (1 + stock.changePercent / 100))) 
                        : 0;
                      
                      return (
                        <tr 
                          key={stock._id} 
                          onClick={() => navigate(`/stocks/${stock._id}`)} 
                          className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/5 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-600"
                          style={{ animationDelay: `${index * 0.02}s` }}
                        >
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center">
                              <StockLogo 
                                symbol={stock.symbol} 
                                src={stock.logoUrl} 
                                size="sm" 
                                className="shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-700 transition-all group-hover:scale-125 group-hover:rotate-3" 
                              />
                            </div>
                          </td>
                          
                          <td className="px-6 py-5">
                            <span className="font-black text-base text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {stock.symbol}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5">
                            <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                              {stock.companyName}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5 hidden md:table-cell">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm group-hover:from-blue-100 group-hover:to-indigo-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-indigo-900/30 transition-all">
                              {stock.sector}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5 text-right">
                            <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                              ₹{stock.price.toLocaleString()}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5 text-right">
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm shadow-md transition-all group-hover:scale-105 ${
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
                          
                          <td className="px-6 py-5 text-right hidden lg:table-cell">
                            <span className="text-gray-600 dark:text-gray-400 font-mono text-sm font-medium">
                              {stock.volume ? stock.volume.toLocaleString() : "—"}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5 text-right hidden lg:table-cell">
                            <span className="text-gray-600 dark:text-gray-400 font-mono text-sm font-medium">
                              {stock.peRatio || "—"}
                            </span>
                          </td>
                          
                          <td className="px-6 py-5 text-right hidden xl:table-cell">
                            <span className="text-gray-600 dark:text-gray-400 font-mono text-sm font-medium">
                              {stock.marketCap ? `₹${(stock.marketCap / 1e9).toFixed(2)}B` : "—"}
                            </span>
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
      </div>
    </div>
  );
}