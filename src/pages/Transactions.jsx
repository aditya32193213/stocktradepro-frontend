import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFilePdf, FaFileCsv, FaFilter } from "react-icons/fa";
import { 
  fetchTransactions, 
  exportTransactionsPDF,
  exportTransactionsCSV,
  selectTransactions, 
  selectTransactionsLoading 
} from "@/features/transactions";

export default function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);

  const [filter, setFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = {
      page,
      limit: 20,
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    
    dispatch(fetchTransactions(params)).then((result) => {
      if (result.payload) {
        setTotalPages(result.payload.totalPages || 1);
      }
    });
  }, [dispatch, filter, fromDate, toDate, page]);

  const handleExportPDF = () => {
    const params = {
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    dispatch(exportTransactionsPDF(params));
  };

  const handleExportCSV = () => {
    const params = {
      ...(filter !== "ALL" && { type: filter }),
      ...(fromDate && { fromDate: new Date(fromDate).toISOString() }),
      ...(toDate && { toDate: new Date(toDate).toISOString() }),
    };
    dispatch(exportTransactionsCSV(params));
  };

  const handleClearFilters = () => {
    setFilter("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading transactions...</p>
      </div>
    );
  }

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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2
                       rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2
                       text-sm font-medium
                       hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaFilter />
            Filters
          </button>

          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="inline-flex items-center gap-2
                       rounded-md bg-red-500 px-4 py-2
                       text-sm font-medium text-white
                       hover:bg-red-600 disabled:opacity-50"
          >
            <FaFilePdf />
            PDF
          </button>

          <button
            onClick={handleExportCSV}
            disabled={loading}
            className="inline-flex items-center gap-2
                       rounded-md bg-green-500 px-4 py-2
                       text-sm font-medium text-white
                       hover:bg-green-600 disabled:opacity-50"
          >
            <FaFileCsv />
            CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-4">
          <h3 className="font-medium">Filter Transactions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                Transaction Type
              </label>
              <div className="flex gap-2">
                {["ALL", "BUY", "SELL"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFilter(t);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      filter === t
                        ? "bg-blue-500 text-white"
                        : "border border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* From Date */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-900 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Empty State */}
      {transactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No transactions found for the selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
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
                  <tr
                    key={tx._id}
                    className="border-t border-gray-200 dark:border-gray-800
                               hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-3">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {tx.stock?.symbol || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tx.type === "BUY"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                            : "bg-red-100 text-red-600 dark:bg-red-900/30"
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right">
                      ₹{tx.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ₹{tx.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="rounded-md border px-3 py-1 text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed
                           border-gray-300 dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Previous
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-md border px-3 py-1 text-sm
                           disabled:opacity-50 disabled:cursor-not-allowed
                           border-gray-300 dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}