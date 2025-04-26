import axios from "axios";

// Base URL for API requests
const API_URL = "http://localhost:8000/api";

// Function to create a transaction
const createTransaction = async (data, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/create-payment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return null;
  }
};

// Function to simulate a callback/webhook for a transaction
const simulateCallback = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/payment-callback`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error simulating callback:", error);
    return null;
  }
};

// Generate a random student
const generateStudent = (index) => {
  return {
    name: `Student ${index}`,
    id: `STD${100000 + index}`,
    email: `student${index}@example.com`,
  };
};

// Generate random amount between min and max
const generateAmount = (min = 500, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

// List of possible payment gateways
const paymentGateways = ["PhonePe", "Razorpay", "PayTM", "UPI", "NetBanking"];

// List of possible payment statuses
const paymentStatuses = [
  "SUCCESS",
  "FAILED",
  "PENDING",
  "CANCELLED",
  "PROCESSING",
  "COMPLETED",
  "REFUNDED",
];

// List of possible payment modes
const paymentModes = ["upi", "netbanking", "card", "wallet"];

// Generate a random gateway
const getRandomGateway = () => {
  const index = Math.floor(Math.random() * paymentGateways.length);
  return paymentGateways[index];
};

// Generate a random status
const getRandomStatus = () => {
  const index = Math.floor(Math.random() * paymentStatuses.length);
  return paymentStatuses[index];
};

// Generate a random payment mode
const getRandomPaymentMode = () => {
  const index = Math.floor(Math.random() * paymentModes.length);
  return paymentModes[index];
};

// Main function to seed transactions
export const seedTransactions = async (count = 10, token) => {
  console.log(`Starting to seed ${count} transactions...`);

  if (!token) {
    console.error("No token provided. Authentication required.");
    return { success: false, message: "Authentication required" };
  }

  const results = {
    created: 0,
    callbacks: 0,
    errors: 0,
    transactions: [],
  };

  // School ID from the assignment
  const schoolId = "65b0e6293e9f76a9694d84b4";

  for (let i = 0; i < count; i++) {
    try {
      // Create transaction data
      const transactionData = {
        school_id: schoolId,
        amount: generateAmount(),
        callback_url: "http://localhost:5173/payment-callback",
        student_info: generateStudent(i + 1),
        gateway_name: getRandomGateway(),
      };

      // Create the transaction
      const createdTransaction = await createTransaction(
        transactionData,
        token
      );

      if (createdTransaction && createdTransaction.data) {
        results.created++;

        // Get the transaction ID
        const transactionId = createdTransaction.data.order_id;

        // Generate callback data
        const status = getRandomStatus();
        const callbackData = {
          payment_status: status,
          collect_request_id: transactionId,
          payment_details: `${getRandomPaymentMode()} transaction`,
          bank_reference: `BANK${100000 + i}`,
          payment_mode: getRandomPaymentMode(),
          error_message:
            status === "FAILED"
              ? "Payment failed due to insufficient funds"
              : "",
        };

        // Simulate the callback
        const callbackResult = await simulateCallback(callbackData);

        if (callbackResult) {
          results.callbacks++;
        }

        results.transactions.push({
          id: transactionId,
          amount: transactionData.amount,
          status: status,
          student: transactionData.student_info.name,
          gateway: transactionData.gateway_name,
        });

        console.log(
          `Created transaction ${i + 1}/${count} with status ${status}`
        );
      } else {
        results.errors++;
        console.error(`Failed to create transaction ${i + 1}`);
      }
    } catch (error) {
      results.errors++;
      console.error(`Error in transaction ${i + 1}:`, error);
    }

    // Add a small delay to prevent overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("Transaction seeding completed:", results);
  return { success: true, results };
};

// Helper function to login and get token
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });

    if (response.data && response.data.data && response.data.data.token) {
      return response.data.data.token;
    }
    return null;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// Run the seeder (example usage):
// import { seedTransactions, login } from './seedTransactions';
//
// async function run() {
//   const token = await login('admin@example.com', 'password123');
//   if (token) {
//     const result = await seedTransactions(10, token);
//     console.log(result);
//   } else {
//     console.error('Login failed');
//   }
// }
//
// run();
