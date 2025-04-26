import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Function to login and get token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: "nitesh04@gmail.com",
      password: "11111111",
    });

    if (response.data && response.data.data && response.data.data.token) {
      console.log("Login successful!");
      return response.data.data.token;
    } else {
      console.error("Token not found in response:", response.data);
      throw new Error("Authentication failed");
    }
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Function to fetch transactions with token
async function fetchTransactions(token) {
  try {
    const response = await axios.get(`${API_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "Transactions response:",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transactions:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Main function to run tests
async function testApi() {
  try {
    console.log("Testing API...");

    // Login to get token
    const token = await login();
    console.log("Token obtained successfully");

    // Fetch transactions with token
    await fetchTransactions(token);

    console.log("API test completed successfully");
  } catch (error) {
    console.error("API test failed:", error.message);
  }
}

// Run the test
testApi();
