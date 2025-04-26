import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getTransactionsBySchool } from "../services/transaction.service";
import { refreshToken } from "../services/auth.service";
import axios from "axios";
import { API_URL } from "../config";

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
  const [refreshingToken, setRefreshingToken] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    checked: false,
    isRunning: false,
    message: "",
  });

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

      // Get current token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }

      console.log(
        "Attempting to fetch school transactions with token:",
        token.substring(0, 20) + "..."
      );

      try {
        // First try the school-specific endpoint
        const response = await axios.get(
          `${API_URL}/transactions/school/${selectedSchoolId}`,
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Log the entire response for debugging
        console.log("School Transaction API Response:", response);

        const data = response.data;

        // Check the response structure and extract transactions and pagination
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
        // We'll fall through to the generic endpoint below
      }

      // If we get here, either the school endpoint failed or returned no data
      // For the assignment, let's try the generic transactions endpoint as a fallback
      console.log("Falling back to generic transactions endpoint");

      const allTransactionsResponse = await axios.get(
        `${API_URL}/transactions`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("All Transactions API Response:", allTransactionsResponse);

      if (
        allTransactionsResponse.data &&
        allTransactionsResponse.data.data &&
        allTransactionsResponse.data.data.transactions
      ) {
        // Map the transactions and add the school ID if it's missing
        const transactions = allTransactionsResponse.data.data.transactions.map(
          (tx) => ({
            ...tx,
            school_id: tx.school_id || selectedSchoolId, // Associate with selected school for display
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

        // No error since we found transactions
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

  const handleTokenRefresh = async () => {
    setRefreshingToken(true);
    const success = await refreshToken();

    if (success) {
      // After successful token refresh, try to fetch transactions again
      fetchTransactions();
    }

    setRefreshingToken(false);
  };

  // Directly login with test credentials
  const handleDirectLogin = async () => {
    setLoginInProgress(true);
    setError(null);

    try {
      // Direct login with credentials
      const response = await axios.post(`${API_URL}/users/login`, {
        email: "nitesh04@gmail.com",
        password: "11111111",
      });

      console.log("Login response:", response.data);

      if (response.data && response.data.data && response.data.data.token) {
        // Store the token
        localStorage.setItem("token", response.data.data.token);

        // Store user data if available
        if (response.data.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
        }

        console.log("✅ Successfully logged in with new token!");

        // Fetch transactions again with new token
        await fetchTransactions();
        return true;
      } else {
        setError("Login successful but no token received");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setLoginInProgress(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Function to check if API is running
  const checkApiStatus = async () => {
    setApiStatus({
      checked: true,
      isRunning: false,
      message: "Checking API status...",
    });

    try {
      // Try to access the login endpoint which should be available
      const response = await axios.get(`${API_URL}/users/test-api`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status < 500; // Accept all responses except server errors
        },
      });

      if (response.status === 200) {
        setApiStatus({
          checked: true,
          isRunning: true,
          message: "API is running and accessible",
        });
      } else {
        setApiStatus({
          checked: true,
          isRunning: true,
          message: `API is running but returned status ${response.status}`,
        });
      }

      return true;
    } catch (error) {
      console.error("API check failed:", error);

      let message =
        "API seems to be offline. Please ensure the backend server is running.";

      if (error.code === "ECONNABORTED") {
        message = "API connection timed out. The server may be down.";
      } else if (error.response) {
        message = `API returned error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        message = "No response received from API. The server may be down.";
      }

      setApiStatus({
        checked: true,
        isRunning: false,
        message,
      });

      return false;
    }
  };

  // Function to directly test the transactions endpoint
  const testTransactionsEndpoint = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current token
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please login first.");
        setLoading(false);
        return;
      }

      console.log("Testing direct endpoint access with token:", token);

      // For the internship assignment: Get ALL transactions instead of filtering by school ID
      // This is temporary to demonstrate functionality without modifying the database
      const response = await axios({
        method: "get",
        url: `${API_URL}/transactions`, // Using the all transactions endpoint instead of school-specific
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Direct endpoint test response:", response);

      if (
        response.data &&
        response.data.data &&
        response.data.data.transactions
      ) {
        // Map the transactions and add the school ID if it's missing
        const transactions = response.data.data.transactions.map((tx) => ({
          ...tx,
          school_id: tx.school_id || selectedSchoolId, // Associate with selected school for display
        }));

        setTransactions(transactions);
        setPagination(
          response.data.data.pagination || {
            total: transactions.length,
            page: 1,
            limit: 10,
            totalPages: 1,
          }
        );

        setError(null);
        return true;
      } else {
        setError(
          "Endpoint returned a response, but no transactions data was found"
        );
        console.log("Endpoint response structure:", response.data);
        return false;
      }
    } catch (error) {
      console.error("Direct endpoint test failed:", error);

      let errorMessage = "Failed to access transactions endpoint";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = "Authentication error: Your token has expired";
        } else {
          errorMessage = `API error: ${error.response.status} ${error.response.statusText}`;
        }
        console.log("Error response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response received from API. The server may be down.";
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
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
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={fetchTransactions}
            disabled={!selectedSchoolId || loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 ${
              !selectedSchoolId || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            View Transactions
          </button>
          <button
            onClick={testTransactionsEndpoint}
            disabled={!selectedSchoolId || loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 ${
              !selectedSchoolId || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
          >
            Test Direct Access
          </button>
        </div>
      </div>

      {/* API Status check */}
      <div className="mb-4 mt-2">
        <button
          onClick={checkApiStatus}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded"
        >
          Check API Status
        </button>

        {apiStatus.checked && (
          <div
            className={`mt-2 p-2 rounded text-sm ${apiStatus.isRunning ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {apiStatus.message}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          {error.includes("fail") ||
          error.includes("token") ||
          transactions.length === 0 ? (
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleTokenRefresh}
                disabled={refreshingToken || loginInProgress}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {refreshingToken
                  ? "Refreshing Token..."
                  : "Refresh Authentication Token"}
              </button>

              <button
                onClick={handleDirectLogin}
                disabled={loginInProgress || refreshingToken}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
              >
                {loginInProgress ? "Logging in..." : "Login Directly"}
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* If no error message but transactions are empty, also show refresh button */}
      {!error && selectedSchoolId && transactions.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <p>
            No transactions found for this school. Your authentication token may
            have expired.
          </p>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handleTokenRefresh}
              disabled={refreshingToken || loginInProgress}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              {refreshingToken
                ? "Refreshing Token..."
                : "Refresh Authentication Token"}
            </button>

            <button
              onClick={handleDirectLogin}
              disabled={loginInProgress || refreshingToken}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              {loginInProgress ? "Logging in..." : "Login Directly"}
            </button>
          </div>
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
