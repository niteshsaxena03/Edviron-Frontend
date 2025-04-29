import axios from "axios";

const API_URL = "https://edviron-backend-2.onrender.com/api";

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

const generateStudent = (index) => {
  return {
    name: `Student ${index}`,
    id: `STD${100000 + index}`,
    email: `student${index}@example.com`,
  };
};

const generateAmount = (min = 500, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

const paymentGateways = ["PhonePe", "Razorpay", "PayTM", "UPI", "NetBanking"];

const paymentStatuses = [
  "SUCCESS",
  "FAILED",
  "PENDING",
  "CANCELLED",
  "PROCESSING",
  "COMPLETED",
  "REFUNDED",
];

const paymentModes = ["upi", "netbanking", "card", "wallet"];

const getRandomGateway = () => {
  const index = Math.floor(Math.random() * paymentGateways.length);
  return paymentGateways[index];
};

const getRandomStatus = () => {
  const index = Math.floor(Math.random() * paymentStatuses.length);
  return paymentStatuses[index];
};

const getRandomPaymentMode = () => {
  const index = Math.floor(Math.random() * paymentModes.length);
  return paymentModes[index];
};

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

  const schoolId = "65b0e6293e9f76a9694d84b4";

  for (let i = 0; i < count; i++) {
    try {
      const transactionData = {
        school_id: schoolId,
        amount: generateAmount(),
        callback_url: "http://localhost:5173/payment-callback",
        student_info: generateStudent(i + 1),
        gateway_name: getRandomGateway(),
      };

      const createdTransaction = await createTransaction(
        transactionData,
        token
      );

      if (createdTransaction && createdTransaction.data) {
        results.created++;

        const transactionId = createdTransaction.data.order_id;

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

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log("Transaction seeding completed:", results);
  return { success: true, results };
};

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
