import axios from "axios";
import { API_URL } from "../config";

const API_ENDPOINT = `${API_URL}/transactions`;

/**
 * Fetch transactions with optional filters and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with transactions data
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await axios.get(API_ENDPOINT, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise} - Promise with transaction data
 */
export const getTransactionById = async (id) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new transaction
 * @param {Object} transaction - Transaction data
 * @returns {Promise} - Promise with created transaction
 */
export const createTransaction = async (transaction) => {
  try {
    const response = await axios.post(API_ENDPOINT, transaction);
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/**
 * Update an existing transaction
 * @param {string} id - Transaction ID
 * @param {Object} transaction - Updated transaction data
 * @returns {Promise} - Promise with updated transaction
 */
export const updateTransaction = async (id, transaction) => {
  try {
    const response = await axios.put(`${API_ENDPOINT}/${id}`, transaction);
    return response.data;
  } catch (error) {
    console.error(`Error updating transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 * @returns {Promise} - Promise with deletion result
 */
export const deleteTransaction = async (id) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transaction ${id}:`, error);
    throw error;
  }
};

/**
 * Export transactions to CSV
 * @param {Object} filters - Filters to apply before exporting
 * @returns {Promise} - Promise with CSV data
 */
export const exportTransactionsToCSV = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/export`, {
      params: filters,
      responseType: "blob",
    });

    // Create a download link and trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("Error exporting transactions:", error);
    throw error;
  }
};

/**
 * Process a transaction refund
 * @param {string} id - Transaction ID
 * @param {Object} refundData - Refund details
 * @returns {Promise} - Promise with refund result
 */
export const processRefund = async (id, refundData) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINT}/${id}/refund`,
      refundData
    );
    return response.data;
  } catch (error) {
    console.error(`Error processing refund for transaction ${id}:`, error);
    throw error;
  }
};
