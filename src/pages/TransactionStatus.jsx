import { useState } from "react";
import { getTransactionStatus } from "../services/transaction.service";

const TransactionStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }

    setLoading(true);
    setError(null);
    setTransactionStatus(null);

    try {
      const response = await getTransactionStatus(orderId);

      // Extract transaction data from the nested response structure
      if (response.data && response.data.data) {
        setTransactionStatus(response.data.data);
      } else {
        setError("Transaction not found or invalid response format");
      }
      setSearched(true);
    } catch (err) {
      console.error("Error checking transaction status:", err);
      setError(err.message || "Failed to check transaction status");
    } finally {
      setLoading(false);
    }
  };

  // Get status badge class based on transaction status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
      case "failure":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Format currency amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          Transaction Status Check
        </h1>
      </div>

      {/* Search Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <form
          onSubmit={handleCheck}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-grow">
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order ID / Transaction ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID or Transaction ID"
              className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-[38px]`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Checking...
                </>
              ) : (
                "Check Status"
              )}
            </button>
          </div>
        </form>
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

      {/* Results */}
      {searched && !loading && !error && (
        <div className="mt-6">
          {transactionStatus ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transaction Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Detailed information about the transaction
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Transaction ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {transactionStatus.collect_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Order ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {transactionStatus.custom_order_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(transactionStatus.status)}`}
                      >
                        {transactionStatus.status || "N/A"}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Gateway
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {transactionStatus.gateway || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Order Amount
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatAmount(transactionStatus.order_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Transaction Amount
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatAmount(transactionStatus.transaction_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      School ID
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {transactionStatus.school_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Time
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(transactionStatus.payment_time)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No transaction found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We couldn't find a transaction with the provided ID.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial state - no search yet */}
      {!searched && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Check transaction status
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter an Order ID or Transaction ID to check its current status.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
