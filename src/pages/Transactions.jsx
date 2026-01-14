import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf, FaFileCsv, FaFilter, FaSearch, FaStickyNote } from "react-icons/fa"; 
import { 
  fetchTransactions, 
  exportTransactionsPDF,
  exportTransactionsCSV,
  selectTransactions, 
  selectTransactionsLoading 
} from "@/features/transactions";
import { StockLogo } from "@/components"; // Ensure you have this component, or remove if not used

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

  // Debounce search to prevent too many API calls
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

  const handleExportPDF = () => {
    const params = {
      search,
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    dispatch(exportTransactionsPDF(params));
  };

  const handleExportCSV = () => {
    const params = {
      search,
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    dispatch(exportTransactionsCSV(params));
  };

  const handleClearFilters = () => {
    setFilter("ALL");
    setSearch("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your complete trading history
          </p>
        </div>

        <div className="flex gap-2">
           {/* Search Bar */}
           <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stock..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-gray-300 dark:border-gray-700 pl-9 pr-4 py-2 text-sm bg-transparent focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaFilter />
            Filters
          </button>

          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          >
            <FaFilePdf />
            PDF
          </button>

          <button
            onClick={handleExportCSV}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            <FaFileCsv />
            CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="font-medium">Filter Transactions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Type</label>
              <div className="flex gap-2">
                {["ALL", "BUY", "SELL"].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setFilter(t); setPage(1); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${filter === t ? "bg-blue-500 text-white" : "border border-gray-300 dark:border-gray-700"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">To Date</label>
              <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }} className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm" />
            </div>
          </div>
          <button onClick={handleClearFilters} className="text-sm text-blue-600 hover:underline">Clear all filters</button>
        </div>
      )}

      {/* Table */}
      {loading && transactions.length === 0 ? (
         <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Symbol</th>
                  <th className="px-4 py-3 text-center">Type</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3">{new Date(tx.createdAt).toLocaleString()}</td>
                    
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                         {/* Ensure StockLogo is imported or replace with just text */}
                        <StockLogo symbol={tx.stock?.symbol} src={tx.stock?.logoUrl} size="sm" />
                        <div>
                          <p className="font-bold">{tx.stock?.symbol || "N/A"}</p>
                          <p className="text-xs text-gray-500">{tx.stock?.companyName}</p>
                        </div>
                        {tx.notes && (
                          <span 
                            title={`Note: ${tx.notes}`} 
                            className="ml-2 text-gray-400 hover:text-blue-500 cursor-help"
                          >
                            <FaStickyNote size={14} />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.type === "BUY" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right">₹{tx.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium">₹{tx.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 border-gray-300 dark:border-gray-700">Previous</button>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 border-gray-300 dark:border-gray-700">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}