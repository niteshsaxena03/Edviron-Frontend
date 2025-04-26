import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { CSVLink } from "react-csv";
import {
  formatDateTime,
  formatCurrency,
  getStatusDisplayName,
  getPaymentMethodDisplayName,
  getTransactionTypeDisplayName,
} from "../utils/transactionUtils";
import {
  TRANSACTION_STATUS,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  TRANSACTION_EXPORT_FIELDS,
} from "../config";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const TransactionList = ({
  transactions = [],
  totalCount = 0,
  loading = false,
  onViewDetails,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentMethod: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters and sorting
  useEffect(() => {
    let results = [...transactions];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (transaction) =>
          transaction.reference?.toLowerCase().includes(searchTerm) ||
          transaction.customer?.name?.toLowerCase().includes(searchTerm) ||
          transaction.customer?.email?.toLowerCase().includes(searchTerm) ||
          transaction.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      results = results.filter(
        (transaction) => transaction.status === filters.status
      );
    }

    // Apply payment method filter
    if (filters.paymentMethod) {
      results = results.filter(
        (transaction) => transaction.paymentMethod === filters.paymentMethod
      );
    }

    // Apply transaction type filter
    if (filters.type) {
      results = results.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      results = results.filter(
        (transaction) => new Date(transaction.date) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      results = results.filter(
        (transaction) => new Date(transaction.date) <= toDate
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      results.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties like customer.name
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".");
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle dates
        if (
          sortConfig.key === "date" ||
          sortConfig.key === "createdAt" ||
          sortConfig.key === "updatedAt"
        ) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        // Handle nulls/undefined values
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        // Handle different types
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
      });
    }

    setFilteredTransactions(results);
  }, [transactions, filters, sortConfig]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPage(0); // Reset to first page on filter change
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "failed":
        return "error";
      case "refunded":
        return "secondary";
      case "canceled":
        return "default";
      default:
        return "default";
    }
  };

  // Prepare data for CSV export
  const csvData = filteredTransactions.map((transaction) => {
    const csvRow = {};
    TRANSACTION_EXPORT_FIELDS.forEach((field) => {
      // Handle nested properties like customer.name
      if (field.key.includes(".")) {
        const keys = field.key.split(".");
        csvRow[field.label] = keys.reduce(
          (obj, key) => obj?.[key] ?? "",
          transaction
        );
      } else {
        let value = transaction[field.key];
        // Format special fields
        if (
          field.key === "date" ||
          field.key === "createdAt" ||
          field.key === "updatedAt"
        ) {
          value = formatDateTime(value);
        } else if (field.key === "amount") {
          value = formatCurrency(value, transaction.currency);
        } else if (field.key === "status") {
          value = getStatusDisplayName(value);
        } else if (field.key === "paymentMethod") {
          value = getPaymentMethodDisplayName(value);
        } else if (field.key === "type") {
          value = getTransactionTypeDisplayName(value);
        }
        csvRow[field.label] = value ?? "";
      }
    });
    return csvRow;
  });

  // Empty state
  if (!loading && filteredTransactions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No transactions found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your filters or create a new transaction
        </Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box p={2} display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Transactions
          </Typography>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleFilterChange("search", e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {showFilters && (
          <Box display="flex" gap={2} alignItems="center">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(TRANSACTION_STATUS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={filters.paymentMethod}
                onChange={(e) =>
                  handleFilterChange("paymentMethod", e.target.value)
                }
                label="Payment Method"
              >
                <MenuItem value="">All</MenuItem>
                {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Date From"
              type="date"
              variant="outlined"
              size="small"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <TextField
              label="Date To"
              type="date"
              variant="outlined"
              size="small"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <Button
              variant="contained"
              size="small"
              onClick={() =>
                setFilters({
                  search: "",
                  status: "",
                  paymentMethod: "",
                  type: "",
                  dateFrom: "",
                  dateTo: "",
                })
              }
            >
              Clear Filters
            </Button>

            {filteredTransactions.length > 0 && (
              <CSVLink
                data={csvData}
                filename="transactions.csv"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" color="primary">
                  Export CSV
                </Button>
              </CSVLink>
            )}
          </Box>
        )}
      </Box>

      {/* Transaction Table */}
      <TableContainer component={Paper}>
        <Table aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("reference")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Reference{" "}
                {sortConfig.key === "reference" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("date")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("amount")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Amount{" "}
                {sortConfig.key === "amount" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("status")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("paymentMethod")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Payment Method{" "}
                {sortConfig.key === "paymentMethod" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("customer.name")}
                sx={{ cursor: "pointer", fontWeight: "bold" }}
              >
                Customer{" "}
                {sortConfig.key === "customer.name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableCell>
              <TableCell sx={{ width: "100px" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  hover
                  onClick={() => onViewDetails(transaction.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{transaction.reference}</TableCell>
                  <TableCell>{formatDateTime(transaction.date)}</TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusDisplayName(transaction.status)}
                      color={getStatusChipColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodDisplayName(transaction.paymentMethod)}
                  </TableCell>
                  <TableCell>
                    {transaction.customer ? (
                      <>
                        <Typography variant="body2">
                          {transaction.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.customer.email}
                        </Typography>
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionList;
