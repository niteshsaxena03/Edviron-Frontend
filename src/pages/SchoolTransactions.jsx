import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactionsBySchool } from "../services/transaction.service";

const SchoolTransactions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get query params with defaults
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

  // School ID options (normally these would come from an API)
  // Using the one from instructions as example
  const schoolIdOptions = [
    { id: "65b0e6293e9f76a9694d84b4", name: "Demo School" },
  ];

  useEffect(() => {
    if (selectedSchoolId) {
      fetchTransactions();
    }
  }, [page, limit, sortConfig.field, sortConfig.order, selectedSchoolId]);

  const fetchTransactions = async () => {
    if (!selectedSchoolId) return;

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

      // Update URL params
      setSearchParams({
        ...params,
        schoolId: selectedSchoolId,
      });

      const result = await getTransactionsBySchool(selectedSchoolId, params);

      setTransactions(result.data.transactions);
      setPagination(result.data.pagination);
    } catch (err) {
      console.error("Error fetching school transactions:", err);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          School Transactions
        </h1>
      </div>

      {/* School selection */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Select School
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School ID
            </label>
            <select
              value={selectedSchoolId}
              onChange={handleSchoolChange}
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            disabled={!selectedSchoolId}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 ${
              !selectedSchoolId
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            View Transactions
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Message for no school selected */}
          {!selectedSchoolId && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Please select a school
              </h3>
              <p className="text-gray-500">
                Select a school ID to view its transactions
              </p>
            </div>
          )}

          {/* Transactions table */}
          {selectedSchoolId && (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction.collect_id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {transaction.custom_order_id ||
                              transaction.collect_id ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.gateway || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{transaction.order_amount?.toFixed(2) || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹
                            {transaction.transaction_amount?.toFixed(2) ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  transaction.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                            >
                              {transaction.status || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.payment_time)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No transactions found for this school
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactions.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
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
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}`}
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
                                    ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
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
                                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
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
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"}`}
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
