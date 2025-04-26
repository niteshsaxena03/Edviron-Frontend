import axios from "axios";
import { API_URL } from "../config";

const API = axios.create({
  baseURL: API_URL,
});

// Set up request interceptor for authentication if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all transactions with optional filters, sorting, and pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Results per page
 * @param {string} params.sort - Field to sort by
 * @param {string} params.order - Sort order (asc/desc)
 * @param {string} params.status - Filter by status
 * @param {string} params.startDate - Filter by start date
 * @param {string} params.endDate - Filter by end date
 * @returns {Promise} - Promise with transaction data
 */
export const getAllTransactions = async (params = {}) => {
  try {
    const response = await API.get("/transactions", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error.response?.data || { message: "Failed to fetch transactions" };
  }
};

/**
 * Get transactions for a specific school
 * @param {string} schoolId - School ID
 * @param {Object} params - Query parameters for pagination and sorting
 * @returns {Promise} - Promise with school transactions data
 */
export const getTransactionsBySchool = (schoolId, queryParams = {}) => {
  return API.get(`/schools/${schoolId}/transactions`, { params: queryParams });
};

/**
 * Get status of a specific transaction
 * @param {string} orderId - Custom order ID or transaction ID
 * @returns {Promise} - Promise with transaction status data
 */
export const getTransactionStatus = (orderId) => {
  return API.get(`/transactions/${orderId}/status`);
};

/**
 * Get transaction summary statistics by school ID
 * @param {number} schoolId - School ID
 * @returns {Promise} - Promise with response data
 */
export const getTransactionStats = (schoolId) => {
  return API.get(`/schools/${schoolId}/transactions/stats`);
};

/**
 * Export transactions to CSV
 * @param {number} schoolId - School ID
 * @param {Object} filters - Filter criteria
 * @returns {Promise} - Promise with response data
 */
export const exportTransactions = (schoolId, filters = {}) => {
  return API.get(`/schools/${schoolId}/transactions/export`, {
    params: filters,
    responseType: "blob",
  });
};
