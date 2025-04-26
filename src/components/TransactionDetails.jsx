import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Divider,
  Box,
} from "@mui/material";
import {
  formatDate,
  formatCurrency,
  getStatusDisplayName,
  getPaymentMethodDisplayName,
  getTransactionTypeDisplayName,
} from "../utils/transactionUtils";
import { TRANSACTION_STATUS } from "../config";

// Status color mapping
const getStatusColor = (status) => {
  const colorMap = {
    pending: "warning",
    processing: "info",
    completed: "success",
    failed: "error",
    refunded: "secondary",
    canceled: "default",
  };
  return colorMap[status] || "default";
};

const TransactionDetails = ({ transaction }) => {
  if (!transaction) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">No transaction data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    id,
    reference,
    amount,
    currency,
    status,
    date,
    paymentMethod,
    type,
    description,
    customer,
    createdAt,
    updatedAt,
  } = transaction;

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" component="h2">
            Transaction Details
          </Typography>
          <Chip
            label={getStatusDisplayName(status)}
            color={getStatusColor(status)}
            variant="outlined"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {id}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Reference
            </Typography>
            <Typography variant="body1" gutterBottom>
              {reference}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(date)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Amount
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatCurrency(amount, currency)}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Payment Method
            </Typography>
            <Typography variant="body1" gutterBottom>
              {getPaymentMethodDisplayName(paymentMethod)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {getTransactionTypeDisplayName(type)}
            </Typography>
          </Grid>

          {description && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                {description}
              </Typography>
            </Grid>
          )}

          {customer && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {customer.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {customer.email}
                </Typography>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Created At
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(createdAt, "MMM dd, yyyy HH:mm:ss")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="textSecondary">
              Updated At
            </Typography>
            <Typography variant="body1" gutterBottom>
              {formatDate(updatedAt, "MMM dd, yyyy HH:mm:ss")}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TransactionDetails.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.string,
    reference: PropTypes.string,
    amount: PropTypes.number,
    currency: PropTypes.string,
    status: PropTypes.string,
    date: PropTypes.string,
    paymentMethod: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    customer: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
};

export default TransactionDetails;
