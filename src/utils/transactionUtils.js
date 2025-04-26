import { format } from "date-fns";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TRANSACTION_STATUS,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "../config";

/**
 * Format a date string according to the specified format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default from config)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, formatStr = DATE_FORMAT) => {
  if (!date) return "N/A";
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

/**
 * Format a datetime string
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted datetime string
 */
export const formatDateTime = (date) => {
  return formatDate(date, DATE_TIME_FORMAT);
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === undefined || amount === null) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get the display name for a transaction status
 * @param {string} status - Status code
 * @returns {string} - User-friendly status name
 */
export const getStatusDisplayName = (status) => {
  return TRANSACTION_STATUS[status] || "Unknown";
};

/**
 * Get the display name for a payment method
 * @param {string} method - Payment method code
 * @returns {string} - User-friendly payment method name
 */
export const getPaymentMethodDisplayName = (method) => {
  return PAYMENT_METHODS[method] || "Unknown";
};

/**
 * Get the display name for a transaction type
 * @param {string} type - Transaction type code
 * @returns {string} - User-friendly transaction type name
 */
export const getTransactionTypeDisplayName = (type) => {
  return TRANSACTION_TYPES[type] || "Unknown";
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

  // Convert dates to format expected by form components
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

  // Only successful payments can be refunded
  return (
    transaction.status === "completed" &&
    transaction.type === "payment" &&
    !transaction.refunded
  );
};

/**
 * Generate a unique transaction reference with optional prefix
 * @param {string} prefix - Optional prefix for the reference (default: 'TX')
 * @returns {string} - Unique transaction reference
 */
export const generateTransactionReference = (prefix = "TX") => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Calculate transaction fee based on amount and payment method
 * @param {number} amount - Transaction amount
 * @param {string} paymentMethod - Payment method code
 * @returns {number} - Calculated fee
 */
export const calculateTransactionFee = (amount, paymentMethod) => {
  // Default fee rates and fixed fees
  const feeRates = {
    credit_card: 0.029, // 2.9%
    debit_card: 0.015, // 1.5%
    bank_transfer: 0.01, // 1%
    wallet: 0.005, // 0.5%
    cash: 0, // No fee
    paypal: 0.034, // 3.4%
    venmo: 0.019, // 1.9%
    crypto: 0.01, // 1%
    default: 0.02, // 2% default
  };

  const fixedFees = {
    credit_card: 0.3,
    debit_card: 0.2,
    bank_transfer: 0.25,
    wallet: 0,
    cash: 0,
    paypal: 0.3,
    venmo: 0.1,
    crypto: 0,
    default: 0.25,
  };

  // Use default if payment method is not recognized
  const rate = feeRates[paymentMethod] || feeRates.default;
  const fixedFee = fixedFees[paymentMethod] || fixedFees.default;

  // Calculate total fee (percentage + fixed)
  const percentageFee = amount * rate;
  const totalFee = percentageFee + fixedFee;

  // Round to 2 decimal places
  return Math.round(totalFee * 100) / 100;
};

/**
 * Determine transaction status based on various conditions
 * @param {Object} transactionData - Transaction data
 * @returns {string} - Determined status code
 */
export const determineTransactionStatus = (transactionData) => {
  const {
    errorCode,
    gatewayResponse,
    isRefunded,
    isCanceled,
    processingComplete,
    verificationPending,
  } = transactionData;

  // Check for failure conditions first
  if (errorCode || (gatewayResponse && gatewayResponse.error)) {
    return "failed";
  }

  // Check other statuses in order of precedence
  if (isRefunded) {
    return "refunded";
  }

  if (isCanceled) {
    return "canceled";
  }

  if (processingComplete) {
    return "completed";
  }

  if (verificationPending) {
    return "processing";
  }

  // Default status
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
 * Get transaction status color for UI display
 * @param {string} status - Transaction status
 * @returns {string} - Color code for the status
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: "#F59E0B", // Amber
    processing: "#3B82F6", // Blue
    completed: "#10B981", // Green
    failed: "#EF4444", // Red
    refunded: "#8B5CF6", // Purple
    canceled: "#6B7280", // Gray
    default: "#6B7280", // Default gray
  };

  return colors[status] || colors.default;
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
