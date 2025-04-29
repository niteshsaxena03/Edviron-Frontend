import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import * as darkModeStyles from "../utils/darkModeStyles";

const SchoolTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const sort = searchParams.get("sort") || "payment_time";
  const order = searchParams.get("order") || "desc";
  const schoolId = searchParams.get("schoolId") || "";

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: page,
    limit: limit,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    field: sort,
    order: order,
  });
  const [selectedSchoolId, setSelectedSchoolId] = useState(schoolId);

  const schoolIdOptions = [
    { id: "65b0e6293e9f76a9694d84b4", name: "Demo School" },
  ];

  useEffect(() => {
    if (selectedSchoolId) {
      fetchTransactions();
    }
  }, [page, limit, sortConfig.field, sortConfig.order, selectedSchoolId]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    if (!selectedSchoolId) {
      setError("Please select a school first");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing. Please login again.");
        setLoading(false);
        return;
      }

      const params = {
        page,
        limit,
        sort: sortConfig.field,
        order: sortConfig.order,
      };

      setSearchParams({
        ...params,
        schoolId: selectedSchoolId,
      });

      try {
        const response = await api.get(
          `/transactions/school/${selectedSchoolId}`,
          { params }
        );

        const data = response.data;

        if (
          data &&
          data.data &&
          data.data.transactions &&
          data.data.transactions.length > 0
        ) {
          setTransactions(data.data.transactions);
          setPagination(
            data.data.pagination || {
              total: data.data.transactions.length,
              page: 1,
              limit: 10,
              totalPages: 1,
            }
          );
          return;
        }
      } catch (err) {
        console.error("Error fetching school-specific transactions:", err);
      }

      const allTransactionsResponse = await api.get(`/transactions`, {
        params,
      });

      if (
        allTransactionsResponse.data &&
        allTransactionsResponse.data.data &&
        allTransactionsResponse.data.data.transactions
      ) {
        const transactions = allTransactionsResponse.data.data.transactions.map(
          (tx) => ({
            ...tx,
            school_id: tx.school_id || selectedSchoolId,
          })
        );

        setTransactions(transactions);
        setPagination(
          allTransactionsResponse.data.data.pagination || {
            total: transactions.length,
            page: 1,
            limit: 10,
            totalPages: 1,
          }
        );

        setError(null);
      } else {
        setTransactions([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        });
        setError("No transactions found in the system");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);

      if (err.response && err.response.status === 401) {
        setError(
          "Authentication error: Your token has expired. Please login again."
        );
      } else {
        setError(err.message || "Failed to load transactions");
      }

      setTransactions([]);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
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
    setSortConfig({
      field,
      order:
        sortConfig.field === field && sortConfig.order === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSchoolChange = (e) => {
    setSelectedSchoolId(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={darkModeStyles.getContentContainerClass(darkMode)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className={darkModeStyles.getHeaderClass(darkMode)}>
          School Transactions
        </h1>
      </div>

      <div className={darkModeStyles.getFilterContainerClass(darkMode)}>
        <h2 className={darkModeStyles.getSectionHeaderClass(darkMode)}>
          Select School
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={darkModeStyles.getLabelClass(darkMode)}>
              School ID
            </label>
            <select
              value={selectedSchoolId}
              onChange={handleSchoolChange}
              className={darkModeStyles.getSelectClass(darkMode)}
            >
              <option value="">Select a School</option>
              {schoolIdOptions.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name} ({school.id})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchTransactions}
            disabled={!selectedSchoolId || loading}
            className={
              !selectedSchoolId || loading
                ? darkModeStyles.getDisabledButtonClass(darkMode)
                : darkModeStyles.getPrimaryButtonClass(darkMode)
            }
          >
            View Transactions
          </button>
        </div>
      </div>

      {error && (
        <div
          className={`${darkMode ? "bg-red-900 border-red-800 text-red-100" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded relative mb-4 transition-colors duration-300`}
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? "border-blue-400" : "border-blue-500"}`}
          ></div>
        </div>
      ) : (
        <>
          {!selectedSchoolId && (
            <div
              className={`text-center py-12 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg transition-colors duration-300`}
            >
              <h3
                className={`text-lg font-medium ${darkMode ? "text-gray-100" : "text-gray-900"} mb-2 transition-colors duration-300`}
              >
                Please select a school
              </h3>
              <p
                className={`${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
              >
                Select a school ID to view its transactions
              </p>
            </div>
          )}

          {selectedSchoolId && (
            <>
              <div className="overflow-x-auto">
                <table className={darkModeStyles.getTableClass(darkMode)}>
                  <thead
                    className={darkModeStyles.getTableHeaderClass(darkMode)}
                  >
                    <tr>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "collect_id"
                        )}
                        onClick={() => handleSortChange("collect_id")}
                      >
                        <div className="flex items-center">
                          Transaction ID
                          {sortConfig.field === "collect_id" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "gateway"
                        )}
                        onClick={() => handleSortChange("gateway")}
                      >
                        <div className="flex items-center">
                          Gateway
                          {sortConfig.field === "gateway" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "order_amount"
                        )}
                        onClick={() => handleSortChange("order_amount")}
                      >
                        <div className="flex items-center">
                          Order Amount
                          {sortConfig.field === "order_amount" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "transaction_amount"
                        )}
                        onClick={() => handleSortChange("transaction_amount")}
                      >
                        <div className="flex items-center">
                          Transaction Amount
                          {sortConfig.field === "transaction_amount" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "status"
                        )}
                        onClick={() => handleSortChange("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortConfig.field === "status" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className={darkModeStyles.getSortableHeaderClass(
                          darkMode,
                          sortConfig.field === "payment_time"
                        )}
                        onClick={() => handleSortChange("payment_time")}
                      >
                        <div className="flex items-center">
                          Payment Time
                          {sortConfig.field === "payment_time" && (
                            <span className="ml-1">
                              {sortConfig.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={darkModeStyles.getTableBodyClass(darkMode)}>
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction.collect_id}
                          className={darkModeStyles.getTableRowClass(darkMode)}
                        >
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {transaction.custom_order_id ||
                              transaction.collect_id ||
                              "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {transaction.gateway || "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            ₹{transaction.order_amount?.toFixed(2) || "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            ₹
                            {transaction.transaction_amount?.toFixed(2) ||
                              "N/A"}
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  transaction.status === "success"
                                    ? darkMode
                                      ? "bg-green-800 text-green-100"
                                      : "bg-green-100 text-green-800"
                                    : transaction.status === "pending"
                                      ? darkMode
                                        ? "bg-yellow-800 text-yellow-100"
                                        : "bg-yellow-100 text-yellow-800"
                                      : darkMode
                                        ? "bg-red-800 text-red-100"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                              {transaction.status || "N/A"}
                            </span>
                          </td>
                          <td
                            className={darkModeStyles.getTableCellClass(
                              darkMode
                            )}
                          >
                            {formatDate(transaction.payment_time)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className={`px-6 py-4 text-center text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                        >
                          No transactions found for this school
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {transactions.length > 0 && (
                <div className={darkModeStyles.getPaginationClass(darkMode)}>
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={
                        page === 1
                          ? `${darkMode ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" : "opacity-50 cursor-not-allowed bg-white text-gray-700 border-gray-300"} relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300`
                          : `${darkMode ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300`
                      }
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className={
                        page === pagination.totalPages
                          ? `${darkMode ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" : "opacity-50 cursor-not-allowed bg-white text-gray-700 border-gray-300"} relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300`
                          : `${darkMode ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"} relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-300`
                      }
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"} transition-colors duration-300`}
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
                          className={
                            page === 1
                              ? `${darkMode ? "opacity-50 cursor-not-allowed text-gray-500 ring-gray-700" : "opacity-50 cursor-not-allowed text-gray-400 ring-gray-300"} relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset transition-colors duration-300`
                              : `${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-700" : "text-gray-400 ring-gray-300 hover:bg-gray-50"} relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors duration-300`
                          }
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

                        {[...Array(pagination.totalPages)].map((_, idx) => {
                          const pageNumber = idx + 1;

                          if (
                            pageNumber === 1 ||
                            pageNumber === pagination.totalPages ||
                            (pageNumber >= page - 2 && pageNumber <= page + 2)
                          ) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={
                                  page === pageNumber
                                    ? `${darkMode ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" : "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"} relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-300`
                                    : `${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-700" : "text-gray-900 ring-gray-300 hover:bg-gray-50"} relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:outline-offset-0 transition-colors duration-300`
                                }
                              >
                                {pageNumber}
                              </button>
                            );
                          }

                          if (
                            (pageNumber === 2 && page > 4) ||
                            (pageNumber === pagination.totalPages - 1 &&
                              page < pagination.totalPages - 3)
                          ) {
                            return (
                              <span
                                key={`ellipsis-${pageNumber}`}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${darkMode ? "text-gray-300 ring-gray-700" : "text-gray-700 ring-gray-300"} ring-1 ring-inset transition-colors duration-300`}
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
                          className={
                            page === pagination.totalPages
                              ? `${darkMode ? "opacity-50 cursor-not-allowed text-gray-500 ring-gray-700" : "opacity-50 cursor-not-allowed text-gray-400 ring-gray-300"} relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset transition-colors duration-300`
                              : `${darkMode ? "text-gray-300 ring-gray-700 hover:bg-gray-700" : "text-gray-400 ring-gray-300 hover:bg-gray-50"} relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors duration-300`
                          }
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SchoolTransactions;
