import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllTransactions } from "../services/transaction.service";
import { useAuth } from "../context/AuthContext";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import * as darkModeStyles from "../utils/darkModeStyles";
import { getRealToken, refreshToken } from "../services/auth.service";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, authenticated } = useAuth();
  const { darkMode } = useTheme();

  // Get query params with defaults
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const sort = searchParams.get("sort") || "payment_time";
  const order = searchParams.get("order") || "desc";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: page,
    limit: limit,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    successfulAmount: 0,
    successfulCount: 0,
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState(status);
  const [dateRange, setDateRange] = useState({
    startDate: startDate,
    endDate: endDate,
  });
  const [sortConfig, setSortConfig] = useState({
    field: sort,
    order: order,
  });

  // Status options - updated to match backend values
  const statusOptions = [
    "All",
    "SUCCESS",
    "PENDING",
    "FAILED",
    "PROCESSING",
    "COMPLETED",
    "REFUNDED",
    "CANCELLED",
  ];

  const [refreshingToken, setRefreshingToken] = useState(false);

  useEffect(() => {
    // Get authentication token first, then fetch transactions
    ensureAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated) {
      // Only fetch from server if sorting field is not client-side sorted
      if (
        sortConfig.field !== "transaction_amount" &&
        sortConfig.field !== "order_amount"
      ) {
        fetchTransactions();
      }
    }
  }, [
    authenticated,
    page,
    limit,
    sortConfig.field,
    sortConfig.order,
    statusFilter,
    dateRange.startDate,
    dateRange.endDate,
  ]);

  // Make sure we're authenticated before fetching data
  const ensureAuthentication = async () => {
    try {
      if (!authenticated) {
        await getRealToken();
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please log in again.");
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = {
        page,
        limit,
        sort: sortConfig.field,
        order: sortConfig.order,
      };

      // Add status filter if not 'All'
      if (statusFilter && statusFilter !== "All") {
        params.status = statusFilter;
      }

      // Add date range filters if they exist
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      // Update URL params
      setSearchParams(params);

      const result = await getAllTransactions(params);
      console.log("Transactions API response:", result);

      if (result && result.data) {
        // Process the transactions to normalize status values
        let normalizedTransactions =
          result.data.transactions?.map((tx) => ({
            ...tx,
            // Convert status to lowercase for consistency
            status: tx.status?.toLowerCase() || "pending",
          })) || [];

        // Apply client-side sorting if sort field is transaction_amount or order_amount
        if (
          sortConfig.field === "transaction_amount" ||
          sortConfig.field === "order_amount"
        ) {
          normalizedTransactions = normalizedTransactions.sort((a, b) => {
            const valA = parseFloat(a[sortConfig.field] || 0);
            const valB = parseFloat(b[sortConfig.field] || 0);
            return sortConfig.order === "asc" ? valA - valB : valB - valA;
          });
        }

        console.log("Normalized transactions:", normalizedTransactions);

        setTransactions(normalizedTransactions);
        setPagination(
          result.data.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          }
        );

        // Calculate statistics based on normalized transactions
        const total = normalizedTransactions.length;
        const totalAmount = normalizedTransactions.reduce(
          (sum, tx) => sum + (parseFloat(tx.transaction_amount) || 0),
          0
        );
        const successfulTxs = normalizedTransactions.filter(
          (tx) => tx.status === "success" || tx.status === "completed"
        );
        const successfulCount = successfulTxs.length;
        const successfulAmount = successfulTxs.reduce(
          (sum, tx) => sum + (parseFloat(tx.transaction_amount) || 0),
          0
        );

        setStats({
          totalAmount: totalAmount,
          totalCount: total,
          successfulAmount: successfulAmount,
          successfulCount: successfulCount,
        });
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: newPage.toString(),
      });
    }
  };

  const handleSortChange = (field) => {
    // Update sort configuration in state
    const newOrder =
      sortConfig.field === field && sortConfig.order === "asc" ? "desc" : "asc";

    setSortConfig({
      field,
      order: newOrder,
    });

    // Apply client-side sorting for amount fields
    if (field === "transaction_amount" || field === "order_amount") {
      // Create a sorted copy of the transactions array
      const sortedTransactions = [...transactions].sort((a, b) => {
        // Parse the values as floats to ensure proper numeric comparison
        const valA = parseFloat(a[field] || 0);
        const valB = parseFloat(b[field] || 0);

        // Apply the sort order
        return newOrder === "asc" ? valA - valB : valB - valA;
      });

      // Update the transactions with the sorted array
      setTransactions(sortedTransactions);
    }
    // For other fields, the sorting will happen server-side via the useEffect
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateChange = (e, field) => {
    setDateRange({
      ...dateRange,
      [field]: e.target.value,
    });
  };

  const applyFilters = () => {
    fetchTransactions();
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setDateRange({ startDate: "", endDate: "" });
    setSortConfig({ field: "payment_time", order: "desc" });
    setSearchParams({});
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const handleTokenRefresh = async () => {
    setRefreshingToken(true);
    const success = await refreshToken();

    if (success) {
      // After successful token refresh, try to fetch transactions again
      fetchTransactions();
    }

    setRefreshingToken(false);
  };

  return (
    <div
      className={`${darkMode ? "bg-gray-900" : "bg-gray-100"} min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className={darkModeStyles.getHeaderClass(darkMode)}>Dashboard</h1>

        {/* Filters Section */}
        <div className={darkModeStyles.getFilterSectionClass(darkMode)}>
          <h2 className={darkModeStyles.getSectionHeaderClass(darkMode)}>
            Filters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className={darkModeStyles.getSelectClass(darkMode)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange(e, "startDate")}
                className={darkModeStyles.getInputClass(darkMode)}
              />
            </div>
            <div>
              <label className={darkModeStyles.getFormLabelClass(darkMode)}>
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange(e, "endDate")}
                className={darkModeStyles.getInputClass(darkMode)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={resetFilters}
              className={darkModeStyles.getSecondaryButtonClass(darkMode)}
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className={darkModeStyles.getPrimaryButtonClass(darkMode)}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <div className="mt-2">
              <button
                onClick={handleTokenRefresh}
                disabled={refreshingToken}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {refreshingToken
                  ? "Refreshing Token..."
                  : "Refresh Authentication Token"}
              </button>
            </div>
          </div>
        )}

        {/* If transactions are empty but we're not loading, show a refresh button */}
        {!loading && !error && transactions.length === 0 && (
          <div
            className={`${darkMode ? "bg-gray-800 border-yellow-600" : "bg-yellow-100 border-yellow-400"} border text-yellow-700 px-4 py-3 rounded mb-6`}
          >
            <p className={darkMode ? "text-yellow-400" : "text-yellow-700"}>
              No transactions found. Your authentication token may have expired.
            </p>
            <div className="mt-2">
              <button
                onClick={handleTokenRefresh}
                disabled={refreshingToken}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {refreshingToken
                  ? "Refreshing Token..."
                  : "Refresh Authentication Token"}
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
          {/* Total Transactions Card */}
          <div className={darkModeStyles.getContentContainerClass(darkMode)}>
            <h2
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} truncate`}
            >
              Total Transactions
            </h2>
            <div className="mt-1 flex items-baseline justify-between">
              <p
                className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {stats.totalCount}
              </p>
              <div
                className={`bg-green-100 ${darkMode ? "bg-opacity-20" : ""} p-1 rounded-md`}
              >
                <FaArrowUp className="text-green-500" />
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className={darkModeStyles.getContentContainerClass(darkMode)}>
            <h2
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} truncate`}
            >
              Total Amount
            </h2>
            <div className="mt-1 flex items-baseline justify-between">
              <p
                className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                ${stats.totalAmount ? stats.totalAmount.toFixed(2) : "0.00"}
              </p>
              <div
                className={`bg-green-100 ${darkMode ? "bg-opacity-20" : ""} p-1 rounded-md`}
              >
                <FaArrowUp className="text-green-500" />
              </div>
            </div>
          </div>

          {/* Successful Transactions Card */}
          <div className={darkModeStyles.getContentContainerClass(darkMode)}>
            <h2
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} truncate`}
            >
              Successful Transactions
            </h2>
            <div className="mt-1 flex items-baseline justify-between">
              <p
                className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                {stats.successfulCount}
              </p>
              <div
                className={`bg-green-100 ${darkMode ? "bg-opacity-20" : ""} p-1 rounded-md`}
              >
                <FaArrowUp className="text-green-500" />
              </div>
            </div>
          </div>

          {/* Successful Amount Card */}
          <div className={darkModeStyles.getContentContainerClass(darkMode)}>
            <h2
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} truncate`}
            >
              Successful Amount
            </h2>
            <div className="mt-1 flex items-baseline justify-between">
              <p
                className={`text-2xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                $
                {stats.successfulAmount
                  ? stats.successfulAmount.toFixed(2)
                  : "0.00"}
              </p>
              <div
                className={`bg-green-100 ${darkMode ? "bg-opacity-20" : ""} p-1 rounded-md`}
              >
                <FaArrowUp className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={darkModeStyles.getContentContainerClass(darkMode)}>
          <h2 className={darkModeStyles.getSectionHeaderClass(darkMode)}>
            Recent Transactions
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div
                className={`w-6 h-6 border-2 ${darkMode ? "border-gray-300" : "border-gray-600"} border-t-blue-600 rounded-full animate-spin`}
              ></div>
            </div>
          ) : error ? (
            <div className={`text-center py-4 text-red-500`}>{error}</div>
          ) : transactions.length === 0 ? (
            <div
              className={`text-center py-4 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={darkModeStyles.getTableClass(darkMode)}>
                <thead className={darkModeStyles.getTableHeaderClass(darkMode)}>
                  <tr>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("collect_id")}
                      style={{ cursor: "pointer" }}
                    >
                      Transaction ID
                      {sortConfig.field === "collect_id" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("school_id")}
                      style={{ cursor: "pointer" }}
                    >
                      School ID
                      {sortConfig.field === "school_id" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("gateway")}
                      style={{ cursor: "pointer" }}
                    >
                      Gateway
                      {sortConfig.field === "gateway" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("order_amount")}
                      style={{ cursor: "pointer" }}
                    >
                      Order Amount
                      {sortConfig.field === "order_amount" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("transaction_amount")}
                      style={{ cursor: "pointer" }}
                    >
                      Transaction Amount
                      {sortConfig.field === "transaction_amount" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("status")}
                      style={{ cursor: "pointer" }}
                    >
                      Status
                      {sortConfig.field === "status" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                    <th
                      className={darkModeStyles.getTableHeaderCellClass(
                        darkMode
                      )}
                      onClick={() => handleSortChange("payment_time")}
                      style={{ cursor: "pointer" }}
                    >
                      Payment Time
                      {sortConfig.field === "payment_time" && (
                        <span className="ml-1">
                          {sortConfig.order === "asc" ? (
                            <FaArrowUp className="inline" />
                          ) : (
                            <FaArrowDown className="inline" />
                          )}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className={darkModeStyles.getTableBodyClass(darkMode)}>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className={darkModeStyles.getTableRowClass(darkMode)}
                    >
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        {transaction.custom_order_id ||
                          transaction.collect_id ||
                          "N/A"}
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        {transaction.school_id || "N/A"}
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        {transaction.gateway || "N/A"}
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        $
                        {transaction.order_amount
                          ? parseFloat(transaction.order_amount).toFixed(2)
                          : "0.00"}
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        $
                        {transaction.transaction_amount
                          ? parseFloat(transaction.transaction_amount).toFixed(
                              2
                            )
                          : "0.00"}
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "completed" ||
                            transaction.status === "success"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          } ${darkMode ? "bg-opacity-20" : ""}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td
                        className={darkModeStyles.getTableCellClass(darkMode)}
                      >
                        {transaction.payment_time
                          ? new Date(transaction.payment_time).toLocaleString()
                          : transaction.createdAt
                            ? new Date(transaction.createdAt).toLocaleString()
                            : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {transactions.length > 0 && (
                <div className={darkModeStyles.getPaginationClass(darkMode)}>
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`${darkModeStyles.getSecondaryButtonClass(darkMode)} ${
                        page === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className={`${darkModeStyles.getSecondaryButtonClass(darkMode)} ml-3 ${
                        page === pagination.totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Showing{" "}
                        <span className="font-medium">
                          {transactions.length > 0 ? (page - 1) * limit + 1 : 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(page * limit, pagination.total)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{pagination.total}</span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                            darkMode
                              ? "text-gray-300 ring-gray-700 hover:bg-gray-800"
                              : "text-gray-400 ring-gray-300 hover:bg-gray-50"
                          } ring-1 ring-inset ${
                            page === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        {[...Array(pagination.totalPages)].map((_, idx) => {
                          const pageNumber = idx + 1;
                          // Only show a window of 5 pages centered around current page
                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            (pageNumber >= page - 2 && pageNumber <= page + 2)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  page === pageNumber
                                    ? `z-10 ${
                                        darkMode ? "bg-blue-700" : "bg-blue-600"
                                      } text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`
                                    : `${
                                        darkMode
                                          ? "text-gray-300 ring-gray-700 hover:bg-gray-800"
                                          : "text-gray-900 ring-gray-300 hover:bg-gray-50"
                                      } ring-1 ring-inset focus:outline-offset-0`
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          }

                          // Show ellipsis
                          if (
                            (pageNumber === 2 && page > 4) ||
                            (pageNumber === pagination.totalPages - 1 &&
                              page < pagination.totalPages - 3)
                          ) {
                            return (
                              <span
                                key={`ellipsis-${pageNumber}`}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                  darkMode
                                    ? "text-gray-300 ring-gray-700"
                                    : "text-gray-700 ring-gray-300"
                                } ring-1 ring-inset`}
                              >
                                ...
                              </span>
                            );
                          }

                          return null;
                        })}

                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === pagination.totalPages}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                            darkMode
                              ? "text-gray-300 ring-gray-700 hover:bg-gray-800"
                              : "text-gray-400 ring-gray-300 hover:bg-gray-50"
                          } ring-1 ring-inset ${
                            page === pagination.totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : "focus:z-20 focus:outline-offset-0"
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
