import { useState } from "react";
import { getTransactionStatus } from "../services/transaction.service";
import { useTheme } from "../context/ThemeContext";
import * as darkModeStyles from "../utils/darkModeStyles";

const TransactionStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const { darkMode } = useTheme();

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


  const getStatusBadgeClass = (status) => {
    const baseClass =
      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status?.toLowerCase()) {
      case "success":
        return `${baseClass} ${darkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"}`;
      case "pending":
        return `${baseClass} ${darkMode ? "bg-yellow-800 text-yellow-100" : "bg-yellow-100 text-yellow-800"}`;
      case "failed":
      case "failure":
        return `${baseClass} ${darkMode ? "bg-red-800 text-red-100" : "bg-red-100 text-red-800"}`;
      default:
        return `${baseClass} ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`;
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };


  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "N/A";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className={darkModeStyles.getContentContainerClass(darkMode)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className={darkModeStyles.getHeaderClass(darkMode)}>
          Transaction Status Check
        </h1>
      </div>


      <div className={darkModeStyles.getFilterContainerClass(darkMode)}>
        <form
          onSubmit={handleCheck}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-grow">
            <label
              htmlFor="orderId"
              className={darkModeStyles.getLabelClass(darkMode)}
            >
              Order ID / Transaction ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID or Transaction ID"
              className={darkModeStyles.getInputClass(darkMode)}
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              disabled={loading}
              className={
                loading
                  ? darkModeStyles.getDisabledButtonClass(darkMode)
                  : darkModeStyles.getPrimaryButtonClass(darkMode) + " h-[38px]"
              }
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

 
      {error && (
        <div
          className={`${darkMode ? "bg-red-900 border-red-800 text-red-100" : "bg-red-100 border-red-400 text-red-700"} border px-4 py-3 rounded relative mb-4 transition-colors duration-300`}
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}


      {searched && !loading && !error && (
        <div className="mt-6">
          {transactionStatus ? (
            <div
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-lg shadow-sm overflow-hidden transition-colors duration-300`}
            >
              <div
                className={`px-4 py-5 sm:px-6 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} border-b transition-colors duration-300`}
              >
                <h3
                  className={`text-lg leading-6 font-medium ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                >
                  Transaction Details
                </h3>
                <p
                  className={`mt-1 max-w-2xl text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                >
                  Detailed information about the transaction
                </p>
              </div>
              <div
                className={`${darkMode ? "border-gray-700" : "border-gray-200"} border-t px-4 py-5 sm:p-6 transition-colors duration-300`}
              >
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Transaction ID
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {transactionStatus.collect_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Order ID
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {transactionStatus.custom_order_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Status
                    </dt>
                    <dd className="mt-1">
                      <span
                        className={getStatusBadgeClass(
                          transactionStatus.status
                        )}
                      >
                        {transactionStatus.status || "N/A"}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Payment Gateway
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {transactionStatus.gateway || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Order Amount
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {formatAmount(transactionStatus.order_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Transaction Amount
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {formatAmount(transactionStatus.transaction_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      School ID
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {transactionStatus.school_id || "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
                    >
                      Payment Time
                    </dt>
                    <dd
                      className={`mt-1 text-sm ${darkMode ? "text-white" : "text-gray-900"} transition-colors duration-300`}
                    >
                      {formatDate(transactionStatus.payment_time)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div
              className={`text-center py-12 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg transition-colors duration-300`}
            >
              <svg
                className={`mx-auto h-12 w-12 ${darkMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300`}
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
              <h3
                className={`mt-2 text-sm font-medium ${darkMode ? "text-gray-100" : "text-gray-900"} transition-colors duration-300`}
              >
                No transaction found
              </h3>
              <p
                className={`mt-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
              >
                We couldn't find a transaction with the provided ID.
              </p>
            </div>
          )}
        </div>
      )}


      {!searched && !loading && (
        <div
          className={`text-center py-12 ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg transition-colors duration-300`}
        >
          <svg
            className={`mx-auto h-12 w-12 ${darkMode ? "text-gray-500" : "text-gray-400"} transition-colors duration-300`}
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
          <h3
            className={`mt-2 text-sm font-medium ${darkMode ? "text-gray-100" : "text-gray-900"} transition-colors duration-300`}
          >
            Check transaction status
          </h3>
          <p
            className={`mt-1 text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} transition-colors duration-300`}
          >
            Enter an Order ID or Transaction ID to check its current status.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
