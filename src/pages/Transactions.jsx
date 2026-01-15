import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf, FaFileCsv, FaFilter, FaSearch, FaStickyNote, FaHistory, FaDownload, FaTimes, FaChevronLeft, FaChevronRight, FaShoppingCart, FaChartLine } from "react-icons/fa"; 
import { 
  fetchTransactions, 
  exportTransactionsPDF,
  exportTransactionsCSV,
  selectTransactions, 
  selectTransactionsLoading 
} from "@/features/transactions";
import { StockLogo } from "@/components";

export default function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState(""); 
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = {
        page,
        limit: 20,
        search, 
        ...(filter !== "ALL" && { type: filter }),
        ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
        ...(toDate && { toDate: new Date(toDate).toISOString() }),
      };
      
      dispatch(fetchTransactions(params)).then((result) => {
        if (result.payload) {
          setTotalPages(result.payload.totalPages || 1);
        }
      });
    }, 500); 

    return () => clearTimeout(timer);
  }, [dispatch, filter, search, fromDate, toDate, page]);

  const handleExportPDF = async () => {
    setExportingPDF(true);
    const params = {
      search,
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    await dispatch(exportTransactionsPDF(params));
    setExportingPDF(false);
  };

  const handleExportCSV = async () => {
    setExportingCSV(true);
    const params = {
      search,
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    await dispatch(exportTransactionsCSV(params));
    setExportingCSV(false);
  };

  const handleClearFilters = () => {
    setFilter("ALL");
    setSearch("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const hasActiveFilters = filter !== "ALL" || search || fromDate || toDate;

  // Calculate stats
  const totalBuyTransactions = transactions.filter(tx => tx.type === "BUY").length;
  const totalSellTransactions = transactions.filter(tx => tx.type === "SELL").length;
  const totalValue = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto text-gray-900 dark:text-gray-100">
        
        {/* Hero Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 lg:p-10 shadow-2xl shadow-indigo-500/20">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            {/* Left: Title Section */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                <FaHistory className="text-white" size={12} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Transaction History</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-lg">
                Your Transactions
              </h1>
              <p className="text-indigo-100 text-sm lg:text-base font-medium max-w-2xl leading-relaxed">
                Complete history of all your buy and sell orders with detailed insights
              </p>
            </div>
            
            {/* Right: Stats Card */}
            <div className="w-full lg:w-auto min-w-[320px]">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FaHistory className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{transactions.length}</p>
                    <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total</p>
                  </div>
                  <div className="text-center border-l border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-green-500/30 rounded-lg">
                        <FaShoppingCart className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{totalBuyTransactions}</p>
                    <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Buys</p>
                  </div>
                  <div className="text-center border-l border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      <div className="p-2 bg-red-500/30 rounded-lg">
                        <FaChartLine className="text-white" size={16} />
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white">{totalSellTransactions}</p>
                    <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Sells</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Left: Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by stock symbol..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" size={14} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  showFilters || hasActiveFilters
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/30'
                    : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <FaFilter size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white/30 text-white text-xs font-black px-2 py-0.5 rounded-full">
                    •
                  </span>
                )}
              </button>
            </div>

            {/* Right: Export Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                disabled={loading || exportingPDF}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {exportingPDF ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FaFilePdf size={16} />
                    PDF
                  </>
                )}
              </button>

              <button
                onClick={handleExportCSV}
                disabled={loading || exportingCSV}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {exportingCSV ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FaFileCsv size={16} />
                    CSV
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-lg text-gray-800 dark:text-white">Filter Transactions</h3>
                {hasActiveFilters && (
                  <button 
                    onClick={handleClearFilters} 
                    className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-2"
                  >
                    <FaTimes size={12} />
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Transaction Type */}
                <div>
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-3 uppercase tracking-wider">Transaction Type</label>
                  <div className="flex gap-2">
                    {["ALL", "BUY", "SELL"].map((t) => (
                      <button
                        key={t}
                        onClick={() => { setFilter(t); setPage(1); }}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          filter === t 
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30" 
                            : "border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* From Date */}
                <div>
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-3 uppercase tracking-wider">From Date</label>
                  <input 
                    type="date" 
                    value={fromDate} 
                    onChange={(e) => { setFromDate(e.target.value); setPage(1); }} 
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-400 block mb-3 uppercase tracking-wider">To Date</label>
                  <input 
                    type="date" 
                    value={toDate} 
                    onChange={(e) => { setToDate(e.target.value); setPage(1); }} 
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {loading && transactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 ml-2">Loading transactions...</span>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 lg:p-16 text-center bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-8 rounded-full">
                  <FaHistory className="text-gray-400 dark:text-gray-600" size={56} />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-gray-700 dark:text-gray-300">No Transactions Found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {hasActiveFilters 
                    ? "Try adjusting your filters to see more results" 
                    : "You haven't made any transactions yet. Start trading to see your history here"}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105"
                >
                  <FaTimes size={14} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-800/30">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                    <FaHistory className="text-indigo-600 dark:text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-gray-800 dark:text-white">Transaction History</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-gray-50 to-indigo-50/50 dark:from-gray-800 dark:to-gray-800/50 sticky top-0 z-10 border-b-2 border-indigo-200 dark:border-indigo-800">
                    <tr className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-widest font-black">
                      <th className="px-6 py-5 text-left">Date & Time</th>
                      <th className="px-6 py-5 text-left">Stock</th>
                      <th className="px-6 py-5 text-center">Type</th>
                      <th className="px-6 py-5 text-right">Quantity</th>
                      <th className="px-6 py-5 text-right">Price</th>
                      <th className="px-6 py-5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {transactions.map((tx, index) => (
                      <tr 
                        key={tx._id} 
                        className="group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/30 dark:hover:from-indigo-900/10 dark:hover:to-purple-900/5 transition-all duration-200 border-l-4 border-transparent hover:border-indigo-500"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-5">
                          <div className="text-sm">
                            <p className="font-bold text-gray-900 dark:text-white">
                              {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </td>
                        
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <StockLogo 
                              symbol={tx.stock?.symbol} 
                              src={tx.stock?.logoUrl} 
                              size="sm"
                              className="shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-indigo-200 dark:group-hover:ring-indigo-700 transition-all group-hover:scale-110"
                            />
                            <div>
                              <p className="font-black text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {tx.stock?.symbol || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {tx.stock?.companyName}
                              </p>
                            </div>
                            {tx.notes && (
                              <span 
                                title={`Note: ${tx.notes}`} 
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-help transition-colors"
                              >
                                <FaStickyNote size={12} />
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md ${
                            tx.type === "BUY" 
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800" 
                              : "bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        
                        <td className="px-6 py-5 text-right">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm border border-gray-200 dark:border-gray-700">
                            {tx.quantity}
                          </span>
                        </td>
                        
                        <td className="px-6 py-5 text-right font-mono font-bold text-base text-gray-900 dark:text-white">
                          ₹{tx.price.toLocaleString()}
                        </td>
                        
                        <td className="px-6 py-5 text-right font-mono font-black text-base text-gray-900 dark:text-white">
                          ₹{tx.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Page <span className="text-indigo-600 dark:text-indigo-400">{page}</span> of <span className="text-indigo-600 dark:text-indigo-400">{totalPages}</span>
              </span>
              <div className="flex gap-3">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)} 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-sm transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700"
                >
                  <FaChevronLeft size={12} />
                  Previous
                </button>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(page + 1)} 
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-sm transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700"
                >
                  Next
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}