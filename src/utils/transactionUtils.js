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
 * Generate a unique transaction reference
 * @returns {string} - Unique transaction reference
 */
export const generateTransactionReference = () => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `TXN-${timestamp}-${random}`;
};
