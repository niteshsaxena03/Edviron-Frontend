export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://edviron-backend-2.onrender.com/api";

export const DATE_FORMAT = "MM/dd/yyyy";
export const DATE_TIME_FORMAT = "MM/dd/yyyy HH:mm:ss";

export const TRANSACTION_STATUS = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
  canceled: "Canceled",
};

export const PAYMENT_METHODS = {
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  crypto: "Cryptocurrency",
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  cash: "Cash",
};

export const TRANSACTION_TYPES = {
  payment: "Payment",
  refund: "Refund",
  chargeback: "Chargeback",
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  adjustment: "Adjustment",
  fee: "Fee",
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const TRANSACTION_EXPORT_FIELDS = [
  { key: "id", label: "ID" },
  { key: "reference", label: "Reference" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "currency", label: "Currency" },
  { key: "status", label: "Status" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "type", label: "Type" },
  { key: "customer.name", label: "Customer Name" },
  { key: "customer.email", label: "Customer Email" },
  { key: "description", label: "Description" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_INFO: "user_info",
  SCHOOL_ID: "school_id",
};

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  STUDENTS: "/students",
  SETTINGS: "/settings",
  PROFILE: "/profile",
};
