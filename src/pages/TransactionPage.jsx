import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Paper,
  CircularProgress,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import TransactionList from "../components/TransactionList";
import TransactionDetails from "../components/TransactionDetails";

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    reference: "TXN-123456",
    date: "2023-06-15T10:30:00Z",
    amount: 299.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    type: "payment",
    description: "Monthly subscription",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
    },
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:30:00Z",
  },
  {
    id: "2",
    reference: "TXN-789012",
    date: "2023-06-14T15:45:00Z",
    amount: 49.99,
    currency: "USD",
    status: "pending",
    paymentMethod: "paypal",
    type: "payment",
    description: "One-time purchase",
    customer: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
    createdAt: "2023-06-14T15:45:00Z",
    updatedAt: "2023-06-14T15:45:00Z",
  },
  {
    id: "3",
    reference: "TXN-345678",
    date: "2023-06-13T09:15:00Z",
    amount: 199.99,
    currency: "USD",
    status: "failed",
    paymentMethod: "credit_card",
    type: "payment",
    description: "Premium subscription",
    customer: {
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
    },
    createdAt: "2023-06-13T09:15:00Z",
    updatedAt: "2023-06-13T09:15:00Z",
  },
  {
    id: "4",
    reference: "TXN-901234",
    date: "2023-06-12T14:20:00Z",
    amount: 25.0,
    currency: "USD",
    status: "refunded",
    paymentMethod: "debit_card",
    type: "refund",
    description: "Product return",
    customer: {
      name: "Alice Williams",
      email: "alice.williams@example.com",
    },
    createdAt: "2023-06-12T14:20:00Z",
    updatedAt: "2023-06-12T16:45:00Z",
  },
  {
    id: "5",
    reference: "TXN-567890",
    date: "2023-06-11T11:30:00Z",
    amount: 149.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "bank_transfer",
    type: "payment",
    description: "Annual plan",
    customer: {
      name: "Charles Brown",
      email: "charles.brown@example.com",
    },
    createdAt: "2023-06-11T11:30:00Z",
    updatedAt: "2023-06-11T11:30:00Z",
  },
];

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTransactions(MOCK_TRANSACTIONS);
        setLoading(false);
      } catch (err) {
        setError("Failed to load transactions. Please try again later.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(transaction);
    setCurrentTab(1);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      setSelectedTransaction(null);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="All Transactions" />
              {selectedTransaction && <Tab label="Transaction Details" />}
            </Tabs>
          </Box>

          {currentTab === 0 ? (
            <TransactionList
              transactions={transactions}
              totalCount={transactions.length}
              loading={loading}
              onRowClick={handleTransactionSelect}
            />
          ) : (
            <TransactionDetails transaction={selectedTransaction} />
          )}
        </>
      )}
    </Container>
  );
};

export default TransactionPage;
