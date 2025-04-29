import { format, parseISO } from "date-fns";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TRANSACTION_STATUSES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "../config";

/**
 * Format a date string to display format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), DATE_FORMAT.display);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Format a date string to display date and time
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), DATE_TIME_FORMAT.display);
  } catch (error) {
    console.error("Error formatting date and time:", error);
    return dateString;
  }
};

/**
 * Format a currency amount
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (default: USD)
 * @returns {string} - Formatted currency amount
 */
export const formatCurrency = (amount, currencyCode = "USD") => {
  if (amount === null || amount === undefined) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

/**
 * Get the display name for a transaction status
 * @param {string} statusKey - The status key
 * @returns {string} - Display name for the status
 */
export const getStatusDisplayName = (statusKey) => {
  if (!statusKey) return "";

  const normalizedStatusKey = statusKey.toLowerCase();

  for (const [key, value] of Object.entries(TRANSACTION_STATUSES)) {
    if (key.toLowerCase() === normalizedStatusKey) {
      return value;
    }
  }

  return (
    normalizedStatusKey.charAt(0).toUpperCase() + normalizedStatusKey.slice(1)
  );
};

/**
 * Get display name for payment method
 * @param {string} methodKey - The payment method key
 * @returns {string} - Display name for the payment method
 */
export const getPaymentMethodDisplayName = (methodKey) => {
  if (!methodKey) return "";

  const normalizedMethodKey = methodKey.toLowerCase();

  for (const [key, value] of Object.entries(PAYMENT_METHODS)) {
    if (key.toLowerCase() === normalizedMethodKey) {
      return value;
    }
  }

  return (
    normalizedMethodKey.charAt(0).toUpperCase() + normalizedMethodKey.slice(1)
  );
};

/**
 * Get display name for transaction type
 * @param {string} typeKey - The transaction type key
 * @returns {string} - Display name for the transaction type
 */
export const getTransactionTypeDisplayName = (typeKey) => {
  if (!typeKey) return "";

  const normalizedTypeKey = typeKey.toLowerCase();

  for (const [key, value] of Object.entries(TRANSACTION_TYPES)) {
    if (key.toLowerCase() === normalizedTypeKey) {
      return value;
    }
  }

  return normalizedTypeKey.charAt(0).toUpperCase() + normalizedTypeKey.slice(1);
};

/**
 * Convert raw transaction data to display-friendly format
 * @param {Object} transaction - Raw transaction data
 * @returns {Object} - Formatted transaction data
 */
export const formatTransactionForDisplay = (transaction) => {
  if (!transaction) return {};

  return {
    ...transaction,
    formattedAmount: formatCurrency(transaction.amount, transaction.currency),
    formattedDate: formatDate(transaction.date),
    formattedCreatedAt: formatDateTime(transaction.createdAt),
    formattedUpdatedAt: formatDateTime(transaction.updatedAt),
    statusDisplayName: getStatusDisplayName(transaction.status),
    paymentMethodDisplayName: getPaymentMethodDisplayName(
      transaction.paymentMethod
    ),
    transactionTypeDisplayName: getTransactionTypeDisplayName(transaction.type),
  };
};

/**
 * Prepare transaction data for form editing
 * @param {Object} transaction - Transaction data from API
 * @returns {Object} - Data ready for form use
 */
export const prepareTransactionForForm = (transaction) => {
  if (!transaction) return {};

  const formReadyData = {
    ...transaction,
    date: transaction.date ? new Date(transaction.date) : null,
  };

  return formReadyData;
};

/**
 * Prepare form data for API submission
 * @param {Object} formData - Data from form
 * @returns {Object} - Data ready for API
 */
export const prepareFormDataForApi = (formData) => {
  const apiReadyData = {
    ...formData,
    // Ensure amount is a number
    amount: parseFloat(formData.amount),
  };

  return apiReadyData;
};

/**
 * Check if a transaction can be refunded
 * @param {Object} transaction - Transaction data
 * @returns {boolean} - Whether transaction can be refunded
 */
export const canRefundTransaction = (transaction) => {
  if (!transaction) return false;

  return (
    transaction.status === "completed" &&
    transaction.type === "payment" &&
    !transaction.refunded
  );
};

/**
 * Generate a transaction reference number
 * @param {string} prefix - The prefix for the reference (default: 'TX')
 * @returns {string} - Generated transaction reference
 */
export const generateTransactionReference = (prefix = "TX") => {
  const timestamp = new Date().getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Calculate transaction fee based on amount and payment method
 * @param {number} amount - The transaction amount
 * @param {string} paymentMethod - The payment method
 * @returns {number} - The calculated fee
 */
export const calculateTransactionFee = (amount, paymentMethod) => {
  if (!amount || amount <= 0) return 0;
  if (!paymentMethod) return 0;

  const feeRates = {
    credit_card: 0.029,
    debit_card: 0.015,
    bank_transfer: 0.005,
    paypal: 0.035,
    crypto: 0.01,
  };

  const fixedFees = {
    credit_card: 0.3,
    debit_card: 0.2,
    bank_transfer: 0.25,
    paypal: 0.4,
    crypto: 0.0,
  };

  const normalizedMethod = paymentMethod.toLowerCase();

  let rate = 0.02;
  let fixed = 0.25;

  for (const [key, value] of Object.entries(feeRates)) {
    if (key.toLowerCase() === normalizedMethod) {
      rate = value;
      fixed = fixedFees[key] || 0.25;
      break;
    }
  }

  return amount * rate + fixed;
};

/**
 * Determine transaction status based on various conditions
 * @param {Object} transaction - The transaction object
 * @returns {string} - The determined status
 */
export const determineTransactionStatus = (transaction) => {
  if (!transaction) return "pending";

  const currentStatus = transaction.status
    ? transaction.status.toLowerCase()
    : "";

  if (transaction.error || transaction.failureReason) {
    return "failed";
  }

  if (
    transaction.refunded ||
    (transaction.refundAmount && transaction.refundAmount > 0) ||
    currentStatus === "refunded"
  ) {
    return "refunded";
  }

  if (
    transaction.canceled ||
    transaction.canceledAt ||
    currentStatus === "canceled" ||
    currentStatus === "cancelled"
  ) {
    return "canceled";
  }

  const completedStatuses = [
    "completed",
    "success",
    "succeeded",
    "approved",
    "confirmed",
  ];
  if (
    transaction.completed ||
    transaction.completedAt ||
    completedStatuses.includes(currentStatus)
  ) {
    return "completed";
  }

  const processingStatuses = [
    "processing",
    "in_progress",
    "in-progress",
    "pending_approval",
  ];
  if (transaction.processing || processingStatuses.includes(currentStatus)) {
    return "processing";
  }

  return "pending";
};

/**
 * Check if a transaction is expired based on creation date and processing state
 * @param {Object} transaction - Transaction data
 * @param {number} expiryHours - Hours after which pending transaction expires (default: 24)
 * @returns {boolean} - Whether transaction is expired
 */
export const isTransactionExpired = (transaction, expiryHours = 24) => {
  if (!transaction || transaction.status !== "pending") {
    return false;
  }

  const createdAt = new Date(transaction.createdAt);
  const now = new Date();
  const diffHours = (now - createdAt) / (1000 * 60 * 60);

  return diffHours > expiryHours;
};

/**
 * Get color class for a transaction status
 * @param {string} status - The transaction status
 * @returns {string} - CSS class for the status color
 */
export const getStatusColorClass = (status) => {
  if (!status) return "text-gray-600 bg-gray-100";

  const normalizedStatus = status.toLowerCase();

  const colorMap = {
    pending: "text-yellow-600 bg-yellow-100",
    processing: "text-blue-600 bg-blue-100",
    completed: "text-green-600 bg-green-100",
    success: "text-green-600 bg-green-100",
    failed: "text-red-600 bg-red-100",
    failure: "text-red-600 bg-red-100",
    refunded: "text-purple-600 bg-purple-100",
    canceled: "text-gray-600 bg-gray-100",
  };

  return colorMap[normalizedStatus] || "text-gray-600 bg-gray-100";
};

/**
 * Calculate total amount including fees
 * @param {number} amount - Base amount
 * @param {number} fee - Fee amount
 * @returns {number} - Total amount
 */
export const calculateTotalWithFees = (amount, fee) => {
  return Math.round((parseFloat(amount) + parseFloat(fee)) * 100) / 100;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 25) => {
  if (!text) return "";
  if (text.length <= length) return text;

  return `${text.substring(0, length)}...`;
};

/**
 * Normalize transaction data from API response
 * @param {Object} transaction - Raw transaction data from API
 * @returns {Object} - Normalized transaction data
 */
export const normalizeTransaction = (transaction) => {
  if (!transaction) return null;

  return {
    id: transaction.collect_id || transaction._id,
    orderId: transaction.custom_order_id,
    amount: transaction.order_amount,
    transactionAmount: transaction.transaction_amount,
    paymentMethod: transaction.payment_mode?.toLowerCase() || "unknown",
    paymentDetails: transaction.payment_details || "",
    status: transaction.status?.toLowerCase() || "pending",
    paymentTime: transaction.payment_time,
    gateway: transaction.gateway || "",
    schoolId: transaction.school_id,
    studentInfo: transaction.student_info || {},
    bankReference: transaction.bank_reference || "",
  };
};

/**
 * Normalize array of transactions from API
 * @param {Array} transactions - Raw transactions array from API
 * @returns {Array} - Array of normalized transactions
 */
export const normalizeTransactions = (transactions) => {
  if (!transactions || !Array.isArray(transactions)) return [];
  return transactions.map(normalizeTransaction);
};
