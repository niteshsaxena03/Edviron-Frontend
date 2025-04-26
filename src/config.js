// API configuration
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Authentication constants
export const TOKEN_KEY = "auth_token";
export const USER_INFO = "user_info";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Date format
export const DATE_FORMAT = "MMM dd, yyyy";
export const DATE_TIME_FORMAT = "MMM dd, yyyy HH:mm";

// Transaction status constants
export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  BANK_TRANSFER: "Bank Transfer",
  PAYPAL: "PayPal",
  CASH: "Cash",
  OTHER: "Other",
};

// Transaction Types
export const TRANSACTION_TYPES = {
  PAYMENT: "PAYMENT",
  REFUND: "REFUND",
  ADJUSTMENT: "ADJUSTMENT",
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
};

// Route Paths
export const ROUTES = {
  HOME: "/",
  TRANSACTIONS: "/transactions",
  TRANSACTION_DETAIL: "/transactions/:id",
  NEW_TRANSACTION: "/transactions/new",
  EDIT_TRANSACTION: "/transactions/:id/edit",
  STUDENTS: "/students",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  LOGIN: "/login",
  REGISTER: "/register",
};

// Form Validation Rules
export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 100000,
  MAX_DESCRIPTION_LENGTH: 500,
};
