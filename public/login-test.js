/**
 * Simple test script to check login and authentication
 * Run this directly in your browser console to test
 */
(async function () {
  const API_URL = "http://localhost:8000/api";

  try {
    console.log("1. Testing login endpoint...");
    const loginResponse = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "nitesh04@gmail.com",
        password: "11111111",
      }),
    });

    const loginData = await loginResponse.json();
    console.log("Login response:", loginData);

    if (!loginData?.data?.token) {
      console.error("❌ No token found in login response!");
      return;
    }

    const token = loginData.data.token;
    console.log("✅ Token received:", token.substring(0, 15) + "...");

    // Store token in localStorage
    localStorage.setItem("token", token);
    if (loginData.data.user) {
      localStorage.setItem("user", JSON.stringify(loginData.data.user));
    }

    // Test a protected endpoint
    console.log("2. Testing protected endpoint with token...");
    try {
      const testResponse = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log("✅ Protected endpoint response:", testData);
        console.log("Authentication flow successful!");
        console.log("Refresh your page to use the authenticated session.");
      } else {
        const errorData = await testResponse.text();
        console.error("❌ Error accessing protected endpoint:", errorData);
      }
    } catch (protectedError) {
      console.error("❌ Error accessing protected endpoint:", protectedError);
    }
  } catch (error) {
    console.error("❌ Login error:", error);
  }
})();
