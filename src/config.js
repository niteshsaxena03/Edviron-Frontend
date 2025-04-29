export const API_URL =
  import.meta.env.VITE_API_URL || "https://edviron-backend-2.onrender.com/api";

export const TOKEN_KEY = "auth_token";
export const USER_INFO = "user_info";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export const DATE_FORMAT = "MMM dd, yyyy";
export const DATE_TIME_FORMAT = "MMM dd, yyyy HH:mm";

export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  BANK_TRANSFER: "Bank Transfer",
  PAYPAL: "PayPal",
  CASH: "Cash",
  OTHER: "Other",
};

export const TRANSACTION_TYPES = {
  PAYMENT: "PAYMENT",
  REFUND: "REFUND",
  ADJUSTMENT: "ADJUSTMENT",
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
};

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

export const VALIDATION = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 100000,
  MAX_DESCRIPTION_LENGTH: 500,
};
